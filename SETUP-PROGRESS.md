# AI Service Provider Database - Setup Progress

## Project Info
- **Subdomain**: aiserviceproviderdatabase.florianrolke.com
- **Location**: `Websites Clients/aiserviceproviderdatabase/`
- **GitHub Token**: Located in `../Website/.env` (GITHUB_ACCESS_TOKEN)

## Completed Steps
- [x] Created project folder structure
- [x] Created package.json

## Remaining Steps
- [ ] Create vite.config.ts
- [ ] Create tsconfig.json + tsconfig.node.json
- [ ] Create index.html
- [ ] Create src/main.tsx entry point
- [ ] Create src/App.tsx
- [ ] Create category data (src/data/categories.ts)
- [ ] Create search components:
  - SearchVoice.tsx (voice input)
  - SearchText.tsx (text input field)
  - SearchFilters.tsx (dropdown filters)
- [ ] Initialize Git repository
- [ ] Create GitHub repo via API
- [ ] Push initial commit
- [ ] Document Cloudflare + Coolify deployment

## Folder Structure Created
```
aiserviceproviderdatabase/
├── src/
│   ├── components/
│   ├── data/
│   ├── pages/
│   ├── styles/
│   └── lib/
├── public/
└── package.json
```

## Search Input Types Needed
1. **Voice Input** - Microphone button for voice search
2. **Text Input** - Standard text field for typing
3. **Dropdown Filters** - Category-based filtering:
   - Location (cities, regions, remote)
   - Service Type (AI Consulting, Automation, Data Analytics, etc.)
   - Industry (Healthcare, Finance, E-commerce, etc.)

## Deployment Flow (High Level)
1. Build project: `npm run build` → outputs to `dist/`
2. Cloudflare: Add CNAME record `aiserviceproviderdatabase` → Coolify app URL
3. Coolify: Create new app, connect to GitHub repo, set build command

## Resume Command
When ready to continue, say: "Continue setting up the aiserviceproviderdatabase project"
