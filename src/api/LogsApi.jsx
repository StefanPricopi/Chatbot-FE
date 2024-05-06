import axios from "axios";

const baseURL = "http://localhost:8080";

const LogApi = {
    getAllChats: (token) => axios.get(`${baseURL}/chat/all`, {headers: {Authorization: `Bearer ${token}`}}).then((result) => result.data),
    getChat: (chatId, token) => axios.get(`${baseURL}/chat/${chatId}`, {headers: {Authorization: `Bearer ${token}`}}).then(res => res.data),
    createChat: (msg, token) => axios.post(`${baseURL}/chat/newchat`, msg, {headers: {Authorization: `Bearer ${token}`}}).then(res => res.data),
    logMessage: (msg, token) => axios.post(`${baseURL}/chat/logMsg`, msg, {headers: {Authorization: `Bearer ${token}`}}),
    deleteChat: (chatId, token) => axios.delete(`${baseURL}/chat/delete/${chatId}`, {headers: {Authorization: `Bearer ${token}`}}),
};

export default LogApi;
