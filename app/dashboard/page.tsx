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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Navigation */}
      <Navigation />
      
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-gray-900">
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Playground
                </span>
              </h1>
              <span className="text-gray-500">Dashboard</span>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                Welcome back, {user.firstName || user.emailAddresses[0]?.emailAddress}
              </span>
              <Link
                href="/"
                className="px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Home
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Motivational Quotes Section */}
        <div className="mb-8">
          <MotivationalQuotes />
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <span className="text-2xl">📝</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Notes</p>
                <p className="text-2xl font-bold text-gray-900">{totalNotes}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <span className="text-2xl">💡</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Business Ideas</p>
                <p className="text-2xl font-bold text-gray-900">{totalIdeas}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <span className="text-2xl">📚</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Library Items</p>
                <p className="text-2xl font-bold text-gray-900">{totalLibraryItems}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-orange-100 rounded-lg">
                <span className="text-2xl">📊</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">This Week</p>
                <p className="text-2xl font-bold text-gray-900">{thisWeekCount}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Quick Actions */}
          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <Link
                  href="/notes/new"
                  className="flex items-center p-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors group"
                >
                  <span className="text-xl mr-3">📝</span>
                  <span className="group-hover:text-blue-600">Create Note</span>
                </Link>
                <Link
                  href="/ideas/new"
                  className="flex items-center p-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors group"
                >
                  <span className="text-xl mr-3">💡</span>
                  <span className="group-hover:text-blue-600">Add Business Idea</span>
                </Link>
                <Link
                  href="/library/new"
                  className="flex items-center p-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors group"
                >
                  <span className="text-xl mr-3">📚</span>
                  <span className="group-hover:text-blue-600">Add to Library</span>
                </Link>
                <Link
                  href="/videos"
                  className="flex items-center p-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors group"
                >
                  <span className="text-xl mr-3">🎥</span>
                  <span className="group-hover:text-blue-600">Browse Videos</span>
                </Link>
                <Link
                  href="/ai-tools"
                  className="flex items-center p-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors group"
                >
                  <span className="text-xl mr-3">🚀</span>
                  <span className="group-hover:text-blue-600">AI Tools Hub</span>
                </Link>
                <Link
                  href="/video-meetings"
                  className="flex items-center p-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors group"
                >
                  <span className="text-xl mr-3">🎥</span>
                  <span className="group-hover:text-blue-600">Video Meetings</span>
                </Link>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
              <div className="text-center py-8 text-gray-500">
                <span className="text-4xl mb-2 block">📭</span>
                <p>No recent activity</p>
                <p className="text-sm">Start creating to see your activity here</p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Need AI Help?</h3>
              <p className="text-gray-600 mb-4 text-sm">
                Get instant help with your ideas, writing, or research questions
              </p>
              <Link
                href="/chat"
                className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm font-medium rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200"
              >
                <span className="mr-2">🤖</span>
                Chat with AI
              </Link>
            </div>
          </div>

          {/* Right Column - Main Content */}
          <div className="lg:col-span-2">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Getting Started</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <h4 className="font-medium text-blue-900 mb-2">Create Your First Note</h4>
                  <p className="text-sm text-blue-700 mb-3">
                    Start organizing your thoughts with a personal note
                  </p>
                  <Link
                    href="/notes/new"
                    className="inline-flex items-center px-3 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Create Note
                  </Link>
                </div>
                
                <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                  <h4 className="font-medium text-green-900 mb-2">Capture Business Ideas</h4>
                  <p className="text-sm text-green-700 mb-3">
                    Turn your ideas into actionable business plans
                  </p>
                  <Link
                    href="/ideas/new"
                    className="inline-flex items-center px-3 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Add Idea
                  </Link>
                </div>
                
                <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                  <h4 className="font-medium text-red-900 mb-2">Browse Videos</h4>
                  <p className="text-sm text-red-700 mb-3">
                    Discover and watch amazing YouTube videos
                  </p>
                  <Link
                    href="/videos"
                    className="inline-flex items-center px-3 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-colors"
                  >
                    Browse Videos
                  </Link>
                </div>
                
                <div className="p-4 bg-indigo-50 rounded-lg border border-indigo-200">
                  <h4 className="font-medium text-indigo-900 mb-2">AI Tools Hub</h4>
                  <p className="text-sm text-indigo-700 mb-3">
                    Access all AI tools: chat, image generation, video tools, and more
                  </p>
                  <Link
                    href="/ai-tools"
                    className="inline-flex items-center px-3 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors"
                  >
                    Explore AI Tools
                  </Link>
                </div>
                
                <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                  <h4 className="font-medium text-purple-900 mb-2">Video Meetings</h4>
                  <p className="text-sm text-purple-700 mb-3">
                    Host and join video meetings with your team
                  </p>
                  <Link
                    href="/video-meetings"
                    className="inline-flex items-center px-3 py-2 bg-purple-600 text-white text-sm font-medium rounded-lg hover:bg-purple-700 transition-colors"
                  >
                    Start Meeting
                  </Link>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Workspace</h3>
              <div className="text-center py-12 text-gray-500">
                <span className="text-6xl mb-4 block">🚀</span>
                <h4 className="text-xl font-medium text-gray-700 mb-2">Ready to get started?</h4>
                <p className="text-gray-600 mb-6">
                  Your personal workspace is ready. Start creating notes, capturing ideas, and building your knowledge library.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Link
                    href="/notes"
                    className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                  >
                    Explore Notes
                  </Link>
                  <Link
                    href="/ideas"
                    className="px-6 py-3 border-2 border-gray-300 text-gray-700 font-medium rounded-lg hover:border-gray-400 hover:bg-gray-50 transition-colors"
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
