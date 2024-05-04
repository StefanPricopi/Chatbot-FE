import React, { useEffect, useState } from 'react'
import styles from '../styling/Chatwindow.module.css'
import LogsApi from '../../../api/LogsApi';
import { v4 as uuidv4 } from 'uuid';
import { Stomp } from "@stomp/stompjs";

export default function Chatwindow({displayChat, chatId}) {

    const [chatInfo, SetChatInfo] = useState({});
    
    
    const [user, setUser] = useState();
    const [chatReceived, setChatReceived] = useState([]);
    const [stompClient, setStompClient] = useState(null);
    const [messages, setMessages] = useState([]);

    /* Websocket part! */
    const socket = new WebSocket('ws://localhost:8080/livechat');
    const stomp = Stomp.over(socket);

    stomp.connect({}, () => {
        stomp.subscribe('/topic/messages', (msg) => {
            const newMsg = [...messages, JSON.parse(msg)]
        });

        setStompClient(stomp);
    });


    const sendMessage = (event) => {
        if(event.key === 'Enter')
        {
            stompClient.send('/app/chat', {}, JSON.stringify({content: "TEST"}));
        }
    }

    useEffect(()=>{
        fetchChat();

        // Testing
        if(stompClient != null)
        {
            const payload = {'id': uuidv4(),  'from': user, 'to': "".to, 'text': "Hello world"};
        
        
            stompClient.publish({'destination' : '/liveChat/publicmessages', body: JSON.stringify(payload)});
        }
        else
        {
            console.log("no?");
        }
    }, []);


    const fetchChat = () => 
    {
        LogsApi.getChat(chatId)
        .then(resp => {
            SetChatInfo(resp);
        })
        .catch(err => {
            console.error(err);
        });

    }

  return (
    <div className={styles.chat_window}>
        {/* 
            Smaller window which opens and displays the chat. 
            Has a button which can be used to join the live chat.

        */}
        
        <div onClick={() => {displayChat(chatInfo.id)}} className={styles.close_chat_btn}>
            {/* Close button */}
            X
        </div>

        <div className={styles.chat_box_top} >
            {/* Toggle switch for setting the ticket/problem solved or not. */}
        </div>

        <div className={styles.chat_box}>
            {/* Main section where the chats are displayed */}
            {chatInfo.messages != null && chatInfo.messages.role != ""? chatInfo.messages.map((i) => (
                <div className={i.sendBy.role == "Customer Service" ? styles.chat_msg_CS : styles.chat_msg_C}>
                    <div className={i.sendBy.role == "Customer Service" ? styles.msg_icon_CS : styles.msg_icon_C}>

                    </div>
                    <div>
                        <p>{i.message != null ? i.message : "empty"}</p>
                    </div>
                </div>
                    
            )) : null}
            
        </div>

        <div className={styles.sub_box}>
            {/* Secondaire section which contains the information + a button which can be used to join the convo. */}
            
            <form>
                <input className={styles.chat_inputfield} type="text" />
                <input className={styles.chat_inputfield_btn} type="submit" onClick={sendMessage}/>
            </form>
                        
        </div>



    </div>
  )
}
