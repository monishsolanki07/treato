from django.contrib import admin
from django.urls import path, include
from django.http import JsonResponse
from django.conf import settings  # ADD THIS LINE
from django.conf.urls.static import static  # ADD THIS IF NEEDED

urlpatterns = [
    path('', lambda request: JsonResponse({"status": "Treato backend running"})),
    path('admin/', admin.site.urls),
    path('api/', include('sweets.urls')),
    path('api/auth/', include('accounts.urls')),
]
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)