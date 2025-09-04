import { NextRequest, NextResponse } from 'next/server';
import { google } from 'googleapis';

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');
    const error = searchParams.get('error');

    if (error) {
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_APP_URL}/video-meetings?error=${encodeURIComponent(error)}`
      );
    }

    if (!code) {
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_APP_URL}/video-meetings?error=no_code`
      );
    }

    // Exchange authorization code for tokens
    const { tokens } = await oauth2Client.getToken(code);
    
    if (!tokens.access_token) {
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_APP_URL}/video-meetings?error=no_access_token`
      );
    }

    // Get user info
    const oauth2 = google.oauth2({ version: 'v2', auth: oauth2Client });
    oauth2Client.setCredentials(tokens);
    
    const userInfo = await oauth2.userinfo.get();
    
    // Store tokens securely (in production, use secure session management)
    const tokenData = {
      access_token: tokens.access_token,
      refresh_token: tokens.refresh_token,
      scope: tokens.scope,
      token_type: tokens.token_type,
      expiry_date: tokens.expiry_date,
      user_email: userInfo.data.email,
      user_name: userInfo.data.name
    };

    // Redirect back to video meetings with success and token data
    const successUrl = `${process.env.NEXT_PUBLIC_APP_URL}/video-meetings?success=true&tokens=${encodeURIComponent(JSON.stringify(tokenData))}`;
    
    return NextResponse.redirect(successUrl);

  } catch (error) {
    console.error('Google OAuth callback error:', error);
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_APP_URL}/video-meetings?error=auth_failed`
    );
  }
}


