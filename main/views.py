from django.shortcuts import render, redirect

from .models import accounts
from .decorators import  UnauthenticatedUser
from .forms import AccountModelForm, CreateUserForm
from django.contrib import messages
from django.contrib.auth import authenticate,login,logout
from django.views.generic import TemplateView, View
from django.core import serializers
from django.http import JsonResponse
import json
# Create your views here.

def DashboardView(request):
    if request.method == 'POST' and request.is_ajax():
        #print("Post works")
        request_data=json.loads(request.body)
        accountsArray = request_data['accountsDictArray']
       # print(accountsArray)
    context = {}
    return render(request,'dashboard.html',context)


class AccountView(View):
    def get(self, request):
        qs = accounts.objects.all()
        data = serializers.serialize('json',qs)
        return JsonResponse({'data':data},safe=False )


def createAccountView(request):
    if request.method == 'POST':
        createform = AccountModelForm(request.POST)
        if createform.is_valid():
            
            accounts = createform.save(commit=False)
            accounts.user = request.user
            accounts.save()
            accountname = createform.cleaned_data.get('userName')
            return redirect('dashboard')

    else:
        createform = AccountModelForm()
    
        
    context = {'form':createform}
    return render(request, 'create_account.html',context)

def deleteAccountView(request):
    if request.method == 'POST':
        request_data = request.POST
        accountName = request_data['element_id']
        
        selected_account = accounts.objects.get(user = request.user, userName = accountName)
        selected_account.delete()
        
        return redirect('dashboard')
        
    context = {}
    return render(request, 'delete_account.html',context)
    
    

def LogIn(request):

    if request.method == 'POST':
        username = request.POST.get('username')
        password = request.POST.get('password')

        user = authenticate(request, username=username,password=password)

        if user is not None:
            login(request,user)
            return redirect('dashboard')
        else:
            messages.info(request, "Username or password is incorrect")
            

    context = {}
    return render(request, 'login.html', context)

@UnauthenticatedUser
def RegisterPage(request):
    
    if request.method == "POST":
        form = CreateUserForm(request.POST)
        if form.is_valid():
            user = form.save()
            username = form.cleaned_data.get('username')
            print(username)
            messages.success(request, f'Account successfully created for {username}')
            return redirect('login')
    else:
        form = CreateUserForm()
        
    context = {'form':form}
    return render(request,'register.html', context)

def logoutUser(request):
    logout(request)
    return redirect('login')