from django.db import models
from django.contrib.auth.models import User
# Create your models here.


class accounts(models.Model):
    userName = models.CharField(max_length=100,unique=True)
    password = models.CharField(max_length= 100)
    domain = models.CharField(max_length= 255)
    domain.required = False
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    
    def __str__(self):
        return self.userName







        