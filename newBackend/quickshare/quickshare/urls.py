from django.urls import path
from quickshare import views as api

urlpatterns = [
    path('login', api.login, name="Login"),
    path('signup', api.signup, name="Signup"),
    path('upload', api.upload_file, name="Upload File"),
    path('user-info', api.user_info, name="User Information"),
    path('storage-info', api.storage_info, name="Storage Information")
]
