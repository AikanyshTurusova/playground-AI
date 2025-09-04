import { NextRequest, NextResponse } from 'next/server';
import { jiraClient } from '../../../../lib/jira';

export async function GET(request: NextRequest) {
  try {
    const projects = await jiraClient.getProjects();
    return NextResponse.json({ success: true, data: projects });
  } catch (error) {
    console.error('Error fetching Jira projects:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch Jira projects' },
      { status: 500 }
    );
  }
}

