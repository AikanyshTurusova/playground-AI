import { NextRequest, NextResponse } from 'next/server';
import { jiraClient } from '../../../../../lib/jira';

// Store invitations in memory (in production, use a database)
const invitations = new Map<string, any>();

export async function POST(request: NextRequest) {
  try {
    const { email, role, projectKey, inviterName } = await request.json();

    if (!email || !role || !projectKey || !inviterName) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Generate a unique invitation token
    const token = Math.random().toString(36).substring(2, 15) + 
                  Math.random().toString(36).substring(2, 15);

    // Store invitation
    invitations.set(token, {
      email,
      role,
      projectKey,
      inviterName,
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days
      accepted: false,
    });

    // In a real implementation, you would send an email here
    const inviteUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/jira/invite/${token}`;

    return NextResponse.json({
      success: true,
      data: {
        token,
        inviteUrl,
        message: `Invitation sent to ${email}`,
      },
    });
  } catch (error) {
    console.error('Error creating invitation:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create invitation' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');

    if (!token) {
      return NextResponse.json(
        { success: false, error: 'Token required' },
        { status: 400 }
      );
    }

    const invitation = invitations.get(token);

    if (!invitation) {
      return NextResponse.json(
        { success: false, error: 'Invitation not found' },
        { status: 404 }
      );
    }

    // Check if invitation has expired
    if (new Date() > new Date(invitation.expiresAt)) {
      invitations.delete(token);
      return NextResponse.json(
        { success: false, error: 'Invitation has expired' },
        { status: 410 }
      );
    }

    return NextResponse.json({
      success: true,
      data: invitation,
    });
  } catch (error) {
    console.error('Error fetching invitation:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch invitation' },
      { status: 500 }
    );
  }
}
