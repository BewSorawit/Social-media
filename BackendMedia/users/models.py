from django.contrib.auth.models import AbstractBaseUser, BaseUserManager
from django.db import models

class CustomUserManager(BaseUserManager):
    def create_user(self, username, password=None, **extra_fields):
        if not username:
            raise ValueError('The Username field must be set')
        user = self.model(username=username, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, username, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        return self.create_user(username, password, **extra_fields)

class UserProfile(AbstractBaseUser):
    GENDER_CHOICES = [
        ('M', 'Male'), ('F', 'Female'), ('O', 'Other')
    ]

    id = models.AutoField(primary_key=True)
    username = models.CharField(max_length=50, unique=True)
    first_name = models.CharField(max_length=50)
    last_name = models.CharField(max_length=50)
    password = models.CharField(max_length=100)
    date_of_birth = models.DateField()
    gender = models.CharField(max_length=10, choices=GENDER_CHOICES)
    profile_picture = models.ImageField(upload_to='profile_pics/', null=True, blank=True)

    USERNAME_FIELD = 'username'
    REQUIRED_FIELDS = ['first_name', 'last_name', 'date_of_birth', 'gender']

    objects = CustomUserManager()

    def __str__(self):
        return self.username
    

# class BlacklistedAccessToken(models.Model):
#     token = models.CharField(max_length=500, unique=True)
#     blacklisted_at = models.DateTimeField(auto_now_add=True)

#     def __str__(self):
#         return self.token

class BlacklistedAccessToken(models.Model):
    token = models.CharField(max_length=500, unique=True)
    blacklisted_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.token

    @staticmethod
    def is_blacklisted(token):
        """
        Check if the given token is blacklisted.
        """
        return BlacklistedAccessToken.objects.filter(token=token).exists()