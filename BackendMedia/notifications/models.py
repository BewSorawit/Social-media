from django.db import models
from users.models import UserProfile
from messaging.models import Message
from comments.models import Comment
from posts.models import Post

# Create your models here.


class Notification(models.Model):
    NOTIFICATION_TYPES = (
        ('comment', 'Comment'),
        ('follow', 'Follow'),
        ('message', 'Message'),
    )

    notification_id = models.AutoField(primary_key=True)
    sender = models.ForeignKey(
        UserProfile, related_name='notifications_sent', on_delete=models.CASCADE)
    receiver = models.ForeignKey(
        UserProfile, related_name='notifications_received', on_delete=models.CASCADE)
    notification_type = models.CharField(
        max_length=10, choices=NOTIFICATION_TYPES)
    message = models.ForeignKey(
        Message, null=True, blank=True, on_delete=models.CASCADE)
    post = models.ForeignKey(Post, null=True, blank=True,
                             on_delete=models.CASCADE)
    comment = models.ForeignKey(
        Comment, null=True, blank=True, on_delete=models.CASCADE)
    # created_at = models.DateTimeField(auto_now_add=True)
    is_read = models.BooleanField(default=False)

    def __str__(self):
        return f"Notification from {self.sender.username} to {self.receiver.username} ({self.notification_type})"

    class Meta:
        db_table = 'Notification'
