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

    getFAQStatistics: () => axios.get(`${baseURL}/faqs/statistics`, {
        headers: {
            'Authorization': `Bearer ${TokenManager.getAccessToken()}`
        }
    }).then((result) => result.data)
        .catch((error) => console.error("Error fetching FAQ statistics:", error)),

    getOutOfOfficeChats: () => axios.get(`${baseURL}/faqs/outOfOfficeChats`, {
        headers: {
            'Authorization': `Bearer ${TokenManager.getAccessToken()}`
        }
    }).then((result) => result.data)
        .catch((error) => console.error("Error fetching out-of-office chat count:", error)),
};

export default FAQApi;
