import React, { useEffect, useState } from 'react'
import styles from './styling/LogsPage.module.css';
import ChatlogItem from './components/Chatlog_item';
import LogApi from '../../api/LogsApi';
import Chatwindow from './components/Chatwindow';
import NavBar from '../../components/NavBar'


export default function LogsPage(userInfo) {

  const [chatLogs, SetChatlogs] = useState([]);
  const [filteredLogs, SetFilteredLogs] = useState("all");
  const [displayChat, SetDisplayChat] = useState(false);
  const [chatId, SetChatId] = useState(0);
  const [chatsFilter, setChatsFilter] = useState("");


  useEffect(() => {
    getAllLogs();
  }, []);


  const getAllLogs = () => 
  {

    // console.log("Userinfo test alex:  "+userInfo.userInfo.token);
    
    LogApi.getAllChats(userInfo.userInfo.token)
    .then(resp => {
      //SetChatlogs(resp.allChats);
      if(resp.allChats != "")
      {
        SetChatlogs(resp.allChats);
      }
      
      console.log(resp.allChats);
    })
    .catch(err => {
      console.error(err);
    });
  }


  const filterLog = chatLogs.filter((log) => {
    if(filteredLogs=="all")
    {
      return true;
    }
    else if(filteredLogs == "solved")
    {
      return log.hasBeenSolved == true;
    }
    else if(filteredLogs == "unsolved")
    {
      return log.hasBeenSolved == false;
    }
  });

  const showChat = (chat_id = 0) => 
  {
    console.log("Got triggerd");
    SetChatId(chat_id);
    SetDisplayChat(prevDisplayChat => !prevDisplayChat);
  }

  return (
    
    <div className={styles.container}>
            <NavBar />

            <section className={styles.main_section}>
    	        <h2 className={styles.title}>Chatlogs</h2>


                {displayChat ? <Chatwindow displayChat={showChat} chatId={chatId} userInfo={userInfo.userInfo}/> : null}

                <div className={styles.log_section}>
                  {/* This is the main container of the different logs.. */}
                  
                  <div className={styles.log_search_togglegroup}>
                    <input type="search" className={styles.log_searchbar} value={chatsFilter} onChange={setChatsFilter}/>

                    <input type="radio" onChange={()=> SetFilteredLogs("unsolved")} checked={filteredLogs === "unsolved"} id="unsolved" name="toggle" value="unsolved"/>
                    <label htmlFor="unsolved">Unsolved</label>

                    <input type="radio" onChange={() => SetFilteredLogs("solved")} checked={filteredLogs == "solved"} id="solved" name="toggle" value="solved"/>
                    <label htmlFor="solved">Solved</label>

                    <input type="radio" onChange={() => SetFilteredLogs("all")} checked={filteredLogs == "all"} id="all" name="toggle" value="all"/>
                    <label htmlFor="all">ALL</label>

                  </div>
                  
                  <div className={styles.log_container}>
                    {filterLog.map((i) => (
                      <ChatlogItem key={i.id} chatId={i.id} refreshList={() => {getAllLogs()}} displayChat={showChat} userInfo={userInfo.userInfo}/>
                    ))}
                  </div>

                </div>

                


            </section>
            <footer className={styles.footer}>
                <p>© Copyright 2024 Hustle & Hack Harmony</p>
            </footer>
        </div>
  )
}
