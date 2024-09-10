from django.urls import path
from .views import UsersViewSet, LoginViewSet, UserProfileUpdateAPIViewSet, CreateUsersViewSet
# from .views import register_user
from . import views
urlpatterns = [
    path('user_profile/', UsersViewSet.as_view()),
    path('user_profile/create_user/', CreateUsersViewSet.as_view()),
    path('user_profile/<int:id>/', UsersViewSet.as_view()),
    path('user_profile/update/<int:id>/', UserProfileUpdateAPIViewSet.as_view()),
    path('login/', LoginViewSet.as_view(), name='login'),
]

# from django.urls import path
# from .views import UsersViewSet, LoginViewSet, UserProfileUpdateAPIViewSet
# from . import views

# urlpatterns = [
#     path('user_profile/', UsersViewSet.as_view()),
#     path('user_profile/<int:user_id>/', UsersViewSet.as_view()),  # ใช้ user_id
#     path('user_profile/update/<int:user_id>/', UserProfileUpdateAPIViewSet.as_view()),  # ใช้ user_id
#     path('login/', LoginViewSet.as_view(), name='login'),
# ]
