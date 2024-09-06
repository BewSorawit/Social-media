from django.db import models
from users.models import UserProfile
from posts.models import Post
from comments.models import Comment
# Create your models here.


class Like(models.Model):
    like_id = models.AutoField(primary_key=True)
    user = models.ForeignKey(
        UserProfile, related_name='likes', on_delete=models.CASCADE)
    post = models.ForeignKey(Post, related_name='likes',
                             on_delete=models.CASCADE, null=True, blank=True)
    comment = models.ForeignKey(Comment, related_name='likes', on_delete=models.CASCADE,
                                null=True, blank=True)

    def __str__(self):
        if self.post:
            return f"Like by {self.user.username} on Post {self.post.id}"
        elif self.comment:
            return f"Like by {self.user.username} on Comment {self.comment.id}"
        return f"Like by {self.user.username}"

    class Meta:
        db_table = 'likes'
        unique_together = ('user', 'post', 'comment')
