from django.urls import path
from .views import UserFollowViewSet

urlpatterns = [
    #    id นั้นกำลังติดตามใครอยู่
    path('<int:user_id>/following/',
         UserFollowViewSet.as_view({'get': 'get_following'}), name='user-following'),
    #    id นั้นกำลังถูกใครติดตาม
    path('<int:user_id>/followers/',
         UserFollowViewSet.as_view({'get': 'get_followers'}), name='user-followers'),
    #    สร้างการติดตาม
    path('<int:user_id>/follow/',
         UserFollowViewSet.as_view({'post': 'follow'}), name='follow-user'),
    path('<int:user_id>/unfollow/',
         UserFollowViewSet.as_view({'delete': 'unfollow'}), name='unfollow-user'),
]
