from django.urls import path
from .views import UsersViewSet, LoginViewSet, UserProfileUpdateAPIViewSet, CreateUsersViewSet, LogoutView
# from .views import register_user

urlpatterns = [
    path('user_profile/', UsersViewSet.as_view()),
    path('user_profile/create_user/', CreateUsersViewSet.as_view()),
    path('user_profile/<int:id>/', UsersViewSet.as_view()),
    path('user_profile/update/<int:id>/',
         UserProfileUpdateAPIViewSet.as_view()),
    path('login/', LoginViewSet.as_view(), name='login'),
    path('logout/', LogoutView.as_view(), name='logout'),
]
