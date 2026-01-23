# Grocery List Frontend

React + TypeScript frontend for the Grocery List App. Built with Vite, React Query, and Tailwind CSS.

## Tech Stack

- **React 19** - UI framework
- **TypeScript** - Type safety
- **Vite** - Fast build tool with HMR
- **TanStack React Query** - Data fetching & caching
- **Tailwind CSS** - Styling
- **shadcn/ui** - Component library
- **Nginx** - Production reverse proxy

## Features

- ✅ Add, edit, delete grocery items
- ✅ Mark items as purchased (individual or bulk)
- ✅ Smart sorting (unpurchased first, then by category)
- ✅ Real-time form validation with error messages
- ✅ Optimized caching with React Query
- ✅ Responsive design (mobile, tablet, desktop)
- ✅ Error handling with user-friendly alerts

## Development

### Prerequisites

- Node.js 20+ and npm (package manager)
- Backend API running on http://localhost:8000

### Commands

```bash
npm install
npm run dev
```

Runs on http://localhost:5173 with hot module reload.

### Build for Production

```bash
npm run build
npm run preview
```

### Linting

```bash
npm run lint
```

## API Integration

The frontend communicates with the backend API at `/api/` endpoint. API requests are proxied through Nginx in production.
When running with `npm run dev` double check the proxy matches the backend host in `vite.config.ts`
or set .env variable `VITE_API_URL`

**Available API methods:**
- `GET /api/grocery-items/` - Fetch all items
- `POST /api/grocery-items/` - Create item
- `PATCH /api/grocery-items/{id}/` - Update item
- `DELETE /api/grocery-items/{id}/` - Delete item
- `DELETE /api/grocery-items/` - Delete all items
- `PATCH /api/grocery-items/bulk-update/` - Bulk update purchased status

See [../README.md](../README.md) for full API documentation.

## Troubleshooting

**API requests failing:**
- Ensure backend is running on http://localhost:8000
- Check browser console for CORS errors
- Verify API proxy in `nginx-frontend.conf` is correct


## Resources

- [React Documentation](https://react.dev)
- [Vite Documentation](https://vite.dev)
- [React Query Documentation](https://tanstack.com/query/latest)
- [Tailwind CSS Documentation](https://tailwindcss.com)
