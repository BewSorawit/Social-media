from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication
# from users.models import BlacklistedAccessToken
from follows.models import UserFollow
from users.models import UserProfile
from .models import Post
from .serializers import PostSerializer
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi
from django.db.models import Q

from posts.models import Post
from users.models import UserProfile
from follows.models import UserFollow
from posts.serializers import PostSerializer


class PostViewSet(viewsets.ViewSet):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def list_public(self, request):
        # token = request.headers.get('Authorization')
        # print(f"Original token: {token}")
        # if token:
        #     if token.startswith('Bearer '):
        #         token = token[len('Bearer '):]
        #     print(f"Processed token: {token}")

        #     if BlacklistedAccessToken.is_blacklisted(token):
        #         print(f"Token is blacklisted: {token}")
        #         return Response({"detail": "Token has been blacklisted"}, status=status.HTTP_403_FORBIDDEN)
        """List all public posts."""
        queryset = Post.objects.filter(visibility='public')
        serializer = PostSerializer(queryset, many=True)
        return Response(serializer.data)

    @swagger_auto_schema(
        responses={200: PostSerializer(many=True)},
        manual_parameters=[openapi.Parameter(
            'author_id', openapi.IN_PATH, description="Author ID", type=openapi.TYPE_INTEGER)]
    )
    def list_public_by_author(self, request, author_id=None):
        # token = request.headers.get('Authorization')
        # print(f"Original token: {token}")
        # if token:
        #     if token.startswith('Bearer '):
        #         token = token[len('Bearer '):]
        #     print(f"Processed token: {token}")

        #     if BlacklistedAccessToken.is_blacklisted(token):
        #         print(f"Token is blacklisted: {token}")
        #         return Response({"detail": "Token has been blacklisted"}, status=status.HTTP_403_FORBIDDEN)
        """List public posts by a specific author."""
        queryset = Post.objects.filter(
            author_id=author_id, visibility='public')
        serializer = PostSerializer(queryset, many=True)
        return Response(serializer.data)

    def list_all(self, request):
        # token = request.headers.get('Authorization')
        # print(f"Original token: {token}")
        # if token:
        #     if token.startswith('Bearer '):
        #         token = token[len('Bearer '):]
        #     print(f"Processed token: {token}")

        #     if BlacklistedAccessToken.is_blacklisted(token):
        #         print(f"Token is blacklisted: {token}")
        #         return Response({"detail": "Token has been blacklisted"}, status=status.HTTP_403_FORBIDDEN)
        print(request.user)
        """List all posts visible to the user (public and private for logged-in user)."""
        if request.user.is_authenticated:
            user_posts = Post.objects.filter(author=request.user)
        else:
            user_posts = Post.objects.none()
        public_posts = Post.objects.filter(visibility='public')
        queryset = user_posts | public_posts
        serializer = PostSerializer(queryset, many=True)
        return Response(serializer.data)

    def list_private(self, request):
        # token = request.headers.get('Authorization')
        # print(f"Original token: {token}")
        # if token:
        #     if token.startswith('Bearer '):
        #         token = token[len('Bearer '):]
        #     print(f"Processed token: {token}")

        #     if BlacklistedAccessToken.is_blacklisted(token):
        #         print(f"Token is blacklisted: {token}")
        #         return Response({"detail": "Token has been blacklisted"}, status=status.HTTP_403_FORBIDDEN)
        """List private posts visible to the logged-in user (posts requiring authorization)."""
        queryset = Post.objects.filter(
            author=request.user, visibility='private')
        serializer = PostSerializer(queryset, many=True)
        return Response(serializer.data)

    @swagger_auto_schema(
        request_body=PostSerializer,
        responses={201: PostSerializer, 400: 'Bad Request'}
    )
    def create(self, request):
        # token = request.headers.get('Authorization')
        # print(f"Original token: {token}")
        # if token:
        #     if token.startswith('Bearer '):
        #         token = token[len('Bearer '):]
        #     print(f"Processed token: {token}")

        #     if BlacklistedAccessToken.is_blacklisted(token):
        #         print(f"Token is blacklisted: {token}")
        #         return Response({"detail": "Token has been blacklisted"}, status=status.HTTP_403_FORBIDDEN)
        """Create a new post."""
        serializer = PostSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(author=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @swagger_auto_schema(
        request_body=PostSerializer,
        responses={200: PostSerializer, 403: 'Permission denied',
                   404: 'Post not found', 400: 'Bad request'}
    )
    def update(self, request, pk=None):
        # token = request.headers.get('Authorization')
        # print(f"Original token: {token}")
        # if token:
        #     if token.startswith('Bearer '):
        #         token = token[len('Bearer '):]
        #     print(f"Processed token: {token}")

        #     if BlacklistedAccessToken.is_blacklisted(token):
        #         print(f"Token is blacklisted: {token}")
        #         return Response({"detail": "Token has been blacklisted"}, status=status.HTTP_403_FORBIDDEN)
        """Update a post."""
        try:
            post = Post.objects.get(pk=pk)
            if post.author != request.user:
                return Response({'detail': 'Permission denied.'}, status=status.HTTP_403_FORBIDDEN)

            serializer = PostSerializer(post, data=request.data)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Post.DoesNotExist:
            return Response({'detail': 'Post not found.'}, status=status.HTTP_404_NOT_FOUND)

    @swagger_auto_schema(
        responses={204: 'Post deleted successfully',
                   403: 'Permission denied', 404: 'Post not found'}
    )
    def delete(self, request, pk=None):
        # token = request.headers.get('Authorization')
        # print(f"Original token: {token}")
        # if token:
        #     if token.startswith('Bearer '):
        #         token = token[len('Bearer '):]
        #     print(f"Processed token: {token}")

        #     if BlacklistedAccessToken.is_blacklisted(token):
        #         print(f"Token is blacklisted: {token}")
        #         return Response({"detail": "Token has been blacklisted"}, status=status.HTTP_403_FORBIDDEN)
        """Delete a post."""
        try:
            post = Post.objects.get(pk=pk)
            if post.author != request.user:
                return Response({'detail': 'Permission denied.'}, status=status.HTTP_403_FORBIDDEN)

            post.delete()
            return Response({'detail': 'Post deleted successfully.'}, status=status.HTTP_204_NO_CONTENT)
        except Post.DoesNotExist:
            return Response({'detail': 'Post not found.'}, status=status.HTTP_404_NOT_FOUND)
    from django.db.models import Q

    def get_followed_posts(self, request, user_id=None):
        # token = request.headers.get('Authorization')
        # print(f"Original token: {token}")
        # if token:
        #     if token.startswith('Bearer '):
        #         token = token[len('Bearer '):]
        #     print(f"Processed token: {token}")

        #     if BlacklistedAccessToken.is_blacklisted(token):
        #         print(f"Token is blacklisted: {token}")
        #         return Response({"detail": "Token has been blacklisted"}, status=status.HTTP_403_FORBIDDEN)

        if not request.user.is_authenticated:
            return Response({'detail': 'Authentication required.'}, status=status.HTTP_401_UNAUTHORIZED)

        try:
            user = UserProfile.objects.get(pk=user_id)
        except UserProfile.DoesNotExist:
            return Response({'detail': 'User not found.'}, status=status.HTTP_404_NOT_FOUND)

        following_users = UserFollow.objects.filter(
            follower=user).values_list('followed', flat=True)
        mutual_followers = UserFollow.objects.filter(
            follower__in=following_users, followed=user).values_list('follower', flat=True)
        posts = Post.objects.filter(
            Q(visibility='public') |
            (Q(author__in=mutual_followers) & Q(visibility='private'))
        )
        serializer = PostSerializer(posts, many=True)
        return Response(serializer.data)

    def get_feed(self, request, user_id=None):
        # token = request.headers.get('Authorization')
        # print(f"Original token: {token}")
        # if token:
        #     if token.startswith('Bearer '):
        #         token = token[len('Bearer '):]
        #     print(f"Processed token: {token}")

        #     if BlacklistedAccessToken.is_blacklisted(token):
        #         print(f"Token is blacklisted: {token}")
        #         return Response({"detail": "Token has been blacklisted"}, status=status.HTTP_403_FORBIDDEN)
        """Retrieve posts visible to the specified user (including posts from followed users and their own posts)."""
        # ตรวจสอบว่าผู้ใช้ที่ระบุด้วย user_id มีอยู่
        user = UserProfile.objects.filter(pk=user_id).first()
        if not user:
            return Response({'detail': 'User not found.'}, status=status.HTTP_404_NOT_FOUND)

        # ดึงโพสต์ที่ผู้ใช้เป็นเจ้าของ
        user_posts = Post.objects.filter(author=user)

        # ดึงรายการผู้ใช้ที่ user กำลังติดตาม
        followed_users = UserFollow.objects.filter(
            follower=user).values_list('followed', flat=True)

        # ดึงโพสต์ทั้งหมดจากผู้ใช้ที่ติดตาม
        followed_posts = Post.objects.filter(
            author__in=followed_users, visibility='public')

        # รวมโพสต์ของผู้ใช้เองและโพสต์จากผู้ใช้ที่ติดตาม
        queryset = user_posts | followed_posts
        serializer = PostSerializer(queryset, many=True)
        return Response(serializer.data)
