from django.db import models
from posts.models import Post
from users.models import UserProfile
# Create your models here.


class PostAccess(models.Model):
    postAccess_id = models.AutoField(primary_key=True)
    post = models.ForeignKey(
        Post, related_name='accesses', on_delete=models.CASCADE)
    user = models.ForeignKey(
        UserProfile, related_name='post_access', on_delete=models.CASCADE)

    def __str__(self):
        return f"Access for {self.user.username} to Post {self.post.id}"

    class Meta:
        db_table = 'PostAccess'
        unique_together = ('post', 'user')
