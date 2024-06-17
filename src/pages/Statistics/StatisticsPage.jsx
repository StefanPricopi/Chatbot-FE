import React, { useState, useEffect } from 'react';
import FAQApi from '../../api/FAQApi';
import styles from './StatisticsPage.module.css';
import NavBar from '../../components/NavBar';
import PieChart from '../../components/PieChart';
import TokenManager from '../../api/TokenManager';

export default function StatisticsPage() {
    const [FAQStatistics, setFAQStatistics] = useState([]);
    const [outOfOfficeChats, setOutOfOfficeChats] = useState(0);
    const [totalChats, setTotalChats] = useState(0);
    const [failedQuestions, setFailedQuestions] = useState([]);
    const [routedChats, setRoutedChats] = useState(0);
    const [chatsWithoutHuman, setChatsWithoutHuman] = useState(0);

    useEffect(() => {
        fetchFAQStatistics();
        fetchOutOfOfficeChats();


        // testing if this works
        fetchFailedQuestions();
        fetchRoutedChats();
        fetchChatsWithoutHuman();
    }, []);

    const fetchFAQStatistics = async () => {
        try {
            const data = await FAQApi.getFAQStatistics();
            const statistics = data.map(stat => ({
                category: stat.category,
                count: stat.count
            }));
            setFAQStatistics(statistics);
            const total = data.reduce((sum, stat) => sum + stat.count, 0);
            setTotalChats(total);
        } catch (error) {
            console.error('Error fetching FAQ statistics:', error);
        }
    };

    const fetchOutOfOfficeChats = async () => {
        try {
            const data = await FAQApi.getOutOfOfficeChats();
            setOutOfOfficeChats(data);
        } catch (error) {
            console.error('Error fetching out-of-office chats:', error);
        }
    };

    const fetchFailedQuestions = async () => {
        try {
            // Think I fixed something here not sure - Shelson
            const data = await FAQApi.getFailedQuestions();

            setFailedQuestions(data);
        } catch (error) {
            console.log("Oh no");
            console.error('Error fetching failed questions:', error);
        }
    };

    const fetchRoutedChats = async () => {
        try {
            const data = await FAQApi.getRoutedChats();
            setRoutedChats(data);
        } catch (error) {
            console.error('Error fetching routed chats:', error);
        }
    };

    const fetchChatsWithoutHuman = async () => {
        try {
            const data = await FAQApi.getChatsWithoutHuman();
            setChatsWithoutHuman(data);
        } catch (error) {
            console.error('Error fetching chats without human interference:', error);
        }
    };

    return (
        <div className={styles.container}>
            <NavBar />
            <div className={styles.content}>
                <h1>Dashboard</h1>
                <div className={styles.statisticsWrapper}>
                    <div className={styles.statBox}>
                        <h2>Out-of-Office Chats</h2>
                        <p>{outOfOfficeChats}</p>
                    </div>
                    <div className={styles.statBox}>
                        <h2>Total Chats</h2>
                        <p>{totalChats}</p>
                    </div>
                    <div className={styles.statBox}>
                        <h2>Failed Questions</h2>
                        <p>{failedQuestions.length}</p>
                    </div>
                    <div className={styles.statBox}>
                        <h2>Routed Chats</h2>
                        <p>{routedChats}</p>
                    </div>
                    <div className={styles.statBox}>
                        <h2>Chats Without Human Interference</h2>
                        <p>{chatsWithoutHuman}</p>
                    </div>
                    <div className={styles.chartSection}>
                        <h2>Most Asked Questions</h2>
                        <PieChart FAQStatistics={FAQStatistics} />
                    </div>
                </div>
            </div>
        </div>
    );
}
