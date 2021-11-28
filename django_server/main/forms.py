from django.forms import ModelForm
from django.contrib.auth.forms import UserCreationForm
from django import forms
from django.contrib.auth.models import User
from .models import accounts
from bootstrap_modal_forms.forms import BSModalModelForm
class CreateUserForm(UserCreationForm):
    class Meta:
        model = User
        fields = ('username', 'password1', 'password2')



class AccountModelForm(ModelForm):
    class Meta:
        model = accounts
        fields = ['userName','password','domain']
        
        
