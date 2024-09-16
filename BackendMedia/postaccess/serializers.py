from rest_framework import serializers
from .models import PostAccess


class PostAccessSerializer(serializers.ModelSerializer):
    class Meta:
        model = PostAccess
        fields = ['postAccess_id', 'post', 'user']
