import { NextRequest, NextResponse } from 'next/server';
import { jiraClient, CreateIssueData } from '../../../../lib/jira';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const projectKey = searchParams.get('projectKey');
    const jql = searchParams.get('jql');

    const issues = await jiraClient.getIssues(projectKey || undefined, jql || undefined);
    return NextResponse.json({ success: true, data: issues });
  } catch (error) {
    console.error('Error fetching Jira issues:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch Jira issues' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const issueData: CreateIssueData = {
      projectKey: body.projectKey,
      summary: body.summary,
      description: body.description,
      issueType: body.issueType || 'Task',
      priority: body.priority,
      assignee: body.assignee,
    };

    const issue = await jiraClient.createIssue(issueData);
    return NextResponse.json({ success: true, data: issue });
  } catch (error) {
    console.error('Error creating Jira issue:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create Jira issue' },
      { status: 500 }
    );
  }
}

