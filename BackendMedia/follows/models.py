from django.db import models
from users.models import UserProfile
# Create your models here.


class UserFollow(models.Model):

    userFollow_id = models.AutoField(primary_key=True)
    follower = models.ForeignKey(
        UserProfile, related_name='following', on_delete=models.CASCADE)
    followed = models.ForeignKey(
        UserProfile, related_name='followers', on_delete=models.CASCADE)

    def __str__(self):
        return f"{self.follower.username} follows {self.followed.username}"

    class Meta:
        db_table = 'UserFollow'
        unique_together = ('follower', 'followed')

    def __str__(self):
        return f"{self.follower.username} follows {self.followed.username}"
