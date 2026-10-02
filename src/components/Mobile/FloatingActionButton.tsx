import React, { useState } from 'react';
import { Plus, MessageCircle, Camera, FileText, X } from 'lucide-react';

interface FloatingActionButtonProps {
  onCreateProject: () => void;
  onCreateListing: () => void;
  onStartChat: () => void;
  onTakePhoto: () => void;
}

export const FloatingActionButton: React.FC<FloatingActionButtonProps> = ({
  onCreateProject,
  onCreateListing,
  onStartChat,
  onTakePhoto
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const actions = [
    { icon: FileText, label: 'Create Project', action: onCreateProject, color: 'bg-blue-500' },
    { icon: Camera, label: 'Add Listing', action: onCreateListing, color: 'bg-green-500' },
    { icon: MessageCircle, label: 'Start Chat', action: onStartChat, color: 'bg-purple-500' }
  ];

  const handleMainClick = () => {
    setIsExpanded(!isExpanded);
  };

  const handleActionClick = (action: () => void) => {
    action();
    setIsExpanded(false);
  };

  return (
    <div className="fixed bottom-20 right-4 z-40">
      {isExpanded && (
        <>
          <div
            className="fixed inset-0 bg-black bg-opacity-20"
            onClick={() => setIsExpanded(false)}
          />
          <div className="absolute bottom-16 right-0 space-y-3">
            {actions.map((action, index) => (
              <div
                key={index}
                className="flex items-center space-x-3 animate-in slide-in-from-bottom-2 duration-200"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <span className="bg-white px-3 py-2 rounded-lg shadow-lg text-sm font-medium text-gray-700 whitespace-nowrap">
                  {action.label}
                </span>
                <button
                  onClick={() => handleActionClick(action.action)}
                  className={`w-12 h-12 ${action.color} rounded-full shadow-lg flex items-center justify-center hover:scale-110 transition-transform`}
                >
                  <action.icon className="w-6 h-6 text-white" />
                </button>
              </div>
            ))}
          </div>
        </>
      )}
      
      <button
        onClick={handleMainClick}
        className={`w-14 h-14 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full shadow-lg flex items-center justify-center hover:scale-110 transition-all duration-200 ${
          isExpanded ? 'rotate-45' : ''
        }`}
      >
        {isExpanded ? (
          <X className="w-7 h-7 text-white" />
        ) : (
          <Plus className="w-7 h-7 text-white" />
        )}
      </button>
    </div>
  );
};