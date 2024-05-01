import React, { useState, useEffect } from 'react';
import styles from './ChatbotPage.module.css';
import minimizeIcon from '../components/images/minimize-icon-3.png';
import openIcon from '../components/images/icon-open-up.png'; 

function ChatbotPage() {
  const [isChatOpen, setIsChatOpen] = useState(true);
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([]);

  useEffect(() => {
    sendWelcomeMessage();
  }, []);

  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
  };

  const sendWelcomeMessage = () => {
    setChatHistory([
      ...chatHistory,
      { type: 'response', text: "Hey there! How can I help you today?" }
    ]);
  };

  const handleMessageChange = (event) => {
    setMessage(event.target.value);
  };

  const getChatbotResponse = async (message) => {
    try {
      const response = await fetch('http://localhost:8080/faqs/getChatbotResponse', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to get chatbot response');
      }
      
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.indexOf("application/json") !== -1) {
        
        const data = await response.json();
        return data.response;
      } else {
       
        return await response.text();
      }
    } catch (error) {
      console.error('Error getting chatbot response:', error);
      return "I'm sorry, I don't understand your question.";
    }
  };

  const sendMessage = async () => {
    setChatHistory([
      ...chatHistory,
      { type: 'user', text: message }
    ]);
    setMessage('');

    const botResponse = await getChatbotResponse(message);
  
    setChatHistory([
      ...chatHistory,
      { type: 'response', text: botResponse }
    ]);
  };

  return (
    <>
      {isChatOpen && (
        <div className={styles.chatWindow}>
          <div className={styles.toggleButton} onClick={toggleChat}>
            <img src={minimizeIcon} alt="Minimize Chat" />
          </div>
          <div className={styles.messageDisplay}>
            {chatHistory.map((chat, index) => (
              <div key={index} className={styles.message}>
                {chat.type === 'user' && <p>{chat.text}</p>}
                {chat.type === 'response' && <p>{chat.text}</p>}
              </div>
            ))}
          </div>
          <div className={styles.messageInput}>
            <input
              type="text"
              className={styles.inputField}
              placeholder="Type your message..."
              value={message}
              onChange={handleMessageChange}
            />
            <button className={styles.sendButton} onClick={sendMessage}>Send</button>
          </div>
        </div>
      )}
      {!isChatOpen && (
        <div className={styles.toggleButton} onClick={toggleChat}>
          <img src={openIcon} alt="Open Chat" />
        </div>
      )}
    </>
  );
}

export default ChatbotPage;
