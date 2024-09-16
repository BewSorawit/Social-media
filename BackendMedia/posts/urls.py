from django.urls import path
from .views import PostViewSet

urlpatterns = [
     
    path('public/', PostViewSet.as_view({'get': 'list_public'})),     #เห็นโพสต์ทั้งหมดที่เป็น public
    path('public/by_author/<int:author_id>/',PostViewSet.as_view({'get': 'list_public_by_author'})),     #แสดงรายการโพสต์ public โดยผู้เขียนคนใดคนหนึ่ง
    path('all/', PostViewSet.as_view({'get': 'list_all'})), #แสดงรายการโพสต์ทั้งหมดที่ผู้ใช้มองเห็นได้ (สาธารณะและส่วนตัวสำหรับผู้ใช้ที่เข้าสู่ระบบ)
    path('private/', PostViewSet.as_view({'get': 'list_private'})),   #แสดงรายการโพสต์ส่วนตัวที่ผู้ใช้ที่เข้าสู่ระบบมองเห็นได้ (โพสต์ที่ต้องได้รับอนุญาต)
    path('create/', PostViewSet.as_view({'post': 'create'})),    #สร้างโพสต์
    path('<int:pk>/',PostViewSet.as_view({'put': 'update', 'delete': 'delete'})),    #อัพเดทและลบโพสต์
    path('users/<int:user_id>/followed_posts/',PostViewSet.as_view({'get': 'get_followed_posts'}), name='followed-posts'),   #ดึงโพสต์จากผู้ใช้ที่ผู้ใช้ที่ระบุติดตามอยู่
    path('users/<int:user_id>/feed/',PostViewSet.as_view({'get': 'get_feed'}), name='user-feed'),   #เรียกดูโพสต์ที่ผู้ใช้ที่ระบุมองเห็นได้ (รวมถึงโพสต์จากผู้ใช้ที่ติดตามและโพสต์ของตนเอง)

]
