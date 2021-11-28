from django.urls import path
from . import views
from .views import AccountView, DashboardView

urlpatterns = [
    
    path('dashboard/', views.DashboardView, name='dashboard'),
    path('', views.LogIn, name='login'),
    path('register', views.RegisterPage, name = 'register'),
    path('logout', views.logoutUser, name = 'logout'),
    path('data-json/', AccountView.as_view(), name = 'data-json'),
    path('create_account', views.createAccountView, name='create_account'),
    path('delete_account', views.deleteAccountView, name='delete_account'),
    #path('login_ajax', views.loginAjax, name='login_ajax'),
    path('login_ajax', views.loginAjax.as_view(), name='login_ajax'),
    path('get_accounts', views.getAccounts.as_view(), name='get_accounts'),

]

