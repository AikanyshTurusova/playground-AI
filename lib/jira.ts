// Jira API Integration
export interface JiraIssue {
  id: string;
  key: string;
  summary: string;
  description?: string | any;
  status: {
    name: string;
    statusCategory: {
      name: string;
    };
  };
  priority: {
    name: string;
  };
  assignee?: {
    displayName: string;
    emailAddress: string;
  };
  reporter: {
    displayName: string;
    emailAddress: string;
  };
  created: string;
  updated: string;
  project: {
    key: string;
    name: string;
  };
  issuetype: {
    name: string;
  };
}

export interface JiraProject {
  id: string;
  key: string;
  name: string;
  description?: string;
  lead: {
    displayName: string;
  };
  projectTypeKey: string;
}

export interface CreateIssueData {
  projectKey: string;
  summary: string;
  description?: string;
  issueType: string;
  priority?: string;
  assignee?: string;
  dueDate?: string;
}

class JiraClient {
  private baseUrl: string;
  private email: string;
  private apiToken: string;

  constructor() {
    this.baseUrl = process.env.JIRA_BASE_URL || '';
    this.email = process.env.JIRA_EMAIL || '';
    this.apiToken = process.env.JIRA_API_TOKEN || '';
  }

  private getAuthHeader(): string {
    const auth = Buffer.from(`${this.email}:${this.apiToken}`).toString('base64');
    return `Basic ${auth}`;
  }

