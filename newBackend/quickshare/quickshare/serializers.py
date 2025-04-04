from rest_framework import serializers
from django.contrib.auth.models import User
from .models import File


class SignupSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('username', 'email', 'password')
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        password = validated_data.pop('password')
        user = User(**validated_data)
        user.set_password(password)
        user.save()
        return user


class UploadFileSerializer(serializers.ModelSerializer):
    class Meta:
        model = File
        fields = ['file']


class UserInfoSerializer(serializers.Serializer):
    email = serializers.CharField()
    username = serializers.CharField()
    fileCount = serializers.IntegerField()
    dirCount = serializers.IntegerField()

class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField(write_only=True)

