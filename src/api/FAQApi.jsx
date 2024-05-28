const FAQApi = {
    getFAQStatistics: async () => {
        const response = await fetch('http://localhost:8080/faqs/statistics');
        return await response.json();
    },
    getOutOfOfficeChats: async () => {
        const response = await fetch('http://localhost:8080/faqs/outOfOfficeChats');
        return await response.json();
    },
    getFailedQuestions: async () => {
        const response = await fetch('http://localhost:8080/faqs/failedQuestions');
        return await response.json();
    },
    getRoutedChats: async () => {
        const response = await fetch('http://localhost:8080/faqs/routedChats');
        return await response.json();
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
