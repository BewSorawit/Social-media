from rest_framework import status, viewsets
from rest_framework.response import Response
from rest_framework.decorators import action
from django.shortcuts import get_object_or_404
from likes.models import Like
from posts.models import Post
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.permissions import IsAuthenticated

class LikeViewSet(viewsets.ViewSet):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    """
    API สำหรับการกดไลค์โพสต์หรือคอมเมนต์ และการนับจำนวนไลค์
    """

    @action(detail=False, methods=['post'])
    def like_unlike(self, request):
        user = request.user
        post_id = request.data.get('post_id')
        comment_id = request.data.get('comment_id')

        # เช็คว่าเป็นการไลค์โพสต์หรือคอมเมนต์
        if post_id:
            post = get_object_or_404(Post, post_id=post_id)
            like, created = Like.objects.get_or_create(user=user, post=post)
        # elif comment_id:
        #     comment = get_object_or_404(Comment, id=comment_id)
        #     like, created = Like.objects.get_or_create(user=user, comment=comment)
        else:
            return Response({'detail': 'Post or Comment ID required'}, status=status.HTTP_400_BAD_REQUEST)

        # หากมีการสร้างไลค์ใหม่ (like) แต่ถ้ามีไลค์อยู่แล้ว (unlike) จะทำการลบ
        if not created:
            like.delete()
            return Response({'detail': 'Unliked'}, status=status.HTTP_204_NO_CONTENT)

        return Response({'detail': 'Liked'}, status=status.HTTP_201_CREATED)

    @action(detail=True, methods=['get'])
    def like_count(self, request, pk=None):
        # นับจำนวนไลค์ของโพสต์โดยใช้ pk จาก URL
        post = get_object_or_404(Post, post_id=pk)

        count = post.likes.count()
        return Response({'like_count': count})
