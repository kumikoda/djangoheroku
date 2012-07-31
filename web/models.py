from django.db import models

# Create your models here.
class Party(models.Model):
	name = models.CharField(max_length=200)
	size = models.IntegerField()
	number = models.IntegerField()
	status = models.CharField(max_length=2, choices = {("w","waiting"), ("m","messaged"), ("s","seated")} )
	
	
