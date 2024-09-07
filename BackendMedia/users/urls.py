from django.urls import path
from .views import UsersViewSet, LoginViewSet, UserProfileUpdateAPIViewSet
# from .views import register_user
from . import views
urlpatterns = [
    path('user_profile/', UsersViewSet.as_view()),
    path('user_profile/<int:id>', UsersViewSet.as_view()),
    path('user_profile/update/<int:id>', UserProfileUpdateAPIViewSet.as_view()),
    path('login/', LoginViewSet.as_view(), name='login'),
]
