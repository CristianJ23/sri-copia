# billing/views.py
# billing/views.py
from firebase_admin import firestore
from rest_framework.views import APIView
from rest_framework.response import Response

class PlanListAPIView(APIView):
    def get(self, request):
        db = firestore.client()
        # 1. Traer productos activos
        docs = db.collection('planes').where('active', '==', True).stream()
        
        lista_planes = []
        for doc in docs:
            data = doc.to_dict()
            data['id'] = doc.id # ID del producto
            
            # 2. Obtener el precio de la subcolección 'prices'
            prices = db.collection('planes').document(doc.id).collection('prices').stream()
            for p in prices:
                p_data = p.to_dict()
                if p_data.get('active', True):
                    data['price_id'] = p.id  # El ID que empieza con price_
                    data['unit_amount'] = p_data.get('unit_amount')
                    data['currency'] = p_data.get('currency')
                    break
            
            lista_planes.append(data)
            
        return Response(lista_planes) # Enviamos el JSON "crudo"
        
#para autenticación con firebase
# billing/views.py
from firebase_admin import auth as firebase_auth
from rest_framework.decorators import api_view, permission_classes, authentication_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.authentication import SessionAuthentication, TokenAuthentication 
from rest_framework.response import Response
from django.views.decorators.csrf import csrf_exempt 

@api_view(['GET'])
@authentication_classes([SessionAuthentication, TokenAuthentication])
@permission_classes([IsAuthenticated])
def get_firebase_token(request):
    # Esto ahora funcionará si estás logueado en el admin
    uid = str(request.user.id)
    custom_token = firebase_auth.create_custom_token(uid)
    
    token_str = custom_token.decode('utf-8') if isinstance(custom_token, bytes) else custom_token
    return Response({'firebase_token': token_str})

@csrf_exempt
@api_view(['GET'])
@permission_classes([IsAuthenticated]) # Solo usuarios logueados en Django pueden pedir el token
def get_firebase_token(request):
    try:
        # Usamos el ID de Django como el UID de Firebase
        uid = str(request.user.id)
        
        # Generamos el token personalizado
        # Importante: .decode('utf-8') solo es necesario en versiones antiguas de firebase-admin
        custom_token = firebase_auth.create_custom_token(uid)
        
        # Si custom_token es un objeto bytes, lo decodificamos
        token_str = custom_token.decode('utf-8') if isinstance(custom_token, bytes) else custom_token
        
        return Response({'firebase_token': token_str})
    except Exception as e:
        return Response({'error': str(e)}, status=500)
    
    # billing/views.py
from django.contrib.auth import authenticate, login
from django.views.decorators.csrf import csrf_exempt

@csrf_exempt
@api_view(['POST'])
def custom_login(request):
    username = request.data.get('username')
    password = request.data.get('password')
    user = authenticate(username=username, password=password)
    if user:
        login(request, user)
        return Response({'message': 'Logged in'})
    return Response({'error': 'Invalid credentials'}, status=401)