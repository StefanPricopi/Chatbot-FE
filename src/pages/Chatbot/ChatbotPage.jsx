import React, { useState, useEffect, useRef } from 'react';
import styles from './ChatbotPage.module.css';
import minimizeIcon from '../../components/images/minimize-icon-3.png';
import openIcon from '../../components/images/chat2.png'; 
import LogsApi from '../../api/LogsApi';
import style from "./ChatbotPage.module.css";
import CustomEmojiPicker from './emoji_comp/CustomEmojiPicker.jsx';

import { Client } from "@stomp/stompjs";


function ChatbotPage({userInfo, trigger}) {
  const [isChatOpen, setIsChatOpen] = useState(true);
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const chatIdRef = useRef(0);
  const [disableBot, setDisableBot] = useState(false);
  const [stompClient, setStompClient] = useState(null);
  const [attempts, setAttempts] = useState(0); 
  const [showFeedback, setShowFeedback] = useState(false);
  const inactivityTimeout = useRef(null);
  // This is a big no no! :'|
  const [botId, setBotId] = useState(10031);


  useEffect(() => {
    // Set a timer for inactivity
    if (inactivityTimeout.current) {
      clearTimeout(inactivityTimeout.current);
    }

    inactivityTimeout.current = setTimeout(() => {
      askForFeedback();
    }, 60000); // 1 minute of inactivity
  }, [chatHistory]);

  // Going to do this without state as it doesn't directly update the state when called. 

  useEffect(() => {

    //console.log(`Info we got: ${userInfo.current.id}`);
    chatIdRef.current = userInfo.current.id

    sendWelcomeMessage();

    setupWebsocketry();




  }, [trigger]);


  const setupWebsocketry = () => {
    /* Websocketery !*/
    const stompClient = new Client({
      brokerURL: 'ws://localhost:8080/ws', 
      reconnectDelay: 500000, 
      heartbeatIncoming: 4000, 
      heartbeatOutgoing: 4000
  });


  stompClient.onConnect = () => {
      
      //Listening to public announcements.
      // stompClient.subscribe('/chat/publicmessages', (data) => {
      //     console.log(`Public message: ${data.body}`);
      // });

      /// private messaging
      console.log(`listening chatid ${chatIdRef.current}`);
      stompClient.subscribe(`/user/${chatIdRef.current}/queue/inboxmessages`, (data) => {

          console.log("Hey we got a message!");

          let newdata= JSON.parse(data.body);
          if(newdata.content.role == "Customer_Service" || newdata.current.role == "ADMIN")
          {
            // Disables the bot from responding
            setDisableBot(true);
            console.log(newdata);
            // Updates the chathistory (the messages you can see)
            setChatHistory(prevChatHistory => [
              ...prevChatHistory,
                { type: 'response', text: newdata.content.message, bot: false }
              ]);

              logMessage({id: newdata.content.user_id, username:"BOT", email: "BOT"}, "Customer Service", newdata.content.message);

          }

          
      });
  };

  stompClient.activate();

  setStompClient(stompClient);
  }

  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
  };

  const sendWelcomeMessage = () => {

    setChatHistory([
      ...chatHistory,
      { type: 'response', text: "Hey there! How can I help you today?", bot: true }
    ]);
  };

  const handleMessageChange = (event) => {
    setMessage(event.target.value);
  };

  const getChatbotResponse = async (message, attempts) => {
    try {
      const userId = userInfo.current.id;
      console.log(`Fetching chatbot response for userId: ${userId}, message: ${message}, attempts: ${attempts}`);
      
      const response = await fetch('http://localhost:8080/faqs/getChatbotResponse', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${userInfo.current.token}`
        },
        body: JSON.stringify({ message, userId, attempts }), 
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

    const date_stamp = new Date().toISOString();
    


    if(chatIdRef.current > 0)
    {

      let payload = {
        chat_id: chatIdRef.current,
        message: {
          user_id: user.id,
          message:msg
        }
      };


      console.log(payload);

      LogsApi.logMessage(
        payload, userInfo.current.token)
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
  const submitViaField = async(event) => {
    if(event.key === 'Enter')
    {
      await sendMessage();
    }
  }

  const updateCS = () => {
    // This will send a ping to the logs page. 
    // It will refresh the list + add a status for the chat which is active. 

    let payload = {"chatId": chatIdRef.current};
    
    console.log("Sending ping!");

    const destination = `/chat/publicmessages`;
    stompClient.publish({
        destination: destination, 
        body: JSON.stringify({content: payload})
    });
}

const sendMessage = async () => {
  // Check if this is the first message which has been sent
  // Used to initiate the chat logging
  console.log(userInfo);

  if (chatHistory.length <= 2) {
    // Only triggers when initiating the conversation
    console.log(userInfo.current.token);
    try {
      console.log(`Current user id: ${userInfo.current.id}`);

      const res = await LogsApi.createChat({
        user_id: userInfo.current.id,
        message: message,
        dateTime: ""
      }, userInfo.current.token);

      console.log(`Alright, started new chat on ${res.chat_id}`);
      chatIdRef.current = res.chat_id;

      try {
        setupWebsocketry();
        // After the first message it sends this ping.
        updateCS();
      } catch (e) {
        console.log("Oh no: " + e);
      }

      setChatHistory(prevChatHistory => [
        ...prevChatHistory,
        { type: 'user', text: message }
      ]);

      setMessage('');

      const botResponse = await getChatbotResponse(message, attempts);
      setChatHistory(prevChatHistory => [
        ...prevChatHistory,
        { type: 'response', text: botResponse, bot: true }
      ]);

      logMessage({ id: botId, username: "BOT", email: "BOT" }, "BOT", botResponse);

    } catch (error) {
      setChatHistory(prevChatHistory => [
        ...prevChatHistory,
        { type: 'response', text: "Please log in before using !", bot: true }
      ]);
      setMessage('');
      console.error(`Error: ${error}`);
    }
  } else {
    if (chatIdRef.current > 0) {
      // Check for feedback loop
      if (showFeedback) {
        handleFeedback(message);
        setMessage('');
        return;
      }

      setChatHistory(prevChatHistory => [
        ...prevChatHistory,
        { type: 'user', text: message, bot: false }
      ]);

      // Check for end keywords to ask for feedback
      const endKeyword = checkEndKeywords(message);
      if (endKeyword) {
        askForFeedback();
        setMessage('');
        return;
      }

      if (!disableBot) {
        const botResponse = await getChatbotResponse(message, attempts);

        if (botResponse.includes("I couldn’t find an answer to your question")) {
          setAttempts(attempts + 1); // Increment attempts if bot couldn't answer
        } else {
          setAttempts(0); // Reset attempts if bot could answer
        }

        setChatHistory(prevChatHistory => [
          ...prevChatHistory,
          { type: 'response', text: botResponse, bot: true }
        ]);

        logMessage({ id: userInfo.current.id, username: "shelson", email: "shelson@gmail.com" }, "Customer", message);
        logMessage({ id: botId, username: "BOT", email: "BOT" }, "BOT", botResponse);
      }

      // Update chat directly
      sendWebsocketMsg();
      updateCS();
      setMessage('');
    } else {
      console.error(`Chat doesn't exist: ${chatIdRef.current}`);
    }
  }
};

