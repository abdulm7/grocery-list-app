from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from api.models import GroceryItem


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
