'use client';

import { useState, useEffect } from 'react';
import Navigation from '../../components/Navigation';

interface TeamMember {
  accountId: string;
  displayName: string;
  emailAddress: string;
  active: boolean;
}

export default function TeamManagement() {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('member');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadTeamMembers();
  }, []);

  const loadTeamMembers = async () => {
    try {
      const response = await fetch('/api/jira/users');
      const data = await response.json();
      
      if (data.success) {
        setTeamMembers(data.data);
      }
    } catch (error) {
      console.error('Failed to load team members:', error);
    } finally {
      setLoading(false);
    }
  };

  const inviteMember = async () => {
    if (!inviteEmail) return;

    try {
      const response = await fetch('/api/jira/invitations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: inviteEmail,
          role: inviteRole,
          projectKey: 'MDP', // Default project for now
          inviterName: 'Aikanysh Turusova', // Current user
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        // Add to local team members list
        const newMember: TeamMember = {
          accountId: `invited-${Date.now()}`,
          displayName: inviteEmail.split('@')[0],
          emailAddress: inviteEmail,
          active: false, // Pending invitation
        };

        setTeamMembers([...teamMembers, newMember]);
        setShowInviteModal(false);
        setInviteEmail('');
        
        // Show success message with invitation link
        alert(`Invitation sent to ${inviteEmail}!\n\nInvitation Link: ${data.data.inviteUrl}`);
      } else {
        alert(data.error || 'Failed to send invitation');
      }
    } catch (error) {
      console.error('Failed to invite member:', error);
      alert('Failed to send invitation');
    }
  };

  const filteredMembers = teamMembers.filter(member =>
    member.displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    member.emailAddress.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
        <Navigation />
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-white text-lg">Loading team members...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Team Management</h1>
            <p className="text-blue-200">Manage your team members and invite new collaborators</p>
          </div>
          <button
            onClick={() => setShowInviteModal(true)}
            className="bg-teal-600 hover:bg-teal-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
          >
            Invite Member
          </button>
        </div>

        {/* Team Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white/10 rounded-lg p-6 text-center">
            <div className="text-3xl font-bold text-white">{teamMembers.length}</div>
            <div className="text-blue-200">Total Members</div>
          </div>
          <div className="bg-white/10 rounded-lg p-6 text-center">
            <div className="text-3xl font-bold text-white">
              {teamMembers.filter(m => m.active).length}
            </div>
            <div className="text-blue-200">Active Members</div>
          </div>
          <div className="bg-white/10 rounded-lg p-6 text-center">
            <div className="text-3xl font-bold text-white">
              {teamMembers.filter(m => !m.active).length}
            </div>
            <div className="text-blue-200">Pending Invitations</div>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 mb-6">
          <div className="flex items-center space-x-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search team members..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
          </div>
        </div>

        {/* Team Members List */}
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
          <h2 className="text-xl font-semibold text-white mb-4">Team Members</h2>
          
          {filteredMembers.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-blue-200">No team members found.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredMembers.map((member) => (
                <div key={member.accountId} className="bg-white/5 border border-white/10 rounded-lg p-4 hover:bg-white/10 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-teal-600 rounded-full flex items-center justify-center">
                        <span className="text-white font-semibold">
                          {member.displayName.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <h3 className="text-white font-medium">{member.displayName}</h3>
                        <p className="text-blue-200 text-sm">{member.emailAddress}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        member.active 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {member.active ? 'Active' : 'Pending'}
                      </span>
                      <button className="text-blue-200 hover:text-white transition-colors">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Invite Member Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Invite Team Member</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                <input
                  type="email"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  placeholder="colleague@company.com"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                <select
                  value={inviteRole}
                  onChange={(e) => setInviteRole(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
                >
                  <option value="member">Team Member</option>
                  <option value="admin">Project Admin</option>
                  <option value="viewer">Viewer</option>
                </select>
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowInviteModal(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={inviteMember}
                disabled={!inviteEmail}
                className="bg-teal-600 hover:bg-teal-700 disabled:bg-gray-400 text-white px-6 py-2 rounded-lg font-semibold transition-colors"
              >
                Send Invitation
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
