from rest_framework import serializers
from .models import UserProfile


class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfile
        fields = ['id', 'username', 'first_name', 'last_name',
                  'password', 'date_of_birth', 'gender', 'profile_picture']
        extra_kwargs = {
            'password': {'write_only': True}
        }
