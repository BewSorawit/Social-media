from django.urls import path
from .views import UsersViewSet, LoginViewSet
from .swagger import schema_view

# from .views import register_user
from . import views
urlpatterns = [
    path('user_profile/', UsersViewSet.as_view()),
    path('login/', LoginViewSet.as_view(), name='login'),
    path('swagger/', schema_view.with_ui('swagger',
         cache_timeout=0), name='schema-swagger-ui'),


]
