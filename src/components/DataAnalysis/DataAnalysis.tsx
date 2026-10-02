import React, { useEffect, useState } from 'react';
import { BarChart3, TrendingUp, Database, Brain, Upload, Download, Play, FileText } from 'lucide-react';

interface DataAnalysisProps {
  onNavigate?: (tab: string) => void;
}

export const DataAnalysis: React.FC<DataAnalysisProps> = ({ onNavigate }) => {
  const [activeTab, setActiveTab] = useState('tools');
  const [notice, setNotice] = useState<string | null>(null);

  useEffect(() => {
    if (!notice) return;
    const timeoutId = window.setTimeout(() => setNotice(null), 3200);
    return () => window.clearTimeout(timeoutId);
  }, [notice]);

  const aiTools = [
    {
      name: 'Statistical Analysis',
      description: 'Automated statistical tests and hypothesis testing',
      icon: BarChart3,
      color: 'bg-blue-500'
    },
    {
      name: 'Data Visualization',
      description: 'Generate charts and graphs from your datasets',
      icon: TrendingUp,
      color: 'bg-green-500'
    },
    {
      name: 'Predictive Modeling',
      description: 'Build machine learning models for predictions',
      icon: Brain,
      color: 'bg-purple-500'
    },
    {
      name: 'Data Cleaning',
      description: 'Automated data preprocessing and cleaning',
      icon: Database,
      color: 'bg-orange-500'
    }
  ];

  const experts = [
    {
      name: 'Dr. Sarah Chen',
      expertise: 'Statistics & Machine Learning',
      rating: 4.9,
      reviews: 127,
      hourlyRate: '$45',
      available: true
    },
    {
      name: 'Prof. Michael Rodriguez',
      expertise: 'Data Science & Analytics',
      rating: 4.8,
      reviews: 89,
      hourlyRate: '$60',
      available: false
    },
    {
      name: 'Alex Thompson',
      expertise: 'Python & R Programming',
      rating: 4.7,
      reviews: 156,
      hourlyRate: '$35',
      available: true
    }
  ];

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">Data Analysis Hub</h1>
        <p className="text-blue-100">AI-powered tools and expert support for your data projects</p>
      </div>

      {notice && (
        <div className="glass-panel neo-card px-4 py-3 text-sm text-slate-700">
          {notice}
        </div>
      )}

      {/* Tabs */}
      <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
        <button
          onClick={() => setActiveTab('tools')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
            activeTab === 'tools'
              ? 'bg-white text-purple-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          AI Tools
        </button>
        <button
          onClick={() => setActiveTab('experts')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
            activeTab === 'experts'
              ? 'bg-white text-purple-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Expert Services
        </button>
        <button
          onClick={() => setActiveTab('collaborate')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
            activeTab === 'collaborate'
              ? 'bg-white text-purple-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Collaborate
        </button>
      </div>

      {activeTab === 'tools' && (
        <div className="space-y-6">
          {/* Quick Upload */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Upload Your Dataset</h2>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-purple-400 transition-colors">
              <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 mb-2">Drag and drop your CSV, Excel, or JSON files here</p>
              <p className="text-sm text-gray-500 mb-4">or click to browse files</p>
              <button className="px-6 py-2 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors">
                Choose Files
              </button>
            </div>
          </div>

          {/* AI Tools Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {aiTools.map((tool, index) => (
              <div key={index} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <div className="flex items-start space-x-4">
                  <div className={`w-12 h-12 ${tool.color} rounded-lg flex items-center justify-center`}>
                    <tool.icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{tool.name}</h3>
                    <p className="text-gray-600 mb-4">{tool.description}</p>
                    <button 
                      onClick={() => {
                        setNotice(`${tool.name} is ready — upload a dataset to begin.`);
                      }}
                      className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      <Play className="w-4 h-4" />
                      <span>Try Now</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'experts' && (
        <div className="space-y-4">
          {experts.map((expert, index) => (
            <div key={index} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div className="flex items-start space-x-4">
                  <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-xl">{expert.name.charAt(0)}</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                      {expert.name}
                      {expert.available && (
                        <span className="ml-2 w-3 h-3 bg-green-500 rounded-full"></span>
                      )}
                    </h3>
                    <p className="text-gray-600 mb-2">{expert.expertise}</p>
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <div className="flex items-center space-x-1">
                        <span className="text-yellow-500">★</span>
                        <span>{expert.rating}</span>
                        <span>({expert.reviews} reviews)</span>
                      </div>
                      <span className="font-medium text-gray-900">{expert.hourlyRate}/hour</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex space-x-2">
                  <button 
                    onClick={() => {
                      if (onNavigate) {
                        onNavigate('messages');
                        return;
                      }
                      setNotice(`Open Messages to contact ${expert.name}.`);
                    }}
                    className="px-6 py-2 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors"
                  >
                    Contact
                  </button>
                  <button 
                    onClick={() => {
                      setNotice(`${expert.name}'s full profile is available from the Profile & Messages sections.`);
                    }}
                    className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                  >
                    View Profile
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'collaborate' && (
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Peer Collaboration</h2>
          <p className="text-gray-600 mb-6">Connect with fellow students for group projects and study sessions</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-4 border border-gray-200 rounded-lg">
              <h3 className="font-medium text-gray-900 mb-2">Study Groups</h3>
              <p className="text-sm text-gray-600 mb-4">Join or create study groups for data analysis courses</p>
              <button 
                onClick={() => {
                  if (onNavigate) {
                    onNavigate('messages');
                    return;
                  }
                  setNotice('Open Messages to start or join a study group.');
                }}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Find Groups
              </button>
            </div>
            
            <div className="p-4 border border-gray-200 rounded-lg">
              <h3 className="font-medium text-gray-900 mb-2">Project Partners</h3>
              <p className="text-sm text-gray-600 mb-4">Find partners for collaborative data projects</p>
              <button 
                onClick={() => {
                  if (onNavigate) {
                    onNavigate('messages');
                    return;
                  }
                  setNotice('Open Messages to find project partners.');
                }}
                className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                Find Partners
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
