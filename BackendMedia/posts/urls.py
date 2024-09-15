from django.urls import path, include
from .views import PostViewSet

urlpatterns = [
    path('user_posts/', PostViewSet.as_view({'get': 'list'})),
    path('user_posts/<int:pk>/', PostViewSet.as_view({'get': 'list_by_id'})),
    path('user_posts/create_posts/', PostViewSet.as_view({'post': 'create'})),
    path('user_posts/update_posts/<int:pk>/', PostViewSet.as_view({'put': 'update'})),
    path('user_posts/delete_posts/<int:pk>/', PostViewSet.as_view({'delete': 'delete'})),

]
