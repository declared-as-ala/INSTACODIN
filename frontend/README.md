# Product Manager - Fullstack Assessment Frontend

A professional Next.js frontend application for managing products and variants, built as part of a fullstack assessment.

## Features

### 🔐 Authentication
- JWT-based authentication with secure token storage
- Automatic route protection and redirection
- Session persistence across browser sessions

### 📦 Product Management
- Full CRUD operations for products
- Real-time data synchronization
- Intuitive table interface with sorting capabilities

### 🏷️ Variant Management
- Advanced variant management with product association
- Search functionality (name and SKU code)
- Sorting by index (ascending/descending)
- Filtering by creator
- Cascading operations when products are deleted

### 🎨 User Experience
- Professional, responsive design using shadcn/ui
- Loading states and error handling
- Smooth animations and micro-interactions
- Mobile-optimized layout
- Toast notifications for user feedback

## Tech Stack

- **Framework**: Next.js 13+ with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS + shadcn/ui
- **State Management**: Zustand (auth) + React Query (data)
- **Forms**: React Hook Form + Zod validation
- **HTTP Client**: Native fetch with custom API client

## Getting Started

### Prerequisites

Ensure the backend NestJS API is running on `http://localhost:5000` with the following endpoints available:
- `POST /auth/login`
- `GET|POST|PUT|DELETE /products`
- `GET|POST|PUT|DELETE /variants`

### Installation

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
```bash
cp .env.local.example .env.local
```

3. Start the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

### Login

Use the credentials provided by your backend API documentation. The application will automatically redirect you to the dashboard upon successful authentication.

## Project Structure

```
├── app/                    # Next.js App Router pages
│   ├── dashboard/         # Protected dashboard page
│   ├── login/            # Authentication page
│   └── layout.tsx        # Root layout with providers
├── components/
│   ├── forms/            # Reusable form components
│   ├── guards/           # Authentication guards
│   ├── layout/           # Layout components
│   ├── providers/        # Context providers
│   ├── tables/           # Data table components
│   └── ui/               # shadcn/ui components
├── hooks/                # Custom React hooks
├── lib/                  # Utility functions
├── services/             # API service layer
└── types/                # TypeScript type definitions
```

## Key Features

### Data Tables
- Advanced search and filtering capabilities
- Column sorting with visual indicators
- Row-level actions (edit, delete)
- Empty states and loading skeletons
- Responsive design for all screen sizes

### Form Management
- Type-safe forms with Zod validation
- Error handling and field validation
- Loading states during submission
- Modal-based editing interface

### State Management
- Zustand for authentication state
- React Query for server state management
- Automatic cache invalidation
- Optimistic updates where appropriate

## API Integration

The application integrates with a NestJS backend API with the following features:
- JWT authentication with automatic token attachment
- Error handling with user-friendly messages
- TypeScript types matching backend responses
- Automatic retry logic for failed requests

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

### Environment Variables

- `NEXT_PUBLIC_API_BASE_URL` - Backend API base URL (default: http://localhost:5000)

## Production Deployment

1. Build the application:
```bash
npm run build
```

2. The application is configured for static export and can be deployed to any static hosting provider.

## Security Considerations

- JWT tokens are stored in secure HTTP-only cookies
- All API requests include proper authentication headers
- Route protection prevents unauthorized access
- XSS protection through proper data sanitization