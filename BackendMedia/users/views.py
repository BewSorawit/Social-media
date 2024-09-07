from django.shortcuts import render

# Create your views here.
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from django.shortcuts import get_object_or_404
from . import models, serializers
from django.contrib.auth.hashers import make_password, check_password
from .models import UserProfile
from .serializers import UserProfileSerializer
from drf_yasg.utils import swagger_auto_schema
from rest_framework.parsers import MultiPartParser, FormParser

class UsersViewSet(APIView):
    @swagger_auto_schema(responses={200: serializers.UserProfileSerializer(many=True)})
    def get(self, request, id=None):
        if id:
            item = get_object_or_404(models.UserProfile, user_id=id)
            serializer = serializers.UserProfileSerializer(item)
            return Response({"status": "success", "data": serializer.data}, status=status.HTTP_200_OK)

        items = models.UserProfile.objects.all()
        serializer = serializers.UserProfileSerializer(items, many=True)
        return Response({"status": "success", "data": serializer.data}, status=status.HTTP_200_OK)

    @swagger_auto_schema(request_body=serializers.UserProfileSerializer, responses={201: serializers.UserProfileSerializer})
    def post(self, request):
        data = request.data.copy()
        if 'password' in data:
            data['password'] = make_password(data['password'])

        serializer = serializers.UserProfileSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response({"status": "success", "data": serializer.data}, status=status.HTTP_201_CREATED)
        return Response({"status": "error", "errors": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, id=None):
        item = get_object_or_404(models.UserProfile, user_id=id)
        item.delete()
        return Response({"status": "success", "message": "Deleted successfully"}, status=status.HTTP_204_NO_CONTENT)

class UserProfileUpdateAPIViewSet(APIView):
    parser_classes = [MultiPartParser, FormParser]

    def put(self, request, id=None):
        item = get_object_or_404(models.UserProfile, user_id=id)
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
            return Response({"status": "success", "message": "Login successful"}, status=status.HTTP_200_OK)
        else:
            return Response({"status": "error", "message": "Invalid username or password"}, status=status.HTTP_401_UNAUTHORIZED)
