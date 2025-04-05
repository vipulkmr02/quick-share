from django.urls import path
from quickshare import views as api

urlpatterns = [
    path('login', api.login, name="Login"),
    path('signup', api.signup, name="Signup"),
    path('authorized', api.auth, name="Authorized"),
    path('user-info', api.user_info, name="Profile"),
    path('file', api.file, name="File"),
]
