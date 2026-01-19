from django.test import TestCase
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from .models import GroceryItem


class GroceryItemModelTests(TestCase):
    """Test model constraints and defaults."""

    def test_create_item_with_defaults(self):
        """Item created with correct defaults for category, purchased, quantity."""
        item = GroceryItem.objects.create(name="Milk")
        self.assertEqual(item.category, "Other")
        self.assertEqual(item.purchased, False)
        self.assertEqual(item.quantity, 1)

    def test_str_representation(self):
        """String representation shows name and quantity."""
        item = GroceryItem.objects.create(name="Eggs", quantity=12)
        self.assertEqual(str(item), "Eggs (12)")

    def test_unique_name_constraint(self):
        """Duplicate names raise IntegrityError."""
        from django.db import IntegrityError
        GroceryItem.objects.create(name="Bread")
        with self.assertRaises(IntegrityError):
            GroceryItem.objects.create(name="Bread")


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


class GroceryItemDetailTests(APITestCase):
    """ Tests for GET, PATCH, DELETE on /api/grocery-items/<pk>/ """

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


class BulkUpdatePurchasedTests(APITestCase):
    """Tests for PATCH on /api/grocery-items/update-purchased/"""

    def setUp(self):
        self.url = reverse('bulk-update')
        self.item1 = GroceryItem.objects.create(name="Milk", purchased=False)
        self.item2 = GroceryItem.objects.create(name="Bread", purchased=False)
        self.item3 = GroceryItem.objects.create(name="Eggs", purchased=True)

    def test_mark_all_purchased(self):
        """PATCH with purchased=true updates all items."""
        data = {"purchased": True}
        response = self.client.patch(self.url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['updated'], 3)
        self.assertTrue(all(
            item.purchased for item in GroceryItem.objects.all()
        ))

    def test_mark_all_unpurchased(self):
        """PATCH with purchased=false updates all items."""
        data = {"purchased": False}
        response = self.client.patch(self.url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['updated'], 3)
        # Verify all items are not purchased
        self.assertFalse(any(
            item.purchased for item in GroceryItem.objects.all()
        ))

    def test_missing_purchased_field(self):
        """PATCH without purchased field returns 400."""
        data = {}
        response = self.client.patch(self.url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('error', response.data)
