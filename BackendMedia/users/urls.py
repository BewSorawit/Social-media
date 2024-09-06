from django.urls import path
from .views import UsersViewSet,LoginViewSet
# from .views import register_user
from . import views
urlpatterns = [
    path('user_profile/', UsersViewSet.as_view()),
    path('login/', LoginViewSet.as_view(), name='login'),
   


]