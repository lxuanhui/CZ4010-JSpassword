from django.shortcuts import render, redirect

from .models import accounts
from .decorators import  UnauthenticatedUser
from .forms import AccountModelForm, CreateUserForm
from django.contrib import messages
from django.contrib.auth import authenticate,login,logout
from django.views.generic import TemplateView, View
from django.core import serializers
from django.http import JsonResponse
from django.contrib.auth.hashers import check_password
from .AESCipher import AESCipher
import hashlib
from ast import literal_eval
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import authentication, permissions
from django.db.models import Q
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
        userID = request.user.id
        qs = accounts.objects.filter(user_id=userID)
        #print(request.session['sha256_password'] )
        aescipher = AESCipher(request.session['sha256_password'] )
        for data in qs:
            data.password = aescipher.decrypt(literal_eval(data.password))
        data = serializers.serialize('json',qs)
        return JsonResponse({'data':data},safe=False )


def createAccountView(request):
    if request.method == 'POST':
        createform = AccountModelForm(request.POST)
        if createform.is_valid() and check_password(request.POST['main_password'], request.user.password):
            aescipher = AESCipher(request.session['sha256_password'])
            accounts = createform.save(commit=False)
            accounts.password = aescipher.encrypt(accounts.password)
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
            request.session['sha256_password'] = hashlib.sha256(password.encode()).hexdigest()
            return redirect('dashboard')
        else:
            messages.info(request, "Username or password is incorrect")
            

    context = {}
    return render(request, 'login.html', context)


class loginAjax(APIView):
    def get(self,request):
        if request.method == 'GET':
            username = request.GET.get('username')
            password = request.GET.get('password')

            user = authenticate(request, username=username,password=password)

            if user is not None:
                return Response({'success': '1','data':{'userID':user.id}})
            else:
                return Response({'success': '0'})
        return Response({'success': '0'})

class getAccounts(APIView):
    def get(self,request):
        if request.method == 'GET':
            userID = request.GET.get('userID')
            password_hash = request.GET.get('password_hash')
            domain = request.GET.get('domain')
            print("test1")
            qs = accounts.objects.filter(Q(user_id=userID),Q(domain=domain)|Q(domain=""))
            print("test1")
            aescipher = AESCipher(password_hash)
            for data in qs:
                data.password = aescipher.decrypt(literal_eval(data.password))
            data = serializers.serialize('json',qs)
            return JsonResponse({'data':data},safe=False )


@UnauthenticatedUser
def RegisterPage(request):
    if request.method == "POST":
        form = CreateUserForm(request.POST)
        if form.is_valid():
            user = form.save()
            username = form.cleaned_data.get('username')
            messages.success(request, f'Account successfully created for {username}')
            return redirect('login')
    else:
        form = CreateUserForm()
        
    context = {'form':form}
    return render(request,'register.html', context)

def logoutUser(request):
    logout(request)
    return redirect('login')