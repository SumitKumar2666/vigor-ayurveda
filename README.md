# VigorAyurveda E-Commerce Platform

Production-grade full-stack Ayurvedic supplement e-commerce platform with React frontend, NestJS backend, MongoDB database, and Razorpay payments integration.

## Architecture

- **Frontend**: React 18 + Vite + TypeScript + Tailwind CSS + Zustand
- **Backend**: NestJS + Mongoose + MongoDB
- **Database**: MongoDB 7.x
- **Payments**: Razorpay integration with signature verification
- **Deploy**: Frontend → Vercel | Backend → Railway/Render | DB → MongoDB Atlas
- **Domains**: vigorayurveda.com, vigorayurveda.in (FE) | api.vigorayurveda.com (BE)

## Features

✅ Complete authentication system (JWT with refresh tokens)
✅ Product catalog with categories, search, and filtering
✅ Shopping cart with localStorage persistence
✅ Razorpay payment gateway integration
✅ Order management system
✅ Admin dashboard for managing products, orders, and users
✅ User account management
✅ Blog/content management system
✅ Role-based access control (User/Admin)
✅ Production-grade error handling and logging
✅ Security hardening (Helmet, rate-limiting, CORS)
✅ Responsive design for all devices
✅ SEO optimization ready

## Local Development Setup

### Prerequisites
- Node.js 20+
- pnpm 8+
- MongoDB 7+ (or use docker-compose)

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

3. **Start MongoDB (Docker)**
   ```bash
   docker-compose up -d mongodb
   ```

4. **Seed Database**
   ```bash
   cd apps/api
   pnpm seed
   ```

   This creates:
   - Admin user: `admin@vigorayurveda.com` / `Admin@123!ChangeMe`
   - Test user: `user@test.com` / `Test@123!`
   - 4 categories, 8 products, 3 blog posts

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

### 1. Database (MongoDB Atlas)

1. Create free account at https://www.mongodb.com/cloud/atlas
2. Create M0 free cluster (or paid tier for production)
3. Create database user with strong password
4. Whitelist IP addresses (0.0.0.0/0 for Railway/Render, or specific IPs)
5. Copy connection string (starts with `mongodb+srv://...`)
6. Set as `MONGODB_URI` in your backend deployment

### 2. Backend (Railway/Render)

**Option A: Railway (Recommended)**
1. Create account at https://railway.app
2. Create new project → Add MongoDB service
3. Create new service from GitHub repo
4. Set root directory: `apps/api`
5. Build command: `pnpm install && pnpm build`
6. Start command: `node dist/main.js`
7. Add environment variables (see below)
8. Deploy and run seed: `pnpm seed`

**Option B: Render**
1. Create new **Web Service** from GitHub
2. Root directory: `apps/api`
3. **Build Command**: `pnpm install && pnpm build`
4. **Start Command**: `node dist/main.js`
5. **Environment Variables**:
   - `NODE_ENV`: `production`
   - `PORT`: `3001`
   - `MONGODB_URI`: from MongoDB Atlas
   - `JWT_SECRET`: generate strong 256-bit random string
   - `JWT_EXPIRES_IN`: `15m`
   - `REFRESH_SECRET`: generate strong 256-bit random string
   - `REFRESH_EXPIRES_IN`: `7d`
   - `RAZORPAY_KEY_ID`: from Razorpay dashboard (live key)
   - `RAZORPAY_KEY_SECRET`: from Razorpay dashboard (live secret)
   - `CORS_ORIGIN`: `https://vigorayurveda.com,https://www.vigorayurveda.com`
   - `FRONTEND_URL`: `https://vigorayurveda.com`
