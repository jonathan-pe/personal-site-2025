# Development Setup

## Running the Application Locally

### Option 1: Full Development (Recommended)
Run both frontend and API servers concurrently:
```bash
pnpm dev
```

This will start:
- Frontend (Vite) on `http://localhost:5173`
- API (Vercel dev) on `http://localhost:3000`

The Vite dev server will proxy `/api/*` requests to the Vercel dev server.

### Option 2: Frontend Only
If you only need to work on the frontend:
```bash
pnpm dev:client
```

### Option 3: API Only
If you only need to test the API endpoints:
```bash
pnpm dev:api
# or
pnpm dev:vercel
```

## API Endpoints

When running locally:
- Chat API: `http://localhost:5173/api/chat` (proxied to Vercel dev)
- Health Check: `http://localhost:5173/api/health` (proxied to Vercel dev)

Direct API access (Vercel dev):
- Chat API: `http://localhost:3000/api/chat`
- Health Check: `http://localhost:3000/api/health`

## Environment Variables

Make sure you have a `.env.local` file with:
```
OPENAI_API_KEY=your_openai_api_key
CHAT_RATE_LIMIT_REQUESTS_PER_MINUTE=10
```

## Production Deployment

The application is configured for Vercel deployment:
- Frontend will be served from the root domain
- API endpoints will be available at `/api/*` on the same domain
- No additional configuration needed for production

## Troubleshooting

- If API calls fail, ensure both servers are running (`pnpm dev`)
- Check that Vercel CLI is installed: `pnpm add -D vercel`
- Verify environment variables are set in `.env.local`
- Check browser network tab for actual request URLs
