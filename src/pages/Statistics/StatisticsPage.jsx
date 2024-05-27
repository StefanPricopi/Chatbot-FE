import React, { useState, useEffect } from 'react';
import FAQApi from '../../api/FAQApi';
import styles from './StatisticsPage.module.css';
import NavBar from '../../components/NavBar';
import PieChart from '../../components/PieChart';

export default function StatisticsPage() {
    const [FAQStatistics, setFAQStatistics] = useState([]);
    const [outOfOfficeChats, setOutOfOfficeChats] = useState(0);

    useEffect(() => {
        fetchFAQStatistics();
        fetchOutOfOfficeChats();
    }, []);

    const fetchFAQStatistics = () => {
        FAQApi.getFAQStatistics()
            .then(data => {
                const statistics = data.map(stat => ({
                    category: stat.category,
                    count: stat.count
                }));
                setFAQStatistics(statistics);
            })
            .catch(error => {
                console.error('Error fetching FAQ statistics:', error);
            });
    };

    const fetchOutOfOfficeChats = () => {
        FAQApi.getOutOfOfficeChats()
            .then(data => {
                setOutOfOfficeChats(data);
            })
            .catch(error => {
                console.error('Error fetching out-of-office chats:', error);
            });
    };

    return (
        <div className={styles.container}>
            <NavBar />
            <div className={styles.content}>
                <h1>Statistics</h1>
                <PieChart FAQStatistics={FAQStatistics} />
                <div className={styles.outOfOffice}>
                    <h2>Out-of-Office Chats</h2>
                    <p>{outOfOfficeChats}</p>
                </div>
            </div>
        </div>
    );
}
