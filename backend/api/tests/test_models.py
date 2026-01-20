from django.test import TestCase
from django.db import IntegrityError
from api.models import GroceryItem


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
        GroceryItem.objects.create(name="Bread")
        with self.assertRaises(IntegrityError):
            GroceryItem.objects.create(name="Bread")
