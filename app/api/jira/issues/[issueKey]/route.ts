import { NextRequest, NextResponse } from 'next/server';
import { jiraClient } from '../../../../../lib/jira';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ issueKey: string }> }
) {
  try {
    const { issueKey } = await params;
    const issue = await jiraClient.getIssue(issueKey);
    return NextResponse.json({ success: true, data: issue });
  } catch (error) {
    console.error('Error fetching Jira issue:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch Jira issue' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ issueKey: string }> }
) {
  try {
    const { issueKey } = await params;
    const updateData = await request.json();

    console.log(`Updating issue ${issueKey} with data:`, updateData);
    
    const issue = await jiraClient.updateIssue(issueKey, updateData);
    return NextResponse.json({ success: true, data: issue });
  } catch (error) {
    console.error('Error updating Jira issue:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update Jira issue' },
      { status: 500 }
    );
  }
}
