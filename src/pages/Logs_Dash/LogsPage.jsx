import React, { useEffect, useState } from 'react'
import styles from './styling/LogsPage.module.css';
import ChatlogItem from './components/Chatlog_item';
import LogApi from '../../api/LogsApi';
import Chatwindow from './components/Chatwindow';

export default function LogsPage() {

  const [chatLogs, SetChatlogs] = useState([]);
  const [filteredLogs, SetFilteredLogs] = useState("all");

  useEffect(() => {
    getAllLogs();
  }, []);


  const getAllLogs = () => 
  {
    LogApi.getAllChats()
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


  return (
    
    <div className={styles.container}>

            <section className={styles.main_section}>
    	        <h2 className={styles.title}>Chatlogs</h2>


                <Chatwindow />


                <div className={styles.log_section}>
                  {/* This is the main container of the different logs.. */}
                  
                  <div className={styles.log_search_togglegroup}>
                    <input type="search" className={styles.log_searchbar} />

                    <input type="radio" onChange={()=> SetFilteredLogs("unsolved")} checked={filteredLogs === "unsolved"} id="unsolved" name="toggle" value="unsolved"/>
                    <label for="unsolved">Unsolved</label>

                    <input type="radio" onChange={() => SetFilteredLogs("solved")} checked={filteredLogs == "solved"} id="solved" name="toggle" value="solved"/>
                    <label for="solved">Solved</label>

                    <input type="radio" onChange={() => SetFilteredLogs("all")} checked={filteredLogs == "all"} id="all" name="toggle" value="all"/>
                    <label for="all">ALL</label>

                  </div>
                  
                  <div className={styles.log_container}>
                    {filterLog.map((i) => (
                      <ChatlogItem key={i.id} chatId={i.id} refreshList={() => {getAllLogs()}}/>
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
