import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { getUserNotes } from "../firebase/utils";

export default async function NotesPage() {
  const user = await currentUser();
  
  if (!user) {
    redirect("/");
  }

  // Get user notes from Firebase
  const notes = await getUserNotes(user.id);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <Link
                href="/dashboard"
                className="text-gray-500 hover:text-gray-700 transition-colors"
              >
                ← Dashboard
              </Link>
              <h1 className="text-2xl font-bold text-gray-900">My Notes</h1>
            </div>
            <Link
              href="/notes/new"
              className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              + New Note
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filters */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search notes..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
              <option value="">All Categories</option>
              <option value="personal">Personal</option>
              <option value="work">Work</option>
              <option value="ideas">Ideas</option>
              <option value="learning">Learning</option>
            </select>
            <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
              <option value="">Sort by</option>
              <option value="recent">Most Recent</option>
              <option value="oldest">Oldest First</option>
              <option value="title">Title A-Z</option>
            </select>
          </div>
        </div>

        {/* Notes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {notes.length === 0 ? (
            /* Empty State */
            <div className="col-span-full text-center py-16">
              <span className="text-6xl mb-4 block">📝</span>
              <h3 className="text-2xl font-semibold text-gray-900 mb-2">No notes yet</h3>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                Start organizing your thoughts by creating your first note. Capture ideas, thoughts, and important information in one place.
              </p>
              <Link
                href="/notes/new"
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                Create Your First Note
              </Link>
            </div>
          ) : (
            /* Notes List */
            notes.map((note) => (
              <div key={note.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">{note.title as string}</h3>
                  <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                    {note.category as string}
                  </span>
                </div>
                <p className="text-gray-600 text-sm mb-4 line-clamp-3">{note.content as string}</p>
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>{new Date(note.createdAt as string).toLocaleDateString()}</span>
                  {(note.tags as string) && (
                    <span className="text-blue-600">{note.tags as string}</span>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Quick Actions */}
        <div className="mt-12 bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <h4 className="font-medium text-blue-900 mb-2">📝 Personal Notes</h4>
              <p className="text-sm text-blue-700 mb-3">
                Keep track of personal thoughts and daily reflections
              </p>
              <Link
                href="/notes/new?category=personal"
                className="text-blue-600 hover:text-blue-800 font-medium text-sm"
              >
                Create Personal Note →
              </Link>
            </div>
            
            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
              <h4 className="font-medium text-green-900 mb-2">💼 Work Notes</h4>
              <p className="text-sm text-green-700 mb-3">
                Organize work-related information and project notes
              </p>
              <Link
                href="/notes/new?category=work"
                className="text-green-600 hover:text-green-800 font-medium text-sm"
              >
                Create Work Note →
              </Link>
            </div>
            
            <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
              <h4 className="font-medium text-purple-900 mb-2">🎯 Goal Tracking</h4>
              <p className="text-sm text-purple-700 mb-3">
                Set and track your personal and professional goals
              </p>
              <Link
                href="/notes/new?category=goals"
                className="text-purple-600 hover:text-purple-800 font-medium text-sm"
              >
                Create Goal Note →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
