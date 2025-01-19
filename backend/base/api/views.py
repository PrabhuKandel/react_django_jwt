from django.http import JsonResponse
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated

from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from .serializers import NoteSerializer
from base.models import Note

class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        # generates the default token with standard claims
        token = super().get_token(user)

        # The custom claims adds the username to the token payload.
        token["username"] = user.username

        return token


# since we are using custom serializer so making custom view to acces that
# Specifies that the custom serializer should be used for handling token generation.
class MyTokenObtainPairView(TokenObtainPairView):
    # The serializer_class attribute in Django REST Framework views defines which serializer the view should use.
    serializer_class = MyTokenObtainPairSerializer


@api_view(["GET"])
def getRoutes(request):
    routes = [
        "/api/token",
        "/api/token/refresh",
    ]

    return Response(routes)

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def getNotes(request):
    print(request)  # Correct way to access headers
    user = request.user
    notes = user.note_set.all()
    serializer = NoteSerializer(notes,many = True)
    return Response(serializer.data)
