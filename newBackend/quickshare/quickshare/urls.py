from django.urls import path
from quickshare import views as api

urlpatterns = [
    path('', api.welcome, name="Login"),
    path('login', api.login, name="Login"),
    path('signup', api.signup, name="Signup"),
    path('authorized', api.auth, name="Authorized"),

    path('file', api.file, name="File"),
    path('files', api.files, name="Public Files"),
    path('download/<str:uuid>', api.download, name="Download File"),
    path('change-visibility/<str:uuid>',
         api.change_visibility, name="Change Visibility"),
    path('private-download/<str:uuid>',
         api.private_download, name="Download File"),

    path('user-info', api.user_info, name="User Info"),
    path('profile', api.profile, name="Profile"),
    path('dp', api.dp, name="Display Pciture"),
]
