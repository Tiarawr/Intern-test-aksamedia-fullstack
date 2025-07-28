# Employee Directory Frontend

React + Vite frontend application for Employee Directory management system.

## Features

- Employee management (CRUD operations)
- Division management
- Dark/Light theme toggle
- Responsive design
- Image upload and display
- Authentication system

## Technologies

- React 18
- Vite
- Tailwind CSS
- React Router
- Lucide React Icons

## Environment Variables

Copy `.env.example` to `.env` and configure:

```bash
VITE_API_URL=http://127.0.0.1:8000/api
VITE_APP_NAME=Tiara Company
```

## Development

Install dependencies:

```bash
npm install
```

Start development server:

```bash
npm run dev
```

Build for production:

```bash
npm run build
```

## Deployment on Vercel

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Set environment variables in Vercel dashboard:
   - `VITE_API_URL`: Your backend API URL
4. Deploy!

### Environment Variables for Production

In Vercel dashboard, add these environment variables:

- `VITE_API_URL`: `https://your-backend-domain.com/api`
- `VITE_APP_NAME`: `Tiara Company`

## Project Structure

```
src/
├── components/          # Reusable components
├── contexts/           # React contexts (Auth, Theme)
├── hooks/              # Custom hooks
├── assets/             # Static assets
├── Dashboard.jsx       # Main dashboard page
├── Login.jsx          # Login page
└── main.jsx           # App entry point
```

## API Integration

The frontend communicates with Laravel backend via REST API:

- Authentication endpoints
- Employee CRUD operations
- Division management
- File upload for employee images
