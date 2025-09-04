import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { getUserNotes, getUserBusinessIdeas, getUserLibraryResources } from "../firebase/utils";
import Navigation from "../components/Navigation";
import MotivationalQuotes from "../components/MotivationalQuotes";

export default async function DashboardPage() {
  const user = await currentUser();
  
  if (!user) {
    redirect("/");
  }

  // Get user data from Firebase
  const notes = await getUserNotes(user.id);
  const businessIdeas = await getUserBusinessIdeas(user.id);
  const libraryResources = await getUserLibraryResources(user.id);
  
  const totalNotes = notes.length;
  const totalIdeas = businessIdeas.length;
  const totalLibraryItems = libraryResources.length;
  const thisWeekCount = notes.filter(note => {
    const createdAt = note.createdAt as string;
    const noteDate = new Date(createdAt);
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return noteDate >= weekAgo;
  }).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Navigation */}
      <Navigation />
      
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-blue-100">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
              <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
              </span>
            </div>

          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
        {/* Motivational Quotes Section */}
        <div className="mb-8">
          <MotivationalQuotes />
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white/95 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-slate-200 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600 mb-1">Total Notes</p>
                <p className="text-3xl font-bold text-slate-800">{totalNotes}</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-slate-800 to-slate-700 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
            </div>
          </div>
          
          <div className="bg-white/95 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-slate-200 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600 mb-1">Business Ideas</p>
                <p className="text-3xl font-bold text-slate-800">{totalIdeas}</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
            </div>
          </div>
          
          <div className="bg-white/95 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-slate-200 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600 mb-1">Library Items</p>
                <p className="text-3xl font-bold text-slate-800">{totalLibraryItems}</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-slate-800 to-slate-700 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
            </div>
          </div>
          
          <div className="bg-white/95 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-slate-200 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600 mb-1">This Week</p>
                <p className="text-3xl font-bold text-slate-800">{thisWeekCount}</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Recent Activity & AI Help */}
          <div className="lg:col-span-1">
            <div className="bg-white/95 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-slate-200 mb-6">
              <h3 className="text-lg font-semibold text-slate-800 mb-6">Recent Activity</h3>
              <div className="space-y-4">
                <div className="flex items-center p-3 bg-slate-50 rounded-lg">
                  <div className="w-10 h-10 bg-gradient-to-r from-slate-800 to-slate-700 rounded-full flex items-center justify-center mr-3">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-slate-800">Welcome to PlayGround AI!</p>
                    <p className="text-xs text-slate-500">Just now</p>
                  </div>
                </div>
                <div className="text-center py-8 text-slate-500">
                  <svg className="w-12 h-12 mx-auto mb-4 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  <p className="text-sm">No recent activity</p>
                  <p className="text-xs text-slate-400">Start creating to see your activity here</p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-slate-800 via-slate-700 to-emerald-600 p-6 rounded-2xl shadow-lg text-white">
              <h3 className="text-lg font-semibold mb-4">AI Assistant</h3>
              <p className="text-slate-200 mb-6 text-sm">
                Get instant help with your ideas, writing, or research questions
              </p>
              <Link
                href="/chat"
                className="inline-flex items-center px-6 py-3 bg-white text-slate-800 text-sm font-medium rounded-xl hover:bg-slate-50 transition-all duration-200 shadow-lg"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                Start Chat
              </Link>
            </div>
          </div>

          {/* Right Column - Main Content */}
          <div className="lg:col-span-2">
            {/* Quick Actions Grid */}
            <div className="bg-gradient-to-br from-slate-50 to-emerald-50/50 backdrop-blur-sm p-8 rounded-3xl shadow-xl border border-slate-200 mb-8">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-2xl font-bold text-slate-800">Quick Actions</h3>
                <div className="w-12 h-1 bg-gradient-to-r from-slate-800 to-emerald-500 rounded-full"></div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Link
                  href="/notes/new"
                  className="group relative p-6 bg-white rounded-2xl border border-slate-200 hover:border-slate-300 hover:shadow-xl transition-all duration-300 overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-slate-800/5 to-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative flex items-center">
                    <div className="w-12 h-12 bg-gradient-to-r from-slate-800 to-slate-700 rounded-xl flex items-center justify-center mr-4 shadow-lg">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-800 group-hover:text-slate-600 transition-colors">Create Note</h4>
                      <p className="text-sm text-slate-600">Organize your thoughts</p>
                    </div>
                  </div>
                </Link>
                
                <Link
                  href="/ideas/new"
                  className="group relative p-6 bg-white rounded-2xl border border-blue-100 hover:border-blue-200 hover:shadow-xl transition-all duration-300 overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-blue-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative flex items-center">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mr-4 shadow-lg">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-800 group-hover:text-slate-600 transition-colors">Add Business Idea</h4>
                      <p className="text-sm text-slate-600">Capture your ideas</p>
                    </div>
                  </div>
                </Link>
                
                <Link
                  href="/videos"
                  className="group relative p-6 bg-white rounded-2xl border border-slate-200 hover:border-slate-300 hover:shadow-xl transition-all duration-300 overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-slate-800/5 to-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative flex items-center">
                    <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center mr-4 shadow-lg">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-800 group-hover:text-slate-600 transition-colors">Browse Videos</h4>
                      <p className="text-sm text-slate-600">Discover content</p>
                    </div>
                  </div>
                </Link>
                
                <Link
                  href="/ai-tools"
                  className="group relative p-6 bg-white rounded-2xl border border-slate-200 hover:border-slate-300 hover:shadow-xl transition-all duration-300 overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-slate-800/5 to-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative flex items-center">
                    <div className="w-12 h-12 bg-gradient-to-r from-slate-800 to-slate-700 rounded-xl flex items-center justify-center mr-4 shadow-lg">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-800 group-hover:text-slate-600 transition-colors">AI Tools Hub</h4>
                      <p className="text-sm text-slate-600">Explore AI features</p>
                    </div>
                  </div>
                </Link>
                
                <Link
                  href="/video-meetings"
                  className="group relative p-6 bg-white rounded-2xl border border-slate-200 hover:border-slate-300 hover:shadow-xl transition-all duration-300 overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-slate-800/5 to-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative flex items-center">
                    <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center mr-4 shadow-lg">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-800 group-hover:text-slate-600 transition-colors">Video Meetings</h4>
                      <p className="text-sm text-slate-600">Start meetings</p>
                    </div>
                  </div>
                </Link>
                
                <Link
                  href="/library/new"
                  className="group relative p-6 bg-white rounded-2xl border border-slate-200 hover:border-slate-300 hover:shadow-xl transition-all duration-300 overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-slate-800/5 to-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative flex items-center">
                    <div className="w-12 h-12 bg-gradient-to-r from-slate-800 to-slate-700 rounded-xl flex items-center justify-center mr-4 shadow-lg">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-800 group-hover:text-slate-600 transition-colors">Add to Library</h4>
                      <p className="text-sm text-slate-600">Save resources</p>
                    </div>
                  </div>
                </Link>
              </div>
            </div>

            {/* Your Workspace */}
            <div className="bg-gradient-to-br from-slate-50 to-emerald-50 p-8 rounded-2xl shadow-lg border border-slate-200">
              <h3 className="text-lg font-semibold text-slate-800 mb-6">Your Workspace</h3>
              <div className="text-center py-8">
                <div className="w-20 h-20 bg-gradient-to-r from-slate-800 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h4 className="text-xl font-semibold text-slate-800 mb-3">Ready to get started?</h4>
                <p className="text-slate-600 mb-8 max-w-md mx-auto">
                  Your personal workspace is ready. Start creating notes, capturing ideas, and building your knowledge library.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link
                    href="/notes"
                    className="px-8 py-3 bg-gradient-to-r from-slate-800 to-slate-700 text-white font-semibold rounded-xl hover:from-slate-700 hover:to-slate-600 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                  >
                    Explore Notes
                  </Link>
                  <Link
                    href="/ideas"
                    className="px-8 py-3 border-2 border-emerald-300 text-slate-700 font-semibold rounded-xl hover:border-emerald-400 hover:bg-white transition-all duration-200"
                  >
                    View Ideas
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
