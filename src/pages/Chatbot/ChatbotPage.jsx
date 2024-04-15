import React, { useState, useEffect } from 'react';
import styles from './ChatbotPage.module.css';
import minimizeIcon from '../../components/images/minimize-icon-3.png';
import openIcon from '../../components/images/chat2.png'; 
import style from "./ChatbotPage.module.css";

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

  function getChatbotResponse(message) {
    const containsKeywords = {
        invoice: ['invoice', 'send'],
        resetPassword: ['reset', 'update', 'change', 'password'],
        changePickupDate: ['change', 'pick-up']
        // Add more cases as needed
    };

    // Check if message contains keywords related to sending invoice
    if (containsKeywords.invoice.some(keyword => message.toLowerCase().includes(keyword))) {
        return "You can send your invoice to the finance department at our main office.";
    }

    // Check if message contains keywords related to resetting password
    if (containsKeywords.resetPassword.some(keyword => message.toLowerCase().includes(keyword))) {
        return "To reset your password, please visit the 'Forgot Password' page on our website.";
    }

    // Check if message contains keywords related to changing pickup date
    if (containsKeywords.changePickupDate.some(keyword => message.toLowerCase().includes(keyword))) {
        return "Yes, you can change the pick-up date of your bid by contacting our customer support.";
    }

    // Add more cases here if needed

    return "I'm sorry, I don't understand your question.";
}

  const sendMessage = () => {
    setChatHistory([
      ...chatHistory,
      { type: 'user', text: message }
    ]);
    setMessage('');

    const botResponse = getChatbotResponse(message);
  
    if (botResponse !== "I'm sorry, I don't understand your question.") {
      setChatHistory([
        ...chatHistory,
        { type: 'response', text: botResponse }
      ]);
    } else {
      const isResetPasswordMessage = message.toLowerCase().includes('reset') || 
                                     message.toLowerCase().includes('change') || 
                                     message.toLowerCase().includes('update') || 
                                     message.toLowerCase().includes('password');

      if (isResetPasswordMessage) {
        fetch(`/faqs/search?keyword=${message}`)
          .then(response => response.json())
          .then(data => {
            setChatHistory([
              ...chatHistory,
              { type: 'response', text: "Here are some FAQs related to resetting password:" },
              ...data.map(faq => ({ type: 'response', text: `${faq.question}: ${faq.answer}` }))
            ]);
          })
          .catch(error => {
            console.error('Error fetching FAQs:', error);
          });
      } else {
        setChatHistory([
          ...chatHistory,
          { type: 'response', text: "I'm sorry, I couldn't understand your request." }
        ]);
      }
    }
  };

  return (
    <div>


      {isChatOpen && (
        <div className={styles.chatWindow}>

          <div className={styles.chatWindow_top}>
            {/* Could write some stuff here like chat id etc. */}
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
        <div className={styles.toggleButtonClosed} onClick={toggleChat}>
          <img src={openIcon} alt="Open Chat" />
        </div>
      )}
    </div>
  );
}

export default ChatbotPage;
