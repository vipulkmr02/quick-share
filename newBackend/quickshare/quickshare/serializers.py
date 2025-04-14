from rest_framework import serializers
from django.contrib.auth.models import User
from .models import File, Profile


class UploadFileSerializer(serializers.ModelSerializer):
    class Meta:
        model = File
        fields = ('file',)


class ChangeCredsSerializer(serializers.Serializer):
    username = serializers.CharField()
    email = serializers.CharField()

    def validate_username(self, value):
        if User.objects.filter(username=value).exclude(pk=self.context['request'].user.pk).exists():
            raise serializers.ValidationError(
                "This username is already taken.")
        return value

    def validate_email(self, value):
        if User.objects.filter(email=value).exclude(pk=self.context['request'].user.pk).exists():
            raise serializers.ValidationError(
                "This email is already in use.")
        return value

    def update(self, instance, validated_data):
        if 'username' in validated_data:
            instance.username = validated_data['username']
        if 'email' in validated_data:
            instance.email = validated_data['email']
        instance.save()
        return instance


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


class FileSerializer(serializers.ModelSerializer):
    class Meta:
        model = File
        fields = '__all__'


class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = ['full_name', 'dob', 'created_on', 'display_picture']


class UserInfoSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['username', 'email', 'profile']

    profile = ProfileSerializer(read_only=True)


class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField(write_only=True)
