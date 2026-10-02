import React, { useState, useRef, useEffect } from 'react';
import { Send, Paperclip, Smile, ArrowLeft, Phone, Video, MoreVertical } from 'lucide-react';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'other';
  timestamp: Date;
  type: 'text' | 'image' | 'file';
}

interface MobileChatProps {
  isOpen: boolean;
  onClose: () => void;
  recipient: {
    name: string;
    avatar?: string;
    online: boolean;
  };
}

export const MobileChat: React.FC<MobileChatProps> = ({
  isOpen,
  onClose,
  recipient
}) => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Hey! I saw your project post about the data analysis assignment. I can help you with that.',
      sender: 'other',
      timestamp: new Date(Date.now() - 300000),
      type: 'text'
    },
    {
      id: '2',
      text: 'That would be great! What\'s your experience with Python and pandas?',
      sender: 'user',
      timestamp: new Date(Date.now() - 240000),
      type: 'text'
    },
    {
      id: '3',
      text: 'I have 3+ years of experience with data science. I can show you some examples of my previous work.',
      sender: 'other',
      timestamp: new Date(Date.now() - 180000),
      type: 'text'
    }
  ]);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = () => {
    if (message.trim()) {
      const newMessage: Message = {
        id: Date.now().toString(),
        text: message,
        sender: 'user',
        timestamp: new Date(),
        type: 'text'
      };
      setMessages([...messages, newMessage]);
      setMessage('');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-white z-50 flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          
          <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center relative">
            <span className="text-white font-semibold">
              {recipient.name.charAt(0)}
            </span>
            {recipient.online && (
              <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-white rounded-full" />
            )}
          </div>
          
          <div>
            <h3 className="font-medium text-gray-900">{recipient.name}</h3>
            <p className="text-xs text-gray-500">
              {recipient.online ? 'Online' : 'Last seen recently'}
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
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="bg-white border-t border-gray-200 p-4">
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
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            />
            <button className="p-1 hover:bg-gray-200 rounded-full">
              <Smile className="w-5 h-5 text-gray-600" />
            </button>
          </div>
          
          <button
            onClick={handleSend}
            className="p-2 bg-purple-600 hover:bg-purple-700 rounded-full transition-colors"
          >
            <Send className="w-5 h-5 text-white" />
          </button>
        </div>
      </div>
    </div>
  );
};