'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface GoogleTokens {
  access_token: string;
  refresh_token: string;
  scope: string;
  token_type: string;
  expiry_date: number;
  user_email: string;
  user_name: string;
}

interface GoogleMeeting {
  id: string;
  summary: string;
  start: {
    dateTime: string;
    timeZone: string;
  };
  end: {
    dateTime: string;
    timeZone: string;
  };
  meetLink: string;
  calendarLink: string;
  hangoutLink: string;
}

export default function VideoMeetingsPage() {
  const [meetingId, setMeetingId] = useState('');
  const [isInMeeting, setIsInMeeting] = useState(false);
  const [meetingName, setMeetingName] = useState('');
  const [meetingType, setMeetingType] = useState('jitsi'); // jitsi, google, teams
  const [meetingUrl, setMeetingUrl] = useState('');
  
  // Google Meet states
  const [googleTokens, setGoogleTokens] = useState<GoogleTokens | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [googleMeetings, setGoogleMeetings] = useState<GoogleMeeting[]>([]);
  
  // Meeting form states
  const [meetingForm, setMeetingForm] = useState({
    summary: '',
    description: '',
    startTime: '',
    endTime: '',
    attendees: '',
    timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
  });

  // Check for tokens in URL on component mount
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const tokensParam = urlParams.get('tokens');
    const success = urlParams.get('success');
    
    if (success === 'true' && tokensParam) {
      try {
        const tokens = JSON.parse(decodeURIComponent(tokensParam));
        setGoogleTokens(tokens);
        setIsAuthenticated(true);
        
        // Clear URL parameters
        window.history.replaceState({}, document.title, window.location.pathname);
        
        // Load user's meetings
        loadGoogleMeetings(tokens.access_token);
      } catch (error) {
        console.error('Error parsing tokens:', error);
      }
    }
  }, []);

  // Generate a random meeting ID
  const generateMeetingId = () => {
    const id = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    setMeetingId(id);
  };

  // Google Meet authentication
  const authenticateWithGoogle = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/google-meet?action=auth_url');
      const data = await response.json();
      
      if (data.authUrl) {
        window.location.href = data.authUrl;
      }
    } catch (error) {
      console.error('Error getting auth URL:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Load Google Meet meetings
  const loadGoogleMeetings = async (accessToken: string) => {
    try {
      const response = await fetch('/api/google-meet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'get_meetings',
          accessToken
        })
      });
      
      const data = await response.json();
      if (data.success) {
        setGoogleMeetings(data.meetings);
      }
    } catch (error) {
      console.error('Error loading meetings:', error);
    }
  };

  // Create Google Meet meeting
  const createGoogleMeetMeeting = async () => {
    if (!googleTokens?.access_token) return;
    
    try {
      setIsLoading(true);
      
      const meetingData = {
        ...meetingForm,
        startTime: new Date(meetingForm.startTime).toISOString(),
        endTime: new Date(meetingForm.endTime).toISOString(),
        attendees: meetingForm.attendees.split(',').map(email => email.trim()).filter(Boolean)
      };
      
      const response = await fetch('/api/google-meet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'create_meeting',
          accessToken: googleTokens.access_token,
          meetingData
        })
      });
      
      const data = await response.json();
      if (data.success) {
        // Open the meeting in a new tab
        window.open(data.meeting.meetLink, '_blank');
        
        // Reset form
        setMeetingForm({
          summary: '',
          description: '',
          startTime: '',
          endTime: '',
          attendees: '',
          timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
        });
        
        // Reload meetings
        loadGoogleMeetings(googleTokens.access_token);
      }
    } catch (error) {
      console.error('Error creating meeting:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Create meeting based on type
  const createMeeting = () => {
    if (meetingType === 'google' && !isAuthenticated) {
      authenticateWithGoogle();
      return;
    }
    
    if (meetingType === 'google' && isAuthenticated) {
      // Show Google Meet form
      return;
    }
    
    generateMeetingId();
    setMeetingName('My Meeting');
    
    switch (meetingType) {
      case 'teams':
        // Microsoft Teams - direct link
        setMeetingUrl(`https://teams.microsoft.com/l/meetup-join/19:meeting_${meetingId}@thread.v2/0?context={"Tid":"","Oid":""}`);
        break;
      default:
        // Jitsi - embed in our app
        setMeetingUrl('');
        setIsInMeeting(true);
        return;
    }
    
    // For Teams, open in new tab
    if (meetingUrl) {
      window.open(meetingUrl, '_blank');
    }
  };

  // Join meeting
  const joinMeeting = () => {
    if (meetingId.trim()) {
      if (meetingType === 'jitsi') {
        setIsInMeeting(true);
      } else {
        // For Teams, open in new tab
        window.open(meetingUrl, '_blank');
      }
    }
  };

  // Leave meeting
  const leaveMeeting = () => {
    setIsInMeeting(false);
    setMeetingId('');
    setMeetingName('');
    setMeetingUrl('');
  };

  useEffect(() => {
    generateMeetingId();
  }, []);

  if (isInMeeting && meetingType === 'jitsi') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-emerald-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
          {/* Meeting Header */}
          <div className="bg-white/90 backdrop-blur-md p-6 rounded-3xl shadow-2xl border-2 border-slate-200 mb-8">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold text-slate-800">Jitsi Video Meeting</h1>
                <p className="text-slate-600 mt-2">Meeting ID: {meetingId}</p>
                {meetingName && <p className="text-slate-600">Name: {meetingName}</p>}
              </div>
              <div className="flex space-x-4">
                <button
                  onClick={leaveMeeting}
                  className="px-6 py-3 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  Leave Meeting
                </button>
                <Link
                  href="/video-meetings"
                  className="px-6 py-3 bg-slate-600 text-white font-bold rounded-xl hover:bg-slate-700 transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  Back to Meetings
                </Link>
              </div>
            </div>
          </div>

          {/* Jitsi Meeting Container */}
          <div className="bg-white/90 backdrop-blur-md p-6 rounded-3xl shadow-2xl border-2 border-slate-200">
            <div className="w-full h-[600px] rounded-2xl overflow-hidden">
              <iframe
                src={`https://meet.jit.si/${meetingId}#userInfo.displayName=${encodeURIComponent(meetingName || 'User')}`}
                width="100%"
                height="100%"
                frameBorder="0"
                allow="camera; microphone; fullscreen; speaker; display-capture; autoplay; clipboard-read; clipboard-write"
                title="Video Meeting"
              />
            </div>
          </div>

          {/* Meeting Controls */}
          <div className="bg-white/90 backdrop-blur-md p-6 rounded-3xl shadow-2xl border-2 border-slate-200 mt-8">
            <h3 className="text-xl font-bold text-slate-800 mb-4">Meeting Controls</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-slate-100 rounded-xl">
                <svg className="w-6 h-6 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                <p className="font-medium text-slate-800 mt-2">Camera</p>
                <p className="text-sm text-slate-600">Click to toggle</p>
              </div>
              <div className="text-center p-4 bg-slate-100 rounded-xl">
                <svg className="w-6 h-6 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                </svg>
                <p className="font-medium text-slate-800 mt-2">Microphone</p>
                <p className="text-sm text-slate-600">Click to toggle</p>
              </div>
              <div className="text-center p-4 bg-slate-100 rounded-xl">
                <svg className="w-6 h-6 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <p className="font-medium text-slate-800 mt-2">Screen Share</p>
                <p className="text-sm text-slate-600">Click to share</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-emerald-50">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-slate-800 mb-4">Video Meetings</h1>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            Choose your preferred video meeting platform. Free Jitsi meetings or professional Google Meet integration.
          </p>
        </div>

        {/* Platform Selection */}
        <div className="bg-white/90 backdrop-blur-md p-8 rounded-3xl shadow-2xl border-2 border-slate-200 mb-12">
          <h2 className="text-3xl font-bold text-slate-800 text-center mb-8">Choose Platform</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div 
              className={`p-6 rounded-2xl border-2 cursor-pointer transition-all duration-200 ${
                meetingType === 'jitsi' 
                  ? 'bg-slate-100 border-slate-400 shadow-lg scale-105' 
                  : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
              }`}
              onClick={() => setMeetingType('jitsi')}
            >
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-slate-800 to-slate-700 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-2">Jitsi Meet</h3>
                <p className="text-slate-600 text-sm">Free, open source, embedded</p>
                <div className="mt-3">
                  <span className="inline-block px-3 py-1 bg-slate-200 text-slate-800 text-xs font-medium rounded-full">
                    FREE
                  </span>
                </div>
              </div>
            </div>

            <div 
              className={`p-6 rounded-2xl border-2 cursor-pointer transition-all duration-200 ${
                meetingType === 'google' 
                  ? 'bg-slate-100 border-emerald-400 shadow-lg scale-105' 
                  : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
              }`}
              onClick={() => setMeetingType('google')}
            >
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-2">Google Meet</h3>
                <p className="text-slate-600 text-sm">Professional, reliable, integrated</p>
                <div className="mt-3">
                  <span className="inline-block px-3 py-1 bg-slate-200 text-slate-800 text-xs font-medium rounded-full">
                    PRO
                  </span>
                </div>
                {isAuthenticated && (
                  <div className="mt-2">
                    <span className="inline-block px-2 py-1 bg-slate-300 text-slate-800 text-xs font-medium rounded-full">
                      ✓ Connected
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div 
              className={`p-6 rounded-2xl border-2 cursor-pointer transition-all duration-200 ${
                meetingType === 'teams' 
                  ? 'bg-slate-100 border-slate-400 shadow-lg scale-105' 
                  : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
              }`}
              onClick={() => setMeetingType('teams')}
            >
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-slate-800 to-slate-700 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-2">Microsoft Teams</h3>
                <p className="text-slate-600 text-sm">Enterprise, secure, collaborative</p>
                <div className="mt-3">
                  <span className="inline-block px-3 py-1 bg-slate-200 text-slate-800 text-xs font-medium rounded-full">
                    ENTERPRISE
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Google Meet Authentication */}
        {meetingType === 'google' && !isAuthenticated && (
                  <div className="bg-white/90 backdrop-blur-md p-8 rounded-3xl shadow-2xl border-2 border-emerald-200 mb-8">
          <div className="text-center">
            <div className="w-20 h-20 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-slate-800 mb-4">Connect Google Account</h2>
            <p className="text-slate-600 mb-8 text-lg leading-relaxed">
                To use Google Meet, you need to authenticate with your Google account. This will allow you to create meetings, manage your calendar, and access Google Meet features.
              </p>
              <button
                onClick={authenticateWithGoogle}
                disabled={isLoading}
                className="px-8 py-4 bg-emerald-600 text-white text-xl font-bold rounded-2xl hover:bg-emerald-700 transition-all duration-200 shadow-xl hover:shadow-2xl transform hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Connecting...' : 'Connect Google Account'}
              </button>
            </div>
          </div>
        )}

        {/* Google Meet Form */}
        {meetingType === 'google' && isAuthenticated && (
          <div className="bg-white/90 backdrop-blur-md p-8 rounded-3xl shadow-2xl border-2 border-emerald-200 mb-8">
            <h2 className="text-3xl font-bold text-slate-800 text-center mb-8">Create Google Meet</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-2">Meeting Title *</label>
                <input
                  type="text"
                  value={meetingForm.summary}
                  onChange={(e) => setMeetingForm({...meetingForm, summary: e.target.value})}
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-slate-500 focus:border-transparent outline-none"
                  placeholder="Enter meeting title"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-2">Start Time *</label>
                <input
                  type="datetime-local"
                  value={meetingForm.startTime}
                  onChange={(e) => setMeetingForm({...meetingForm, startTime: e.target.value})}
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-slate-500 focus:border-transparent outline-none"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-2">End Time *</label>
                <input
                  type="datetime-local"
                  value={meetingForm.endTime}
                  onChange={(e) => setMeetingForm({...meetingForm, endTime: e.target.value})}
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-slate-500 focus:border-transparent outline-none"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-2">Attendees (comma-separated)</label>
                <input
                  type="text"
                  value={meetingForm.attendees}
                  onChange={(e) => setMeetingForm({...meetingForm, attendees: e.target.value})}
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-slate-500 focus:border-transparent outline-none"
                  placeholder="email1@example.com, email2@example.com"
                />
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-600 mb-2">Description</label>
                <textarea
                  value={meetingForm.description}
                  onChange={(e) => setMeetingForm({...meetingForm, description: e.target.value})}
                  rows={3}
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-slate-500 focus:border-transparent outline-none"
                  placeholder="Enter meeting description"
                />
              </div>
              
              <div className="md:col-span-2 text-center">
                <button
                  onClick={createGoogleMeetMeeting}
                  disabled={isLoading || !meetingForm.summary || !meetingForm.startTime || !meetingForm.endTime}
                  className="px-8 py-4 bg-emerald-600 text-white text-xl font-bold rounded-2xl hover:bg-emerald-700 transition-all duration-200 shadow-xl hover:shadow-2xl transform hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? 'Creating...' : 'Create Google Meet'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Google Meet Meetings List */}
        {meetingType === 'google' && isAuthenticated && googleMeetings.length > 0 && (
          <div className="bg-white/90 backdrop-blur-md p-8 rounded-3xl shadow-2xl border-2 border-emerald-200 mb-8">
            <h2 className="text-3xl font-bold text-slate-800 text-center mb-8">Your Upcoming Meetings</h2>
            <div className="space-y-4">
              {googleMeetings.map((meeting) => (
                <div key={meeting.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-emerald-200">
                  <div>
                    <h3 className="font-semibold text-slate-800">{meeting.summary}</h3>
                    <p className="text-sm text-slate-600">
                      {new Date(meeting.start.dateTime).toLocaleString()} - {new Date(meeting.end.dateTime).toLocaleString()}
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    {meeting.meetLink && (
                      <a
                        href={meeting.meetLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2 bg-emerald-600 text-white text-sm font-medium rounded-lg hover:bg-emerald-700 transition-colors"
                      >
                        Join Meet
                      </a>
                    )}
                    <a
                      href={meeting.calendarLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 bg-slate-600 text-white text-sm font-medium rounded-lg hover:bg-slate-700 transition-colors"
                    >
                      View Calendar
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Main Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Create Meeting */}
          <div className="bg-white/90 backdrop-blur-md p-8 rounded-3xl shadow-2xl border-2 border-emerald-200 hover:shadow-3xl transition-all duration-300 hover:scale-105">
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </div>
              <h2 className="text-3xl font-bold text-slate-800 mb-4">Create New Meeting</h2>
              <p className="text-slate-600 mb-8 text-lg leading-relaxed">
                Start a new video meeting on {meetingType === 'jitsi' ? 'Jitsi' : meetingType === 'google' ? 'Google Meet' : 'Microsoft Teams'}.
                {meetingType === 'jitsi' ? ' Perfect for team calls and presentations.' : ' Professional meetings with enterprise features.'}
              </p>
              <button
                onClick={createMeeting}
                className="px-8 py-4 bg-emerald-600 text-white text-xl font-bold rounded-2xl hover:bg-emerald-700 transition-all duration-200 shadow-xl hover:shadow-2xl transform hover:-translate-y-1"
              >
                Create Meeting
              </button>
            </div>
          </div>

          {/* Join Meeting */}
          <div className="bg-white/90 backdrop-blur-md p-8 rounded-3xl shadow-2xl border-2 border-slate-200 hover:shadow-3xl transition-all duration-300 hover:scale-105">
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-r from-slate-800 to-slate-700 rounded-xl flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" />
                </svg>
              </div>
              <h2 className="text-3xl font-bold text-slate-800 mb-4">Join Meeting</h2>
              <p className="text-slate-600 mb-8 text-lg leading-relaxed">
                Join an existing meeting using a meeting ID or link.
              </p>
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Enter Meeting ID or Link"
                  value={meetingId}
                  onChange={(e) => setMeetingId(e.target.value)}
                  className="w-full px-6 py-4 text-lg border-2 border-slate-300 rounded-xl focus:ring-2 focus:ring-slate-500 focus:border-transparent outline-none"
                />
                <button
                  onClick={joinMeeting}
                  className="w-full px-8 py-4 bg-slate-600 text-white text-xl font-bold rounded-2xl hover:bg-slate-700 transition-all duration-200 shadow-xl hover:shadow-2xl transform hover:-translate-y-1"
                >
                  Join Meeting
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Platform Features */}
        <div className="bg-white/90 backdrop-blur-md p-8 rounded-3xl shadow-2xl border-2 border-slate-200 mb-8">
          <h2 className="text-3xl font-bold text-slate-800 text-center mb-8">Platform Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-slate-100 p-6 rounded-2xl mb-4">
                <svg className="w-10 h-10 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-2">Jitsi Meet</h3>
              <ul className="text-slate-600 text-sm space-y-1">
                <li>• Free forever</li>
                <li>• No downloads needed</li>
                <li>• End-to-end encryption</li>
                <li>• Embedded in app</li>
              </ul>
            </div>
            
            <div className="text-center">
              <div className="bg-slate-100 p-6 rounded-2xl mb-4">
                <svg className="w-10 h-10 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-2">Google Meet</h3>
              <ul className="text-slate-600 text-sm space-y-1">
                <li>• Professional quality</li>
                <li>• Google Workspace integration</li>
                <li>• Calendar integration</li>
                <li>• Meeting scheduling</li>
              </ul>
            </div>
            
            <div className="text-center">
              <div className="bg-slate-100 p-6 rounded-2xl mb-4">
                <svg className="w-10 h-10 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-2">Microsoft Teams</h3>
              <ul className="text-slate-600 text-sm space-y-1">
                <li>• Enterprise security</li>
                <li>• Microsoft 365 integration</li>
                <li>• Advanced collaboration</li>
                <li>• Professional features</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 text-center">
          <Link
            href="/dashboard"
            className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-slate-800 to-slate-700 text-white text-xl font-bold rounded-2xl hover:from-slate-700 hover:to-slate-600 transition-all duration-200 shadow-xl hover:shadow-2xl transform hover:-translate-y-1"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            Back to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
