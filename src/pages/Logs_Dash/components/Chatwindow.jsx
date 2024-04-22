import React, { useEffect, useState } from 'react'
import styles from '../styling/Chatwindow.module.css'
import LogsApi from '../../../api/LogsApi';


export default function Chatwindow({displayChat, chatId}) {

    const [chatInfo, SetChatInfo] = useState({});


    useEffect(()=>{
        fetchChat();
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
            
            
        </div>



    </div>
  )
}
