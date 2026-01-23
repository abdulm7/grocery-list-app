# Grocery List Backend

Django REST Framework API for the Grocery List App. Provides endpoints for managing grocery items with validation, filtering, and bulk operations.

## Tech Stack

- **Django 5.2.10 (LTS)** - Web framework
- **Django REST Framework** - REST API framework
- **PostgreSQL** - Database
- **Docker** - Containerization

## Features

- ✅ CRUD operations for grocery items
- ✅ Real-time form validation with field-level errors
- ✅ Bulk operations (bulk update purchased status, delete all)
- ✅ Category and purchased status filtering
- ✅ Pagination support
- ✅ Comprehensive test coverage
- ✅ Production-ready with Docker

## Development

### Prerequisites

- Python 3.10+
- PostgreSQL (or use Docker)
- Virtual environment (Optional)

### Setup

```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

### Environment Variables

Create `.env` file in the backend directory:

```env
DEBUG=
SECRET_KEY=
ALLOWED_HOSTS=
DATABASE_URL=
```

### Database Setup

```bash
python manage.py migrate
```

### Run Development Server

```bash
python manage.py runserver
```

## Testing

### Run All Tests

```bash
python manage.py test
```

### Run Specific Test Module

```bash
python manage.py test api.tests.test_models
python manage.py test api.tests.test_list_endpoint
python manage.py test api.tests.test_detail_endpoint
python manage.py test api.tests.test_bulk_operations
```

## Django Admin

Access Django admin panel:

```
http://localhost:8000/admin/
```

Default credentials:
- Username: admin
- Password: (create with `python manage.py createsuperuser`)

### Run with Gunicorn

```bash
pip install gunicorn
gunicorn backend.wsgi:application --bind 0.0.0.0:8000
```

## Resources

- [Django Documentation](https://docs.djangoproject.com/)
- [Django REST Framework Documentation](https://www.django-rest-framework.org/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Docker Documentation](https://docs.docker.com/)
