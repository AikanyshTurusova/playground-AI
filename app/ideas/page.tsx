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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Header */}
      <header className="bg-white/10 backdrop-blur-sm border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <Link
                href="/dashboard"
                className="text-blue-200 hover:text-white transition-colors"
              >
                ← Dashboard
              </Link>
              <h1 className="text-2xl font-bold text-white">Business Ideas</h1>
            </div>
            <Link
              href="/ideas/new"
              className="px-4 py-2 bg-gradient-to-r from-teal-600 to-blue-600 text-white font-medium rounded-lg hover:from-teal-700 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              + New Idea
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filters */}
        <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl border border-white/20 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search business ideas..."
                className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-blue-200 focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              />
            </div>
            <select className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:ring-2 focus:ring-teal-500 focus:border-transparent">
              <option value="" className="bg-slate-800">All Stages</option>
              <option value="concept" className="bg-slate-800">Concept</option>
              <option value="research" className="bg-slate-800">Research</option>
              <option value="planning" className="bg-slate-800">Planning</option>
              <option value="development" className="bg-slate-800">Development</option>
              <option value="launch" className="bg-slate-800">Launch</option>
            </select>
            <select className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:ring-2 focus:ring-teal-500 focus:border-transparent">
              <option value="" className="bg-slate-800">All Industries</option>
              <option value="tech" className="bg-slate-800">Technology</option>
              <option value="health" className="bg-slate-800">Healthcare</option>
              <option value="finance" className="bg-slate-800">Finance</option>
              <option value="education" className="bg-slate-800">Education</option>
              <option value="retail" className="bg-slate-800">Retail</option>
            </select>
          </div>
        </div>

        {/* Ideas Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {businessIdeas.length === 0 ? (
            /* Empty State */
            <div className="col-span-full text-center py-16">
              <span className="text-6xl mb-4 block">💡</span>
              <h3 className="text-2xl font-semibold text-white mb-2">No business ideas yet</h3>
              <p className="text-blue-200 mb-6 max-w-md mx-auto">
                Start capturing your entrepreneurial thoughts and turn them into actionable business plans. 
                Every great company started with an idea!
              </p>
              <Link
                href="/ideas/new"
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-teal-600 to-blue-600 text-white font-medium rounded-lg hover:from-teal-700 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                Capture Your First Idea
              </Link>
            </div>
          ) : (
            /* Ideas List */
            businessIdeas.map((idea) => (
              <div key={idea.id} className="bg-white/10 backdrop-blur-sm p-6 rounded-xl border border-white/20 hover:bg-white/15 transition-all">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-lg font-semibold text-white line-clamp-2">{idea.title as string}</h3>
                  <span className="text-xs text-blue-200 bg-teal-100/20 px-2 py-1 rounded-full">
                    {idea.stage as string}
                  </span>
                </div>
                <p className="text-blue-200 text-sm mb-4 line-clamp-3">{idea.description as string}</p>
                <div className="flex items-center justify-between text-xs text-blue-200 mb-3">
                  <span className="bg-blue-100/20 px-2 py-1 rounded-full">{idea.category as string}</span>
                  <span className="bg-purple-100/20 px-2 py-1 rounded-full">{idea.industry as string}</span>
                </div>
                <div className="text-xs text-blue-200">
                  Created: {new Date(idea.createdAt as string).toLocaleDateString()}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Quick Actions */}
        <div className="mt-12 bg-white/10 backdrop-blur-sm p-6 rounded-xl border border-white/20">
          <h3 className="text-lg font-semibold text-white mb-4">Idea Categories</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 bg-blue-100/20 rounded-lg border border-blue-200/30 hover:bg-blue-100/30 transition-all">
              <h4 className="font-medium text-white mb-2">🚀 SaaS Solutions</h4>
              <p className="text-sm text-blue-200 mb-3">
                Software-as-a-Service business ideas
              </p>
              <Link
                href="/ideas/new?category=saas"
                className="text-teal-400 hover:text-teal-300 font-medium text-sm"
              >
                Create SaaS Idea →
              </Link>
            </div>
            
            <div className="p-4 bg-green-100/20 rounded-lg border border-green-200/30 hover:bg-green-100/30 transition-all">
              <h4 className="font-medium text-white mb-2">🏥 Health Tech</h4>
              <p className="text-sm text-blue-200 mb-3">
                Healthcare and wellness innovations
              </p>
              <Link
                href="/ideas/new?category=health"
                className="text-teal-400 hover:text-teal-300 font-medium text-sm"
              >
                Create Health Idea →
              </Link>
            </div>
            
            <div className="p-4 bg-purple-100/20 rounded-lg border border-purple-200/30 hover:bg-purple-100/30 transition-all">
              <h4 className="font-medium text-white mb-2">💰 Fintech</h4>
              <p className="text-sm text-blue-200 mb-3">
                Financial technology solutions
              </p>
              <Link
                href="/ideas/new?category=fintech"
                className="text-teal-400 hover:text-teal-300 font-medium text-sm"
              >
                Create Fintech Idea →
              </Link>
            </div>
            
            <div className="p-4 bg-orange-100/20 rounded-lg border border-orange-200/30 hover:bg-orange-100/30 transition-all">
              <h4 className="font-medium text-white mb-2">🎓 EdTech</h4>
              <p className="text-sm text-blue-200 mb-3">
                Educational technology platforms
              </p>
              <Link
                href="/ideas/new?category=edtech"
                className="text-teal-400 hover:text-teal-300 font-medium text-sm"
              >
                Create EdTech Idea →
              </Link>
            </div>
          </div>
        </div>

        {/* Idea Development Process */}
        <div className="mt-8 bg-white/10 backdrop-blur-sm p-6 rounded-xl border border-white/20">
          <h3 className="text-lg font-semibold text-white mb-4">Idea Development Process</h3>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100/20 rounded-full flex items-center justify-center mx-auto mb-2">
                <span className="text-teal-400 font-bold">1</span>
              </div>
              <h4 className="font-medium text-white text-sm">Concept</h4>
              <p className="text-xs text-blue-200 mt-1">Initial idea</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100/20 rounded-full flex items-center justify-center mx-auto mb-2">
                <span className="text-teal-400 font-bold">2</span>
              </div>
              <h4 className="font-medium text-white text-sm">Research</h4>
              <p className="text-xs text-blue-200 mt-1">Market analysis</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100/20 rounded-full flex items-center justify-center mx-auto mb-2">
                <span className="text-teal-400 font-bold">3</span>
              </div>
              <h4 className="font-medium text-white text-sm">Planning</h4>
              <p className="text-xs text-blue-200 mt-1">Business plan</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-orange-100/20 rounded-full flex items-center justify-center mx-auto mb-2">
                <span className="text-teal-400 font-bold">4</span>
              </div>
              <h4 className="font-medium text-white text-sm">Development</h4>
              <p className="text-xs text-blue-200 mt-1">Build MVP</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-red-100/20 rounded-full flex items-center justify-center mx-auto mb-2">
                <span className="text-teal-400 font-bold">5</span>
              </div>
              <h4 className="font-medium text-white text-sm">Launch</h4>
              <p className="text-xs text-blue-200 mt-1">Go to market</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
