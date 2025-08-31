# Backend (NestJS + TypeORM + PostgreSQL)

## Run (Dev)

```bash
cp .env.example .env
npm install
npm run start:dev
# Swagger → http://localhost:$PORT/docs (default 4000)
```

## Seed User

- Auto-seeded on boot (test/test)
- Or run: `npm run seed`

## Endpoints (Bearer auth required except login/health)

- `POST /auth/login` → { username, password } → { access_token }
- `GET /health`
- `GET /products`
- `GET /products/:id`
- `POST /products` { name }
- `PATCH /products/:id` { name? }
- `DELETE /products/:id` (cascade delete, global reindex products & all variants SKUs)
- `GET /variants?productId=&search=&createdBy=&sort=ASC|DESC`
- `POST /variants` { productId, name } (index auto, SKU auto)
- `PATCH /variants/:id` { name? }
- `DELETE /variants/:id` (reindex variants of that product & SKUs)

## Rules enforced

- Products indexed 1..N (unique)
- Variants indexed 1..M per product
- SKUCode = `<productIndex>_<variantIndex>` kept consistent
- Cascade delete via DB + service-level reindex
- Search (name/SKU), sort (index), filter (createdBy)
