from rest_framework.decorators import api_view, authentication_classes, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from rest_framework.authtoken.models import Token
from rest_framework.authentication import TokenAuthentication
from django.contrib.auth import authenticate
from .serializers import SignupSerializer, LoginSerializer, UploadFileSerializer


@api_view(['POST'])
@permission_classes([])
def signup(request):
    serializer = SignupSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([])
def login(request):
    serializer = LoginSerializer(data=request.data)
    if serializer.is_valid():
        print(request)
        validated_data = serializer.validated_data
        if validated_data is not None:
            username = validated_data['username']
            password = validated_data['password']
            user = authenticate(request, username=username, password=password)

            if user:
                token, created = Token.objects.get_or_create(user=user)
                return Response({'token': token.key})

        else:
            return Response(
                {'error': 'Invalid credentials'},
                status=status.HTTP_401_UNAUTHORIZED
            )
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def auth(request):
    print(request.user)
    return Response({"message": "You are in!"})


@api_view(['POST'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def upload_file(request):
    serializer = UploadFileSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save(uploaded_by=request.user)
        breakpoint()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def user_info():
    pass


@api_view(['GET'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def storage_info(request):
    fileCount = request.user.files()
    return Response({"fileCount": fileCount})


# @api_view(['GET'])
# @permission_classes([IsAuthenticated])
# def get_all_files(request):
#     return request.user.files
