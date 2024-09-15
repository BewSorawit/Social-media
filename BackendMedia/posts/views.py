from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication
from .models import Post
from .serializers import PostSerializer
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi


class PostViewSet(viewsets.ViewSet):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def list_public(self, request):
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
        """List public posts by a specific author."""
        queryset = Post.objects.filter(
            author_id=author_id, visibility='public')
        serializer = PostSerializer(queryset, many=True)
        return Response(serializer.data)

    def list_all(self, request):
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
        """Delete a post."""
        try:
            post = Post.objects.get(pk=pk)
            if post.author != request.user:
                return Response({'detail': 'Permission denied.'}, status=status.HTTP_403_FORBIDDEN)

            post.delete()
            return Response({'detail': 'Post deleted successfully.'}, status=status.HTTP_204_NO_CONTENT)
        except Post.DoesNotExist:
            return Response({'detail': 'Post not found.'}, status=status.HTTP_404_NOT_FOUND)
