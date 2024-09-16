# follows/views.py
from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from users.models import UserProfile
from .models import UserFollow
from .serializers import UserProfileSerializer


class UserFollowViewSet(viewsets.ViewSet):
    permission_classes = [IsAuthenticated]

    def get_following(self, request, user_id=None):
        """Get users that the specified user is following."""
        try:
            user = UserProfile.objects.get(pk=user_id)
        except UserProfile.DoesNotExist:
            return Response({'detail': 'User not found.'}, status=status.HTTP_404_NOT_FOUND)

        following = UserFollow.objects.filter(follower=user)
        serializer = UserProfileSerializer(
            [follow.followed for follow in following], many=True)
        return Response(serializer.data)

    def get_followers(self, request, user_id=None):
        """Get users that are following the specified user."""
        try:
            user = UserProfile.objects.get(pk=user_id)
        except UserProfile.DoesNotExist:
            return Response({'detail': 'User not found.'}, status=status.HTTP_404_NOT_FOUND)

        followers = UserFollow.objects.filter(followed=user)
        serializer = UserProfileSerializer(
            [follow.follower for follow in followers], many=True)
        return Response(serializer.data)

    def follow(self, request, user_id=None):
        """Follow a user."""
        if not request.user.is_authenticated:
            return Response({'detail': 'Authentication required.'}, status=status.HTTP_401_UNAUTHORIZED)

        try:
            user_to_follow = UserProfile.objects.get(pk=user_id)
        except UserProfile.DoesNotExist:
            return Response({'detail': 'User not found.'}, status=status.HTTP_404_NOT_FOUND)

        if request.user.id == user_to_follow.id:
            return Response({'detail': 'You cannot follow yourself.'}, status=status.HTTP_400_BAD_REQUEST)

        UserFollow.objects.get_or_create(
            follower=request.user, followed=user_to_follow)
        return Response({'detail': 'Followed successfully.'}, status=status.HTTP_201_CREATED)

    def unfollow(self, request, user_id=None):
        """Unfollow a user."""
        if not request.user.is_authenticated:
            return Response({'detail': 'Authentication required.'}, status=status.HTTP_401_UNAUTHORIZED)

        try:
            user_to_unfollow = UserProfile.objects.get(pk=user_id)
        except UserProfile.DoesNotExist:
            return Response({'detail': 'User not found.'}, status=status.HTTP_404_NOT_FOUND)

        try:
            follow_instance = UserFollow.objects.get(
                follower=request.user, followed=user_to_unfollow)
            follow_instance.delete()
            return Response({'detail': 'Unfollowed successfully.'}, status=status.HTTP_204_NO_CONTENT)
        except UserFollow.DoesNotExist:
            return Response({'detail': 'Not following this user.'}, status=status.HTTP_400_BAD_REQUEST)
