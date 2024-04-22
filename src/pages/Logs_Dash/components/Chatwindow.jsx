import React, { useEffect } from 'react'
import styles from '../styling/Chatwindow.module.css'
import LogsApi from '../../../api/LogsApi';


export default function Chatwindow({displayChat, chatId}) {


    useEffect(()=>{
        fetchChat();
    }, []);


    const fetchChat = () => 
    {
        console.log(chatId);

        LogsApi.getChat(chatId)
        .then(resp => {
            console.log(resp);
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
        
        <div onClick={displayChat()} className={styles.close_chat_btn}>
            {/* Close button */}
            X
        </div>

        <div className={styles.chat_box}>
            {/* Main section where the chats are displayed */}
            
        </div>

        <div className={styles.sub_box}>
            {/* Secondaire section which contains the information + a button which can be used to join the convo. */}
            

        </div>



    </div>
  )
}
