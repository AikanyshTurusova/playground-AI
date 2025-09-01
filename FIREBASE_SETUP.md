# Firebase + Clerk Setup Guide

## Environment Variables Setup

Create a `.env.local` file in your project root with the following variables:

```bash
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyClLL0fNctKE5c0SVuanx49I-xKND81q1w
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=playground-ai-4c752.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=playground-ai-4c752
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=playground-ai-4c752.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=862885326777
NEXT_PUBLIC_FIREBASE_APP_ID=1:862885326777:web:6ff8f70d2b8ede95091068
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-9496L1LJT9

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_aGVscGVkLWxhZHliaXJkLTQxLmNsZXJrLmFjY291bnRzLmRldiQ
CLERK_SECRET_KEY=sk_test_P6YnZAce9TajnPcRColLgYM4VOZaB5GQyiSBxSnnHF
```

## Usage

### Firebase Services
```typescript
import { app, analytics } from './firebase';
import { auth, db, storage } from './firebase/utils';
```

### Clerk Authentication
```typescript
import { useUser, SignInButton, SignUpButton, UserButton } from '@clerk/nextjs';
import { auth } from '@clerk/nextjs/server';

// Client-side user info
const { isSignedIn, user } = useUser();

// Server-side authentication check
const { userId } = await auth();
```

## Security Notes

- The `NEXT_PUBLIC_` prefix makes these variables available in the browser
- Never commit `.env.local` to version control
- Add `.env.local` to your `.gitignore` file
- For production, set these variables in your hosting platform's environment settings

## Available Services

### Firebase
- **Analytics**: Automatically initialized for client-side usage
- **App**: Core Firebase app instance for other services
- **Authentication**: Ready to use with `auth` from utils
- **Firestore**: Ready to use with `db` from utils
- **Storage**: Ready to use with `storage` from utils

### Clerk
- **User Authentication**: Sign in/up with email, social providers
- **User Management**: User profiles, sessions, and metadata
- **Protected Routes**: Middleware-based route protection
- **Webhooks**: Handle authentication events

## Project Structure

```
app/
├── firebase.ts              # Main Firebase configuration
├── firebase/
│   └── utils.ts            # Firebase service utilities
├── components/
│   └── FirebaseExample.tsx # Example usage component
├── dashboard/
│   └── page.tsx            # Protected dashboard page
├── api/webhook/clerk/      # Clerk webhook endpoint
│   └── route.ts
└── layout.tsx              # Root layout with ClerkProvider

middleware.ts                # Clerk authentication middleware
```

## Authentication Flow

1. **Public Routes**: Homepage with sign in/up buttons
2. **Protected Routes**: Dashboard requires authentication
3. **User State**: Clerk manages user sessions automatically
4. **Firebase Integration**: Use Clerk user ID with Firebase services

## Next Steps

1. Test authentication flow (sign up, sign in, dashboard access)
2. Connect Firebase with Clerk user IDs for user-specific data
3. Implement role-based access control
4. Add user profile management features
5. Set up Clerk webhooks in your dashboard
