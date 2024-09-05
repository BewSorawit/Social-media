from django.db import models

# Create your models here.
class Register(models.Model):
    register_fname = models.CharField(max_length=100)