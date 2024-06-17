import React, { useState, useEffect } from 'react';
import FAQApi from '../api/FAQApi';
import styles from './HomePage.module.css';
import NavBar from '../components/NavBar';
import { Link } from 'react-router-dom';

export default function HomePage() {
    const [FAQs, setFAQs] = useState([]);
    const [newFAQQuestion, setNewFAQQuestion] = useState('');
    const [newFAQAnswer, setNewFAQAnswer] = useState('');
    const [newFAQCategory, setNewFAQCategory] = useState('');
    const [editingFAQId, setEditingFAQId] = useState(null);
    const [updatedFAQQuestion, setUpdatedFAQQuestion] = useState('');
    const [updatedFAQAnswer, setUpdatedFAQAnswer] = useState('');
    const [updatedFAQCategory, setUpdatedFAQCategory] = useState('');

    const [currentPage, setCurrentPage] = useState(1);
    const FAQsPerPage = 4;

    useEffect(() => {
        fetchFAQs();
    }, []);

    const fetchFAQs = () => {
        FAQApi.getFAQs()
            .then(data => {
                setFAQs(data.chatbotFAQS);
            })
            .catch(error => {
                console.error('Error fetching FAQs:', error);
            });
    };

    const addFAQ = () => {
        FAQApi.createFAQ({ question: newFAQQuestion, answer: newFAQAnswer, category: newFAQCategory })
            .then(() => {
                fetchFAQs();
                setNewFAQQuestion('');
                setNewFAQAnswer('');
                setNewFAQCategory('');
            })
            .catch(error => {
                console.error('Error adding FAQ:', error);
            });
    };

    const deleteFAQ = id => {
        FAQApi.deleteFAQ(id)
            .then(() => {
                fetchFAQs();
            })
            .catch(error => {
                console.error('Error deleting FAQ:', error);
            });
    };

    const updateFAQ = (id) => {
        const updatedFAQ = {
            question: updatedFAQQuestion,
            answer: updatedFAQAnswer,
            category: updatedFAQCategory
        };
        FAQApi.updateFAQ(id, updatedFAQ)
            .then(() => {
                fetchFAQs();
                setEditingFAQId(null);
                setUpdatedFAQQuestion('');
                setUpdatedFAQAnswer('');
                setUpdatedFAQCategory('');
            })
            .catch(error => {
                console.error('Error updating FAQ:', error);
            });
    };

    const indexOfLastFAQ = currentPage * FAQsPerPage;
    const indexOfFirstFAQ = indexOfLastFAQ - FAQsPerPage;
    const currentFAQs = FAQs.slice(indexOfFirstFAQ, indexOfLastFAQ);

    const paginate = pageNumber => setCurrentPage(pageNumber);

    return (
        <div className={styles.container}>
            <NavBar />
            <header className={styles.header}>
                <div className={styles.headerContent}>
                    <div>
                        <h1>Welcome to the Dashboard.</h1>
                        <p>Keep track of BAS World.</p>
                    </div>
                    <img src="./dashboard.webp" alt="Dashboard" className={styles.headerImage} />
                </div>
            </header>
            <section className={styles.mainSection}>
                <div className={styles.FAQContainer}>
                    <p className={styles.FAQCrud}>FAQs CRUD:</p>
                    <ul className={styles.FAQList}>
                        {currentFAQs.map((faq, index) => (
                            <li key={faq.faqid} className={styles.faqItem}>
                                {editingFAQId === faq.faqid ? (
                                    <div className={styles.editingContainer}>
                                        <input
                                            type="text"
                                            value={updatedFAQQuestion}
                                            onChange={e => setUpdatedFAQQuestion(e.target.value)}
                                            className={styles.input}
                                        />
                                        <input
                                            type="text"
                                            value={updatedFAQAnswer}
                                            onChange={e => setUpdatedFAQAnswer(e.target.value)}
                                            className={styles.input}
                                        />
                                        <input
                                            type="text"
                                            value={updatedFAQCategory}
                                            onChange={e => setUpdatedFAQCategory(e.target.value)}
                                            className={styles.input}
                                        />
                                        <button onClick={() => updateFAQ(faq.faqid)} className={styles.button}>Save</button>
                                    </div>
                                ) : (
                                    <div>
                                        <p>Question: {faq.question}</p>
                                        <p>Answer: {faq.answer}</p>
                                        <p>Category: {faq.category}</p>
                                        <button onClick={() => deleteFAQ(faq.faqid)} className={styles.button}>Delete</button>
                                        <button onClick={() => {
                                            setEditingFAQId(faq.faqid);
                                            setUpdatedFAQQuestion(faq.question);
                                            setUpdatedFAQAnswer(faq.answer);
                                            setUpdatedFAQCategory(faq.category);
                                        }} className={styles.button}>Edit</button>
                                    </div>
                                )}
                            </li>
                        ))}
                    </ul>
                    <div className={styles.pagination}>
                        <button
                            onClick={() => paginate(currentPage - 1)}
                            className={styles.arrow}
                            disabled={currentPage === 1}
                        >
                            &laquo;
                        </button>
                        {[...Array(Math.ceil(FAQs.length / FAQsPerPage)).keys()].map(number => (
                            <button
                                key={number + 1}
                                onClick={() => paginate(number + 1)}
                                className={`${styles.pageButton} ${currentPage === number + 1 ? styles.active : ''}`}
                            >
                                {number + 1}
                            </button>
                        ))}
                        <button
                            onClick={() => paginate(currentPage + 1)}
                            className={styles.arrow}
                            disabled={currentPage === Math.ceil(FAQs.length / FAQsPerPage)}
                        >
                            &raquo;
                        </button>
                    </div>
                </div>
            </section>
            <section className={styles.addFAQContainer}>
                <h2>Add New FAQ</h2>
                <div>
                    <input
                        type="text"
                        value={newFAQQuestion}
                        onChange={e => setNewFAQQuestion(e.target.value)}
                        placeholder="Question"
                        className={styles.input}
                    />
                </div>
                <div>
                    <input
                        type="text"
                        value={newFAQAnswer}
                        onChange={e => setNewFAQAnswer(e.target.value)}
                        placeholder="Answer"
                        className={styles.input}
                    />
                </div>
                <div>
                    <input
                        type="text"
                        value={newFAQCategory}
                        onChange={e => setNewFAQCategory(e.target.value)}
                        placeholder="Category"
                        className={styles.input}
                    />
                </div>
                <div>
                    <button onClick={addFAQ} className={styles.button}>Add</button>
                </div>
            </section>
            <footer className={styles.footer}>
                <p>© Copyright 2024 Hustle & Hack Harmony</p>
                <Link to="/statistics" className={styles.button}>View Statistics</Link>
            </footer>
        </div>
    );
}
