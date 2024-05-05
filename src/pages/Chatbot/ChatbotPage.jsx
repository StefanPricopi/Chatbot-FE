import React, { useState, useEffect, useRef } from 'react';
import styles from './ChatbotPage.module.css';
import minimizeIcon from '../../components/images/minimize-icon-3.png';
import openIcon from '../../components/images/chat2.png'; 
import LogsApi from '../../api/LogsApi';
import style from "./ChatbotPage.module.css";
import { Client } from "@stomp/stompjs";


function ChatbotPage() {
  const [isChatOpen, setIsChatOpen] = useState(true);
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const chatIdRef = useRef(0);
  const [disableBot, setDisableBot] = useState(false);
  const [stompClient, setStompClient] = useState(null);


  // Going to do this without state as it doesn't directly update the state when called. 

  useEffect(() => {
    sendWelcomeMessage();

    setupWebsocketry();





  }, []);


  const setupWebsocketry = () => {
    /* Websocketery !*/
    const stompClient = new Client({
      brokerURL: 'ws://localhost:8080/ws', 
      reconnectDelay: 5000, 
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

          let newdata= JSON.parse(data.body);
          if(newdata.content.role == "Customer_Service")
          {
            // Disables the bot from responding
            setDisableBot(true);

            // Updates the chathistory (the messages you can see)
            setChatHistory(prevChatHistory => [
              ...prevChatHistory,
                { type: 'response', text: newdata.content.message, bot: false }
              ]);

              logMessage({id: 0, username:"BOT", email: "BOT"}, "Customer Service", newdata.content.message);

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
    if(chatIdRef.current > 0)
    {
      LogsApi.logMessage(
        {
          chat_id: chatIdRef.current,
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
  const submitViaField = async(event) => {
    if(event.key === 'Enter')
    {
      await sendMessage();
    }
  }

  const sendMessage = async () => {


    // Checks if this is the first message which has been sent 
    // Used to initiate the chatlogging!
    if(chatHistory.length <= 1)
    {
      // Only triggers when initiating the convo
      try {
        const res = await LogsApi.createChat({
          sendBy: {
            /// This is mock data should be binded with Authentication later on!
            userId: 1, 
            userName: "shelson", 
            email: "", 
            role: "Customer"
          },
          message: message, 
          dateTime: ""
        });

        chatIdRef.current = res.chat_id;


        setupWebsocketry();

        setChatHistory(prevChatHistory => [
        ...prevChatHistory,
          { type: 'user', text: message }
        ]);


        setMessage('');

        const botResponse = await getChatbotResponse(message);
        setChatHistory(prevChatHistory =>[
            ...prevChatHistory,
            { type: 'response', text: botResponse, bot: true }
          ]);
            

        logMessage({id: 0, username:"BOT", email: "BOT"}, "Customer Service", botResponse);
        

      } catch (error) {
        console.error(`Error: ${error}`);
      }
    }
    else 
    {

      if(chatIdRef.current > 0)
      {
        setChatHistory(prevChatHistory => [
        ...prevChatHistory,
          { type: 'user', text: message, bot: false }
        ]);
        

        

        if(!disableBot)
        {
          const botResponse = await getChatbotResponse(message);
          setChatHistory(prevChatHistory =>[
              ...prevChatHistory,
              { type: 'response', text: botResponse, bot: true }
            ]);
          logMessage({id: 0, username:"BOT", email: "BOT"}, "Customer Service", botResponse);

        }
        
          logMessage({id: 1, username:"shelson", email: "shelson@gmail.com"}, "Customer", message);


        // Dit update ook direct de chat!
        sendWebsocketMsg();

        setMessage('');

        
      }
      else {
        console.error(`Chat doesn't exist: ${chatIdRef.current}`);
      }
    }
    
  };

  const sendWebsocketMsg = () => 
  {
    // Private messaging!.
    console.log(`Ok, sending it too: ${chatIdRef.current}`);
    let payload = {"chatId": chatIdRef.current, "message":message, "role": "Customer"};

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

                </div>}
                {/* This section is for the customer service employee response.*/}
                {chat.type === 'response' && !chat.bot && disableBot &&
                <div className={styles.msg_box}>
                    <div className={styles.msg_box_bot}>
                      <div className={styles.msg_bot_avatar}>🙋‍♂️</div>
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
