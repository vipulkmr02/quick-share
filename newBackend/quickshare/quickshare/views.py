from rest_framework.decorators import api_view, authentication_classes, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from rest_framework.authtoken.models import Token
from rest_framework.authentication import TokenAuthentication
from django.contrib.auth import authenticate
from .serializers import SignupSerializer, LoginSerializer, UploadFileSerializer, FileSerializer
from .models import File


# INFO: url: /signup
@api_view(['POST'])
@permission_classes([])
def signup(request):
    serializer = SignupSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# INFO: url: /login
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


# INFO: url: /authorized
@api_view(['GET'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def auth(request):
    if (request.user):
        return Response(
            {"message": "Authorized"},
            status=status.HTTP_200_OK,
        )
    return Response(
        {"message": "Authorized"},
        status=status.HTTP_401_UNAUTHORIZED
    )


# INFO: url: /file
@api_view(['POST', 'GET', 'DELETE'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def file(request):
    if request.method == 'POST':
        serializer = UploadFileSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(uploaded_by=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    if request.method == 'GET':
        query = request.GET.dict()
        DBquery = {}

        for key, value in query.items():
            DBquery[key + '__icontains'] = value

        files = File.objects.filter(**DBquery)
        if files.exists():
            serializer = FileSerializer(files, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response({"message": "No Files Found"}, status=status.HTTP_400_BAD_REQUEST)

    if request.method == 'DELETE':
        query = request.GET.dict()
        NO_ID = False
        DBquery = {}
        breakpoint()

        for key, value in query.items():
            if key != 'id':
                NO_ID = True

            if key == 'no_id' and value == '1':
                NO_ID = False
                continue

            DBquery[key + '__icontains'] = value

        if NO_ID:
            return Response(
                {"message": "Please use id for DELETE operation"},
                status=status.HTTP_400_BAD_REQUEST
            )
        else:
            files = File.objects.filter(**DBquery)
            files_deleted = 00
            if files.exists():
                for file in files:
                    file.delete(keep_parents=True)
                    files_deleted += 1

            return Response({
                "message": "Successfully Deleted",
                "amount": files_deleted,
            })

# INFO: url: /user-info


@api_view(['GET', 'POST'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def user_info(request):
    if (request.method == 'GET'):
        if (request.user):
            return request.user.profile

    elif (request.method == 'POST'):
        return Response('post /user-info')


# # INFO: url: /files
# @api_view(['GET'])
# @authentication_classes([TokenAuthentication])
# @permission_classes([IsAuthenticated])
# def files(request):
#     files = request.user.files.all()
#     fileCount = len(files)
#     return Response({"fileCount": fileCount,
#                      "files": [{
#                          "id": x.file_uuid,
#                          "fileName": x.file_name,
#                          "uploadedAt": x.uploaded_at,
#                          "description": x.description,
#                          "size": x.file.size
#                      } for x in files]})
