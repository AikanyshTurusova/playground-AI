'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import Navigation from '../components/Navigation';
import { JiraIssue, JiraProject } from '../../lib/jira';

export default function JiraDashboard() {
  const { user } = useUser();
  const [projects, setProjects] = useState<JiraProject[]>([]);
  const [issues, setIssues] = useState<JiraIssue[]>([]);
  const [selectedProject, setSelectedProject] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newIssue, setNewIssue] = useState({
    projectKey: '',
    summary: '',
    description: '',
    issueType: 'Idea',
    priority: 'Medium',
    assignee: '',
    dueDate: '',
  });
  const [teamMembers, setTeamMembers] = useState<any[]>([]);
  const [viewMode, setViewMode] = useState<'list' | 'kanban'>('list');

  useEffect(() => {
    loadProjects();
  }, []);

  useEffect(() => {
    if (selectedProject) {
      loadIssues(selectedProject);
      loadTeamMembers();
    }
  }, [selectedProject]);

  const loadProjects = async () => {
    try {
      const response = await fetch('/api/jira/projects');
      const data = await response.json();
      
      if (data.success) {
        setProjects(data.data);
        if (data.data.length > 0) {
          setSelectedProject(data.data[0].key);
        }
      } else {
        setError('Failed to load Jira projects. Please check your Jira configuration.');
      }
    } catch (error) {
      setError('Failed to connect to Jira. Please check your configuration.');
    } finally {
      setLoading(false);
    }
  };

  const loadIssues = async (projectKey: string) => {
    try {
      const response = await fetch(`/api/jira/issues?projectKey=${projectKey}`);
      const data = await response.json();
      
      if (data.success) {
        setIssues(data.data);
      } else {
        setError('Failed to load issues');
      }
    } catch (error) {
      setError('Failed to load issues');
    }
  };

  const loadTeamMembers = async () => {
    try {
      const response = await fetch('/api/jira/users');
      const data = await response.json();
      
      if (data.success) {
        setTeamMembers(data.data);
      }
    } catch (error) {
      console.error('Failed to load team members:', error);
    }
  };

  const createIssue = async () => {
    if (!newIssue.summary.trim()) {
      alert('Please enter a task summary');
      return;
    }

    if (!newIssue.projectKey) {
      alert('Please select a project');
      return;
    }

    try {
      console.log('Creating issue with data:', newIssue);
      const response = await fetch('/api/jira/issues', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newIssue),
      });

      const data = await response.json();
      console.log('Create issue response:', data);
      
      if (data.success) {
        setShowCreateModal(false);
        setNewIssue({
          projectKey: '',
          summary: '',
          description: '',
          issueType: 'Idea',
          priority: 'Medium',
          assignee: '',
          dueDate: '',
        });
        
        // Show success message
        alert(`Task "${newIssue.summary}" created successfully!`);
        
        // Reload issues
        if (selectedProject) {
          loadIssues(selectedProject);
        }
      } else {
        alert(data.error || 'Failed to create task');
      }
    } catch (error) {
      console.error('Error creating issue:', error);
      alert('Failed to create task. Please try again.');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'done':
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'in progress':
      case 'in development':
        return 'bg-blue-100 text-blue-800';
      case 'to do':
      case 'open':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'highest':
      case 'critical':
        return 'bg-red-100 text-red-800';
      case 'high':
        return 'bg-orange-100 text-orange-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const extractDescriptionText = (description: any): string => {
    if (!description) return '';
    if (typeof description === 'string') return description;
    
    // Handle Jira's ADF (Atlassian Document Format) structure
    if (description.content && Array.isArray(description.content)) {
      const extractText = (content: any[]): string => {
        return content.map(item => {
          if (item.type === 'text') {
            return item.text || '';
          } else if (item.content && Array.isArray(item.content)) {
            return extractText(item.content);
          }
          return '';
        }).join('');
      };
      
      return extractText(description.content);
    }
    
    return 'No description available';
  };

  const KanbanBoard = ({ issues }: { issues: JiraIssue[] }) => {
    const columns = [
      { id: 'parking-lot', title: 'Backlog', status: 'Parking lot' },
      { id: 'in-progress', title: 'In Progress', status: 'In Progress' },
      { id: 'done', title: 'Done', status: 'Done' },
    ];

    const getIssuesByStatus = (status: string) => {
      return issues.filter(issue => issue.status.name === status);
    };

    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {columns.map((column) => (
          <div key={column.id} className="bg-white/5 rounded-lg p-4">
            <h3 className="text-white font-semibold mb-4 flex items-center justify-between">
              {column.title}
              <span className="bg-teal-600 text-white text-xs px-2 py-1 rounded-full">
                {getIssuesByStatus(column.status).length}
              </span>
            </h3>
            <div className="space-y-3">
              {getIssuesByStatus(column.status).map((issue) => (
                <div key={issue.id} className="bg-white/10 border border-white/20 rounded-lg p-3 hover:bg-white/15 transition-colors cursor-pointer">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-medium text-teal-300">{issue.key}</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(issue.priority.name)}`}>
                      {issue.priority.name}
                    </span>
                  </div>
                  <h4 className="text-white text-sm font-medium mb-2 line-clamp-2">{issue.summary}</h4>
                  {issue.assignee && (
                    <div className="flex items-center text-xs text-blue-200">
                      <span>👤 {issue.assignee.displayName}</span>
                    </div>
                  )}
                </div>
              ))}
              {getIssuesByStatus(column.status).length === 0 && (
                <div className="text-center py-8 text-blue-200 text-sm">
                  No tasks in this column
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
        <Navigation />
        <div className="flex items-center justify-center min-h-[80vh]">
          <div className="text-white text-xl">Loading Jira projects...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
        <Navigation />
        <div className="container mx-auto px-4 py-8">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-red-800 mb-2">Jira Configuration Required</h2>
            <p className="text-red-700 mb-4">{error}</p>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-800 mb-2">To set up Jira integration:</h3>
              <ol className="list-decimal list-inside text-gray-700 space-y-1">
                <li>Go to your Atlassian account settings</li>
                <li>Create an API token</li>
                <li>Add these environment variables to your .env.local file:</li>
              </ol>
              <div className="mt-3 bg-gray-800 text-green-400 p-3 rounded font-mono text-sm">
                JIRA_BASE_URL=https://your-domain.atlassian.net<br/>
                JIRA_EMAIL=your-email@example.com<br/>
                JIRA_API_TOKEN=your-api-token
              </div>
            </div>
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
            <h1 className="text-3xl font-bold text-white mb-2">Team Project Management</h1>
            <p className="text-blue-200">Manage your team, tasks, and track productivity with Jira integration</p>
          </div>
          <div className="flex items-center space-x-4">
            <a
              href="/jira/team"
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors"
            >
              Manage Team
            </a>
            <a
              href="/jira/member"
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors"
            >
              My Tasks
            </a>
            <a
              href="/jira/create-task"
              className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors"
            >
              Create Task
            </a>
            <div className="flex bg-white/10 rounded-lg p-1">
              <button
                onClick={() => setViewMode('list')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  viewMode === 'list' 
                    ? 'bg-teal-600 text-white' 
                    : 'text-blue-200 hover:text-white'
                }`}
              >
                List View
              </button>
              <button
                onClick={() => setViewMode('kanban')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  viewMode === 'kanban' 
                    ? 'bg-teal-600 text-white' 
                    : 'text-blue-200 hover:text-white'
                }`}
              >
                Kanban Board
              </button>
            </div>

          </div>
        </div>

        {/* Project Selector and Team Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <div className="lg:col-span-1">
            <label className="block text-white font-semibold mb-2">Select Project:</label>
            <select
              value={selectedProject}
              onChange={(e) => setSelectedProject(e.target.value)}
              className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              {projects.map((project) => (
                <option key={project.key} value={project.key} className="bg-gray-800">
                  {project.name} ({project.key})
                </option>
              ))}
            </select>
          </div>
          
          <div className="lg:col-span-2">
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-white/10 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-white">{issues.length}</div>
                <div className="text-blue-200 text-sm">Total Tasks</div>
              </div>
              <div className="bg-white/10 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-white">
                  {issues.filter(issue => issue.status.name === 'Done').length}
                </div>
                <div className="text-blue-200 text-sm">Completed</div>
              </div>
              <div className="bg-white/10 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-white">
                  {issues.filter(issue => issue.assignee).length}
                </div>
                <div className="text-blue-200 text-sm">Assigned</div>
              </div>
            </div>
          </div>
        </div>

        {/* Issues Display */}
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
          <h2 className="text-xl font-semibold text-white mb-4">
            {viewMode === 'list' ? 'Tasks' : 'Kanban Board'} - {projects.find(p => p.key === selectedProject)?.name}
          </h2>
          
          {issues.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-blue-200">No tasks found in this project.</p>
            </div>
          ) : viewMode === 'list' ? (
            <div className="space-y-4">
              {issues.map((issue) => (
                <div key={issue.id} className="bg-white/5 border border-white/10 rounded-lg p-4 hover:bg-white/10 transition-colors">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center space-x-3">
                      <span className="font-semibold text-white">{issue.key}</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(issue.status.name)}`}>
                        {issue.status.name}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(issue.priority.name)}`}>
                        {issue.priority.name}
                      </span>
                    </div>
                    <span className="text-sm text-blue-200">
                      {new Date(issue.updated).toLocaleDateString()}
                    </span>
                  </div>
                  
                  <h3 className="text-white font-medium mb-2">{issue.summary}</h3>
                  
                  {issue.description && (
                    <p className="text-blue-200 text-sm mb-3 line-clamp-2">
                      {extractDescriptionText(issue.description)}
                    </p>
                  )}
                  
                  <div className="flex justify-between items-center text-sm text-blue-200">
                    <div>
                      <span>Reporter: {issue.reporter.displayName}</span>
                      {issue.assignee && (
                        <span className="ml-4">Assignee: {issue.assignee.displayName}</span>
                      )}
                    </div>
                    <span>Type: {issue.issuetype.name}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <KanbanBoard issues={issues} />
          )}
        </div>
      </div>


    </div>
  );
}
