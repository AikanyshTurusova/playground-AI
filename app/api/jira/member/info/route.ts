import { NextRequest, NextResponse } from 'next/server';

// Store team members in memory (in production, use a database)
const teamMembers = new Map<string, any[]>();

export async function GET(request: NextRequest) {
  try {
    // In a real implementation, you would get this from authentication/session
    // For demo purposes, we'll return a mock member
    const mockMember = {
      email: 'aikanyshmairambekovna03@gmail.com',
      role: 'admin',
      projectKey: 'MDP',
      active: true,
    };

    return NextResponse.json({
      success: true,
      data: mockMember,
    });
  } catch (error) {
    console.error('Error fetching member info:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch member info' },
      { status: 500 }
    );
  }
}

