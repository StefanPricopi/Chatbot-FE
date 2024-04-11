import axios from "axios";

const LogApi = {
    getAllChats: () => axios.get("http://localhost:8080/chat/all").then((result) => result.data),
    getChat: (chatId) => axios.get(`http://localhost:8080/chat/${chatId}`, chatId).then(res => res.data),
    deleteChat: (chatId) => axios.delete(`http://localhost:8080/chat/delete/${chatId}`),
};

export default LogApi;
