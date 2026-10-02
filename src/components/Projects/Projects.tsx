import React, { useState } from 'react';
import { Search, Filter, Plus, Clock, DollarSign, Users, BookOpen, Star } from 'lucide-react';

interface ProjectsProps {
  showCreateModal?: boolean;
}

export const Projects: React.FC<ProjectsProps> = ({ showCreateModal = false }) => {
  const [activeTab, setActiveTab] = useState('browse');
  const [showCreateProject, setShowCreateProject] = useState(showCreateModal);

  React.useEffect(() => {
    if (showCreateModal) {
      setShowCreateProject(true);
    }
  }, [showCreateModal]);

  const projects = [
    {
      id: 1,
      title: 'Data Analysis for Marketing Research',
      description: 'Need help analyzing customer survey data using Python and statistical methods.',
      budget: '$50-100',
      deadline: '3 days',
      skills: ['Python', 'Statistics', 'Data Visualization'],
      applicants: 5,
      posted: '2 hours ago',
      urgent: true
    },
    {
      id: 2,
      title: 'Web Development - E-commerce Site',
      description: 'Looking for a developer to create a simple e-commerce website using React.',
      budget: '$200-300',
      deadline: '1 week',
      skills: ['React', 'JavaScript', 'CSS'],
      applicants: 12,
      posted: '5 hours ago',
      urgent: false
    },
    {
      id: 3,
      title: 'Essay Writing - History Assignment',
      description: 'Need assistance with research and writing for a 3000-word history essay.',
      budget: '$80-120',
      deadline: '5 days',
      skills: ['Research', 'Writing', 'History'],
      applicants: 8,
      posted: '1 day ago',
      urgent: false
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Projects & Assignments</h1>
          <p className="text-gray-600">Find help or offer your expertise</p>
        </div>
        
        <button 
          onClick={() => setShowCreateProject(true)}
          className="px-6 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-medium hover:from-purple-700 hover:to-blue-700 transition-all flex items-center space-x-2"
        >
          <Plus className="w-5 h-5" />
          <span>Post Project</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
        <button
          onClick={() => setActiveTab('browse')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
            activeTab === 'browse'
              ? 'bg-white text-purple-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Browse Projects
        </button>
        <button
          onClick={() => setActiveTab('my-projects')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
            activeTab === 'my-projects'
              ? 'bg-white text-purple-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          My Projects
        </button>
        <button
          onClick={() => setActiveTab('applications')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
            activeTab === 'applications'
              ? 'bg-white text-purple-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Applications
        </button>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search projects..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
          />
        </div>
        <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
          <Filter className="w-5 h-5 text-gray-600" />
          <span className="text-gray-700">Filters</span>
        </button>
      </div>

      {/* Projects List */}
      <div className="space-y-4">
        {projects.map((project) => (
          <div key={project.id} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                    {project.title}
                    {project.urgent && (
                      <span className="ml-2 px-2 py-1 bg-red-100 text-red-800 text-xs font-medium rounded-full">
                        Urgent
                      </span>
                    )}
                  </h3>
                </div>
                
                <p className="text-gray-600 mb-4">{project.description}</p>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.skills.map((skill, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-purple-100 text-purple-800 text-sm font-medium rounded-full"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
                
                <div className="flex items-center space-x-6 text-sm text-gray-500">
                  <div className="flex items-center space-x-1">
                    <DollarSign className="w-4 h-4" />
                    <span>{project.budget}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Clock className="w-4 h-4" />
                    <span>{project.deadline}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Users className="w-4 h-4" />
                    <span>{project.applicants} applicants</span>
                  </div>
                  <span>{project.posted}</span>
                </div>
              </div>
              
              <div className="flex flex-col space-y-2 lg:ml-6">
                <button 
                  onClick={() => alert('Application submitted! The project owner will be notified.')}
                  className="px-6 py-2 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors"
                >
                  Apply Now
                </button>
                <button 
                  onClick={() => alert('Project saved to your favorites!')}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Create Project Modal */}
      {showCreateProject && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">Create New Project</h2>
              <button
                onClick={() => setShowCreateProject(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                ×
              </button>
            </div>
            <div className="p-6">
              <p className="text-gray-600 mb-4">Project creation form would go here...</p>
              <button
                onClick={() => {
                  alert('Project created successfully!');
                  setShowCreateProject(false);
                }}
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 rounded-lg font-medium hover:from-purple-700 hover:to-blue-700 transition-all"
              >
                Create Project
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};