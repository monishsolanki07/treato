from django.contrib import admin
from django.urls import path, include
from django.http import JsonResponse


urlpatterns = [
    path('', lambda request: JsonResponse({"status": "Treato backend running"})),
    path('admin/', admin.site.urls),
    path('api/', include('sweets.urls')),
    path('api/auth/', include('accounts.urls')),
]
