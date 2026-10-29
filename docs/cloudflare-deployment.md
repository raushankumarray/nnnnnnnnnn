# Cloudflare Pages Deployment Guide

Follow these steps to deploy the Nexus Project to the Cloudflare Edge network.

## Build Command
Execute the following to generate the production-ready node:
```bash
npm run build
```

## Deployment Commands
Nexus supports both automated Git-based deployment and manual CLI deployment via Wrangler.

### CLI Protocol
- **Deploy**: `npx wrangler pages deploy .next`
- **Preview**: `npx wrangler pages dev .next`

## Dashboard Configuration
When setting up the project in the Cloudflare Pages dashboard:

1. **Framework Preset**: Select **Next.js**.
2. **Build Settings**:
   - Build Command: `npm run build`
   - Output Directory: `.next`
3. **Compatibility Flags**: Add `nodejs_compat` under **Settings** > **Functions** > **Compatibility flags**.
4. **Preview Deployments**: Enable "Automatic deployments" for your branch to allow for "Preview builds" on every commit.

## Image Optimization
The project uses `unoptimized: true` in `next.config.ts` to ensure compatibility with Cloudflare's serverless image handling without requiring additional paid services.
