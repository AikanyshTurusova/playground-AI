import { NextRequest, NextResponse } from 'next/server';
import { jiraClient } from '../../../../../lib/jira';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');

    if (!email) {
      return NextResponse.json(
        { success: false, error: 'Email required' },
        { status: 400 }
      );
    }

    // Get all issues and filter by assignee
    const issues = await jiraClient.getIssues('MDP'); // Default project
    const assignedTasks = issues.filter(issue => 
      issue.assignee && issue.assignee.emailAddress === email
    );

    return NextResponse.json({
      success: true,
      data: assignedTasks,
    });
  } catch (error) {
    console.error('Error fetching member tasks:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch member tasks' },
      { status: 500 }
    );
  }
}
