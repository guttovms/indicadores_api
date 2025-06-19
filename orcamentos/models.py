from django.db import models

class Indicador(models.Model):
    TIPO_CHOICES = [
        ('PIB', 'Produto Interno Bruto'),
        ('IPCA', 'Inflação IPCA'),
        ('CAMBIO', 'Câmbio'),
        ('RECEITA', 'Receita'),
        ('DESPESA', 'Despesa'),
        ('OUTRO', 'Outro')
    ]
    tipo = models.CharField(max_length=20, choices=TIPO_CHOICES)
    valor = models.FloatField()
    ano = models.IntegerField()

    def __str__(self):
        return f"{self.tipo} - {self.ano}"