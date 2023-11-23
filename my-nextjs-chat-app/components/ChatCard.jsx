
import React from 'react';

const ChatCard = ({ messages }) => {
  return (
    <div className="max-w-md mx-auto bg-white rounded-xl overflow-hidden md:max-w-2xl my-8 shadow-md">
      <div className="p-8">
        <h2 className="text-xl font-bold mb-4">Chat Messages</h2>
        <div className="space-y-4">
          {messages.map((message, index) => (
            <div key={index} className="border p-4 rounded-md">
              <p>{message.content}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ChatCard;
