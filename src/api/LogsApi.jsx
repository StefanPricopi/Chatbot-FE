import axios from "axios";

const baseURL = "http://localhost:8080";

const LogApi = {
    getAllChats: () => axios.get(`${baseURL}/chat/all`).then((result) => result.data),
    getChat: (chatId) => axios.get(`${baseURL}/chat/${chatId}`, chatId).then(res => res.data),
    createChat: (msg) => axios.post(`${baseURL}/chat/newchat`, msg).then(res => res.data),
    logMessage: (msg) => axios.post(`${baseURL}/chat/logMsg`, msg),
    deleteChat: (chatId) => axios.delete(`${baseURL}/chat/delete/${chatId}`),
};

export default LogApi;
