import { NextRequest, NextResponse } from 'next/server';
import { jiraClient } from '../../../../lib/jira';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('query') || '';

    const users = await jiraClient.getUsers(query);
    return NextResponse.json({ success: true, data: users });
  } catch (error) {
    console.error('Error fetching Jira users:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch Jira users' },
      { status: 500 }
    );
  }
}

