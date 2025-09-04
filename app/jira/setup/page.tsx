'use client';

import { useState } from 'react';
import Navigation from '../../components/Navigation';

export default function JiraSetup() {
  const [testResult, setTestResult] = useState<{success: boolean, message: string} | null>(null);
  const [testing, setTesting] = useState(false);

  const testConnection = async () => {
    setTesting(true);
    setTestResult(null);
    
    try {
      const response = await fetch('/api/jira/test');
      const data = await response.json();
      
      setTestResult({
        success: data.success,
        message: data.message
      });
    } catch (error) {
      setTestResult({
        success: false,
        message: 'Failed to test connection'
      });
    } finally {
      setTesting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-white mb-8">Jira Integration Setup</h1>
          
          <div className="grid md:grid-cols-2 gap-8">
            {/* Setup Instructions */}
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
              <h2 className="text-xl font-semibold text-white mb-4">Setup Instructions</h2>
              
              <div className="space-y-6 text-blue-200">
                <div>
                  <h3 className="font-semibold text-white mb-2">1. Get Your Jira API Token</h3>
                  <ol className="list-decimal list-inside space-y-1 ml-4">
                    <li>Go to <a href="https://id.atlassian.com/manage-profile/security/api-tokens" target="_blank" rel="noopener noreferrer" className="text-teal-400 hover:text-teal-300 underline">Atlassian API Tokens</a></li>
                    <li>Click "Create API token"</li>
                    <li>Give it a label (e.g., "PlaygroundAI Integration")</li>
                    <li>Copy the generated token</li>
                  </ol>
                </div>
                
                <div>
                  <h3 className="font-semibold text-white mb-2">2. Find Your Jira Domain</h3>
                  <p>Your Jira domain is the URL you use to access Jira, for example:</p>
                  <div className="bg-gray-800 p-3 rounded font-mono text-sm mt-2">
                    https://yourcompany.atlassian.net
                  </div>
                </div>
                
                <div>
                  <h3 className="font-semibold text-white mb-2">3. Add Environment Variables</h3>
                  <p>Create or update your <code className="bg-gray-800 px-2 py-1 rounded text-sm">.env.local</code> file with:</p>
                  <div className="bg-gray-800 p-3 rounded font-mono text-sm mt-2">
                    JIRA_BASE_URL=https://yourcompany.atlassian.net<br/>
                    JIRA_EMAIL=your-email@company.com<br/>
                    JIRA_API_TOKEN=your-api-token-here
                  </div>
                </div>
                
                <div>
                  <h3 className="font-semibold text-white mb-2">4. Restart Your Development Server</h3>
                  <p>After adding the environment variables, restart your Next.js development server:</p>
                  <div className="bg-gray-800 p-3 rounded font-mono text-sm mt-2">
                    npm run dev
                  </div>
                </div>
              </div>
            </div>
            
            {/* Test Connection */}
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
              <h2 className="text-xl font-semibold text-white mb-4">Test Connection</h2>
              
              <div className="space-y-4">
                <p className="text-blue-200">
                  Once you've added your environment variables, test the connection to make sure everything is working.
                </p>
                
                <button
                  onClick={testConnection}
                  disabled={testing}
                  className="w-full bg-teal-600 hover:bg-teal-700 disabled:bg-gray-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
                >
                  {testing ? 'Testing...' : 'Test Jira Connection'}
                </button>
                
                {testResult && (
                  <div className={`p-4 rounded-lg ${
                    testResult.success 
                      ? 'bg-green-100 border border-green-200' 
                      : 'bg-red-100 border border-red-200'
                  }`}>
                    <div className={`font-semibold ${
                      testResult.success ? 'text-green-800' : 'text-red-800'
                    }`}>
                      {testResult.success ? '✅ Success!' : '❌ Failed'}
                    </div>
                    <div className={`text-sm ${
                      testResult.success ? 'text-green-700' : 'text-red-700'
                    }`}>
                      {testResult.message}
                    </div>
                  </div>
                )}
                
                {testResult?.success && (
                  <div className="mt-4">
                    <a
                      href="/jira"
                      className="block w-full bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold text-center transition-colors"
                    >
                      Go to Jira Dashboard
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Troubleshooting */}
          <div className="mt-8 bg-white/10 backdrop-blur-sm rounded-xl p-6">
            <h2 className="text-xl font-semibold text-white mb-4">Troubleshooting</h2>
            
            <div className="space-y-4 text-blue-200">
              <div>
                <h3 className="font-semibold text-white mb-2">Common Issues:</h3>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li><strong>403 Forbidden:</strong> Check that your email and API token are correct</li>
                  <li><strong>404 Not Found:</strong> Verify your Jira base URL is correct</li>
                  <li><strong>Connection timeout:</strong> Check your internet connection and Jira server status</li>
                  <li><strong>Environment variables not loading:</strong> Make sure you restarted your development server</li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-semibold text-white mb-2">Need Help?</h3>
                <p>
                  If you're still having issues, check the{' '}
                  <a href="https://developer.atlassian.com/cloud/jira/platform/basic-auth-for-rest-apis/" target="_blank" rel="noopener noreferrer" className="text-teal-400 hover:text-teal-300 underline">
                    Atlassian API documentation
                  </a>{' '}
                  for more detailed setup instructions.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

