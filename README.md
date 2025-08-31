# 🚀 Fullstack Product Manager

A modern **Product Management System** built with **Next.js frontend** and **NestJS backend**, featuring advanced product and variant management with authentication and responsive design.

## 🖥️ Tech Stack

### Frontend
- **Next.js 13+** (App Router) + TypeScript
- **Tailwind CSS** + shadcn/ui
- **Zustand** (state management) + **React Query** (data fetching)
- **React Hook Form** + **Zod** validation

### Backend
- **NestJS** + TypeScript
- **TypeORM** + PostgreSQL
- **JWT Authentication**
- **Swagger** API documentation

### Database
- **PostgreSQL 15**

### Containerization
- **Docker** + **Docker Compose**

## 📦 Features

### Frontend
- 🔐 JWT authentication with auto-refresh
- 📊 Dashboard with products & variants management
- 🔍 Advanced search, filtering, and sorting
- 📱 Responsive & mobile-friendly design
- 🔔 Toast notifications & loading states
- ✅ Form validation with error handling

### Backend
- ⚡ Full CRUD operations for products & variants
- 🗑️ Cascade delete & automatic reindexing
- 🛡️ JWT authentication & route protection
- 📚 Auto-generated Swagger documentation
- 🌱 Database seeding with test data

## ⚡ Quick Start

### Prerequisites
- Docker & Docker Compose
- Node.js 18+ & npm (for local development)

### 1️⃣ Docker Setup (Recommended)

```bash
# Clone the repository
git clone <your-repo-url>
cd fullstack-product-manager

# Start all services
docker-compose up --build
```

**Access Points:**
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000
- Swagger Docs: http://localhost:5000/docs
- Database: localhost:5432

**Default Test User:**
- Username: `test`
- Password: `test`

### 2️⃣ Local Development

#### Backend Setup
```bash
cd backend
npm install
cp .env.example .env
npm run start:dev
```

#### Frontend Setup
```bash
cd frontend
npm install
cp .env.local.example .env.local
npm run dev
```

## 📁 Project Structure

```
fullstack-product-manager/
├── docker-compose.yml
├── README.md
├── backend/
│   ├── src/
│   │   ├── auth/
│   │   ├── products/
│   │   ├── variants/
│   │   ├── database/
│   │   └── main.ts
│   ├── package.json
│   ├── Dockerfile
│   └── .env.example
└── frontend/
    ├── src/
    │   ├── app/
    │   ├── components/
    │   ├── lib/
    │   └── types/
    ├── package.json
    ├── Dockerfile
    └── .env.local.example
```

## 🔧 Configuration Files

### docker-compose.yml
```yaml
version: "3.9"
services:
  db:
    image: postgres:15
    container_name: fullstack_test_db
    restart: always
    environment:
      POSTGRES_USER: admin
      POSTGRES_PASSWORD: admin
      POSTGRES_DB: fullstack_test
    ports:
      - "5432:5432"
    volumes:
      - pgdata:/var/lib/postgresql/data

  backend:
    build: ./backend
    container_name: fullstack_test_backend
    restart: always
    environment:
      DB_HOST: db
      DB_PORT: 5432
      DB_USER: admin
      DB_PASSWORD: admin
      DB_NAME: fullstack_test
    ports:
      - "5000:5000"
    depends_on:
      - db

  frontend:
    build: ./frontend
    container_name: fullstack_test_frontend
    restart: always
    ports:
      - "3000:3000"
    depends_on:
      - backend

volumes:
  pgdata:
```

### Backend Dockerfile
```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 5000
CMD ["sh", "-c", "node dist/seeds/seed.js && npm run start:dev"]
```

### Frontend Dockerfile
```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "run", "start"]
```

## 🔑 API Endpoints

### Authentication
```
POST /auth/login
Body: { "username": "string", "password": "string" }
Response: { "access_token": "string" }
```

### Products
```
GET    /products              # Get all products with filtering
POST   /products              # Create product
GET    /products/:id          # Get product by ID
PUT    /products/:id          # Update product
DELETE /products/:id          # Delete product
```

### Variants
```
GET    /variants              # Get all variants
POST   /variants              # Create variant
GET    /variants/:id          # Get variant by ID
PUT    /variants/:id          # Update variant
DELETE /variants/:id          # Delete variant
```

### Health Check
```
GET    /health                # API health status
```

## 📋 Backend Code Structure

