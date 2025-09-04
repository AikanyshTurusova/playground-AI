'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Navigation from '../../../components/Navigation';

interface InvitationData {
  email: string;
  role: string;
  projectKey: string;
  inviterName: string;
  valid: boolean;
}

export default function AcceptInvitation() {
  const params = useParams();
  const token = params.token as string;
  const [invitation, setInvitation] = useState<InvitationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [accepting, setAccepting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (token) {
      loadInvitation(token);
    }
  }, [token]);

  const loadInvitation = async (inviteToken: string) => {
    try {
      const response = await fetch(`/api/jira/invitations/${inviteToken}`);
      const data = await response.json();
      
      if (data.success) {
        setInvitation(data.data);
      } else {
        setError(data.error || 'Invalid invitation');
      }
    } catch (error) {
      setError('Failed to load invitation');
    } finally {
      setLoading(false);
    }
  };

  const acceptInvitation = async () => {
    if (!invitation) return;

    setAccepting(true);
    try {
      const response = await fetch(`/api/jira/invitations/${token}/accept`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: invitation.email,
          role: invitation.role,
          projectKey: invitation.projectKey,
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        alert('Invitation accepted! You can now access the project.');
        // Redirect to the project
        window.location.href = `/jira?project=${invitation.projectKey}`;
      } else {
        setError(data.error || 'Failed to accept invitation');
      }
    } catch (error) {
      setError('Failed to accept invitation');
    } finally {
      setAccepting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
        <Navigation />
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-white text-lg">Loading invitation...</div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !invitation) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
        <Navigation />
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-md mx-auto bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center">
            <div className="text-red-400 text-lg mb-4">❌ Invalid Invitation</div>
            <p className="text-blue-200 mb-4">
              {error || 'This invitation link is invalid or has expired.'}
            </p>
            <a
              href="/jira"
              className="bg-teal-600 hover:bg-teal-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors"
            >
              Go to Dashboard
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto bg-white/10 backdrop-blur-sm rounded-xl p-6">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-teal-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">Team Invitation</h1>
            <p className="text-blue-200">You've been invited to join a project team</p>
          </div>

          <div className="space-y-4 mb-6">
            <div className="bg-white/5 rounded-lg p-4">
              <div className="text-sm text-blue-200 mb-1">Invited by</div>
              <div className="text-white font-medium">{invitation.inviterName}</div>
            </div>
            
            <div className="bg-white/5 rounded-lg p-4">
              <div className="text-sm text-blue-200 mb-1">Your email</div>
              <div className="text-white font-medium">{invitation.email}</div>
            </div>
            
            <div className="bg-white/5 rounded-lg p-4">
              <div className="text-sm text-blue-200 mb-1">Role</div>
              <div className="text-white font-medium capitalize">{invitation.role}</div>
            </div>
            
            <div className="bg-white/5 rounded-lg p-4">
              <div className="text-sm text-blue-200 mb-1">Project</div>
              <div className="text-white font-medium">{invitation.projectKey}</div>
            </div>
          </div>

          <div className="space-y-3">
            <button
              onClick={acceptInvitation}
              disabled={accepting}
              className="w-full bg-teal-600 hover:bg-teal-700 disabled:bg-gray-400 text-white py-3 rounded-lg font-semibold transition-colors"
            >
              {accepting ? 'Accepting...' : 'Accept Invitation'}
            </button>
            
            <a
              href="/jira"
              className="block w-full text-center text-blue-200 hover:text-white transition-colors py-2"
            >
              Decline and go to dashboard
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

