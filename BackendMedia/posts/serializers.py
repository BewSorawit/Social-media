from rest_framework import serializers
from .models import Post
from likes.models import Like  # นำเข้าโมเดล Like

class PostSerializer(serializers.ModelSerializer):
    like_count = serializers.SerializerMethodField()
    liked_user_ids = serializers.SerializerMethodField()

    def get_like_count(self, obj):
        return Like.objects.filter(post=obj).count()

    def get_liked_user_ids(self, obj):
        return Like.objects.filter(post=obj).values_list('user', flat=True)

    class Meta:
        model = Post
        fields = ['post_id', 'author', 'content', 'image', 'visibility', 'created_at', 'like_count', 'liked_user_ids']
        read_only_fields = ['author', 'created_at']
