import React, { useEffect, useState } from 'react'
import styles from '../styling/LogsPage.module.css';
import LogApi from '../../../api/LogsApi';

export default function ChatlogItem({chatId, refreshList, displayChat, userInfo}) {


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
      LogApi.getChat(id, userInfo.token)
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
    LogApi.deleteChat(chatId, userInfo.token)
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
          <p>Customer - {chatInfo.createdBy != null ? chatInfo.createdBy.username: "error"}</p>
          <p className={chatInfo.hasBeenSolved ? styles.chatlog_solved : styles.chatlog_unsolved}>{chatInfo.hasBeenSolved ? "Solved" : "Unsolved"}</p>
          <span className={styles.status_live}>Date: [Placeholder]</span>
          {/* <span className={styles.status_live}>🔴Live</span> */}
          <button onClick={() => {displayChat(chatInfo.id)}} className={styles.chatlog_open_btn}>Open</button>
    </section>
  )
}
