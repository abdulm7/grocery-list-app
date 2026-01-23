# Grocery List App

A full-stack web application for managing a single family's grocery list. Built with React, Django REST Framework, PostgreSQL, and Docker.

## Features

- ✅ **Add Items** - Create grocery items with name, category, and quantity
- ✅ **Edit Items** - Update item details anytime
- ✅ **Mark Purchased** - Toggle items as purchased individually or bulk
- ✅ **Delete Items** - Remove single items or clear entire list
- ✅ **Smart Sorting** - Items sorted by purchased status, then category
- ✅ **Form Validation** - Real-time validation with field-level error messages
- ✅ **Responsive Design** - Works on desktop, tablet, and mobile
- ✅ **Error Handling** - User-friendly error alerts and recovery

## Tech Stack

**Frontend:** React 19, TypeScript, Vite, TanStack React Query, Tailwind CSS, shadcn/ui (see [frontend/README.md](frontend/README.md))

**Backend:** Django 5.2.10 (LTS), Django REST Framework, PostgreSQL (see [backend/README.md](backend/README.md))

**Infrastructure:** Docker & Docker Compose, Nginx, AWS EC2


## Getting Started

### Prerequisites

- Git
- Docker & Docker Compose installed

### Installation & Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd grocery-list-app
   ```

2. **Create environment file**
   
   Create `.env` with your configuration, populating the variables below:
   Reference `.env.example`
   ```env
    POSTGRES_DB=
    POSTGRES_USER=
    POSTGRES_PASSWORD=
    SECRET_KEY=
    DEBUG=
    ALLOWED_HOSTS=
    DATABASE_URL=
   ```

3. **Start the application**
   ```bash
   docker compose up
   ```

   This will start:
   - **Frontend**: http://localhost:80
   - **Backend API**: http://localhost:8000/api/
   - **PostgreSQL**: Running in container


## Docker Commands

```bash
docker compose up # Start services
docker compose up -d # Start in background
docker compose up --build # Rebuild images
docker compose down # Stop & remove containers
docker compose down -v # Stop & remove containers and volumes
```


## Development

### Frontend Development

See [frontend/README.md](frontend/README.md) for detailed frontend setup and development instructions.

### Backend Development & API Reference

See [backend/README.md](backend/README.md) for detailed backend setup, development instructions, and API documentation.

### Running Tests

**Backend:**
```bash
docker compose exec backend python manage.py test
```

## Database

PostgreSQL database is created automatically with Docker Compose.


**Frontend can't reach API:**
- Check that backend service is running: `docker compose logs backend`
- Verify API proxy in `frontend/nginx-frontend.conf` points to correct backend URL
- Check 'ALLOWED_HOSTS" includes the domain/IP your frontend is making requests from

## License

This project is licensed under the MIT License - see LICENSE file for details.
