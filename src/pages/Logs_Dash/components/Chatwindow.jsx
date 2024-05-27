import React, { useEffect, useState } from 'react'
import styles from '../styling/Chatwindow.module.css'
import LogsApi from '../../../api/LogsApi';
import { v4 as uuidv4 } from 'uuid';
import { Client } from "@stomp/stompjs";
import TokenManager from '../../../api/TokenManager';

export default function Chatwindow({displayChat, chatId, userInfo, refreshList}) {

    const [chatInfo, SetChatInfo] = useState({});
    const [user, setUser] = useState();
    const [stompClient, setStompClient] = useState(null);
    const [liveMsg, setLiveChat] = useState("");    
    const [solved, isSolved] = useState(false);

    const [messages, setMessages] = useState([]);

    const setStyleBasedOnRole = (role) => 
    {
        switch(role)
        {
            case "Customer":
                return styles.chat_msg_C
            case "Customer Service":
                return styles.chat_msg_CS
            case "BOT":
                return styles.chat_msg_BOT
        }
    }

    useEffect(()=>{
        fetchChat();

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
            stompClient.subscribe(`/user/${chatId}/queue/inboxmessages`, (data) => {
                

                fetchChat();
                //console.log(`Private message: ${data.body}`);
            });
        };

        stompClient.activate();

        setStompClient(stompClient);

    }, []);

    const sendMessage = (e) => 
    {
        e.preventDefault();
        //console.log(chatInfo.createdBy.roles[0]);
        //console.log(chatInfo);


        if(stompClient != null)
        {

            let payload = {"chatId": chatId, "message":liveMsg, "role": "Customer_Service", disableBot: true};

            /// Public messaging (maybe for later)
            // stompClient.publish({
            //     destination: "/chat/publicmessages", 
            //     body: JSON.stringify({content: payload})
            // });


            // Private messaging!
            const destination = `/user/${chatId}/queue/inboxmessages`;
            stompClient.publish({
                destination: destination, 
                body: JSON.stringify({content: payload})
            });

            setLiveChat('');
            fetchChat();
        }
        else
        {
            console.log("Oh no, client == empty");
        }  
    }

    const fetchChat = () => 
    {
        LogsApi.getChat(chatId, userInfo.token)
        .then(resp => {
            SetChatInfo(resp);
            isSolved(resp.hasBeenSolved);
        })
        .catch(err => {
            console.error(err);
        });
    }

    const closeConnection = () => 
    {
        try
        {
            stompClient.disconnect();

        }
        catch(e)
        {
            console.log("can't disconnect something which hasn't connected");
        }
    }

    const updateStatus = (stat) => 
    {
        
        let payload = {chatId: chatId, status: stat};

        LogsApi.updateStatus(payload, TokenManager.getAccessToken())
        .then(() => {
            console.log("Ok, status change is on its way");
            refreshList();
        });
        
        isSolved(prev => !prev);
    }

  return (
    <div className={styles.chat_window}>
        {/* 
            Smaller window which opens and displays the chat. 
            Has a button which can be used to join the live chat.

        */}
        
        <div onClick={() => {displayChat(chatInfo.id); closeConnection()}} className={styles.close_chat_btn}>
            {/* Close button */}
            X
        </div>

        <div className={styles.chat_box_top} >
            {/* Toggle switch for setting the ticket/problem solved or not. */}
            <label>Has been solved: </label>
            <button onClick={() => {updateStatus(!solved)}} className={solved ? styles.isSolved : styles.notSolved}>{solved ? "Solved" : "Unsolved"}</button>
        </div>

        <div className={styles.chat_box}>
            {/* Main section where the chats are displayed */}
            {chatInfo.messages != null && chatInfo.messages.role != ""? chatInfo.messages.map((i) => (
                <div key={i.message} className={setStyleBasedOnRole(i.sendBy.roles[0])}>
                    <div className={setStyleBasedOnRole(i.sendBy.roles[0])}>
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
                <input className={styles.chat_inputfield} type="text" value={liveMsg} onChange={(e) => {setLiveChat(e.target.value)}} autoFocus />
                <input className={styles.chat_inputfield_btn} type="submit" onClick={sendMessage}/>
            </form>
        </div>



    </div>
  )
}
