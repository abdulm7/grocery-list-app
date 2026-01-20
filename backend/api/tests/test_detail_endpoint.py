from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from api.models import GroceryItem


class GroceryItemDetailTests(APITestCase):
    """Tests for GET, PATCH, DELETE on /api/grocery-items/<pk>/"""

    def setUp(self):
        self.item = GroceryItem.objects.create(
            name="Milk", category="Dairy", quantity=2
        )
        self.url = reverse('grocery-item-detail', kwargs={'pk': self.item.pk})

    def test_get_item_success(self):
        """GET returns item details."""
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['name'], "Milk")
        self.assertEqual(response.data['category'], "Dairy")
        self.assertEqual(response.data['quantity'], 2)

    def test_item_not_found(self):
        """GET with invalid pk returns 404."""
        url = reverse('grocery-item-detail', kwargs={'pk': 0})
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_patch_item_partial_update(self):
        """PATCH updates only provided fields."""
        data = {"purchased": True}
        response = self.client.patch(self.url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['purchased'], True)
        self.assertEqual(response.data['name'], "Milk")  # unchanged

    def test_patch_item_multiple_fields(self):
        """PATCH can update multiple fields at once."""
        data = {"name": "Almond Milk", "category": "Non-Dairy", "quantity": 3}
        response = self.client.patch(self.url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['name'], "Almond Milk")
        self.assertEqual(response.data['category'], "Non-Dairy")
        self.assertEqual(response.data['quantity'], 3)

    def test_patch_item_invalid_quantity(self):
        """PATCH with quantity < 1 returns 400."""
        data = {"quantity": 0}
        response = self.client.patch(self.url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('quantity', response.data)

    def test_patch_item_duplicate_name(self):
        """PATCH with name that already exists returns 400."""
        GroceryItem.objects.create(name="Bread")
        data = {"name": "Bread"}
        response = self.client.patch(self.url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('name', response.data)

    def test_patch_item_id_ignored(self):
        """PATCH ignores id in payload (read-only)."""
        original_id = self.item.pk
        data = {"id": 9999, "name": "Updated Milk"}
        response = self.client.patch(self.url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['id'], original_id)
        self.assertEqual(response.data['name'], "Updated Milk")

    def test_delete_item_success(self):
        """DELETE removes item and returns 204."""
        response = self.client.delete(self.url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(GroceryItem.objects.filter(pk=self.item.pk).exists())
