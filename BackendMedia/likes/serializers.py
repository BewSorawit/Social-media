from rest_framework import serializers
from likes.models import Like
class LikeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Like
        fields = ['like_id', 'user', 'post', 'comment']
