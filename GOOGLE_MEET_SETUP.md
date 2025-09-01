# 🚀 Google Meet API Setup Guide

## 📋 Prerequisites
- Google account with Google Workspace (recommended) or regular Gmail
- Node.js and npm installed
- Basic understanding of APIs and OAuth

## 🎯 What You'll Get
- ✅ Create Google Meet meetings programmatically
- ✅ Integrate with Google Calendar
- ✅ Schedule meetings with attendees
- ✅ Professional video meeting experience
- ✅ Full API control over meetings

## 🔧 Step-by-Step Setup

### Step 1: Google Cloud Console Setup

1. **Go to Google Cloud Console**
   ```
   https://console.cloud.google.com/
   ```

2. **Create New Project**
   - Click project dropdown → "New Project"
   - Name: `playground-ai-meetings`
   - Click "Create"

3. **Enable Billing**
   - Left sidebar → "Billing"
   - Link billing account (required for API usage)

### Step 2: Enable Required APIs

1. **Go to APIs & Services → Library**
2. **Enable these APIs:**
   - **Google Calendar API** (required for Meet)
   - **Google+ API** (for user info)
   - **Google Meet API** (if available)

3. **For each API:**
   - Search by name
   - Click "Enable"

### Step 3: Create OAuth 2.0 Credentials

1. **Go to APIs & Services → OAuth consent screen**
2. **Choose User Type:**
   - **External** (if you want anyone to use it)
   - **Internal** (if only your organization)

3. **Fill in App Information:**
   ```
   App name: Playground AI Video Meetings
   User support email: [your-email]
   Developer contact: [your-email]
   ```

4. **Add Scopes:**
   ```
   https://www.googleapis.com/auth/calendar
   https://www.googleapis.com/auth/calendar.events
   https://www.googleapis.com/auth/userinfo.email
   ```

5. **Add Test Users** (if external):
   - Add your email and any test users

6. **Go to Credentials → Create Credentials → OAuth 2.0 Client IDs**
7. **Choose Application Type: Web application**
8. **Add Authorized Redirect URIs:**
   ```
   http://localhost:3002/api/auth/google/callback
   http://localhost:3000/api/auth/google/callback
   ```

9. **Copy Client ID and Client Secret**

### Step 4: Create Service Account (Optional - for Server-to-Server)

1. **Go to Credentials → Create Credentials → Service Account**
2. **Fill in details:**
   ```
   Name: playground-meetings-service
   Description: Service account for Google Meet integration
   ```

3. **Grant permissions:**
   - Role: `Editor`
   - Click "Continue" → "Done"

4. **Create API Key:**
   - Click on service account
   - "Keys" tab → "Add Key" → "Create New Key"
   - Choose "JSON"
   - Download JSON file

### Step 5: Install Dependencies

```bash
npm install googleapis @google-cloud/local-auth
npm install @types/google-auth-library --save-dev
```

### Step 6: Environment Variables

Create `.env.local` file:

```env
# Google OAuth2
GOOGLE_CLIENT_ID=your_oauth_client_id_here
GOOGLE_CLIENT_SECRET=your_oauth_client_secret_here
GOOGLE_REDIRECT_URI=http://localhost:3002/api/auth/google/callback

# Google Service Account (optional)
GOOGLE_SERVICE_ACCOUNT_EMAIL=your_service_account_email
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
GOOGLE_PROJECT_ID=your_project_id

# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3002
```

### Step 7: Test the Integration

1. **Start your development server:**
   ```bash
   npm run dev
   ```

2. **Go to:** `http://localhost:3002/video-meetings`

3. **Select Google Meet platform**

4. **Click "Connect Google Account"**

5. **Authorize your app**

6. **Create a test meeting**

## 🔍 Troubleshooting

### Common Issues:

1. **"redirect_uri_mismatch"**
   - Check your redirect URI in Google Cloud Console
   - Ensure it matches exactly with your app

2. **"access_denied"**
   - Check OAuth consent screen settings
   - Ensure scopes are properly configured

3. **"quota_exceeded"**
   - Check billing is enabled
   - Monitor API usage in Google Cloud Console

4. **"invalid_grant"**
   - Tokens may have expired
   - Re-authenticate user

### API Quotas & Limits:

- **Calendar API:** 1,000,000 requests/day
- **Google Meet:** Varies by plan
- **OAuth:** 100 requests/100 seconds/user

## 🚀 Production Deployment

### 1. Update Redirect URIs:
```
https://yourdomain.com/api/auth/google/callback
```

### 2. Set Production Environment Variables:
```env
GOOGLE_REDIRECT_URI=https://yourdomain.com/api/auth/google/callback
NEXT_PUBLIC_APP_URL=https://yourdomain.com
```

### 3. Security Considerations:
- Store tokens securely (use secure sessions)
- Implement token refresh logic
- Add rate limiting
- Use HTTPS in production

## 📚 API Endpoints

### Available Actions:

1. **Create Meeting:**
   ```json
   POST /api/google-meet
   {
     "action": "create_meeting",
     "accessToken": "user_access_token",
     "meetingData": {
       "summary": "Team Meeting",
       "description": "Weekly team sync",
       "startTime": "2024-01-15T10:00:00Z",
       "endTime": "2024-01-15T11:00:00Z",
       "attendees": ["user1@example.com", "user2@example.com"]
     }
   }
   ```

2. **Get Calendars:**
   ```json
   POST /api/google-meet
   {
     "action": "get_calendars",
     "accessToken": "user_access_token"
   }
   ```

3. **Get Meetings:**
   ```json
   POST /api/google-meet
   {
     "action": "get_meetings",
     "accessToken": "user_access_token"
   }
   ```

4. **Get Auth URL:**
   ```
   GET /api/google-meet?action=auth_url
   ```

## 🎉 What You Can Do Now

- ✅ **Create Google Meet meetings** with full details
- ✅ **Schedule meetings** with start/end times
- ✅ **Add attendees** by email
- ✅ **Integrate with Google Calendar**
- ✅ **View upcoming meetings**
- ✅ **Join meetings directly** from your app

## 🔗 Useful Links

- [Google Cloud Console](https://console.cloud.google.com/)
- [Google Calendar API Docs](https://developers.google.com/calendar/api)
- [Google Meet API Docs](https://developers.google.com/meet/api)
- [OAuth 2.0 Playground](https://developers.google.com/oauthplayground/)

## 💡 Pro Tips

1. **Use Google Workspace** for better meeting features
2. **Implement token refresh** for long-running sessions
3. **Add error handling** for network issues
4. **Cache calendar data** to reduce API calls
5. **Monitor API usage** to stay within quotas

---

**Need Help?** Check the troubleshooting section or review the API documentation links above.