  private async makeRequest(endpoint: string, options: RequestInit = {}): Promise<any> {
    const url = `${this.baseUrl}/rest/api/3${endpoint}`;
    
    const response = await fetch(url, {
      ...options,
      headers: {
        'Authorization': this.getAuthHeader(),
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Jira API Error: ${response.status} - ${errorText}`);
      console.error(`URL: ${url}`);
      console.error(`Request body:`, options.body);
      throw new Error(`Jira API Error: ${response.status} - ${errorText}`);
    }

    // Handle empty responses (common with transitions)
    const text = await response.text();
    if (!text) {
      return {}; // Return empty object for successful transitions
    }
    
    try {
      return JSON.parse(text);
    } catch (error) {
      console.error('Failed to parse JSON response:', text);
      return {}; // Return empty object if JSON parsing fails
    }
  }

  async getProjects(): Promise<JiraProject[]> {
    try {
      const data = await this.makeRequest('/project');
      return data.map((project: any) => ({
        id: project.id,
        key: project.key,
        name: project.name,
        description: project.description,
        lead: project.lead,
        projectTypeKey: project.projectTypeKey,
      }));
    } catch (error) {
      console.error('Error fetching Jira projects:', error);
      throw error;
    }
  }

  async getIssues(projectKey?: string, jql?: string): Promise<JiraIssue[]> {
    try {
      let query = '';
      if (jql) {
        query = jql;
      } else if (projectKey) {
        query = `project = ${projectKey}`;
      } else {
        query = 'ORDER BY created DESC';
      }

      const data = await this.makeRequest(`/search?jql=${encodeURIComponent(query)}&maxResults=100`);
      
      return data.issues.map((issue: any) => ({
        id: issue.id,
        key: issue.key,
        summary: issue.fields.summary,
        description: issue.fields.description,
        status: {
          name: issue.fields.status.name,
          statusCategory: issue.fields.status.statusCategory,
        },
        priority: {
          name: issue.fields.priority?.name || 'Medium',
        },
        assignee: issue.fields.assignee ? {
          displayName: issue.fields.assignee.displayName,
          emailAddress: issue.fields.assignee.emailAddress,
        } : undefined,
        reporter: {
          displayName: issue.fields.reporter.displayName,
          emailAddress: issue.fields.reporter.emailAddress,
        },
        created: issue.fields.created,
        updated: issue.fields.updated,
        project: {
          key: issue.fields.project.key,
          name: issue.fields.project.name,
        },
        issuetype: {
          name: issue.fields.issuetype.name,
        },
      }));
    } catch (error) {
      console.error('Error fetching Jira issues:', error);
      throw error;
    }
  }

  async createIssue(issueData: CreateIssueData): Promise<JiraIssue> {
    try {
      const payload: any = {
        fields: {
          project: {
            key: issueData.projectKey,
          },
          summary: issueData.summary,
          issuetype: {
            id: issueData.issueType === 'Idea' ? '10001' : issueData.issueType,
          },
        },
      };

      // Add assignee if provided (only if it's a valid email)
      if (issueData.assignee && issueData.assignee.includes('@')) {
        payload.fields.assignee = {
          emailAddress: issueData.assignee,
        };
      }

      // Add due date if provided
      if (issueData.dueDate) {
        payload.fields.duedate = issueData.dueDate;
      }

      // Add priority if provided
      if (issueData.priority) {
        payload.fields.priority = {
          name: issueData.priority,
        };
      }

      console.log('Creating Jira issue with payload:', JSON.stringify(payload, null, 2));
      const data = await this.makeRequest('/issue', {
        method: 'POST',
        body: JSON.stringify(payload),
      });

      // Fetch the created issue to get full details
      return this.getIssue(data.key);
    } catch (error) {
      console.error('Error creating Jira issue:', error);
      throw error;
    }
  }

  async getIssue(issueKey: string): Promise<JiraIssue> {
    try {
      const data = await this.makeRequest(`/issue/${issueKey}`);
      
      return {
        id: data.id,
        key: data.key,
        summary: data.fields.summary,
        description: data.fields.description,
        status: {
          name: data.fields.status.name,
          statusCategory: data.fields.status.statusCategory,
        },
        priority: {
          name: data.fields.priority?.name || 'Medium',
        },
        assignee: data.fields.assignee ? {
          displayName: data.fields.assignee.displayName,
          emailAddress: data.fields.assignee.emailAddress,
        } : undefined,
        reporter: {
          displayName: data.fields.reporter.displayName,
          emailAddress: data.fields.reporter.emailAddress,
        },
        created: data.fields.created,
        updated: data.fields.updated,
        project: {
          key: data.fields.project.key,
          name: data.fields.project.name,
        },
        issuetype: {
          name: data.fields.issuetype.name,
        },
      };
    } catch (error) {
      console.error('Error fetching Jira issue:', error);
      throw error;
    }
  }

  async getTransitions(issueKey: string): Promise<any[]> {
    try {
      const data = await this.makeRequest(`/issue/${issueKey}/transitions`);
      return data.transitions || [];
    } catch (error) {
      console.error('Error fetching transitions:', error);
      throw error;
    }
  }

  async transitionIssue(issueKey: string, transitionId: string, comment?: string): Promise<JiraIssue> {
    try {
      const payload: any = {
        transition: {
          id: transitionId
        }
      };

      // Skip comment for now to avoid ADF format issues
      // if (comment) {
      //   payload.update = {
      //     comment: [{
      //       add: {
      //         body: {
      //           type: "doc",
      //           version: 1,
      //           content: [{
      //             type: "paragraph",
      //             content: [{
      //               type: "text",
      //               text: comment
      //             }]
      //           }]
      //         }
      //       }
      //     }]
      //   };
      // }

      console.log('Transitioning Jira issue with payload:', JSON.stringify(payload, null, 2));

      await this.makeRequest(`/issue/${issueKey}/transitions`, {
        method: 'POST',
        body: JSON.stringify(payload),
      });

      return this.getIssue(issueKey);
    } catch (error) {
      console.error('Error transitioning Jira issue:', error);
      throw error;
    }
  }

  async updateIssue(issueKey: string, updateData: any): Promise<JiraIssue> {
    try {
      // Handle status updates using transitions
      if (updateData.status) {
        const transitions = await this.getTransitions(issueKey);
        console.log('Available transitions:', transitions.map(t => ({ id: t.id, name: t.name, to: t.to?.name })));
        
        // Map status names to transition names based on your actual Jira workflow
        const statusToTransition: { [key: string]: string } = {
          'Parking lot': 'Parking lot',
          'In Progress': 'Discovery',  // Map In Progress to Discovery
          'Done': 'Done',
          'Backlog': 'Parking lot'
        };
        
        const targetStatus = statusToTransition[updateData.status] || updateData.status;
        const transition = transitions.find(t => t.to?.name === targetStatus);
        
        if (transition) {
          console.log(`Found transition: ${transition.name} (${transition.id}) to ${transition.to?.name}`);
          return await this.transitionIssue(issueKey, transition.id, `Status updated to ${updateData.status}`);
        } else {
          console.error(`No transition found for status: ${updateData.status}`);
          console.error('Available transitions:', transitions.map(t => t.to?.name));
          throw new Error(`No transition available for status: ${updateData.status}`);
        }
      }

      // Handle other field updates (non-status)
      const payload: any = {
        fields: {},
      };

      if (updateData.summary) payload.fields.summary = updateData.summary;
      if (updateData.description) payload.fields.description = updateData.description;
      if (updateData.priority) {
        payload.fields.priority = typeof updateData.priority === 'string' 
          ? { name: updateData.priority } 
          : updateData.priority;
      }
      if (updateData.assignee) {
        payload.fields.assignee = typeof updateData.assignee === 'string'
          ? { emailAddress: updateData.assignee }
          : updateData.assignee;
      }

      // Only update if there are non-status fields to update
      if (Object.keys(payload.fields).length > 0) {
        console.log('Updating Jira issue fields with payload:', JSON.stringify(payload, null, 2));
        await this.makeRequest(`/issue/${issueKey}`, {
          method: 'PUT',
          body: JSON.stringify(payload),
        });
      }

      return this.getIssue(issueKey);
    } catch (error) {
      console.error('Error updating Jira issue:', error);
      throw error;
    }
  }

  async getIssueTypes(projectKey?: string): Promise<any[]> {
    try {
      const endpoint = projectKey ? `/project/${projectKey}` : '/issuetype';
      const data = await this.makeRequest(endpoint);
      
      if (projectKey) {
        return data.issueTypes || [];
      }
      return data;
    } catch (error) {
      console.error('Error fetching issue types:', error);
      throw error;
    }
  }

  async getPriorities(): Promise<any[]> {
    try {
      const data = await this.makeRequest('/priority');
      return data;
    } catch (error) {
      console.error('Error fetching priorities:', error);
      throw error;
    }
  }

  async getUsers(query: string = ''): Promise<any[]> {
    try {
      // Use a default query if none provided
      const searchQuery = query || 'a';
      const endpoint = `/user/search?query=${encodeURIComponent(searchQuery)}&maxResults=50`;
      const data = await this.makeRequest(endpoint);
      return data;
    } catch (error) {
      console.error('Error fetching Jira users:', error);
      // Fallback to current user if search fails
      return [
        {
          accountId: 'current-user',
          displayName: 'Aikanysh Turusova',
          emailAddress: 'aikanyshmairambekovna03@gmail.com'
        }
      ];
    }
  }


  async testConnection(): Promise<boolean> {
    try {
      await this.makeRequest('/myself');
      return true;
    } catch (error) {
      console.error('Jira connection test failed:', error);
      return false;
    }
  }
}

export const jiraClient = new JiraClient();