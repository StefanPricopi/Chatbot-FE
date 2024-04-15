import React from 'react'
import styles from '../styling/Chatwindow.module.css'


export default function Chatwindow() {
  return (
    <div className={styles.chat_window}>
        {/* 
            Smaller window which opens and displays the chat. 
            Has a button which can be used to join the live chat.

        */}
        
        <div className={styles.close_chat_btn}>
            {/* Close button */}
            X
        </div>

        <div className={styles.chat_box}>
            {/* Main section where the chats are displayed */}
            
        </div>

        <div>
            {/* Secondaire section which contains the information + a button which can be used to join the convo. */}
            

        </div>



    </div>
  )
}
