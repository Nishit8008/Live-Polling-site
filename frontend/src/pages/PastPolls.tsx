import React, { useEffect, useState } from 'react';
import type { Poll } from '../hooks/usePoll';
import { MessageSquare, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const API_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000/api';

const PastPolls: React.FC = () => {
    const [history, setHistory] = useState<Poll[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const res = await fetch(`${API_URL}/poll/history`);
                if (res.ok) {
                    const data = await res.json();
                    setHistory(data);
                }
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchHistory();
    }, []);

    return (
        <div className="dashboard-container">
            <div className="flex items-center gap-4 mb-8">
                <Link to="/teacher" className="btn btn-secondary" style={{ padding: '0.5rem', borderRadius: '50%' }}>
                    <ArrowLeft size={20} />
                </Link>
                <h1 style={{ marginBottom: 0 }}>View Poll History</h1>
            </div>

            {loading ? (
                <div className="center-layout"><div className="loader"></div></div>
            ) : history.length === 0 ? (
                <div className="text-center mt-4">
                    <p className="subtitle" style={{ margin: '0 auto' }}>No past polls found.</p>
                </div>
            ) : (
                history.map((poll, pIdx) => {
                    const totalVotes = poll.options.reduce((sum, opt) => sum + opt.voteCount, 0);
                    return (
                        <div key={poll._id} className="mb-8 pl-4 pr-4">
                            <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '1rem' }}>Question {history.length - pIdx}</h3>

                            <div className="poll-question-header" style={{ borderRadius: '8px 8px 0 0' }}>
                                {poll.question}
                            </div>
                            <div className="poll-options-container" style={{ borderRadius: '0 0 8px 8px' }}>
                                {poll.options.map((opt, idx) => {
                                    const letter = String.fromCharCode(65 + idx);
                                    const percentage = totalVotes === 0 ? 0 : Math.round((opt.voteCount / totalVotes) * 100);

                                    return (
                                        <div key={opt.id} className="poll-option result-mode">
                                            <div className="poll-option-progress" style={{ width: `${percentage}%`, backgroundColor: opt.voteCount > 0 ? 'var(--primary)' : 'var(--bg-secondary)' }}></div>
                                            <div className="poll-option-content">
                                                <div className="poll-option-text" style={{ color: opt.voteCount > 0 ? 'white' : 'var(--text-dark)' }}>
                                                    <span className="poll-option-letter" style={{ backgroundColor: opt.voteCount > 0 ? 'white' : 'var(--bg-secondary)', color: opt.voteCount > 0 ? 'var(--primary)' : 'var(--text-gray)' }}>{letter}</span>
                                                    <span>{opt.text}</span>
                                                </div>
                                                <span className="poll-option-percent">{percentage}%</span>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    );
                })
            )}

            {/* FAB Chat Button */}
            <div className="chat-fab">
                <MessageSquare size={24} />
            </div>
        </div>
    );
};

export default PastPolls;
