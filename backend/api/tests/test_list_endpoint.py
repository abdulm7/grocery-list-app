from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from api.models import GroceryItem


class GroceryItemListTests(APITestCase):
    """Tests for GET, POST, DELETE on /api/grocery-items/"""

    def setUp(self):
        self.url = reverse('grocery-item-list')

    def test_list_items(self):
        """GET returns all items."""
        GroceryItem.objects.create(name="Milk")
        GroceryItem.objects.create(name="Bread")
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 2)

    def test_create_item_success(self):
        """POST with valid data creates item and returns 201."""
        data = {"name": "Eggs", "category": "Dairy", "quantity": 12}
        response = self.client.post(self.url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['name'], "Eggs")
        self.assertEqual(response.data['category'], "Dairy")
        self.assertEqual(response.data['quantity'], 12)
        self.assertEqual(response.data['purchased'], False)
        self.assertTrue(GroceryItem.objects.filter(name="Eggs").exists())

    def test_create_item_missing_name(self):
        """POST without name returns 400."""
        data = {"category": "Dairy"}
        response = self.client.post(self.url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('name', response.data)

    def test_create_item_duplicate_name(self):
        """POST with duplicate name returns 400."""
        GroceryItem.objects.create(name="Milk")
        data = {"name": "Milk"}
        response = self.client.post(self.url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('name', response.data)

    def test_create_item_quantity_less_than_min(self):
        """POST with quantity < 1 returns 400."""
        data = {"name": "Milk", "quantity": 0}
        response = self.client.post(self.url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('quantity', response.data)

    def test_delete_all_items(self):
        """DELETE removes all items and returns count."""
        GroceryItem.objects.create(name="Milk")
        GroceryItem.objects.create(name="Bread")
        GroceryItem.objects.create(name="Eggs")
        response = self.client.delete(self.url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(response.data['deleted'], 3)
        self.assertEqual(GroceryItem.objects.count(), 0)
