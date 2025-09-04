import { NextRequest, NextResponse } from 'next/server';
import { jiraClient } from '../../../../lib/jira';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const projectKey = searchParams.get('projectKey');

    if (!projectKey) {
      return NextResponse.json(
        { success: false, error: 'Project key is required' },
        { status: 400 }
      );
    }

    const issueTypes = await jiraClient.getIssueTypes(projectKey);
    return NextResponse.json({ success: true, data: issueTypes });
  } catch (error) {
    console.error('Error fetching issue types:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch issue types' },
      { status: 500 }
    );
  }
}