### Main Application (main.ts)
```typescript
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  app.enableCors();
  
  const config = new DocumentBuilder()
    .setTitle('Product Manager API')
    .setDescription('API for managing products and variants')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);
  
  await app.listen(5000);
}
bootstrap();
```

### Product Entity
```typescript
import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Variant } from '../variants/variant.entity';

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column('text')
  description: string;

  @Column('decimal', { precision: 10, scale: 2 })
  price: number;

  @Column()
  category: string;

  @OneToMany(() => Variant, variant => variant.product, { cascade: true })
  variants: Variant[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
```

### Variant Entity
```typescript
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Product } from '../products/product.entity';

@Entity()
export class Variant {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  value: string;

  @Column('decimal', { precision: 10, scale: 2 })
  priceModifier: number;

  @Column()
  stock: number;

  @ManyToOne(() => Product, product => product.variants, { onDelete: 'CASCADE' })
  product: Product;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
```

### Auth Service
```typescript
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  async validateUser(username: string, password: string): Promise<any> {
    // In production, hash passwords and check against database
    if (username === 'test' && password === 'test') {
      return { id: 1, username: 'test' };
    }
    return null;
  }

  async login(user: any) {
    const payload = { username: user.username, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
```

## 🎨 Frontend Code Structure

### Auth Store (Zustand)
```typescript
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthState {
  token: string | null;
  user: any | null;
  login: (token: string, user: any) => void;
  logout: () => void;
  isAuthenticated: () => boolean;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      token: null,
      user: null,
      login: (token, user) => set({ token, user }),
      logout: () => set({ token: null, user: null }),
      isAuthenticated: () => !!get().token,
    }),
    {
      name: 'auth-storage',
    }
  )
);
```

### API Client
```typescript
import axios from 'axios';
import { useAuthStore } from '../stores/authStore';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
});

apiClient.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      useAuthStore.getState().logout();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
```

### Product Form Component
```typescript
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

const productSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().min(1, 'Description is required'),
  price: z.number().min(0, 'Price must be positive'),
  category: z.string().min(1, 'Category is required'),
});

type ProductFormData = z.infer<typeof productSchema>;

interface ProductFormProps {
  onSubmit: (data: ProductFormData) => void;
  defaultValues?: Partial<ProductFormData>;
}

export function ProductForm({ onSubmit, defaultValues }: ProductFormProps) {
  const { register, handleSubmit, formState: { errors } } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues,
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <Input {...register('name')} placeholder="Product name" />
        {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
      </div>
      
      <div>
        <Textarea {...register('description')} placeholder="Description" />
        {errors.description && <p className="text-red-500 text-sm">{errors.description.message}</p>}
      </div>
      
      <div>
        <Input {...register('price', { valueAsNumber: true })} type="number" step="0.01" placeholder="Price" />
        {errors.price && <p className="text-red-500 text-sm">{errors.price.message}</p>}
      </div>
      
      <div>
        <Input {...register('category')} placeholder="Category" />
        {errors.category && <p className="text-red-500 text-sm">{errors.category.message}</p>}
      </div>
      
      <Button type="submit">Save Product</Button>
    </form>
  );
}
```

## 🛠️ Development Scripts

### Backend
```bash
npm run start:dev    # Development server
npm run build        # Production build
npm run start        # Start production server
npm run seed         # Seed database with test data
```

### Frontend
```bash
npm run dev          # Development server
npm run build        # Production build
npm run start        # Start production server
npm run lint         # Run ESLint
```

## 📋 Environment Variables

### Backend (.env)
```env
DB_HOST=localhost
DB_PORT=5432
DB_USER=admin
DB_PASSWORD=admin
DB_NAME=fullstack_test
JWT_SECRET=your-super-secret-jwt-key
```

### Frontend (.env.local)
```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:5000
```

## 🔒 Security Features

- JWT token-based authentication
- Route protection on frontend and backend
- Input validation and sanitization
- CORS configuration
- Password hashing (in production)
- Automatic token refresh handling

## 🚀 Production Deployment

1. Update environment variables for production
2. Configure proper database credentials
3. Set secure JWT secrets
4. Enable HTTPS
5. Configure reverse proxy (nginx)
6. Set up monitoring and logging

## 🧪 Testing

```bash
# Backend tests
cd backend
npm run test

# Frontend tests
cd frontend
npm run test
```

## 📝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details.

## 🆘 Support

For support and questions:
- Create an issue on GitHub
- Check the API documentation at `/docs`
- Review the troubleshooting section

---

**Happy coding! 🎉**
