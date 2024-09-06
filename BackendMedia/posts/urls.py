from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import PostViewSet

# สร้าง router สำหรับ PostViewSet
router = DefaultRouter()
router.register(r'posts', PostViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
