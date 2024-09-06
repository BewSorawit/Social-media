from django.db import models

# Create your models here.


class UserProfile(models.Model):

    GENDER_CHOICES = [
        ('M', 'Male'), ('F', 'Female'), ('O', 'Other')
    ]

    user_id = models.AutoField(primary_key=True)
    username = models.CharField(max_length=50, unique=True)
    first_name = models.CharField(max_length=50)
    last_name = models.CharField(max_length=50)
    password = models.CharField(max_length=100)
    date_of_birth = models.DateField()
    gender = models.CharField(max_length=10, choices=GENDER_CHOICES)
    profile_picture = models.ImageField(
        upload_to='profile_pics/', null=True, blank=True)

    def __str__(self):
        return self.username

    class Meta:
        db_table = 'UserProfile'