const checkEndKeywords = (message) => {
  const endKeywords = ["thank you", "thanks", "goodbye", "bye", "that's all", "thankyou", "ty"];
  return endKeywords.some(keyword => message.toLowerCase().includes(keyword));
};

const askForFeedback = () => {
  setShowFeedback(true);
  setChatHistory(prevChatHistory => [
    ...prevChatHistory,
    { type: 'response', text: 'Happy to help! Would you like to leave feedback? [YES/NO]' }
  ]);
};

const handleFeedback = (feedback) => {
  setShowFeedback(false);
  setAttempts(0); // Reset attempts on feedback
  setChatHistory(prevChatHistory => [
    ...prevChatHistory,
    { type: 'response', text: `Thank you for your feedback: ${feedback}` }
  ]);
};

  const sendWebsocketMsg = () => 
  {
    // Private messaging!.
    console.log(`Ok, sending it too: ${chatIdRef.current}`);
    let payload = {"chatId": chatIdRef.current, "message":message, "role": ["Customer"]};

    const destination = `/user/${chatIdRef.current}/queue/inboxmessages`;
    stompClient.publish({
        destination: destination, 
        body: JSON.stringify({content: payload})
    });
  }


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
                {chat.type === 'response' && chat.bot &&
                  <div className={styles.msg_box}>
                    <div className={styles.msg_box_bot}>
                      <div className={styles.msg_bot_avatar}>🤖</div>
                      <div className={styles.msg_bot}>{chat.text}</div>
                    </div>
                  </div>
                }
                {/* This section is for the customer service employee response.*/}
                {chat.type === 'response' && !chat.bot && disableBot &&
                  <div className={styles.msg_box}>
                    <div className={styles.msg_box_bot}>
                      <div className={styles.msg_bot_avatar}>🙋‍♂️</div>
                      <div className={styles.msg_bot}>{chat.text}</div>
                    </div>
                  </div>
                }
              </div>
            ))}
            {showFeedback && (
              <div className={styles.feedbackButtons}>
                <button onClick={() => handleFeedback('Yes')}>👍 Yes</button>
                <button onClick={() => handleFeedback('No')}>👎 No</button>
              </div>
            )}
          </div>

          <div className={styles.messageInput}>
            {/* <CustomEmojiPicker /> */}

            <input
              type="text"
              className={styles.inputField}
              placeholder="Type your message..."
              value={message}
              onChange={handleMessageChange}
              onKeyDown={submitViaField}
              autoFocus
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
