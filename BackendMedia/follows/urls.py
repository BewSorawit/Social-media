# follows/urls.py
from django.urls import path
from .views import UserFollowViewSet

urlpatterns = [
    path('<int:user_id>/following/',
         UserFollowViewSet.as_view({'get': 'get_following'}), name='user-following'),
    path('<int:user_id>/followers/',
         UserFollowViewSet.as_view({'get': 'get_followers'}), name='user-followers'),
    path('<int:user_id>/follow/',
         UserFollowViewSet.as_view({'post': 'follow'}), name='follow-user'),
    path('<int:user_id>/unfollow/',
         UserFollowViewSet.as_view({'delete': 'unfollow'}), name='unfollow-user'),
]
