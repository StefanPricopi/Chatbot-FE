import React, { useEffect, useState } from 'react'
import styles from '../styling/LogsPage.module.css';
import LogApi from '../../../api/LogsApi';

export default function ChatlogItem({chatId, refreshList}) {


  const [chatInfo, SetChatInfo] = useState({});

  //SetChatId(param.chatId);

  /*
    Requires the ID. 

    Receives info based on the chatid: 
    - chat_id, 
    - started by user
    - status (open, closed)
    - date

  */
  useEffect(() => {

    getChat(chatId);
  }, []);

  const getChat = (id) => 
  {
      LogApi.getChat(id)
      .then(resp => {
        SetChatInfo(resp);
        //console.log(resp);
      })
      .catch(err => 
        {
          console.error(`Error: ${err}`);
        });
  }

  const deleteLog = () => 
  {
    LogApi.deleteChat(chatId)
    .then(() => {
      console.log("Log has been deleted.");
      refreshList();
      // Needs some fixing
    })
    .catch(error => {
      console.error(error);
    });
  }


  return (
    <section className={styles.chatlog_container}>
        <div className={styles.chatlog_close_btn} onClick={deleteLog}>
          X
        </div>

          <p>Chat #{chatInfo.id}</p>
          <p>Customer - {chatInfo.customer_id}</p>
          <p className={chatInfo.hasBeenSolved ? styles.chatlog_solved : styles.chatlog_unsolved}>{chatInfo.hasBeenSolved ? "Solved" : "Unsolved"}</p>
          <p>Priority: <span className={chatInfo.highPrio ? styles.chatlog_prio_h : styles.chatlog_prio_l}>{chatInfo.highPrio ? "High" : "Low"} </span></p>
          <button className={styles.chatlog_open_btn}>Open</button>
    </section>
  )
}
