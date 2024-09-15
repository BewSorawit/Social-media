from django.urls import path
from .views import PostViewSet

urlpatterns = [
    path('public/', PostViewSet.as_view({'get': 'list_public'})),
    path('public/by_author/<int:author_id>/',
         PostViewSet.as_view({'get': 'list_public_by_author'})),
    path('all/', PostViewSet.as_view({'get': 'list_all'})),
    path('private/', PostViewSet.as_view({'get': 'list_private'})),
    path('create/', PostViewSet.as_view({'post': 'create'})),
    path('<int:pk>/',
         PostViewSet.as_view({'put': 'update', 'delete': 'delete'})),
]
