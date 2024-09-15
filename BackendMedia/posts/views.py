from django.shortcuts import render
from .models import Post
from .serializers import PostSerializer
from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from . import models, serializers
from .models import Post
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework_simplejwt.exceptions import InvalidToken, TokenError
from django.shortcuts import get_object_or_404


class PostViewSet(viewsets.ModelViewSet):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def list(self, request):
        if request.user.is_authenticated:
            queryset = Post.objects.filter(author=request.user) | Post.objects.filter(visibility='public')
        else:
            queryset = Post.objects.filter(visibility='public')

        serializer = PostSerializer(queryset, many=True)
        return Response(serializer.data)
    
    # def list_by_id(self, request, author_id=None):
    #     #เห็นเมื่อเป็นเพื่อนกัน
    #     try:
    #         # post = Post.objects.get(pk=pk)
    #         posts = Post.objects.filter(author_id=author_id)
           
    #         if not visible_posts:
    #             return Response({'detail': 'Not found.'}, status=status.HTTP_404_NOT_FOUND)

    #         serializer = PostSerializer(visible_posts, many=True)
    #         return Response(serializer.data)
    #     except Post.DoesNotExist:
    #         return Response({'detail': 'Post not found.'}, status=status.HTTP_404_NOT_FOUND)
    def list_by_id(self, request, author_id=None):
        posts = Post.objects.filter(author_id=author_id)
        visible_posts = [
            post for post in posts
            if post.visibility == 'public' or post.author.id == request.user.id
        ]
        if not visible_posts:
            return Response({'detail': 'Not found.'}, status=status.HTTP_404_NOT_FOUND)

        serializer = PostSerializer(visible_posts, many=True)
        return Response(serializer.data)

    def create(self, request):
        serializer = PostSerializer(data=request.data)
        if serializer.is_valid():
            # Automatically set the author to the logged-in user
            serializer.save(author_id=request.user.id)
            print(request.user.id)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def update(self, request, pk=None):
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

    def delete(self, request, pk=None):
        try:
            post = Post.objects.get(pk=pk)
            if post.author != request.user:
                return Response({'detail': 'Permission denied.'}, status=status.HTTP_403_FORBIDDEN)

            post.delete()
            return Response({'detail': 'Post deleted successfully.'}, status=status.HTTP_204_NO_CONTENT)
        except Post.DoesNotExist:
            return Response({'detail': 'Post not found.'}, status=status.HTTP_404_NOT_FOUND)

