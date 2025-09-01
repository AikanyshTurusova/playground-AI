import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { getUserLibraryResources } from "../firebase/utils";

export default async function LibraryPage() {
  const user = await currentUser();
  
  if (!user) {
    redirect("/");
  }

  // Get user library resources from Firebase
  const libraryResources = await getUserLibraryResources(user.id);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-purple-50">
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
              <h1 className="text-2xl font-bold text-gray-900">Knowledge Library</h1>
            </div>
            <Link
              href="/library/new"
              className="px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-medium rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              + Add Resource
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* AI Tools Quick Access */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">🚀 AI-Powered Tools</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link
              href="/chat"
              className="p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg hover:from-blue-100 hover:to-blue-200 transition-colors border border-blue-200"
            >
              <div className="flex items-center space-x-3">
                <span className="text-2xl">🤖</span>
                <div>
                  <h4 className="font-medium text-blue-900">AI Chat Assistant</h4>
                  <p className="text-sm text-blue-700">Get help with ideas, writing, and research</p>
                </div>
              </div>
            </Link>
            
            <Link
              href="/library/images"
              className="p-4 bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg hover:from-purple-100 hover:to-purple-200 transition-colors border border-purple-200"
            >
              <div className="flex items-center space-x-3">
                <span className="text-2xl">🎨</span>
                <div>
                  <h4 className="font-medium text-purple-900">AI Image Generator</h4>
                  <p className="text-sm text-purple-700">Create stunning images from text descriptions</p>
                </div>
              </div>
            </Link>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search library resources..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
            <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent">
              <option value="">All Types</option>
              <option value="article">Articles</option>
              <option value="book">Books</option>
              <option value="video">Videos</option>
              <option value="podcast">Podcasts</option>
              <option value="course">Courses</option>
              <option value="tool">Tools</option>
            </select>
            <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent">
              <option value="">All Topics</option>
              <option value="business">Business</option>
              <option value="technology">Technology</option>
              <option value="health">Health & Wellness</option>
              <option value="finance">Finance</option>
              <option value="productivity">Productivity</option>
              <option value="creativity">Creativity</option>
            </select>
          </div>
        </div>

        {/* Library Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {libraryResources.length === 0 ? (
            /* Empty State */
            <div className="col-span-full text-center py-16">
              <span className="text-6xl mb-4 block">📚</span>
              <h3 className="text-2xl font-semibold text-gray-900 mb-2">Your library is empty</h3>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                Start building your personal knowledge base by adding articles, books, videos, and other valuable resources. 
                Organize your learning materials in one place.
              </p>
              <Link
                href="/library/new"
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-medium rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                Add Your First Resource
              </Link>
            </div>
          ) : (
            /* Resources List */
            libraryResources.map((resource) => (
              <div key={resource.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">{resource.title as string}</h3>
                  <span className="text-xs text-gray-500 bg-purple-100 px-2 py-1 rounded-full">
                    {resource.type as string}
                  </span>
                </div>
                <p className="text-gray-600 text-sm mb-4 line-clamp-3">{resource.description as string}</p>
                <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                  <span className="bg-blue-100 px-2 py-1 rounded-full">{resource.topic as string}</span>
                  <span className="bg-purple-100 px-2 py-1 rounded-full">{resource.difficulty as string}</span>
                </div>
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>Rating: {'⭐'.repeat(resource.rating as number)}</span>
                  <span>{new Date(resource.createdAt as string).toLocaleDateString()}</span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Resource Categories */}
        <div className="mt-12 bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Resource Categories</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <h4 className="font-medium text-blue-900 mb-2">📖 Articles & Books</h4>
              <p className="text-sm text-blue-700 mb-3">
                Written content and publications
              </p>
              <Link
                href="/library/new?type=article"
                className="text-blue-600 hover:text-blue-800 font-medium text-sm"
              >
                Add Article →
              </Link>
            </div>
            
            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
              <h4 className="font-medium text-green-900 mb-2">🎥 Videos & Courses</h4>
              <p className="text-sm text-green-700 mb-3">
                Visual and interactive learning
              </p>
              <Link
                href="/library/new?type=video"
                className="text-green-600 hover:text-green-800 font-medium text-sm"
              >
                Add Video →
              </Link>
            </div>
            
            <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
              <h4 className="font-medium text-purple-900 mb-2">🎧 Podcasts & Audio</h4>
              <p className="text-sm text-purple-700 mb-3">
                Audio content and discussions
              </p>
              <Link
                href="/library/new?type=podcast"
                className="text-purple-600 hover:text-purple-800 font-medium text-sm"
              >
                Add Podcast →
              </Link>
            </div>
            
            <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
              <h4 className="font-medium text-orange-900 mb-2">🛠️ Tools & Resources</h4>
              <p className="text-sm text-orange-700 mb-3">
                Software, apps, and utilities
              </p>
              <Link
                href="/library/new?type=tool"
                className="text-orange-600 hover:text-orange-800 font-medium text-sm"
              >
                Add Tool →
              </Link>
            </div>
          </div>
        </div>

        {/* Learning Paths */}
        <div className="mt-8 bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Suggested Learning Paths</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border border-blue-200">
              <h4 className="font-semibold text-blue-900 mb-3">🚀 Entrepreneurship</h4>
              <ul className="text-sm text-blue-800 space-y-2 mb-4">
                <li>• Business fundamentals</li>
                <li>• Market research</li>
                <li>• Financial planning</li>
                <li>• Growth strategies</li>
              </ul>
              <Link
                href="/library/new?topic=entrepreneurship"
                className="text-blue-600 hover:text-blue-800 font-medium text-sm"
              >
                Start Learning →
              </Link>
            </div>
            
            <div className="p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-xl border border-green-200">
              <h4 className="font-semibold text-green-900 mb-3">💻 Technology</h4>
              <ul className="text-sm text-green-800 space-y-2 mb-4">
                <li>• Programming basics</li>
                <li>• Web development</li>
                <li>• Data science</li>
                <li>• AI & ML</li>
              </ul>
              <Link
                href="/library/new?topic=technology"
                className="text-green-600 hover:text-green-800 font-medium text-sm"
              >
                Start Learning →
              </Link>
            </div>
            
            <div className="p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl border border-purple-200">
              <h4 className="font-semibold text-purple-900 mb-3">🧠 Personal Growth</h4>
              <ul className="text-sm text-purple-800 space-y-2 mb-4">
                <li>• Productivity hacks</li>
                <li>• Time management</li>
                <li>• Goal setting</li>
                <li>• Mindfulness</li>
              </ul>
              <Link
                href="/library/new?topic=personal-growth"
                className="text-purple-600 hover:text-purple-800 font-medium text-sm"
              >
                Start Learning →
              </Link>
            </div>
          </div>
        </div>

        {/* Reading Stats */}
        <div className="mt-8 bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Learning Stats</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-gray-900">{libraryResources.length}</div>
              <div className="text-sm text-gray-600">Resources Added</div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-gray-900">
                {new Set(libraryResources.map(r => r.topic)).size}
              </div>
              <div className="text-sm text-gray-600">Topics Covered</div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-gray-900">
                {libraryResources.filter(r => r.isCompleted).length}
              </div>
              <div className="text-sm text-gray-600">Completed</div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-gray-900">
                {libraryResources.filter(r => r.isBookmarked).length}
              </div>
              <div className="text-sm text-gray-600">Bookmarked</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
