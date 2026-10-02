import React, { useState } from 'react';
import { Search, Plus, Phone, Video, MoreVertical, Send, Paperclip, Smile } from 'lucide-react';

export const Messages: React.FC = () => {
  const [selectedChat, setSelectedChat] = useState(1);
  const [message, setMessage] = useState('');

  const conversations = [
    {
      id: 1,
      name: 'Sarah Wilson',
      lastMessage: 'I can help you with your data analysis project',
      timestamp: '2 min ago',
      unread: 2,
      online: true,
      avatar: 'SW'
    },
    {
      id: 2,
      name: 'Study Group - CS301',
      lastMessage: 'Meeting tomorrow at 3 PM in library',
      timestamp: '1 hour ago',
      unread: 0,
      online: false,
      avatar: 'SG',
      isGroup: true
    },
    {
      id: 3,
      name: 'Dr. Michael Chen',
      lastMessage: 'Your assignment submission looks good',
      timestamp: '3 hours ago',
      unread: 0,
      online: false,
      avatar: 'MC'
    },
    {
      id: 4,
      name: 'Alex Thompson',
      lastMessage: 'Thanks for the Python tutorial!',
      timestamp: '1 day ago',
      unread: 0,
      online: true,
      avatar: 'AT'
    }
  ];

  const messages = [
    {
      id: 1,
      sender: 'other',
      text: 'Hey! I saw your project post about the data analysis assignment. I can help you with that.',
      timestamp: new Date(Date.now() - 300000)
    },
    {
      id: 2,
      sender: 'user',
      text: 'That would be great! What\'s your experience with Python and pandas?',
      timestamp: new Date(Date.now() - 240000)
    },
    {
      id: 3,
      sender: 'other',
      text: 'I have 3+ years of experience with data science. I can show you some examples of my previous work.',
      timestamp: new Date(Date.now() - 180000)
    },
    {
      id: 4,
      sender: 'user',
      text: 'Perfect! When would you be available for a quick call to discuss the project details?',
      timestamp: new Date(Date.now() - 120000)
    },
    {
      id: 5,
      sender: 'other',
      text: 'I\'m free this evening after 6 PM. We can also start with the basic data cleaning if you want.',
      timestamp: new Date(Date.now() - 60000)
    }
  ];

  const selectedConversation = conversations.find(c => c.id === selectedChat);

  const handleSendMessage = () => {
    if (message.trim()) {
      // Add message logic here
      setMessage('');
    }
  };

  return (
    <div className="h-[calc(100vh-8rem)] bg-white rounded-xl shadow-sm border border-gray-100 flex">
      {/* Conversations List */}
      <div className="w-1/3 border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Messages</h2>
            <button className="p-2 hover:bg-gray-100 rounded-lg">
              <Plus className="w-5 h-5 text-gray-600" />
            </button>
          </div>
          
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search conversations..."
              className="w-full pl-9 pr-4 py-2 bg-gray-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {conversations.map((conversation) => (
            <div
              key={conversation.id}
              onClick={() => setSelectedChat(conversation.id)}
              className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${
                selectedChat === conversation.id ? 'bg-purple-50 border-purple-200' : ''
              }`}
            >
              <div className="flex items-start space-x-3">
                <div className="relative">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-semibold ${
                    conversation.isGroup ? 'bg-green-500' : 'bg-gradient-to-r from-purple-600 to-blue-600'
                  }`}>
                    {conversation.avatar}
                  </div>
                  {conversation.online && (
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
                  )}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium text-gray-900 truncate">{conversation.name}</h3>
                    <span className="text-xs text-gray-500">{conversation.timestamp}</span>
                  </div>
                  <p className="text-sm text-gray-600 truncate mt-1">{conversation.lastMessage}</p>
                </div>
                
                {conversation.unread > 0 && (
                  <div className="w-5 h-5 bg-purple-600 text-white text-xs rounded-full flex items-center justify-center">
                    {conversation.unread}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {selectedConversation ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b border-gray-200 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold ${
                    selectedConversation.isGroup ? 'bg-green-500' : 'bg-gradient-to-r from-purple-600 to-blue-600'
                  }`}>
                    {selectedConversation.avatar}
                  </div>
                  {selectedConversation.online && (
                    <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                  )}
                </div>
                
                <div>
                  <h3 className="font-medium text-gray-900">{selectedConversation.name}</h3>
                  <p className="text-sm text-gray-500">
                    {selectedConversation.online ? 'Online' : 'Last seen recently'}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <button className="p-2 hover:bg-gray-100 rounded-lg">
                  <Phone className="w-5 h-5 text-gray-600" />
                </button>
                <button className="p-2 hover:bg-gray-100 rounded-lg">
                  <Video className="w-5 h-5 text-gray-600" />
                </button>
                <button className="p-2 hover:bg-gray-100 rounded-lg">
                  <MoreVertical className="w-5 h-5 text-gray-600" />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                      msg.sender === 'user'
                        ? 'bg-purple-600 text-white'
                        : 'bg-gray-100 text-gray-900'
                    }`}
                  >
                    <p className="text-sm">{msg.text}</p>
                    <p className={`text-xs mt-1 ${
                      msg.sender === 'user' ? 'text-purple-200' : 'text-gray-500'
                    }`}>
                      {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Message Input */}
            <div className="p-4 border-t border-gray-200">
              <div className="flex items-center space-x-3">
                <button className="p-2 hover:bg-gray-100 rounded-lg">
                  <Paperclip className="w-5 h-5 text-gray-600" />
                </button>
                
                <div className="flex-1 bg-gray-100 rounded-full px-4 py-2 flex items-center">
                  <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-1 bg-transparent outline-none text-gray-900"
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  />
                  <button className="p-1 hover:bg-gray-200 rounded-full">
                    <Smile className="w-5 h-5 text-gray-600" />
                  </button>
                </div>
                
                <button
                  onClick={handleSendMessage}
                  className="p-2 bg-purple-600 hover:bg-purple-700 rounded-full transition-colors"
                >
                  <Send className="w-5 h-5 text-white" />
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Plus className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No conversation selected</h3>
              <p className="text-gray-500">Choose a conversation to start messaging</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};