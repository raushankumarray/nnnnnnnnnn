# Nexus Project

Nexus is a GitHub-driven software ecosystem designed for high-performance project engineering and enterprise provisioning. This repository is optimized for deployment on Cloudflare Pages.

## 🚀 Quick Start

### 1. Development Mode
Run the development server locally:
```bash
npm run dev
```

### 2. Build Protocol
Prepare the optimized production bundle:
```bash
npm run build
```

## ☁️ Cloudflare Deployment Guide

To deploy the latest code to Cloudflare, follow these standard protocols:

### Manual Deployment
Run these commands in your terminal after the build is complete:
1. **Deploy to Production**:
   ```bash
   npx wrangler pages deploy .next
   ```
2. **Preview Build**:
   ```bash
   npx wrangler pages dev .next
   ```

### Step-by-Step Dashboard Setup
1. **Connect Repository**: Log in to [Cloudflare Dashboard](https://dash.cloudflare.com/) and navigate to **Workers & Pages** > **Create application** > **Pages** > **Connect to Git**.
2. **Select Repo**: Choose the `nexus-project` repository.
3. **Build Settings**:
   - **Framework preset**: `Next.js`
   - **Build command**: `npm run build`
   - **Build output directory**: `.next`
4. **Environment Variables**: Add `NODE_VERSION: 20` or higher.
5. **Enable Preview Builds**: In the Pages project settings, ensure "Preview deployments" are enabled for all non-production branches.

## 🔧 Technical Architecture
- **Framework**: Next.js 15 (App Router)
- **Runtime**: Cloudflare `nodejs_compat`
- **Prototype Mode**: Inert Firebase services enabled for high-fidelity UI testing without API requirements.

---
© 2025 Nexus Project | Master Protocol established.