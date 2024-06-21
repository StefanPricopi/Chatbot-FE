import axios from "axios";
import TokenManager from "./TokenManager";

const baseURL = "http://localhost:8080"; 

const FAQApi = {
    getFAQs: () => axios.get(`${baseURL}/faqs`, {
        headers: {
            'Authorization': `Bearer ${TokenManager.getAccessToken()}`
        }
    }).then((result) => result.data),
    

    createFAQ: (newFAQ) => axios.post(`${baseURL}/faqs`, newFAQ, {
        headers: {
            'Authorization': `Bearer ${TokenManager.getAccessToken()}`
        }
    }),

    deleteFAQ: (faqId) => axios.delete(`${baseURL}/faqs/${faqId}`, {
        headers: {
            'Authorization': `Bearer ${TokenManager.getAccessToken()}`
        }
    }),

    updateFAQ: (id, updatedFAQ) => axios.put(`${baseURL}/faqs/${id}`, updatedFAQ, {
        headers: {
            'Authorization': `Bearer ${TokenManager.getAccessToken()}`
        }
    }),

    getFAQStatistics: async () => {
        const response = await fetch('http://localhost:8080/faqs/statistics');
        return await response.json();
    },
    getOutOfOfficeChats: async () => {
        const response = await fetch('http://localhost:8080/faqs/outOfOfficeChats');
        return await response.json();
    },
    getFailedQuestions: async () => {
        // Made some changes here to fix something - Shelson
        const response = await axios.get('http://localhost:8080/faqs/failedQuestions', {headers: {
            'Authorization': `Bearer ${TokenManager.getAccessToken()}`
        }}).then(resp => resp.data);
        return await response;
    },
    getRoutedChats: async () => {
        const response = await axios.get('http://localhost:8080/faqs/routedChats', {headers: {
            'Authorization': `Bearer ${TokenManager.getAccessToken()}`
        }}).then(resp => resp.data);
        return await response;
    },
    getChatsWithoutHuman: async () => {
        const response = await fetch('http://localhost:8080/faqs/chatsWithoutHuman');
        return await response.json();
    },
    getChatsDuringOutOfOffice: async () => {
        const response = await fetch('http://localhost:8080/faqs/chatsDuringOutOfOffice');
        return await response.json();
    }
};

export default FAQApi;
