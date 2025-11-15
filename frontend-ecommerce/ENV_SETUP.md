# Environment Variables Setup

This project uses environment variables to manage configuration. This prevents hardcoding sensitive values and makes it easy to switch between development, staging, and production environments.

## Quick Start

1. **Copy the example file**:
   ```bash
   cp .env.example .env
   ```

2. **Edit `.env`** with your actual values:
   ```env
   REACT_APP_API_BASE_URL=http://localhost:8080
   REACT_APP_GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
   ```

3. **Restart your development server**:
   ```bash
   npm start
   ```

## Environment Variables

### Required Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `REACT_APP_API_BASE_URL` | Backend API base URL | `http://localhost:8080` |
| `REACT_APP_GOOGLE_CLIENT_ID` | Google OAuth Client ID | `817733173307-xxx.apps.googleusercontent.com` |

### Important Notes

- **React requires the `REACT_APP_` prefix** for environment variables to be accessible in the code
- Environment variables are embedded at build time, not runtime
- You must restart the dev server after changing `.env` files
- Never commit `.env` files to version control (already in `.gitignore`)

## Usage in Code

All environment variables are accessed through the centralized config file:

```javascript
import config from './config/env';

// Get API base URL
const apiUrl = config.API_BASE_URL;

// Get full API URL for an endpoint
const fullUrl = config.getApiUrl('/api/products');

// Get Google Client ID
const clientId = config.GOOGLE_CLIENT_ID;
```

## Environment-Specific Files

React supports different `.env` files for different environments:

- `.env` - Default, loaded in all environments
- `.env.development` - Loaded when `NODE_ENV=development`
- `.env.production` - Loaded when `NODE_ENV=production`
- `.env.local` - Local overrides (gitignored)

Priority: `.env.local` > `.env.development`/`.env.production` > `.env`

## Production Setup

For production, set environment variables in your hosting platform:

### Vercel
```bash
vercel env add REACT_APP_API_BASE_URL
vercel env add REACT_APP_GOOGLE_CLIENT_ID
```

### Netlify
Add in Netlify dashboard: Site settings → Environment variables

### Other Platforms
Set environment variables in your platform's configuration panel before building.

## Troubleshooting

### Variables not working?
1. Ensure they start with `REACT_APP_`
2. Restart the dev server after changes
3. Check for typos in variable names
4. Verify `.env` file is in the `frontend-ecommerce/` directory

### Build issues?
- Environment variables must be set before running `npm run build`
- Check that all required variables are set
- Review build logs for missing variable warnings

