from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.response import Response
from rest_framework import status
from rest_framework.pagination import PageNumberPagination

from .models import Sweet
from .serializers import SweetSerializer


# -----------------------------
# PURCHASE SWEET (USER)
# -----------------------------
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def purchase_sweet(request, id):
    try:
        sweet = Sweet.objects.get(id=id)
    except Sweet.DoesNotExist:
        return Response({"error": "Sweet not found"}, status=404)

    if sweet.quantity <= 0:
        return Response({"error": "Out of stock"}, status=400)

    sweet.quantity -= 1
    sweet.save()

    return Response({
        "message": "Sweet purchased",
        "remaining_quantity": sweet.quantity
    }, status=200)


# -----------------------------
# RESTOCK SWEET (ADMIN)
# -----------------------------
@api_view(['POST'])
@permission_classes([IsAdminUser])
def restock_sweet(request, id):
    amount = request.data.get('amount')

    if not amount or int(amount) <= 0:
        return Response({"error": "Invalid restock amount"}, status=400)

    try:
        sweet = Sweet.objects.get(id=id)
    except Sweet.DoesNotExist:
        return Response({"error": "Sweet not found"}, status=404)

    sweet.quantity += int(amount)
    sweet.save()

    return Response({
        "message": "Sweet restocked",
        "new_quantity": sweet.quantity
    }, status=200)


# -----------------------------
# LIST + CREATE SWEETS
# (FILTERS + ORDERING + PAGINATION)
# -----------------------------
@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def sweets_list_create(request):
    if request.method == 'GET':
        sweets = Sweet.objects.all()

        # ---- Filters ----
        name = request.GET.get('name')
        category = request.GET.get('category')
        min_price = request.GET.get('min_price')
        max_price = request.GET.get('max_price')
        ordering = request.GET.get('ordering')

        if name:
            sweets = sweets.filter(name__icontains=name)

        if category:
            sweets = sweets.filter(category__iexact=category)

        if min_price:
            sweets = sweets.filter(price__gte=min_price)

        if max_price:
            sweets = sweets.filter(price__lte=max_price)

        # ---- Ordering (safe whitelist) ----
        allowed_ordering = ['price', '-price', 'name', '-name']
        if ordering in allowed_ordering:
            sweets = sweets.order_by(ordering)

        # ---- Pagination ----
        paginator = PageNumberPagination()
        paginator.page_size = 4  # small for demo
        result_page = paginator.paginate_queryset(sweets, request)

        serializer = SweetSerializer(result_page, many=True)
        return paginator.get_paginated_response(serializer.data)

    # ---- POST (Admin only) ----
    if not request.user.is_staff:
        return Response({"error": "Admin only"}, status=403)

    serializer = SweetSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=201)

    return Response(serializer.errors, status=400)


# -----------------------------
# UPDATE + DELETE SWEET (ADMIN)
# -----------------------------
@api_view(['PUT', 'DELETE'])
@permission_classes([IsAuthenticated, IsAdminUser])
def sweet_update_delete(request, id):
    try:
        sweet = Sweet.objects.get(id=id)
    except Sweet.DoesNotExist:
        return Response({"error": "Sweet not found"}, status=404)

    if request.method == 'PUT':
        serializer = SweetSerializer(sweet, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=200)
        return Response(serializer.errors, status=400)

    # DELETE
    sweet.delete()
    return Response({"message": "Sweet deleted"}, status=204)
