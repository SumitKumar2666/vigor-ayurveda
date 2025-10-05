# VigorAyurveda E-Commerce Platform

Full-stack Ayurvedic supplement e-commerce platform with React frontend, NestJS backend, Prisma ORM, PostgreSQL database, and Razorpay payments.

## Architecture

- **Frontend**: React 18 + Vite + TypeScript + Tailwind + shadcn/ui
- **Backend**: NestJS + Prisma + PostgreSQL (Neon)
- **Payments**: Razorpay test/live mode
- **Deploy**: Frontend → Vercel | Backend → Render | DB → Neon
- **Domains**: vigorayurveda.com, vigorayurveda.in (FE) | api.vigorayurveda.com (BE)

## Local Development Setup

### Prerequisites
- Node.js 20+
- pnpm 8+
- PostgreSQL 16+ (or use docker-compose)

### Quick Start

1. **Clone and Install**
   ```bash
   git clone <repo-url>
   cd vigor-ayurveda
   pnpm install
   ```

2. **Setup Environment Variables**
   ```bash
   cp apps/api/.env.example apps/api/.env
   cp apps/web/.env.example apps/web/.env
   ```
   
   Edit `apps/api/.env` with your DATABASE_URL and secrets.

3. **Start Database (Docker)**
   ```bash
   docker-compose up -d db
   ```

4. **Run Migrations & Seed**
   ```bash
   cd apps/api
   pnpm prisma:migrate
   pnpm seed
   ```

5. **Start Development Servers**
   ```bash
   pnpm dev
   ```
   
   - Frontend: http://localhost:5173
   - Backend: http://localhost:3001

### Admin Credentials (Seeded)
- Email: admin@vigorayurveda.com
- Password: Admin@123!ChangeMe (⚠️ Change immediately)

## Production Deployment

### 1. Database (Neon)

1. Create project at https://neon.tech
2. Copy connection string (starts with `postgresql://...`)
3. Set as `DATABASE_URL` in Render

### 2. Backend (Render)

1. Create new **Web Service** from GitHub
2. **Build Command**: 
   ```bash
   pnpm install --filter @vigor/api... && pnpm --filter @vigor/api prisma:generate && pnpm --filter @vigor/api build
   ```
3. **Start Command**: `node dist/main.js`
4. **Environment Variables**:
   - `DATABASE_URL`: from Neon
   - `JWT_SECRET`: generate strong random string
   - `REFRESH_SECRET`: generate strong random string
   - `RAZORPAY_KEY_ID`: from Razorpay dashboard
   - `RAZORPAY_KEY_SECRET`: from Razorpay dashboard
   - `CORS_ORIGIN`: `https://vigorayurveda.com,https://vigorayurveda.in`
   - `NODE_ENV`: `production`
5. Add custom domain: `api.vigorayurveda.com`
6. After first deploy, run migrations:
   ```bash
   pnpm --filter @vigor/api prisma migrate deploy
   pnpm --filter @vigor/api seed
   ```

### 3. Frontend (Vercel)

1. Import `apps/web` from GitHub
2. **Framework Preset**: Vite
3. **Root Directory**: `apps/web`
4. **Environment Variables**:
   - `VITE_API_BASE_URL`: `https://api.vigorayurveda.com/api/v1`
   - `VITE_RAZORPAY_KEY_ID`: from Razorpay
   - `VITE_GA_MEASUREMENT_ID`: from Google Analytics
5. Add domains: `vigorayurveda.com`, `vigorayurveda.in`

### 4. DNS Configuration

Point your domains to:
- `vigorayurveda.com` → Vercel (A/CNAME records)
- `vigorayurveda.in` → Vercel (A/CNAME records)
- `api.vigorayurveda.com` → Render target (CNAME)

### 5. Go-Live Checklist

- [ ] Database migrated and seeded
- [ ] Admin password changed from default
- [ ] All environment variables set to production values
- [ ] Razorpay switched from test to live keys
- [ ] Custom domains configured and SSL active
- [ ] GA4 tracking verified
- [ ] Test complete checkout flow end-to-end
- [ ] Verify payment webhook/signature validation
- [ ] Run Lighthouse audit (target: 90+ performance, accessibility)

## Project Structure

```
vigor-ayurveda/
├── apps/
│   ├── api/          # NestJS backend
│   └── web/          # React frontend
├── packages/
│   └── config/       # Shared types
└── infra/            # Docker, CI/CD configs
```

## Scripts

### Root
- `pnpm dev` - Start all apps in dev mode
- `pnpm build` - Build all apps
- `pnpm lint` - Lint all packages
- `pnpm test` - Run all tests

### Backend (apps/api)
- `pnpm start:dev` - Dev mode with watch
- `pnpm build` - Build for production
- `pnpm prisma:migrate` - Run migrations
- `pnpm seed` - Seed database
- `pnpm test` - Unit tests
- `pnpm test:e2e` - E2E tests

### Frontend (apps/web)
- `pnpm dev` - Dev server
- `pnpm build` - Production build
- `pnpm preview` - Preview production build
- `pnpm test` - Unit tests
- `pnpm e2e` - Playwright E2E tests

## Key Features

- ✅ JWT access/refresh token auth (httpOnly cookies)
- ✅ Product catalog with categories & search
- ✅ Shopping cart with persistence (Zustand)
- ✅ Razorpay payment integration with signature verification
- ✅ Order management
- ✅ Blog/Learn section
- ✅ SEO-optimized (sitemap, robots.txt, meta tags)
- ✅ GA4 analytics
- ✅ Security hardening (Helmet, rate-limiting, CORS)
- ✅ Comprehensive error handling & logging (Pino)
- ✅ Seeded with 12 products & 3 blog posts

## Security Notes

- **Never commit** `.env` files
- **Rotate secrets** regularly (JWT, Refresh, Razorpay)
- **HTTPS only** in production
- **Rate limiting** active on API
- **CORS restricted** to frontend domains only
- **Password hashing** with argon2

## Support

For issues, contact admin@vigorayurveda.com or open an issue on GitHub.

---

**Disclaimer**: This platform provides educational content only, not medical advice. Sexual wellness content is intended for adults 18+. Consult a healthcare professional before starting any supplement regimen.