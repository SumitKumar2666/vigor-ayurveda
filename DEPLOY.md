# Deployment Guide - Vigor Ayurveda E-commerce Platform

This guide will help you deploy the Vigor Ayurveda full-stack e-commerce application to production.

## Table of Contents

1. [System Requirements](#system-requirements)
2. [Local Development Setup](#local-development-setup)
3. [Production Deployment](#production-deployment)
4. [Environment Variables](#environment-variables)
5. [Database Setup](#database-setup)
6. [CI/CD Pipeline](#cicd-pipeline)
7. [Domain Configuration](#domain-configuration)
8. [Troubleshooting](#troubleshooting)

## System Requirements

### Development
- Node.js 20.x or higher
- pnpm 8.x or higher
- MongoDB 7.x or higher
- Docker & Docker Compose (optional, for containerized setup)

### Production
- MongoDB Atlas account (or self-hosted MongoDB)
- Vercel account (for frontend) or any static hosting
- Railway/Render/Heroku account (for backend API) or VPS
- Domain name with SSL certificate
- Razorpay account for payments

## Local Development Setup

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/vigor-ayurveda.git
cd vigor-ayurveda
```

### 2. Install Dependencies

```bash
pnpm install
```

### 3. Set Up MongoDB

**Option A: Using Docker Compose (Recommended for Development)**

```bash
docker-compose up -d mongodb
```

**Option B: Local MongoDB Installation**

Install MongoDB 7.x from [mongodb.com](https://www.mongodb.com/try/download/community) and ensure it's running on port 27017.

### 4. Configure Environment Variables

**Backend (.env in apps/api/):**

```bash
cd apps/api
cp .env.example .env
```

Edit `.env` with your values:

```env
NODE_ENV=development
PORT=3001

# MongoDB
MONGODB_URI=mongodb://localhost:27017/vigor_ayurveda

# JWT Secrets (Change these!)
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRES_IN=15m
REFRESH_SECRET=your-super-secret-refresh-key-change-in-production
REFRESH_EXPIRES_IN=7d

# Razorpay (Test Keys for Development)
RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxx
RAZORPAY_KEY_SECRET=your_test_secret

# CORS
CORS_ORIGIN=http://localhost:5173
FRONTEND_URL=http://localhost:5173
```

**Frontend (.env in apps/web/):**

```bash
cd apps/web
cp .env.example .env
```

Edit `.env`:

```env
VITE_API_BASE_URL=http://localhost:3001/api/v1
VITE_RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxx
```

### 5. Seed the Database

```bash
cd apps/api
pnpm seed
```

This will create:
- Admin user: `admin@vigorayurveda.com` / `Admin@123!ChangeMe`
- Test user: `user@test.com` / `Test@123!`
- 4 categories
- 8 products
- 3 blog posts

### 6. Start Development Servers

**Terminal 1 - Backend:**
```bash
cd apps/api
pnpm start:dev
```

**Terminal 2 - Frontend:**
```bash
cd apps/web
pnpm dev
```

The application will be available at:
- Frontend: http://localhost:5173
- Backend API: http://localhost:3001
- API Health Check: http://localhost:3001/api/v1/health

## Production Deployment

### Option 1: Vercel (Frontend) + Railway (Backend)

#### Deploy Backend to Railway

1. Create a Railway account at [railway.app](https://railway.app)

2. Create a new project and add MongoDB:
   - Click "New" → "Database" → "MongoDB"
   - Copy the MongoDB connection string

3. Create a new service for the API:
   - Click "New" → "GitHub Repo"
   - Select your repository
   - Set root directory: `apps/api`
   - Configure build command: `pnpm install && pnpm build`
   - Set start command: `node dist/main.js`

4. Add environment variables in Railway:
   ```env
   NODE_ENV=production
   PORT=3001
   MONGODB_URI=<your-railway-mongodb-uri>
   JWT_SECRET=<generate-strong-secret>
   JWT_EXPIRES_IN=15m
   REFRESH_SECRET=<generate-strong-secret>
   REFRESH_EXPIRES_IN=7d
   RAZORPAY_KEY_ID=<your-live-razorpay-key>
   RAZORPAY_KEY_SECRET=<your-live-razorpay-secret>
   CORS_ORIGIN=https://yourdomain.com,https://www.yourdomain.com
   FRONTEND_URL=https://yourdomain.com
   ```

5. Deploy and get your API URL (e.g., `https://your-api.railway.app`)

6. Run seed command in Railway terminal:
   ```bash
   pnpm seed
   ```

#### Deploy Frontend to Vercel

1. Create a Vercel account at [vercel.com](https://vercel.com)

2. Import your repository:
   - Click "Add New" → "Project"
   - Import your GitHub repository
   - Set root directory: `apps/web`
   - Framework Preset: Vite
   - Build Command: `pnpm build`
   - Output Directory: `dist`

3. Add environment variables:
   ```env
   VITE_API_BASE_URL=https://your-api.railway.app/api/v1
   VITE_RAZORPAY_KEY_ID=<your-live-razorpay-key>
   ```

4. Deploy!

### Option 2: VPS Deployment (Ubuntu/Debian)

#### Prerequisites
- Ubuntu 22.04 LTS or Debian 11
- Domain name pointed to your server
- Root or sudo access

#### 1. Install Dependencies

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js 20.x
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Install pnpm
npm install -g pnpm

# Install MongoDB
curl -fsSL https://www.mongodb.org/static/pgp/server-7.0.asc | sudo gpg --dearmor -o /usr/share/keyrings/mongodb-archive-keyring.gpg
echo "deb [ signed-by=/usr/share/keyrings/mongodb-archive-keyring.gpg ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/7.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list
sudo apt update
sudo apt install -y mongodb-org
sudo systemctl start mongod
sudo systemctl enable mongod

# Install Nginx
sudo apt install -y nginx

# Install PM2 (Process Manager)
npm install -g pm2
```

#### 2. Clone and Build Application

```bash
# Clone repository
cd /var/www
git clone https://github.com/your-username/vigor-ayurveda.git
cd vigor-ayurveda

# Install dependencies
pnpm install

# Build backend
cd apps/api
pnpm build

# Build frontend
cd ../web
pnpm build
```

#### 3. Configure Environment Variables

Create `/var/www/vigor-ayurveda/apps/api/.env`:

```env
NODE_ENV=production
PORT=3001
MONGODB_URI=mongodb://localhost:27017/vigor_ayurveda
JWT_SECRET=<your-strong-secret>
JWT_EXPIRES_IN=15m
REFRESH_SECRET=<your-strong-secret>
REFRESH_EXPIRES_IN=7d
RAZORPAY_KEY_ID=<your-live-key>
RAZORPAY_KEY_SECRET=<your-live-secret>
CORS_ORIGIN=https://yourdomain.com
FRONTEND_URL=https://yourdomain.com
```

#### 4. Start Backend with PM2

```bash
cd /var/www/vigor-ayurveda/apps/api
pm2 start dist/main.js --name vigor-api
pm2 save
pm2 startup
```

#### 5. Configure Nginx

Create `/etc/nginx/sites-available/vigor-ayurveda`:

```nginx
# API Server
server {
    listen 80;
    server_name api.yourdomain.com;

    location / {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}

# Frontend
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    root /var/www/vigor-ayurveda/apps/web/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /assets {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

Enable the site:

```bash
sudo ln -s /etc/nginx/sites-available/vigor-ayurveda /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

#### 6. Install SSL Certificate (Let's Encrypt)

```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com -d api.yourdomain.com
```

#### 7. Seed Database

```bash
cd /var/www/vigor-ayurveda/apps/api
pnpm seed
```

## Environment Variables

### Required Backend Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `NODE_ENV` | Environment mode | `production` |
| `PORT` | API server port | `3001` |
| `MONGODB_URI` | MongoDB connection string | `mongodb://user:pass@host:27017/db` |
| `JWT_SECRET` | Access token secret | `random-256-bit-string` |
| `JWT_EXPIRES_IN` | Access token expiry | `15m` |
| `REFRESH_SECRET` | Refresh token secret | `random-256-bit-string` |
| `REFRESH_EXPIRES_IN` | Refresh token expiry | `7d` |
| `RAZORPAY_KEY_ID` | Razorpay public key | `rzp_live_xxxxxx` |
| `RAZORPAY_KEY_SECRET` | Razorpay secret key | `your_secret` |
| `CORS_ORIGIN` | Allowed origins (comma-separated) | `https://yourdomain.com` |
| `FRONTEND_URL` | Frontend base URL | `https://yourdomain.com` |

### Required Frontend Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_API_BASE_URL` | Backend API base URL | `https://api.yourdomain.com/api/v1` |
| `VITE_RAZORPAY_KEY_ID` | Razorpay public key | `rzp_live_xxxxxx` |

## Database Setup

### MongoDB Atlas (Recommended for Production)

1. Create account at [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new cluster (M0 free tier available)
3. Create database user with password
4. Whitelist IP addresses (0.0.0.0/0 for all IPs, or specific IPs)
5. Get connection string and update `MONGODB_URI`

### Backup & Restore

**Backup:**
```bash
mongodump --uri="<MONGODB_URI>" --out=/backup/$(date +%Y%m%d)
```

**Restore:**
```bash
mongorestore --uri="<MONGODB_URI>" /backup/20240101
```

## CI/CD Pipeline

### GitHub Actions Example

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '20'

      - name: Install pnpm
        run: npm install -g pnpm

      - name: Install dependencies
        run: pnpm install

      - name: Build API
        run: cd apps/api && pnpm build

      - name: Build Web
        run: cd apps/web && pnpm build

      - name: Deploy API to Railway
        run: railway up --service api
        env:
          RAILWAY_TOKEN: ${{ secrets.RAILWAY_TOKEN }}

      - name: Deploy Web to Vercel
        run: vercel --prod --token=${{ secrets.VERCEL_TOKEN }}
```

## Domain Configuration

### DNS Records

Point your domain to your deployment:

**For Vercel:**
- `A` record: `@` → Vercel IP
- `CNAME` record: `www` → `cname.vercel-dns.com`

**For VPS:**
- `A` record: `@` → Your server IP
- `A` record: `www` → Your server IP
- `A` record: `api` → Your server IP

**For Railway:**
- `CNAME` record: `api` → `your-service.railway.app`

## Troubleshooting

### Common Issues

**1. MongoDB Connection Failed**
```bash
# Check MongoDB status
sudo systemctl status mongod

# View MongoDB logs
sudo journalctl -u mongod

# Restart MongoDB
sudo systemctl restart mongod
```

**2. API Not Starting**
```bash
# Check PM2 logs
pm2 logs vigor-api

# Restart API
pm2 restart vigor-api
```

**3. Frontend Build Errors**
```bash
# Clear cache and rebuild
cd apps/web
rm -rf node_modules dist
pnpm install
pnpm build
```

**4. CORS Errors**
- Ensure `CORS_ORIGIN` in backend `.env` matches your frontend domain
- Include both `https://yourdomain.com` and `https://www.yourdomain.com`

**5. Payment Gateway Issues**
- Verify Razorpay keys are correct (test vs live)
- Ensure webhook URLs are configured in Razorpay dashboard
- Check payment logs in admin dashboard

### Health Checks

**Backend:**
```bash
curl https://api.yourdomain.com/api/v1/health
```

**Database:**
```bash
mongosh "<MONGODB_URI>" --eval "db.adminCommand('ping')"
```

### Performance Optimization

1. **Enable Gzip in Nginx:**
```nginx
gzip on;
gzip_types text/plain text/css application/json application/javascript;
```

2. **Add Caching Headers:**
```nginx
location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
}
```

3. **MongoDB Indexing:**
```javascript
// Run in MongoDB shell
db.products.createIndex({ slug: 1 });
db.products.createIndex({ categoryId: 1 });
db.users.createIndex({ email: 1 });
db.orders.createIndex({ userId: 1 });
```

## Security Checklist

- [ ] Change default admin password after first login
- [ ] Use strong JWT secrets (256-bit random strings)
- [ ] Enable MongoDB authentication
- [ ] Configure firewall to allow only necessary ports
- [ ] Set up SSL certificates for all domains
- [ ] Enable rate limiting in production
- [ ] Regular security updates (`apt update && apt upgrade`)
- [ ] Set up automated backups
- [ ] Monitor server logs for suspicious activity
- [ ] Use environment variables for all secrets
- [ ] Enable CORS only for trusted domains

## Support

For issues or questions:
- GitHub Issues: [github.com/your-username/vigor-ayurveda/issues](https://github.com/your-username/vigor-ayurveda/issues)
- Email: admin@vigorayurveda.com

## License

Copyright © 2024 Vigor Ayurveda. All rights reserved.
