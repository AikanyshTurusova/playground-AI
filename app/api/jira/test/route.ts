import { NextRequest, NextResponse } from 'next/server';
import { jiraClient } from '../../../../lib/jira';

export async function GET(request: NextRequest) {
  try {
    const isConnected = await jiraClient.testConnection();
    
    if (isConnected) {
      return NextResponse.json({ 
        success: true, 
        message: 'Jira connection successful',
        connected: true 
      });
    } else {
      return NextResponse.json({ 
        success: false, 
        message: 'Jira connection failed',
        connected: false 
      }, { status: 500 });
    }
  } catch (error) {
    console.error('Error testing Jira connection:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to test Jira connection',
        connected: false 
      },
      { status: 500 }
    );
  }
}

