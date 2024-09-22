from django.urls import path
from .views import PostViewSet

urlpatterns = [

    # เห็นโพสต์ทั้งหมดที่เป็น public
    path('public/', PostViewSet.as_view({'get': 'list_public'})),
    path('privates/', PostViewSet.as_view({'get': 'list_privates'})),

    # แสดงรายการโพสต์ public โดยผู้เขียนคนใดคนหนึ่ง
    path('public/by_author/<int:author_id>/',
         PostViewSet.as_view({'get': 'list_public_by_author'})),
    path('public_and_private/by_author/<int:author_id>/',
         PostViewSet.as_view({'get': 'list_public_and_private_by_author'})),

    # แสดงรายการโพสต์ทั้งหมดที่ผู้ใช้มองเห็นได้ (สาธารณะและส่วนตัวสำหรับผู้ใช้ที่เข้าสู่ระบบ)
    path('all/', PostViewSet.as_view({'get': 'list_all'})),

    # แสดงรายการโพสต์ส่วนตัวที่ผู้ใช้ที่เข้าสู่ระบบมองเห็นได้ (โพสต์ที่ต้องได้รับอนุญาต)
    path('private/', PostViewSet.as_view({'get': 'list_private'})),

    path('create/', PostViewSet.as_view({'post': 'create'})),  # สร้างโพสต์
    # อัพเดทและลบโพสต์
    path('<int:pk>/',
         PostViewSet.as_view({'put': 'update', 'delete': 'delete'})),

    path('users/<int:user_id>/followed_posts/',
         PostViewSet.as_view({'get': 'get_followed_posts'}), name='followed-posts'),

    path('users/<int:user_id>/profile_posts/',
         PostViewSet.as_view({'get': 'get_user_profile_posts'}), name='user-profile-posts'),


]
