import React, { useState } from 'react';
import MessageDisplay from './MessageDisplay';
import MessageInput from './MessageInput';

function Chatbot() {
  const [messages, setMessages] = useState([]);

  const handleMessageSubmit = (newMessage) => {
    setMessages([...messages, { text: newMessage, sender: 'user' }]);
    // Here you would typically send the user's message to the chatbot
    // and receive a response, which you would then add to the messages state
  };

  return (
    <div className="chat-window">
      <MessageDisplay messages={messages} />
      <MessageInput onSubmit={handleMessageSubmit} />
    </div>
  );
}

export default Chatbot;