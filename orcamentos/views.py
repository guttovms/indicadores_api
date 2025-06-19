from rest_framework import viewsets
from .models import Indicador
from .serializers import IndicadorSerializer

class IndicadorViewSet(viewsets.ModelViewSet):
    queryset = Indicador.objects.all()
    serializer_class = IndicadorSerializer