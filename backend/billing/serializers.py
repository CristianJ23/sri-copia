# billing/serializers.py (Versión Final)

from rest_framework import serializers

class PlanSerializer(serializers.Serializer):
    # Ya que los nombres en la base de datos son snake_case, NO SE USA 'source'
    pln_codigo = serializers.CharField(max_length=20) 
    pln_nombre = serializers.CharField(max_length=100)
    pln_precio = serializers.DecimalField(max_digits=10, decimal_places=2)
    pln_duracion_dias = serializers.IntegerField()
    pln_estado = serializers.CharField(max_length=10)
    pln_numero_cuentas = serializers.IntegerField()

    # Si lo tiene en la base de datos, perfecto. Si no, usa el valor por defecto
    pln_descripcion = serializers.CharField(required=False, allow_null=True) 

    firebase_id = serializers.CharField(read_only=True)
    
    
    # 2. 🚨 Serializador para el Checkout (el que probablemente faltaba o estaba mal)
class CheckoutSerializer(serializers.Serializer):
    plan_id = serializers.CharField(max_length=100)
    # Si quieres enviar más datos (ej. user_id, email), añádelos aquí