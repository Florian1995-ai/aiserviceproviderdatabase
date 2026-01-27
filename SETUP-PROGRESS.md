# AI Service Provider Database - Setup Progress

## Project Info
- **Subdomain**: aiserviceproviderdatabase.florianrolke.com
- **Location**: `Websites Clients/aiserviceproviderdatabase/`
- **GitHub Repo**: https://github.com/Florian1995-ai/aiserviceproviderdatabase
- **Local Dev**: http://localhost:3000

## Completed Steps
- [x] Created project folder structure
- [x] Created vite.config.ts, tsconfig.json, index.html
- [x] Created React entry files (main.tsx, App.tsx)
- [x] Initialized Git repository
- [x] Created GitHub repo via API
- [x] Pushed to GitHub
- [x] Added Supabase client (read-only)
- [x] Created text search interface MVP
- [x] Tested on localhost

## Remaining Steps
- [ ] Deploy to Coolify
- [ ] Configure Cloudflare subdomain
- [ ] Add dropdown filters (after finalizing categories)

## Environment Variables (for deployment)
Create these in Coolify:
```
VITE_SUPABASE_URL=https://twioemvizpqdfvpkhrnl.supabase.co
VITE_SUPABASE_ANON_KEY=<your-anon-key>
```

## Cloudflare + Coolify Deployment

### Step 1: Coolify Setup
1. Go to your Coolify dashboard
2. Create new project > Add Resource > Public Repository
3. Repository URL: `https://github.com/Florian1995-ai/aiserviceproviderdatabase`
4. Build settings:
   - Build command: `npm run build`
   - Output directory: `dist`
   - Install command: `npm install`
5. Add environment variables (see above)
6. Deploy - note the generated URL

### Step 2: Cloudflare DNS
1. Go to Cloudflare dashboard > Your domain > DNS
2. Add record:
   - Type: CNAME
   - Name: `aiserviceproviderdatabase`
   - Target: Your Coolify app URL (without https://)
   - Proxy status: Proxied (orange cloud)
3. Save

### Step 3: Configure Coolify Domain
1. Back in Coolify, go to your app settings
2. Add custom domain: `aiserviceproviderdatabase.florianrolke.com`
3. Enable HTTPS (Coolify handles SSL via Let's Encrypt)

## Future Enhancements
- Dropdown filters (region, service type, contact availability)
- Semantic search using vector embeddings
- Pagination for large result sets
