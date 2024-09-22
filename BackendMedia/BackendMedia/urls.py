from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from rest_framework import permissions
from drf_yasg.views import get_schema_view
from drf_yasg import openapi

# Define the schema view for Swagger and ReDoc
schema_view = get_schema_view(
    openapi.Info(
        title="My API",
        default_version='v1',
        description="Test API description",
        terms_of_service="https://www.google.com/policies/terms/",
        contact=openapi.Contact(email="contact@myapi.local"),
        license=openapi.License(name="BSD License"),
    ),
    public=True,
    permission_classes=(permissions.AllowAny,),
)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('hurry-feed/users/', include('users.urls')),
    path('hurry-feed/posts/', include('posts.urls')),
    path('hurry-feed/likes/', include('likes.urls')),
    path('hurry-feed/userfollow/', include('follows.urls')),
    path('hurry-feed/postaccess/', include('postaccess.urls')),

    path('swagger/', schema_view.with_ui('swagger',
         cache_timeout=0), name='schema-swagger-ui'),

    path('redoc/', schema_view.with_ui('redoc',
         cache_timeout=0), name='schema-redoc'),


]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL,
                          document_root=settings.MEDIA_ROOT)
