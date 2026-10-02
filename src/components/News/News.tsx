import React, { useState } from 'react';
import { Bell, Calendar, MapPin, Star, Clock, Users, ExternalLink } from 'lucide-react';

export const News: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState('all');

  const categories = [
    { id: 'all', label: 'All News' },
    { id: 'events', label: 'Events' },
    { id: 'scholarships', label: 'Scholarships' },
    { id: 'alerts', label: 'Alerts' },
    { id: 'academic', label: 'Academic' }
  ];

  const news = [
    {
      id: 1,
      category: 'events',
      title: 'Annual Tech Conference 2024',
      description: 'Join industry leaders and students for networking and learning opportunities.',
      date: '2024-02-15',
      time: '9:00 AM',
      location: 'Main Auditorium',
      urgent: false,
      image: 'https://images.pexels.com/photos/2774556/pexels-photo-2774556.jpeg?auto=compress&cs=tinysrgb&w=400',
      attendees: 250
    },
    {
      id: 2,
      category: 'scholarships',
      title: 'Merit Scholarship Applications Open',
      description: 'Apply for the 2024 Merit Scholarship program. Deadline: March 1st, 2024.',
      date: '2024-03-01',
      urgent: true,
      amount: '$5,000',
      eligibility: 'GPA 3.5+'
    },
    {
      id: 3,
      category: 'alerts',
      title: 'Library Hours Extended During Finals',
      description: 'The library will be open 24/7 during the final examination period.',
      date: '2024-02-10',
      urgent: false,
      duration: 'Feb 20 - Mar 5'
    },
    {
      id: 4,
      category: 'academic',
      title: 'New Data Science Course Available',
      description: 'Introduction to Machine Learning - Now accepting enrollments for Spring semester.',
      date: '2024-02-08',
      instructor: 'Dr. Sarah Chen',
      credits: 3
    }
  ];

  const filteredNews = activeCategory === 'all' 
    ? news 
    : news.filter(item => item.category === activeCategory);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'events': return Calendar;
      case 'scholarships': return Star;
      case 'alerts': return Bell;
      case 'academic': return Users;
      default: return Bell;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'events': return 'bg-blue-100 text-blue-800';
      case 'scholarships': return 'bg-yellow-100 text-yellow-800';
      case 'alerts': return 'bg-red-100 text-red-800';
      case 'academic': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Campus News</h1>
          <p className="text-gray-600">Stay updated with the latest campus announcements</p>
        </div>
        
        <button 
          onClick={() => alert('Notification preferences updated!')}
          className="px-6 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-medium hover:from-purple-700 hover:to-blue-700 transition-all flex items-center space-x-2"
        >
          <Bell className="w-5 h-5" />
          <span>Enable Notifications</span>
        </button>
      </div>

      {/* Category Filters */}
      <div className="flex flex-wrap gap-2">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => setActiveCategory(category.id)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              activeCategory === category.id
                ? 'bg-purple-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {category.label}
          </button>
        ))}
      </div>

      {/* News Feed */}
      <div className="space-y-4">
        {filteredNews.map((item) => {
          const Icon = getCategoryIcon(item.category);
          const categoryColor = getCategoryColor(item.category);
          
          return (
            <div key={item.id} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className={`w-10 h-10 ${categoryColor.replace('text-', 'text-white ').replace('bg-', 'bg-')} rounded-lg flex items-center justify-center`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${categoryColor}`}>
                      {item.category.charAt(0).toUpperCase() + item.category.slice(1)}
                    </span>
                    {item.urgent && (
                      <span className="ml-2 px-2 py-1 bg-red-100 text-red-800 text-xs font-medium rounded-full">
                        Urgent
                      </span>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center text-sm text-gray-500">
                  <Clock className="w-4 h-4 mr-1" />
                  {new Date(item.date).toLocaleDateString()}
                </div>
              </div>

              <h3 className="text-lg font-semibold text-gray-900 mb-2">{item.title}</h3>
              <p className="text-gray-600 mb-4">{item.description}</p>

              {/* Category-specific details */}
              <div className="flex flex-wrap gap-4 text-sm text-gray-500 mb-4">
                {item.category === 'events' && (
                  <>
                    {item.time && (
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        {item.time}
                      </div>
                    )}
                    {item.location && (
                      <div className="flex items-center">
                        <MapPin className="w-4 h-4 mr-1" />
                        {item.location}
                      </div>
                    )}
                    {item.attendees && (
                      <div className="flex items-center">
                        <Users className="w-4 h-4 mr-1" />
                        {item.attendees} attending
                      </div>
                    )}
                  </>
                )}
                
                {item.category === 'scholarships' && (
                  <>
                    {item.amount && (
                      <div className="flex items-center font-medium text-green-600">
                        <Star className="w-4 h-4 mr-1" />
                        {item.amount}
                      </div>
                    )}
                    {item.eligibility && (
                      <div className="flex items-center">
                        <span>Eligibility: {item.eligibility}</span>
                      </div>
                    )}
                  </>
                )}
                
                {item.category === 'alerts' && item.duration && (
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-1" />
                    {item.duration}
                  </div>
                )}
                
                {item.category === 'academic' && (
                  <>
                    {item.instructor && (
                      <div className="flex items-center">
                        <Users className="w-4 h-4 mr-1" />
                        {item.instructor}
                      </div>
                    )}
                    {item.credits && (
                      <div className="flex items-center">
                        <span>{item.credits} Credits</span>
                      </div>
                    )}
                  </>
                )}
              </div>

              <div className="flex items-center justify-between">
                <button 
                  onClick={() => alert(`Opening details for: ${item.title}`)}
                  className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                >
                  <span>Learn More</span>
                  <ExternalLink className="w-4 h-4" />
                </button>
                
                <div className="flex space-x-2">
                  <button 
                    onClick={() => alert('Notification saved!')}
                    className="p-2 text-gray-400 hover:text-purple-600 transition-colors"
                  >
                    <Bell className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};