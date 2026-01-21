from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import GroceryItem
from .serializers import GroceryItemSerializer


@api_view(['GET', 'POST', 'DELETE'])
def grocery_item_list(request):
    """
    List all or delete grocery items, or create/add a new grocery item.
    """
    if request.method == 'GET':
        items = GroceryItem.objects.all()
        serializer = GroceryItemSerializer(items, many=True)
        return Response(serializer.data)

    elif request.method == 'POST':
        serializer = GroceryItemSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    elif request.method == 'DELETE':
        count = GroceryItem.objects.all().delete()
        return Response({'deleted': count[0]}, status=status.HTTP_200_OK)


@api_view(['GET', 'PATCH', 'DELETE'])
def grocery_item_detail(request, pk):
    """
    Retrieve, update or delete a grocery item.
    """
    try:
        item = GroceryItem.objects.get(pk=pk)
    except GroceryItem.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        serializer = GroceryItemSerializer(item)
        return Response(serializer.data)

    elif request.method == 'PATCH':
        serializer = GroceryItemSerializer(item, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == 'DELETE':
        item.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


@api_view(['PATCH'])
def bulk_update_purchased(request):
    """
    Bulk update purchased status for all items.
    Body: {"purchased": true} or {"purchased": false}
    """
    purchased = request.data.get('purchased')
    if purchased is None:
        return Response(
            {'error': 'purchased field is required'}, 
            status=status.HTTP_400_BAD_REQUEST
        )
    
    updated_count = GroceryItem.objects.all().update(purchased=purchased)
    return Response({'updated': updated_count}, status=status.HTTP_200_OK)