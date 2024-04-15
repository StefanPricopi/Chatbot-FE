import axios from "axios";

const baseURL = "http://localhost:8080"; 

const FAQApi = {
    getFAQs: () => axios.get(`${baseURL}/faqs`).then((result) => result.data),
    createFAQ: (newFAQ) => axios.post(`${baseURL}/faqs`, newFAQ),
    deleteFAQ: (faqId) => axios.delete(`${baseURL}/faqs/${faqId}`),
    updateFAQ: (id, updatedFAQ) => axios.put(`${baseURL}/faqs/${id}`, updatedFAQ)
};

export default FAQApi;

