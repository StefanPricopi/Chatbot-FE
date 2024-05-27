import axios from "axios";
import TokenManager from "./TokenManager"; 

const baseURL = "http://localhost:8080";

const LogApi = {
    getAllChats: () => axios.get(`${baseURL}/chat/all`, {
        headers: {
            'Authorization': `Bearer ${TokenManager.getAccessToken()}`
        }
    }).then((result) => result.data),

    getChat: (chatId) => axios.get(`${baseURL}/chat/${chatId}`, {
        headers: {
            'Authorization': `Bearer ${TokenManager.getAccessToken()}`
        }
    }).then(res => res.data),

    createChat: (msg) => axios.post(`${baseURL}/chat/newchat`, msg, {
        headers: {
            'Authorization': `Bearer ${TokenManager.getAccessToken()}`
        }
    }).then(res => res.data),

    logMessage: (msg) => axios.post(`${baseURL}/chat/logMsg`, msg, {
        headers: {
            'Authorization': `Bearer ${TokenManager.getAccessToken()}`
        }
    }),

    deleteChat: (chatId) => axios.delete(`${baseURL}/chat/delete/${chatId}`, {
        headers: {
            'Authorization': `Bearer ${TokenManager.getAccessToken()}`
        }
    }),
};

export default LogApi;
