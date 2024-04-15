import React, { useState, useEffect } from 'react';
import styles from './ChatbotPage.module.css';
import minimizeIcon from '../components/images/minimize-icon-3.png';
import openIcon from '../components/images/icon-open-up.png'; 
import style from "./ChatbotPage.module.css";

function ChatbotPage() {
  const [isChatOpen, setIsChatOpen] = useState(true);
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([]);

  useEffect(() => {
    // Send welcome message when component mounts
    sendWelcomeMessage();
  }, []);

  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
  };

  const sendWelcomeMessage = () => {
    // Add the welcome message to chat history
    setChatHistory([
      ...chatHistory,
      { type: 'response', text: "Hey there! How can I help you today?" }
    ]);
  };

  const handleMessageChange = (event) => {
    setMessage(event.target.value);
  };

  const sendMessage = () => {
    // Add user message to chat history
    setChatHistory([
      ...chatHistory,
      { type: 'user', text: message }
    ]);

    // Clear the message input field
    setMessage('');

    // Make an API call to retrieve FAQs by keyword
    fetch(`/faqs/search?keyword=${message}`)
      .then(response => response.json())
      .then(data => {
        // Handle the response data (list of FAQs)
        console.log(data);
        // Update the chat history with the retrieved FAQs or their response
        setChatHistory([...chatHistory, { type: 'response', text: data }]);
      })
      .catch(error => {
        console.error('Error fetching FAQs:', error);
        // Handle error if needed
      });
  };

  return (
    <div>


      {isChatOpen && (
        <div className={styles.chatWindow}>

          <div className={styles.chatWindow_top}>

          </div>

          <div className={styles.toggleButton} onClick={toggleChat}>
            <img src={minimizeIcon} alt="Minimize Chat" />
          </div>


          <div className={styles.messageDisplay}>
            {chatHistory.map((chat, index) => (
              <div key={index} className={styles.message}>
                {chat.type === 'user' && 
                  <div className={styles.msg_box}>
                    <div className={styles.msg_box_usr}>
                      <div className={styles.msg_usr}>{chat.text}</div>
                      <div className={styles.msg_user_avatar}>👤</div>
                    </div>
                    
                  </div>
                }
                {chat.type === 'response' && 
                <div className={styles.msg_box}>
                    <div className={styles.msg_box_bot}>
                      <div className={styles.msg_bot_avatar}>🤖</div>
                      <div className={styles.msg_bot}>{chat.text}</div>
                    </div>

                </div>}
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
    </div>
  );
}

export default ChatbotPage;
