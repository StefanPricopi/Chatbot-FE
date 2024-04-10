import axios from "axios";

const FAQApi = {
    getFAQs: () => axios.get("http://localhost:8080/faqs").then((result) => result.data),
    createFAQ: (newFAQ) => axios.post("http://localhost:8080/faqs", newFAQ),
    deleteFAQ: (faqId) => axios.delete(`http://localhost:8080/faqs/${faqId}`),
    updateFAQ: (id, updatedFAQ) => axios.put(`http://localhost:8080/faqs/${id}`, updatedFAQ)
};

export default FAQApi;
