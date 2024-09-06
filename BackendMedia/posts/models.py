from django.db import models
from users.models import UserProfile
# Create your models here.


class Post(models.Model):
    VISIBILITY_CHOICES = (
        ('public', 'Public'),
        ('private', 'Private'),
    )

    post_id = models.AutoField(primary_key=True)
    author = models.ForeignKey(
        UserProfile, related_name='posts', on_delete=models.CASCADE)
    content = models.TextField()
    image = models.ImageField(upload_to='post_images/', null=True, blank=True)
    visibility = models.CharField(
        max_length=10, choices=VISIBILITY_CHOICES, default='public')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Post by {self.author.username} at {self.created_at}"

    class Meta:
        db_table = 'Post'
