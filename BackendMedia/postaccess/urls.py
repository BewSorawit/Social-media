from django.urls import path, include
from .views import PostAccessViewSet

urlpatterns = [
    path('<int:post_id>/access/', PostAccessViewSet.as_view(
        {'get': 'list', 'post': 'create'}), name='post-access'),
    path('<int:post_id>/access/<int:user_id>/',
         PostAccessViewSet.as_view({'delete': 'destroy'}), name='remove-post-access'),
]
