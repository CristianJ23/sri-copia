from rest_framework import serializers

class PlanSerializer(serializers.Serializer):
    firebase_id = serializers.CharField(read_only=True)
    
    # Mapea 'name' de Firebase a 'pln_nombre' en React
    pln_nombre = serializers.CharField(source='name', max_length=100)
    
    # Mapea 'description' de Firebase a 'pln_descripcion' en React
    pln_descripcion = serializers.CharField(source='description', required=False, allow_null=True)
    
    # Mapea el booleano 'active' de Firebase a 'pln_estado'
    pln_estado = serializers.BooleanField(source='active', default=True)

    # 🚨 AQUÍ ESTABA EL ERROR: 
    # Como en Firestore lo llamaste 'pln_precio', NO uses source='price'
    pln_precio = serializers.DecimalField(max_digits=10, decimal_places=2)

    # El ID que generará Stripe (aparecerá pronto en tu base)
    stripe_price_id = serializers.CharField(required=False, allow_null=True)
    
    # Otros campos                                      que tengas en la raíz
    pln_codigo = serializers.CharField(required=False)
    pln_duracion_dias = serializers.IntegerField(required=False)
    pln_numero_cuentas = serializers.IntegerField(required=False)
    

class CheckoutSerializer(serializers.Serializer):
    # El ID del PRECIO de Stripe (price_1Q...) es lo más importante aquí
    stripe_price_id = serializers.CharField(max_length=100)
    # Opcionalmente, el ID del plan en tu sistema
    plan_id = serializers.CharField(max_length=100, required=False)