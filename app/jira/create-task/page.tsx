'use client';

import { useState, useEffect } from 'react';
import Navigation from '../../components/Navigation';

interface Project {
  key: string;
  name: string;
}

interface TeamMember {
  accountId: string;
  displayName: string;
  emailAddress: string;
}

export default function CreateTask() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [success, setSuccess] = useState(false);

  const [taskData, setTaskData] = useState({
    projectKey: '',
    summary: '',
    description: '',
    issueType: 'Idea',
    priority: 'Medium',
    assignee: '',
    dueDate: '',
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [projectsRes, membersRes] = await Promise.all([
        fetch('/api/jira/projects'),
        fetch('/api/jira/users'),
      ]);

      const projectsData = await projectsRes.json();
      const membersData = await membersRes.json();

      if (projectsData.success) {
        setProjects(projectsData.data);
        if (projectsData.data.length > 0) {
          setTaskData(prev => ({ ...prev, projectKey: projectsData.data[0].key }));
        }
      }

      if (membersData.success) {
        setTeamMembers(membersData.data);
      }
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setLoading(false);
    }
  };

  const createTask = async () => {
    if (!taskData.summary.trim()) {
      alert('Please enter a task summary');
      return;
    }

    if (!taskData.projectKey) {
      alert('Please select a project');
      return;
    }

    setCreating(true);
    try {
      const response = await fetch('/api/jira/issues', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(taskData),
      });

      const data = await response.json();
      
      if (data.success) {
        setSuccess(true);
        setTaskData({
          projectKey: taskData.projectKey,
          summary: '',
          description: '',
          issueType: 'Idea',
          priority: 'Medium',
          assignee: '',
          dueDate: '',
        });
        
        setTimeout(() => setSuccess(false), 3000);
      } else {
        alert(data.error || 'Failed to create task');
      }
    } catch (error) {
      alert('Failed to create task. Please try again.');
    } finally {
      setCreating(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
        <Navigation />
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-white text-lg">Loading...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Create New Task</h1>
            <p className="text-blue-200">Create and assign tasks to your team members</p>
          </div>

          {success && (
            <div className="bg-green-500/20 border border-green-500/50 rounded-lg p-4 mb-6">
              <div className="text-green-200">✅ Task created successfully!</div>
            </div>
          )}

          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
            <div className="space-y-6">
              {/* Project Selection */}
              <div>
                <label className="block text-white font-semibold mb-2">Project</label>
                <select
                  value={taskData.projectKey}
                  onChange={(e) => setTaskData({...taskData, projectKey: e.target.value})}
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                >
                  {projects.map((project) => (
                    <option key={project.key} value={project.key} className="bg-gray-800">
                      {project.name} ({project.key})
                    </option>
                  ))}
                </select>
              </div>

              {/* Task Summary */}
              <div>
                <label className="block text-white font-semibold mb-2">Task Summary *</label>
                <input
                  type="text"
                  value={taskData.summary}
                  onChange={(e) => setTaskData({...taskData, summary: e.target.value})}
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  placeholder="Enter task summary..."
                />
              </div>

              {/* Task Description */}
              <div>
                <label className="block text-white font-semibold mb-2">Description</label>
                <textarea
                  value={taskData.description}
                  onChange={(e) => setTaskData({...taskData, description: e.target.value})}
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  rows={4}
                  placeholder="Enter task description..."
                />
              </div>

              {/* Task Type and Priority */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-white font-semibold mb-2">Type</label>
                  <select
                    value={taskData.issueType}
                    onChange={(e) => setTaskData({...taskData, issueType: e.target.value})}
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                  >
                    <option value="Idea" className="bg-gray-800">Idea</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-white font-semibold mb-2">Priority</label>
                  <select
                    value={taskData.priority}
                    onChange={(e) => setTaskData({...taskData, priority: e.target.value})}
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                  >
                    <option value="Low" className="bg-gray-800">Low</option>
                    <option value="Medium" className="bg-gray-800">Medium</option>
                    <option value="High" className="bg-gray-800">High</option>
                    <option value="Highest" className="bg-gray-800">Highest</option>
                  </select>
                </div>
              </div>

              {/* Assignment and Due Date */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-white font-semibold mb-2">Assign to</label>
                  <select
                    value={taskData.assignee}
                    onChange={(e) => setTaskData({...taskData, assignee: e.target.value})}
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                  >
                    <option value="" className="bg-gray-800">Unassigned</option>
                    {teamMembers.map((member) => (
                      <option key={member.accountId} value={member.emailAddress} className="bg-gray-800">
                        {member.displayName}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-white font-semibold mb-2">Due Date</label>
                  <input
                    type="date"
                    value={taskData.dueDate}
                    onChange={(e) => setTaskData({...taskData, dueDate: e.target.value})}
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
              </div>

              {/* Create Button */}
              <div className="flex justify-end space-x-4 pt-4">
                <a
                  href="/jira"
                  className="px-6 py-3 text-blue-200 hover:text-white transition-colors"
                >
                  Cancel
                </a>
                <button
                  onClick={createTask}
                  disabled={creating || !taskData.summary.trim()}
                  className="bg-teal-600 hover:bg-teal-700 disabled:bg-gray-400 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
                >
                  {creating ? 'Creating...' : 'Create Task'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

