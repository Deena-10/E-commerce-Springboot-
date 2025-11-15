# Troubleshooting Guide - Fixed Issues

## Issues Fixed

### 1. ✅ JSON Parsing Errors
**Problem**: Console errors like `SyntaxError: Unexpected token 'w', "window.ses"... is not valid JSON`

**Solution**: 
- Added error handling for external scripts (Razorpay, Google OAuth)
- Improved JWT token decoding in OAuthCallback with proper validation
- Added error handler for Razorpay script loading

**Status**: Fixed - These errors were from external scripts trying to parse HTML responses. They're now handled gracefully.

### 2. ✅ 401 Unauthorized Login Error
**Problem**: Login requests returning 401 with unclear error messages

**Solution**:
- **Backend**: Improved error handling in `AuthController.login()` to return proper error messages:
  - Returns "Invalid email or password" for wrong credentials
  - Returns "Please verify your email first" for unverified users
  - Handles authentication exceptions properly
- **Frontend**: Enhanced error handling in `LoginPage.jsx` to:
  - Parse different error response formats (string, object, etc.)
  - Show user-friendly error messages
  - Handle network errors gracefully

**Status**: Fixed - Login errors now show clear, actionable messages.

### 3. ⚠️ Google OAuth 403 Error
**Problem**: `[GSI_LOGGER]: The given origin is not allowed for the given client ID`

**Solution**: 
- Updated error message to guide users
- This requires configuration in Google Cloud Console

**Action Required**: 
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Navigate to **APIs & Services** → **Credentials**
3. Find your OAuth 2.0 Client ID: `817733173307-95opkpfgelnnmrphs0ramvcekv25rho3`
4. Click **Edit**
5. Under **Authorized JavaScript origins**, add:
   - `http://localhost:3000`
   - `http://localhost:8080` (if using OAuth redirect)
6. Under **Authorized redirect URIs**, add:
   - `http://localhost:3000/oauth2/callback`
   - `http://localhost:8080/login/oauth2/code/google`
7. Click **Save**

**Status**: Partially fixed - Code updated, but requires Google Console configuration.

## Testing the Fixes

### Test Login
1. **Start the backend**:
   ```bash
   cd Ecom
   mvn spring-boot:run
   ```

2. **Start the frontend**:
   ```bash
   cd frontend-ecommerce
   npm start
   ```

3. **Test login with different scenarios**:
   - Valid credentials → Should login successfully
   - Invalid email → Should show "Invalid email or password"
   - Wrong password → Should show "Invalid email or password"
   - Unverified user → Should show "Please verify your email first" and redirect to verification page
   - Non-existent user → Should show "Invalid email or password"

### Test Google OAuth
1. After configuring Google Console (see above)
2. Click "Sign in with Google" button
3. Should redirect to Google login
4. After authentication, should return to app and log you in

## Common Issues & Solutions

### Backend Not Running
**Error**: `Cannot connect to server` or `Connection refused`

**Solution**: 
- Ensure backend is running on `http://localhost:8080`
- Check if port 8080 is available
- Verify MySQL database is running and accessible

### Database Connection Error
**Error**: Backend fails to start with database errors

**Solution**:
- Ensure MySQL is running
- Verify database `shoppino` exists
- Check credentials in `Ecom/src/main/resources/application.properties`

### User Not Verified
**Error**: "Please verify your email first"

**Solution**:
- Check your email for verification code
- Go to `/verify` page and enter the code
- Or use "Resend Code" option

### CORS Errors
**Error**: CORS policy blocking requests

**Solution**: 
- Backend CORS is configured for `http://localhost:3000`
- If using different port, update `SecurityConfig.java` CORS configuration

## Files Modified

### Frontend
- `frontend-ecommerce/src/Pages/Auth/LoginPage.jsx` - Enhanced error handling
- `frontend-ecommerce/src/Api/axiosInstance.js` - Improved error interception
- `frontend-ecommerce/src/Components/OAuthCallback.jsx` - Better JWT decoding
- `frontend-ecommerce/public/index.html` - Added error handler for Razorpay script

### Backend
- `Ecom/src/main/java/demo/webproject/controller/AuthController.java` - Improved login error handling

## Next Steps

1. ✅ **Fixed**: JSON parsing errors
2. ✅ **Fixed**: 401 login error handling
3. ⚠️ **Action Required**: Configure Google OAuth in Google Cloud Console
4. ✅ **Fixed**: Error messages now user-friendly

If you encounter any other issues, check the browser console and backend logs for detailed error messages.