6. Add custom domain: `api.vigorayurveda.com`
7. After deployment, seed database:
   ```bash
   pnpm seed
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
- `pnpm seed` - Seed database with sample data
- `pnpm test` - Unit tests
- `pnpm test:e2e` - E2E tests

### Frontend (apps/web)
- `pnpm dev` - Dev server
- `pnpm build` - Production build
- `pnpm preview` - Preview production build
- `pnpm test` - Unit tests
- `pnpm e2e` - Playwright E2E tests

## API Endpoints

### Public Endpoints
- `GET /api/v1/health` - Health check
- `GET /api/v1/products` - List products (with search/filter)
- `GET /api/v1/products/:slug` - Get product details
- `GET /api/v1/categories` - List categories
- `GET /api/v1/blog` - List blog posts
- `POST /api/v1/auth/register` - User registration
- `POST /api/v1/auth/login` - User login
- `POST /api/v1/auth/refresh` - Refresh access token

### Protected Endpoints (Requires Authentication)
- `GET /api/v1/auth/me` - Get current user
- `POST /api/v1/auth/logout` - Logout
- `GET /api/v1/orders/my-orders` - Get user's orders
- `POST /api/v1/orders` - Create new order
- `POST /api/v1/payments/razorpay/order` - Create Razorpay order
- `POST /api/v1/payments/razorpay/verify` - Verify payment

### Admin Endpoints (Requires Admin Role)
- `GET /api/v1/admin/dashboard` - Dashboard statistics
- `GET /api/v1/admin/orders` - All orders
- `PUT /api/v1/admin/orders/:id/status` - Update order status
- `POST /api/v1/admin/products` - Create product
- `PUT /api/v1/admin/products/:slug` - Update product
- `DELETE /api/v1/admin/products/:slug` - Delete product
- `GET /api/v1/admin/users` - All users
- `DELETE /api/v1/admin/users/:id` - Delete user

## Security Notes

- **Never commit** `.env` files
- **Rotate secrets** regularly (JWT, Refresh, Razorpay)
- **HTTPS only** in production
- **Rate limiting** active on API
- **CORS restricted** to frontend domains only
- **Password hashing** with argon2

## Tech Stack Details

### Backend
- **Framework**: NestJS 10.x
- **Database**: MongoDB 7.x with Mongoose ODM
- **Authentication**: JWT (access + refresh tokens with httpOnly cookies)
- **Password Hashing**: Argon2
- **Validation**: class-validator, class-transformer
- **Security**: Helmet, CORS, Rate limiting (30 req/min)
- **Logging**: Pino (structured logging)
- **Payments**: Razorpay with HMAC signature verification

### Frontend
- **Framework**: React 18.2 with TypeScript
- **Build Tool**: Vite 5.x
- **Routing**: React Router v6
- **State Management**: Zustand with localStorage persistence
- **HTTP Client**: Axios with interceptors
- **Styling**: Tailwind CSS 3.4
- **UI Components**: Custom components with Radix UI primitives
- **Icons**: Lucide React

### DevOps
- **Package Manager**: pnpm workspaces (monorepo)
- **Containerization**: Docker + Docker Compose
- **CI/CD**: GitHub Actions ready
- **Deployment**: Vercel (frontend) + Railway/Render (backend)

## Development Workflow

1. **Feature Development**
   ```bash
   # Create feature branch
   git checkout -b feature/your-feature

   # Make changes and test locally
   pnpm dev

   # Commit changes
   git add .
   git commit -m "feat: add your feature"

   # Push to remote
   git push origin feature/your-feature
   ```

2. **Testing**
   ```bash
   # Run backend tests
   cd apps/api
   pnpm test

   # Run frontend tests
   cd apps/web
   pnpm test
   ```

3. **Database Management**
   ```bash
   # Backup MongoDB
   mongodump --uri="mongodb://localhost:27017/vigor_ayurveda" --out=backup

   # Restore MongoDB
   mongorestore --uri="mongodb://localhost:27017/vigor_ayurveda" backup

   # Re-seed database
   cd apps/api
   pnpm seed
   ```

## Troubleshooting

### Common Issues

**Port already in use:**
```bash
# Kill process on port 3001 (backend)
lsof -ti:3001 | xargs kill -9

# Kill process on port 5173 (frontend)
lsof -ti:5173 | xargs kill -9
```

**MongoDB connection failed:**
```bash
# Check MongoDB is running
docker ps

# Restart MongoDB
docker-compose restart mongodb

# View MongoDB logs
docker-compose logs mongodb
```

**CORS errors:**
- Ensure `CORS_ORIGIN` in backend `.env` matches frontend URL
- Check browser console for specific CORS error details

**Payment verification failed:**
- Verify Razorpay keys are correct (test vs live)
- Check signature generation matches Razorpay documentation
- Ensure order_id matches between creation and verification

## Documentation

- [Deployment Guide](./DEPLOY.md) - Comprehensive deployment instructions
- [API Documentation](./apps/api/README.md) - API endpoints and usage
- [Frontend Documentation](./apps/web/README.md) - Component documentation

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

Copyright © 2024 Vigor Ayurveda. All rights reserved.

## Support

For issues, contact admin@vigorayurveda.com or open an issue on GitHub.

---

**Disclaimer**: This platform provides educational content only, not medical advice. Sexual wellness content is intended for adults 18+. Consult a healthcare professional before starting any supplement regimen.