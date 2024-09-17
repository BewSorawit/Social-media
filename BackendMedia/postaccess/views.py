from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import PostAccess
from .serializers import PostAccessSerializer
from posts.models import Post
from users.models import UserProfile
# from users.models import BlacklistedAccessToken

class PostAccessViewSet(viewsets.ViewSet):
    permission_classes = [IsAuthenticated]

    def list(self, request, post_id=None):
         # token = request.headers.get('Authorization')
        # print(f"Original token: {token}")
        # if token:
        #     if token.startswith('Bearer '):
        #         token = token[len('Bearer '):]
        #     print(f"Processed token: {token}")

        #     if BlacklistedAccessToken.is_blacklisted(token):
        #         print(f"Token is blacklisted: {token}")
        #         return Response({"detail": "Token has been blacklisted"}, status=status.HTTP_403_FORBIDDEN)
        """List all users who have access to the specified post."""
        if not Post.objects.filter(pk=post_id).exists():
            return Response({'detail': 'Post not found.'}, status=status.HTTP_404_NOT_FOUND)

        accesses = PostAccess.objects.filter(post_id=post_id)
        serializer = PostAccessSerializer(accesses, many=True)
        return Response(serializer.data)

    def create(self, request, post_id=None):
         # token = request.headers.get('Authorization')
        # print(f"Original token: {token}")
        # if token:
        #     if token.startswith('Bearer '):
        #         token = token[len('Bearer '):]
        #     print(f"Processed token: {token}")

        #     if BlacklistedAccessToken.is_blacklisted(token):
        #         print(f"Token is blacklisted: {token}")
        #         return Response({"detail": "Token has been blacklisted"}, status=status.HTTP_403_FORBIDDEN)
        """Add access to the specified post for a user."""
        post = Post.objects.filter(pk=post_id).first()
        if not post:
            return Response({'detail': 'Post not found.'}, status=status.HTTP_404_NOT_FOUND)

        user_id = request.data.get('user_id')
        user = UserProfile.objects.filter(pk=user_id).first()
        if not user:
            return Response({'detail': 'User not found.'}, status=status.HTTP_404_NOT_FOUND)

        access, created = PostAccess.objects.get_or_create(
            post=post, user=user)
        if created:
            return Response({'detail': 'Access granted.'}, status=status.HTTP_201_CREATED)
        else:
            return Response({'detail': 'Access already exists.'}, status=status.HTTP_400_BAD_REQUEST)

    def destroy(self, request, post_id=None, user_id=None):
         # token = request.headers.get('Authorization')
        # print(f"Original token: {token}")
        # if token:
        #     if token.startswith('Bearer '):
        #         token = token[len('Bearer '):]
        #     print(f"Processed token: {token}")

        #     if BlacklistedAccessToken.is_blacklisted(token):
        #         print(f"Token is blacklisted: {token}")
        #         return Response({"detail": "Token has been blacklisted"}, status=status.HTTP_403_FORBIDDEN)
        """Remove access to the specified post for a user."""
        post = Post.objects.filter(pk=post_id).first()
        if not post:
            return Response({'detail': 'Post not found.'}, status=status.HTTP_404_NOT_FOUND)

        user = UserProfile.objects.filter(pk=user_id).first()
        if not user:
            return Response({'detail': 'User not found.'}, status=status.HTTP_404_NOT_FOUND)

        access = PostAccess.objects.filter(post=post, user=user).first()
        if access:
            access.delete()
            return Response({'detail': 'Access removed.'}, status=status.HTTP_204_NO_CONTENT)
        else:
            return Response({'detail': 'Access not found.'}, status=status.HTTP_404_NOT_FOUND)
