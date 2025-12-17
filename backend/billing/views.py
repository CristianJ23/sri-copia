# billing/views.py - Versión Final con Stripe Checkout

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.conf import settings 
# Importamos el serializador PlanSerializer y el nuevo CheckoutSerializer
from .serializers import PlanSerializer, CheckoutSerializer 
from firebase_admin import firestore, exceptions 

# 🚨 LIBRERÍA DE STRIPE: NECESARIA PARA CREAR LA SESIÓN DE PAGO
import stripe 

# 🚨 Configurar la clave secreta de Stripe al inicio del módulo
# Debe tener STRIPE_SECRET_KEY, STRIPE_SUCCESS_URL y STRIPE_CANCEL_URL en settings.py
try:
    stripe.api_key = settings.STRIPE_SECRET_KEY
except AttributeError:
    # Esto ayuda si olvidas configurar la clave en settings.py
    print("ADVERTENCIA: STRIPE_SECRET_KEY no configurada en settings.py.")
    pass 


class PlanListAPIView(APIView):
    """
    [GET] Lista todos los planes de pago activos desde Firestore.
    """
    def get(self, request):
        db = settings.FIRESTORE_DB
        planes_data = []
        
        try:
            # 1. Consulta a la colección 'planes', filtrando por estado 'activo'
            planes_ref = db.collection('planes').where('pln_estado', '==', 'activo').stream()
            
            # 2. Iterar sobre los documentos
            for doc in planes_ref:
                data = doc.to_dict()
                data['firebase_id'] = doc.id 
                planes_data.append(data)
                
        except exceptions.FirebaseError as e: 
            return Response({"detail": f"Error de conexión con Firebase: {e}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            
        except Exception as e:
            return Response({"detail": f"Error interno en la API: {e}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        
        # 3. Serializar y devolver la respuesta JSON
        if not planes_data:
             # Devuelve una lista vacía con 200 OK (Práctica común en APIs)
             return Response([], status=status.HTTP_200_OK) 
        
        serializer = PlanSerializer(planes_data, many=True)
        return Response(serializer.data)


class CheckoutAPIView(APIView):
    """
    [POST] Crea una sesión de Stripe Checkout para el plan seleccionado.
    """
    def post(self, request):
        db = settings.FIRESTORE_DB
        serializer = CheckoutSerializer(data=request.data)
        
        if serializer.is_valid():
            plan_id = serializer.validated_data['plan_id']
            
            try:
                # 1. Obtener datos del plan desde Firebase
                plan_ref = db.collection('planes').document(plan_id).get()
                if not plan_ref.exists:
                    return Response({"error": "Plan no encontrado o ID inválido."}, status=status.HTTP_404_NOT_FOUND)
                
                plan_data = plan_ref.to_dict()
                
                plan_nombre = plan_data.get('pln_nombre', 'Plan de Suscripción')
                plan_precio = plan_data.get('pln_precio')
                
                # Validación de precio (debe ser un número válido)
                if plan_precio is None or not isinstance(plan_precio, (int, float)):
                    # Intentar convertir si es un string (puede venir de Firestore como string)
                    try:
                        plan_precio = float(plan_precio)
                    except (TypeError, ValueError):
                        return Response({"error": "El precio del plan no es válido."}, status=status.HTTP_400_BAD_REQUEST)

                # 2. Crear la Sesión de Checkout de Stripe
                # Stripe espera el precio en centavos (multiplicado por 100)
                unit_amount_cents = int(plan_precio * 100)
                
                checkout_session = stripe.checkout.Session.create(
                    payment_method_types=['card'],
                    mode='payment',
                    line_items=[{
                        'price_data': {
                            'currency': 'usd',
                            'unit_amount': unit_amount_cents,
                            'product_data': {
                                'name': plan_nombre,
                                'description': f"Suscripción al plan {plan_nombre} ({plan_data.get('pln_codigo')})",
                            },
                        },
                        'quantity': 1,
                    }],
                    # Redirecciona a las URLs definidas en settings.py
                    success_url=settings.STRIPE_SUCCESS_URL,
                    cancel_url=settings.STRIPE_CANCEL_URL,
                    metadata={'firebase_plan_id': plan_id} 
                )
                
                # 3. Respuesta Exitosa: Enviamos la URL de redirección
                return Response({
                    "success": True,
                    "message": "Sesión de Stripe creada.",
                    "redirect_url": checkout_session.url 
                }, status=status.HTTP_200_OK)

            except stripe.error.StripeError as e:
                # Captura errores específicos de la API de Stripe
                return Response({"error": f"Error de Stripe: {e.user_message}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            
            except Exception as e:
                # Captura cualquier otro error no manejado
                return Response({"error": f"Error interno: {e}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)