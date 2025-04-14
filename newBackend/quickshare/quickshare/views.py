from django.core.exceptions import ObjectDoesNotExist
from django.http import FileResponse
from rest_framework.decorators import (
    api_view,
    authentication_classes,
    permission_classes,
)
from rest_framework.permissions import IsAuthenticated
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework import status
from rest_framework.authtoken.models import Token
from rest_framework.authentication import TokenAuthentication
from django.contrib.auth import authenticate
from .serializers import (
    ProfileSerializer,
    SignupSerializer,
    LoginSerializer,
    UploadFileSerializer,
    FileSerializer,
    ChangeCredsSerializer,
    UserInfoSerializer,
)
from .models import File


# INFO: url: /
def welcome() -> Response:
    return Response({"message": "Welcome to QuickShare API"},
                    status=status.HTTP_200_OK)


# INFO: url: /signup
@api_view(["POST"])
@permission_classes([])
def signup(request: Request):
    serializer = SignupSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors,
                    status=status.HTTP_400_BAD_REQUEST)


# INFO: url: /login
@api_view(["POST"])
@permission_classes([])
def login(request):
    serializer = LoginSerializer(data=request.data)
    if serializer.is_valid():
        validated_data = serializer.validated_data
        if validated_data is not None:
            user = authenticate(
                request,
                username=validated_data["username"],
                password=validated_data["password"],
            )

            if user:
                token, created = Token.objects.get_or_create(user=user)
                return Response({"token": token.key})

        else:
            return Response({"error": "Invalid credentials"},
                            status=status.HTTP_401_UNAUTHORIZED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# INFO: url: /authorized
@api_view(["GET"])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def auth(request):
    if request.user:
        return Response(
            {"message": "Authorized"},
            status=status.HTTP_200_OK,
        )
    return Response({"message": "Authorized"},
                    status=status.HTTP_401_UNAUTHORIZED)


# NOTE: url: /files
@api_view(["GET"])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def files(request):
    # NOTE: For getting all public files in the system
    files = File.objects.filter(public=True)
    if files.exists():
        serializer = FileSerializer(files, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    return Response(
        {"message": "No Files Found"}, status=status.HTTP_400_BAD_REQUEST
    )


# INFO: url: /file
@api_view(["POST", "GET", "DELETE", "PATCH"])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def file(request):
    if request.method == "POST":
        serializer = UploadFileSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(uploaded_by=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == "GET":
        query = request.GET.dict()
        DBquery = {}

        for key, value in query.items():
            DBquery[key + "__icontains"] = value

        files = request.user.files.filter(**DBquery)
        if files.exists():
            serializer = FileSerializer(files, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(
            {"message": "No Files Found"}, status=status.HTTP_400_BAD_REQUEST
        )

    elif request.method == "DELETE":
        query = request.GET.dict()
        NO_ID = False
        DBquery = {}

        for key, value in query.items():
            if key != "id":
                NO_ID = True

            if key == "no_id" and value == "1":
                NO_ID = False
                continue

            DBquery[key + "__icontains"] = value

        if NO_ID:
            return Response(
                {"message": "Please use id for DELETE operation"},
                status=status.HTTP_400_BAD_REQUEST,
            )
        else:
            files = request.user.files.filter(**DBquery)
            files_deleted = 00
            if files.exists():
                for file in files:
                    file.delete(keep_parents=True)
                    files_deleted += 1

            return Response(
                {
                    "message": "Successfully Deleted",
                    "amount": files_deleted,
                }
            )
    else:
        return Response({"message": "Bad Request"},
                        status=status.HTTP_400_BAD_REQUEST)


# INFO: url: /change-visibility/<str:uuid>
@api_view(['GET'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def change_visibility(uuid):
    file = File.objects.get(file_uuid=uuid)
    if file:
        file.public = not file.public
        file.save(update_fields=True)
        return Response({"message": "Done!"},
                        status=status.HTTP_200_OK)
    else:
        return Response({"messsage": "Cannot find file."},
                        status=status.HTTP_404_NOT_FOUND)


# INFO: url: /change-creds
@api_view(['PATCH', 'PUT'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def change_creds(request: Request) -> Response:
    serializer = ChangeCredsSerializer(
        instance=request.user,
        data=request.data,
        context={'request': request},
        partial=True
    )

    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_200_OK)

    return Response(serializer.errors,
                    status=status.HTTP_400_BAD_REQUEST)


# INFO: url: /user-info
@api_view(["GET"])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def user_info(request):
    serializer = UserInfoSerializer(request.user)
    return Response(serializer.data, status=status.HTTP_200_OK)


# INFO: url: /profile
@api_view(["PUT", "PATCH", "GET"])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def profile(request):
    # NOTE: For creating new profile, 'PUT' request,
    if request.method == "PUT":
        try:
            request.user.profile.delete()
        except ObjectDoesNotExist:
            pass
        serializer = ProfileSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(user=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors,
                            status=status.HTTP_400_BAD_REQUEST)

    # NOTE: For updating existing profile, 'PATCH' request,
    elif request.method == "PATCH":
        try:
            currentProfile = request.user.profile
            serializer = ProfileSerializer(
                currentProfile, data=request.data, partial=True
            )
            if serializer.is_valid():
                serializer.save(user=request.user)
                return Response(serializer.data,
                                status=status.HTTP_201_CREATED)
            else:
                return Response(serializer.errors,
                                status=status.HTTP_400_BAD_REQUEST)

        except Exception:
            return Response(
                {"message": "Profile does not exists."},
                status=status.HTTP_400_BAD_REQUEST,
            )

    # NOTE: For accessing user's profile, 'GET' request
    elif request.method == "GET":
        try:
            serializer = ProfileSerializer(request.user.profile)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except ObjectDoesNotExist:
            return Response(
                {"message": "Profile does not exists."},
                status=status.HTTP_400_BAD_REQUEST,
            )
    else:
        return Response({"message": "Bad Request"},
                        status=status.HTTP_400_BAD_REQUEST)


# NOTE: url: /dp
@api_view(["GET"])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def dp(request):
    if 'display_picture' in dir(request.user.profile):
        return Response(
            {"message": "Display Picture does not exists."},
            status=status.HTTP_400_BAD_REQUEST,
        )
    return FileResponse(open(request.user.profile.display_picture.path, "rb"))


# NOTE: url: /download/<uuid>
@api_view(["GET"])
def download(uuid):
    try:
        file = File.objects.get(file_uuid=uuid)
        filePath = file.file.path

    except ObjectDoesNotExist:
        return Response(
            {"message": "File does not exists."},
            status=status.HTTP_400_BAD_REQUEST,
        )

    if not filePath:
        return Response(
            {"message": "File does not exists."},
            status=status.HTTP_400_BAD_REQUEST,
        )

    if not file.public:
        return Response(
            {"message": "File is not public by the owner."},
            status=status.HTTP_400_BAD_REQUEST,
        )

    return FileResponse(
        open(filePath, "rb"),
        as_attachment=True,
        filename=File.objects.get(file_uuid=uuid).file_name,
    )


# NOTE: url: /private-download/<uuid>
@api_view(["GET"])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def private_download(request, uuid):
    try:
        file = request.user.files.get(file_uuid=uuid)
        filePath = file.file.path

    except ObjectDoesNotExist:
        return Response(
            {"message": "File does not exists."},
            status=status.HTTP_400_BAD_REQUEST,
        )

    if not filePath:
        return Response(
            {"message": "File does not exists."},
            status=status.HTTP_400_BAD_REQUEST,
        )

    return FileResponse(
        open(filePath, "rb"),
        as_attachment=True,
        filename=File.objects.get(file_uuid=uuid).file_name,
    )

