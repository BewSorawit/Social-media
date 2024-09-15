from rest_framework import serializers
from .models import Post


# class PostSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = Post
#         fields = ['post_id', 'author', 'content',
#                   'image', 'visibility', 'created_at']


class PostSerializer(serializers.ModelSerializer):
    class Meta:
        model = Post
        fields = ['post_id', 'author', 'content', 'image', 'visibility', 'created_at']
        read_only_fields = ['author', 'created_at']