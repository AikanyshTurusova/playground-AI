import { NextRequest, NextResponse } from 'next/server';
import { jiraClient } from '../../../../lib/jira';

export async function GET(request: NextRequest) {
  try {
    const priorities = await jiraClient.getPriorities();
    return NextResponse.json({ success: true, data: priorities });
  } catch (error) {
    console.error('Error fetching priorities:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch priorities' },
      { status: 500 }
    );
  }
}

