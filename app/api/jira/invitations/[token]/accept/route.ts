import { NextRequest, NextResponse } from 'next/server';

// Store invitations in memory (in production, use a database)
const invitations = new Map<string, any>();
const teamMembers = new Map<string, any[]>();

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  try {
    const { token } = await params;
    const { email, role, projectKey } = await request.json();

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

    // Check if already accepted
    if (invitation.accepted) {
      return NextResponse.json(
        { success: false, error: 'Invitation already accepted' },
        { status: 400 }
      );
    }

    // Add member to team
    const projectMembers = teamMembers.get(projectKey) || [];
    const existingMember = projectMembers.find(m => m.email === email);

    if (!existingMember) {
      projectMembers.push({
        email,
        role,
        joinedAt: new Date().toISOString(),
        active: true,
      });
      teamMembers.set(projectKey, projectMembers);
    }

    // Mark invitation as accepted
    invitation.accepted = true;
    invitation.acceptedAt = new Date().toISOString();
    invitations.set(token, invitation);

    return NextResponse.json({
      success: true,
      data: {
        message: 'Invitation accepted successfully',
        projectKey,
        role,
      },
    });
  } catch (error) {
    console.error('Error accepting invitation:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to accept invitation' },
      { status: 500 }
    );
  }
}

