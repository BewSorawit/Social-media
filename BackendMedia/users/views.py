from django.shortcuts import render

# Create your views here.
from rest_framework import status
from rest_framework import generics
from rest_framework.response import Response
from rest_framework.views import APIView
from django.shortcuts import get_object_or_404
from . import models, serializers
from django.contrib.auth.hashers import make_password, check_password
from .models import UserProfile, BlacklistedAccessToken
from .serializers import UserProfileSerializer
from drf_yasg.utils import swagger_auto_schema
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework_simplejwt.exceptions import InvalidToken, TokenError
from rest_framework.authtoken.models import Token
from .models import BlacklistedAccessToken
from django.db.models import Q


class UsersViewSet(APIView):

    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    @swagger_auto_schema(responses={200: serializers.UserProfileSerializer(many=True)})
    def get(self, request, id=None):

        # token = request.headers.get('Authorization')
        # print(f"Original token: {token}")
        # if token:
        #     if token.startswith('Bearer '):
        #         token = token[len('Bearer '):]
        #     print(f"Processed token: {token}")

        #     if BlacklistedAccessToken.is_blacklisted(token):
        #         print(f"Token is blacklisted: {token}")
        #         return Response({"detail": "Token has been blacklisted"}, status=status.HTTP_403_FORBIDDEN)

        if id:
            item = get_object_or_404(models.UserProfile, id=id)
            serializer = serializers.UserProfileSerializer(item)
            return Response({"status": "success", "data": serializer.data}, status=status.HTTP_200_OK)

        items = models.UserProfile.objects.all()
        serializer = serializers.UserProfileSerializer(items, many=True)
        return Response({"status": "success", "data": serializer.data}, status=status.HTTP_200_OK)

    def delete(self, request, id=None):
        # token = request.headers.get('Authorization')
        # print(f"Original token: {token}")
        # if token:
        #     if token.startswith('Bearer '):
        #         token = token[len('Bearer '):]
        #     print(f"Processed token: {token}")

        #     if BlacklistedAccessToken.is_blacklisted(token):
        #         print(f"Token is blacklisted: {token}")
        #         return Response({"detail": "Token has been blacklisted"}, status=status.HTTP_403_FORBIDDEN)

        if request.user.id != id:
            return Response({"detail": "Permission denied."}, status=403)
        item = get_object_or_404(models.UserProfile, id=id)
        item.delete()
        return Response({"status": "success", "message": "Deleted successfully"}, status=status.HTTP_204_NO_CONTENT)


class CreateUsersViewSet(APIView):

    @swagger_auto_schema(request_body=serializers.UserProfileSerializer, responses={201: serializers.UserProfileSerializer})
    def post(self, request):

        # token = request.headers.get('Authorization')
        # print(f"Original token: {token}")
        # if token:
        #     if token.startswith('Bearer '):
        #         token = token[len('Bearer '):]
        #     print(f"Processed token: {token}")

        #     if BlacklistedAccessToken.is_blacklisted(token):
        #         print(f"Token is blacklisted: {token}")
        #         return Response({"detail": "Token has been blacklisted"}, status=status.HTTP_403_FORBIDDEN)

        data = request.data.copy()
        if 'password' in data:
            data['password'] = make_password(data['password'])

        serializer = serializers.UserProfileSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response({"status": "success", "data": serializer.data}, status=status.HTTP_201_CREATED)
        return Response({"status": "error", "errors": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)


class UserProfileUpdateAPIViewSet(APIView):
    parser_classes = [MultiPartParser, FormParser]

    def put(self, request, id=None):
        # token = request.headers.get('Authorization')
        # if token:
        #     # ตัด 'Bearer ' ออกถ้ามี
        #     if token.startswith('Bearer '):
        #         token = token[len('Bearer '):]

        #     # ตรวจสอบว่ามี token นี้ในฐานข้อมูลแล้วหรือไม่
        #     blacklisted_tokens = BlacklistedAccessToken.objects.filter(token=token)
        #     for blacklisted_token in blacklisted_tokens:
        #         print(f"Blacklisted token: {blacklisted_token.token}")

        #     if BlacklistedAccessToken.is_blacklisted(token):
        #         return Response({"detail": "Token has been blacklisted"}, status=status.HTTP_403_FORBIDDEN)

        if request.user.id != id:
            return Response({"detail": "Permission denied."}, status=403)
        item = get_object_or_404(models.UserProfile, id=id)
        data = request.data.copy()

        if 'password' in data:
            data['password'] = make_password(data['password'])

        serializer = serializers.UserProfileSerializer(
            item, data=data, partial=True
        )

        if serializer.is_valid():
            serializer.save()
            return Response({
                "status": "success",
                "data": serializer.data
            }, status=status.HTTP_200_OK)

        return Response({
            "status": "error",
            "errors": serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)


class LoginViewSet(APIView):

    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')
        try:
            user = UserProfile.objects.get(username=username)
        except UserProfile.DoesNotExist:
            return Response({"status": "error", "message": "User not found"}, status=status.HTTP_404_NOT_FOUND)

        if check_password(password, user.password):
            refresh = RefreshToken.for_user(user)
            serializer = UserProfileSerializer(user)
            return Response({
                "status": "success",
                "message": "Login successful",
                "id": user.id,
                "user": serializer.data,
                "access": str(refresh.access_token),
                # "refresh": str(refresh),
            }, status=status.HTTP_200_OK)
        else:
            return Response({"status": "error", "message": "Invalid username or password"}, status=status.HTTP_401_UNAUTHORIZED)


class LogoutView(APIView):
    permission_classes = (IsAuthenticated,)

    def post(self, request):
        try:
            # ดึง access token จาก header
            # ดึงจาก header อาจจะต้องปรับให้ตรงกับที่คุณใช้
            access_token = request.headers.get('Authorization')

            if access_token:
                # ตัด 'Bearer ' ออกถ้ามี
                if access_token.startswith('Bearer '):
                    access_token = access_token[len('Bearer '):]

                # เพิ่ม access token ลงใน blacklist
                BlacklistedAccessToken.objects.create(token=access_token)
                return Response({"status": "success", "message": "Access token has been blacklisted."}, status=status.HTTP_205_RESET_CONTENT)
            else:
                return Response({"status": "error", "message": "Access token is required."}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({"status": "error", "message": str(e)}, status=status.HTTP_400_BAD_REQUEST)


class UserSearchView(generics.ListAPIView):
    serializer_class = UserProfileSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        query = self.request.query_params.get('q', '')
        if query:
            return UserProfile.objects.filter(Q(first_name__icontains=query) | Q(last_name__icontains=query))
        return UserProfile.objects.none()
