import { NextRequest, NextResponse } from 'next/server';
import { google } from 'googleapis';

// Google OAuth2 configuration
const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);

// Google Calendar API instance
const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

export async function POST(request: NextRequest) {
  try {
    const { action, accessToken, meetingData } = await request.json();

    if (!accessToken) {
      return NextResponse.json({ error: 'Access token required' }, { status: 400 });
    }

    // Set the access token
    oauth2Client.setCredentials({ access_token: accessToken });

    switch (action) {
      case 'create_meeting':
        return await createGoogleMeet(meetingData);
      
      case 'get_calendars':
        return await getCalendars();
      
      case 'get_meetings':
        return await getMeetings();
      
      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }
  } catch (error) {
    console.error('Google Meet API Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// Create a Google Meet meeting
async function createGoogleMeet(meetingData: any) {
  try {
    const {
      summary,
      description,
      startTime,
      endTime,
      attendees,
      timeZone = 'UTC'
    } = meetingData;

    const event = {
      summary,
      description,
      start: {
        dateTime: startTime,
        timeZone,
      },
      end: {
        dateTime: endTime,
        timeZone,
      },
      attendees: attendees?.map((email: string) => ({ email })) || [],
      conferenceData: {
        createRequest: {
          requestId: `meet-${Date.now()}`,
          conferenceSolutionKey: {
            type: 'hangoutsMeet'
          }
        }
      }
    };

    const response = await calendar.events.insert({
      calendarId: 'primary',
      requestBody: event,
      conferenceDataVersion: 1,
    });

    const meeting = response.data;
    
    return NextResponse.json({
      success: true,
      meeting: {
        id: meeting.id,
        summary: meeting.summary,
        start: meeting.start,
        end: meeting.end,
        meetLink: meeting.conferenceData?.entryPoints?.[0]?.uri,
        calendarLink: meeting.htmlLink,
        attendees: meeting.attendees,
        hangoutLink: meeting.hangoutLink
      }
    });
  } catch (error) {
    console.error('Error creating meeting:', error);
    return NextResponse.json({ error: 'Failed to create meeting' }, { status: 500 });
  }
}

// Get user's calendars
async function getCalendars() {
  try {
    const response = await calendar.calendarList.list();
    
    return NextResponse.json({
      success: true,
      calendars: response.data.items?.map(cal => ({
        id: cal.id,
        summary: cal.summary,
        primary: cal.primary,
        accessRole: cal.accessRole
      })) || []
    });
  } catch (error) {
    console.error('Error getting calendars:', error);
    return NextResponse.json({ error: 'Failed to get calendars' }, { status: 500 });
  }
}

// Get upcoming meetings
async function getMeetings() {
  try {
    const now = new Date();
    const oneWeekFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

    const response = await calendar.events.list({
      calendarId: 'primary',
      timeMin: now.toISOString(),
      timeMax: oneWeekFromNow.toISOString(),
      singleEvents: true,
      orderBy: 'startTime',
      maxResults: 10
    });

    return NextResponse.json({
      success: true,
      meetings: response.data.items?.map(meeting => ({
        id: meeting.id,
        summary: meeting.summary,
        start: meeting.start,
        end: meeting.end,
        meetLink: meeting.conferenceData?.entryPoints?.[0]?.uri,
        calendarLink: meeting.htmlLink,
        hangoutLink: meeting.hangoutLink
      })) || []
    });
  } catch (error) {
    console.error('Error getting meetings:', error);
    return NextResponse.json({ error: 'Failed to get meetings' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');

    if (action === 'auth_url') {
      const authUrl = oauth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: [
          'https://www.googleapis.com/auth/calendar',
          'https://www.googleapis.com/auth/calendar.events',
          'https://www.googleapis.com/auth/userinfo.email'
        ],
        prompt: 'consent'
      });

      return NextResponse.json({ authUrl });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    console.error('Google Meet API Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
