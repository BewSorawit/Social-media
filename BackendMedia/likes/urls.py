from django.urls import path, include
from .views import LikeViewSet



urlpatterns = [
    path('like_unlike/', LikeViewSet.as_view({'post': 'like_unlike'}), name='like-unlike'),
    path('<int:pk>/like_count/', LikeViewSet.as_view({'get': 'like_count'}), name='like-count'),
]




