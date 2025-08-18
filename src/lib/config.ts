// Environment configuration for API endpoints
export const config = {
  // In development, API calls will be proxied by Vite to localhost:3000 (Vercel dev)
  // In production, API calls will go to the same domain as the frontend
  apiBaseUrl: '',

  // Environment detection
  isDevelopment: import.meta.env.DEV,
  isProduction: import.meta.env.PROD,

  // Vercel environment detection
  isVercel: typeof window !== 'undefined' && window.location.hostname.includes('vercel.app'),
} as const

export default config
