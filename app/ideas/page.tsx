import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { getUserBusinessIdeas } from "../firebase/utils";

export default async function IdeasPage() {
  const user = await currentUser();
  
  if (!user) {
    redirect("/");
  }

  // Get user business ideas from Firebase
  const businessIdeas = await getUserBusinessIdeas(user.id);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-green-50">
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
              <h1 className="text-2xl font-bold text-gray-900">Business Ideas</h1>
            </div>
            <Link
              href="/ideas/new"
              className="px-4 py-2 bg-gradient-to-r from-green-600 to-blue-600 text-white font-medium rounded-lg hover:from-green-700 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              + New Idea
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
                placeholder="Search business ideas..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
            <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent">
              <option value="">All Stages</option>
              <option value="concept">Concept</option>
              <option value="research">Research</option>
              <option value="planning">Planning</option>
              <option value="development">Development</option>
              <option value="launch">Launch</option>
            </select>
            <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent">
              <option value="">All Industries</option>
              <option value="tech">Technology</option>
              <option value="health">Healthcare</option>
              <option value="finance">Finance</option>
              <option value="education">Education</option>
              <option value="retail">Retail</option>
            </select>
          </div>
        </div>

        {/* Ideas Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {businessIdeas.length === 0 ? (
            /* Empty State */
            <div className="col-span-full text-center py-16">
              <span className="text-6xl mb-4 block">💡</span>
              <h3 className="text-2xl font-semibold text-gray-900 mb-2">No business ideas yet</h3>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                Start capturing your entrepreneurial thoughts and turn them into actionable business plans. 
                Every great company started with an idea!
              </p>
              <Link
                href="/ideas/new"
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-green-600 to-blue-600 text-white font-medium rounded-lg hover:from-green-700 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                Capture Your First Idea
              </Link>
            </div>
          ) : (
            /* Ideas List */
            businessIdeas.map((idea) => (
              <div key={idea.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">{idea.title as string}</h3>
                  <span className="text-xs text-gray-500 bg-green-100 px-2 py-1 rounded-full">
                    {idea.stage as string}
                  </span>
                </div>
                <p className="text-gray-600 text-sm mb-4 line-clamp-3">{idea.description as string}</p>
                <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                  <span className="bg-blue-100 px-2 py-1 rounded-full">{idea.category as string}</span>
                  <span className="bg-purple-100 px-2 py-1 rounded-full">{idea.industry as string}</span>
                </div>
                <div className="text-xs text-gray-500">
                  Created: {new Date(idea.createdAt as string).toLocaleDateString()}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Quick Actions */}
        <div className="mt-12 bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Idea Categories</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <h4 className="font-medium text-blue-900 mb-2">🚀 SaaS Solutions</h4>
              <p className="text-sm text-blue-700 mb-3">
                Software-as-a-Service business ideas
              </p>
              <Link
                href="/ideas/new?category=saas"
                className="text-blue-600 hover:text-blue-800 font-medium text-sm"
              >
                Create SaaS Idea →
              </Link>
            </div>
            
            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
              <h4 className="font-medium text-green-900 mb-2">🏥 Health Tech</h4>
              <p className="text-sm text-green-700 mb-3">
                Healthcare and wellness innovations
              </p>
              <Link
                href="/ideas/new?category=health"
                className="text-green-600 hover:text-green-800 font-medium text-sm"
              >
                Create Health Idea →
              </Link>
            </div>
            
            <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
              <h4 className="font-medium text-purple-900 mb-2">💰 Fintech</h4>
              <p className="text-sm text-purple-700 mb-3">
                Financial technology solutions
              </p>
              <Link
                href="/ideas/new?category=fintech"
                className="text-purple-600 hover:text-purple-800 font-medium text-sm"
              >
                Create Fintech Idea →
              </Link>
            </div>
            
            <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
              <h4 className="font-medium text-orange-900 mb-2">🎓 EdTech</h4>
              <p className="text-sm text-orange-700 mb-3">
                Educational technology platforms
              </p>
              <Link
                href="/ideas/new?category=edtech"
                className="text-orange-600 hover:text-orange-800 font-medium text-sm"
              >
                Create EdTech Idea →
              </Link>
            </div>
          </div>
        </div>

        {/* Idea Development Process */}
        <div className="mt-8 bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Idea Development Process</h3>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <span className="text-blue-600 font-bold">1</span>
              </div>
              <h4 className="font-medium text-gray-900 text-sm">Concept</h4>
              <p className="text-xs text-gray-600 mt-1">Initial idea</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <span className="text-green-600 font-bold">2</span>
              </div>
              <h4 className="font-medium text-gray-900 text-sm">Research</h4>
              <p className="text-xs text-gray-600 mt-1">Market analysis</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <span className="text-purple-600 font-bold">3</span>
              </div>
              <h4 className="font-medium text-gray-900 text-sm">Planning</h4>
              <p className="text-xs text-gray-600 mt-1">Business plan</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <span className="text-orange-600 font-bold">4</span>
              </div>
              <h4 className="font-medium text-gray-900 text-sm">Development</h4>
              <p className="text-xs text-gray-600 mt-1">Build MVP</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <span className="text-red-600 font-bold">5</span>
              </div>
              <h4 className="font-medium text-gray-900 text-sm">Launch</h4>
              <p className="text-xs text-gray-600 mt-1">Go to market</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
