"""
URL configuration for core project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/6.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from billing.views import PlanListAPIView, get_firebase_token

# 🚨 CORRECCIÓN: Usar sintaxis de módulo (puntos)
from billing.views import PlanListAPIView 

urlpatterns = [
    path('admin/', admin.site.urls),
    # Ahora funcionará en las dos partes:
    path('api/v1/planes/', PlanListAPIView.as_view(), name='api-planes'),
    path('', PlanListAPIView.as_view(), name='facturacion'),
    path('api/v1/get-firebase-token/', get_firebase_token, name='firebase-token'),
    path('api-auth/', include('rest_framework.urls')), # Esto habilita /api-auth/login/
]
