import React from 'react';

const UserMessage = ({ message }) => {
  const formatTimestamp = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <div className="flex gap-3 mb-4 justify-end">
      {/* Message Content */}
      <div className="max-w-[80%]">
        {/* Message Bubble */}
        <div className="rounded-lg p-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white">
          <div className="text-sm leading-relaxed">
            {typeof message.content === 'string' ? message.content : JSON.stringify(message.content)}
          </div>
          
          {/* Timestamp */}
          <div className="text-lg text-purple-100 mt-2 text-right">
            {formatTimestamp(message.timestamp)}
          </div>
        </div>
      </div>

      {/* Avatar */}
      <div className="flex-shrink-0">
        <div className="w-8 h-8 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center">
          <span className="text-gray-600 dark:text-gray-300 text-sm">👤</span>
        </div>
      </div>
    </div>
  );
};

export default UserMessage; 