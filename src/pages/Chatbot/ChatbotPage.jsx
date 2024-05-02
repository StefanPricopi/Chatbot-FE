import React, { useState, useEffect } from 'react';
import styles from './ChatbotPage.module.css';
import minimizeIcon from '../../components/images/minimize-icon-3.png';
import openIcon from '../../components/images/chat2.png'; 
import LogsApi from '../../api/LogsApi';
import style from "./ChatbotPage.module.css";

function ChatbotPage() {
  const [isChatOpen, setIsChatOpen] = useState(true);
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [chatId, setChatId] = useState(0);
  // Going to do this without state as it doesn't directly update the state when called. 

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

  const logMessage = async(user, role, msg) => 
  {

    console.log(role);

    if(chatId > 0)
    {
      LogsApi.logMessage(
        {
          chat_id: chatId,
          message: {
            sendBy: {
              userId:user.id,
              userName: user.username,
              email: user.email, 
              role: role
            },
            message: msg
          }
        })
        .catch(err => {
          console.error(`Oh no something went wrong: ${err}`);
        });
    }
    else 
    {
      console.error("Chat doesn't exist " + chatId);
    }
  }

  // simple enter key event.
  const submitViaField = (event) => {
    if(event.key === 'Enter')
    {
      sendMessage();
    }
  }

  const sendMessage = async () => {


    // Checks if this is the first message which has been sent 
    // Used to initiate the chatlogging!
    if(chatHistory.length <= 1)
    {
      LogsApi.createChat(
        {
          sendBy: {
            userId: 1, 
            userName: "shelson", 
            email: "", 
            role: "Customer"
          },
          message: message, 
          dateTime: ""
        }
      )
      .then(res => {
        setChatId(res.chat_id);
      });
    }
    // End of chatlogging stufferoe


      setChatHistory(prevChatHistory => [
      ...prevChatHistory,
        { type: 'user', text: message }
      ]);
      
      setMessage('');

      const botResponse = await getChatbotResponse(message);
    
      setChatHistory(prevChatHistory =>[
        ...prevChatHistory,
        { type: 'response', text: botResponse }
      ]);


      logMessage({id: 0, username:"BOT", email: "BOT"}, "Customer Service", botResponse);
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
              onKeyDown={submitViaField}
            />
            <button className={styles.sendButton} onClick={sendMessage} >Send</button>
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
