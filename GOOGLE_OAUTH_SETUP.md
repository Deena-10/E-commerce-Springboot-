# Google OAuth Setup Guide

## Your Client ID
```
817733173307-95opkpfgelnnmrphs0ramvcekv25rho3.apps.googleusercontent.com
```

## ✅ Current Configuration Status

### Frontend
- ✅ Configured in `frontend-ecommerce/src/index.js`
- ✅ Using `@react-oauth/google` library

### Backend
- ✅ Configured in `Ecom/src/main/resources/application.properties`
- ✅ Client ID and Secret are set
- ✅ Redirect URI configured

## 🔧 Fix the 403 Error - Google Cloud Console Setup

The 403 error occurs because Google doesn't recognize `http://localhost:3000` as an authorized origin. Follow these steps:

### Step 1: Access Google Cloud Console
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Sign in with your Google account
3. Select your project (or create one if needed)

### Step 2: Navigate to OAuth Credentials
1. In the left sidebar, click **APIs & Services**
2. Click **Credentials**
3. Find your OAuth 2.0 Client ID: `817733173307-95opkpfgelnnmrphs0ramvcekv25rho3`
4. Click the **Edit** icon (pencil) next to it

### Step 3: Configure Authorized JavaScript Origins
In the **Authorized JavaScript origins** section, add:
```
http://localhost:3000
http://localhost:8080
```

**Why both?**
- `http://localhost:3000` - For frontend React app
- `http://localhost:8080` - For backend OAuth redirect (if using server-side OAuth flow)

### Step 4: Configure Authorized Redirect URIs
In the **Authorized redirect URIs** section, add:
```
http://localhost:3000/oauth2/callback
http://localhost:8080/login/oauth2/code/google
```

**Why both?**
- `http://localhost:3000/oauth2/callback` - Frontend callback route
- `http://localhost:8080/login/oauth2/code/google` - Backend Spring Security OAuth callback

### Step 5: Save Changes
1. Click **Save** at the bottom
2. Wait a few seconds for changes to propagate

### Step 6: Test
1. Restart your frontend (if running):
   ```bash
   # Stop the current server (Ctrl+C)
   # Then restart
   npm start
   ```

2. Try logging in with Google:
   - Click "Sign in with Google" button
   - Should redirect to Google login
   - After authentication, should return to your app

## 📋 Complete Configuration Checklist

- [ ] Google Cloud Console accessed
- [ ] OAuth Client ID found
- [ ] `http://localhost:3000` added to Authorized JavaScript origins
- [ ] `http://localhost:8080` added to Authorized JavaScript origins
- [ ] `http://localhost:3000/oauth2/callback` added to Authorized redirect URIs
- [ ] `http://localhost:8080/login/oauth2/code/google` added to Authorized redirect URIs
- [ ] Changes saved
- [ ] Frontend restarted
- [ ] Google login tested

## 🚨 Common Issues

### Issue: Still getting 403 error after configuration
**Solution:**
- Wait 1-2 minutes for Google's servers to update
- Clear browser cache
- Try in incognito/private window
- Verify you saved the changes in Google Console

### Issue: "Redirect URI mismatch"
**Solution:**
- Ensure the redirect URI in Google Console exactly matches what your app uses
- Check for trailing slashes (should match exactly)
- Verify the port numbers are correct

### Issue: "Invalid client ID"
**Solution:**
- Verify the client ID in `index.js` matches Google Console
- Check for any extra spaces or characters
- Ensure you're using the correct project in Google Console

## 🔒 Production Setup (For Later)

When deploying to production, you'll need to:
1. Add your production domain to Authorized JavaScript origins:
   ```
   https://yourdomain.com
   ```

2. Add production redirect URIs:
   ```
   https://yourdomain.com/oauth2/callback
   https://yourdomain.com/login/oauth2/code/google
   ```

3. Update the client ID in your production environment variables (don't hardcode it)

## 📝 Notes

- Changes in Google Cloud Console can take 1-2 minutes to propagate
- You can have multiple origins and redirect URIs
- The client secret is only needed on the backend (already configured)
- Never commit your client secret to public repositories

## ✅ Verification

After setup, you should see:
- ✅ No 403 errors in console
- ✅ Google login button works
- ✅ Redirects to Google login page
- ✅ Returns to app after authentication
- ✅ User is logged in successfully

If you still encounter issues after following these steps, check:
1. Browser console for specific error messages
2. Network tab to see the exact request/response
3. Backend logs for any authentication errors

