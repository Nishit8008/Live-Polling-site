import React, { useState, useEffect } from 'react';
import { useSocket } from '../hooks/useSocket';
import { usePoll } from '../hooks/usePoll';
import { usePollTimer } from '../hooks/usePollTimer';
import { useAppContext } from '../context/AppContext';
import { BarChart2, MessageSquare, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const StudentDashboard: React.FC = () => {
    const { poll, loading } = usePoll();
    const { socket } = useSocket();
    const { sessionId } = useAppContext();
    const remainingTime = usePollTimer(poll?.startTime || null, poll?.duration || 0);
    const navigate = useNavigate();

    const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
    const [hasVoted, setHasVoted] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    // Check sessionStorage for existing vote to prevent simple refresh bypass
    useEffect(() => {
        if (poll) {
            const voted = sessionStorage.getItem(`voted_${poll._id}`);
            if (voted) {
                setHasVoted(true);
                setSelectedOptionId(voted);
            } else {
                setHasVoted(false);
                setSelectedOptionId(null);
            }
        }
    }, [poll?._id]); // Run when poll ID changes

    // Handle kicked event
    useEffect(() => {
        if (!socket) return;
        socket.emit('registerSession', sessionId);
        socket.on('student:kicked', () => {
            alert("You have been kicked from the session.");
            navigate('/');
        });
        return () => {
            socket.off('student:kicked');
        };
    }, [socket, sessionId, navigate]);

    const handleSubmit = () => {
        if (!selectedOptionId || !socket || !poll) return;

        setSubmitting(true);
        socket.emit('vote', {
            pollId: poll._id,
            optionId: selectedOptionId,
            studentSessionId: sessionId
        });

        // Optimistic UI update
        setHasVoted(true);
        sessionStorage.setItem(`voted_${poll._id}`, selectedOptionId);
        setSubmitting(false);

        // If there's an error, we could listen to 'vote:error', but for simplicity assume success.
    };

    if (loading) return <div className="center-layout"><div className="loader"></div></div>;

    // Student view shows results if they have voted OR timer expired OR poll is closed
    const showResults = hasVoted || remainingTime <= 0 || (poll && poll.status === 'closed');

    const formatTime = (seconds: number) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    };

    return (
        <div className="center-layout" style={{ justifyContent: 'flex-start', paddingTop: '4rem' }}>

            {!poll || poll.status === 'waiting' || (poll.status === 'closed' && showResults) ? (
                <div className="text-center mt-4">
                    <div className="brand-pill">
                        <BarChart2 size={14} /> Intervue Poll
                    </div>
                    {(!poll || poll.status === 'waiting') && (
                        <>
                            <div className="loader mt-4"></div>
                            <h2 style={{ fontSize: '1.25rem', marginTop: '1rem' }}>Wait for the teacher to ask questions..</h2>
                        </>
                    )}

                    {poll && poll.status === 'closed' && showResults && (
                        <h2 style={{ fontSize: '1.25rem', marginTop: '1rem' }}>Wait for the teacher to ask a new question..</h2>
                    )}
                </div>
            ) : null}

            {poll && poll.status === 'active' && !showResults && (
                <div style={{ width: '100%', maxWidth: '600px' }}>
                    <div className="flex items-center gap-4 mb-4">
                        <h2 style={{ fontSize: '1.25rem', fontWeight: 600 }}>Question 1</h2>
                        <div className="timer-pill">
                            <Clock size={16} /> {formatTime(remainingTime)}
                        </div>
                    </div>

                    <div className="poll-question-header">
                        {poll.question}
                    </div>
                    <div className="poll-options-container">
                        {poll.options.map((opt, idx) => {
                            const letter = String.fromCharCode(65 + idx);
                            const isSelected = selectedOptionId === opt.id;

                            return (
                                <div
                                    key={opt.id}
                                    className={`poll-option ${isSelected ? 'selected' : ''}`}
                                    onClick={() => setSelectedOptionId(opt.id)}
                                >
                                    <div className="poll-option-content">
                                        <div className="poll-option-text">
                                            <span className="poll-option-letter">{letter}</span>
                                            <span>{opt.text}</span>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    <div className="flex justify-end mt-4">
                        <button
                            className="btn"
                            onClick={handleSubmit}
                            disabled={!selectedOptionId || submitting}
                        >
                            {submitting ? 'Submitting...' : 'Submit'}
                        </button>
                    </div>
                </div>
            )}

            {/* RESULT VIEW FOR STUDENT */}
            {poll && showResults && poll.status !== 'waiting' && (
                <div style={{ width: '100%', maxWidth: '600px', marginTop: '2rem' }}>
                    <div className="flex items-center gap-4 mb-4">
                        <h2 style={{ fontSize: '1.25rem', fontWeight: 600 }}>Question 1</h2>
                    </div>

                    <div className="poll-question-header">
                        {poll.question}
                    </div>
                    <div className="poll-options-container">
                        {poll.options.map((opt, idx) => {
                            const letter = String.fromCharCode(65 + idx);
                            const isStudentChoice = selectedOptionId === opt.id;

                            let percentage = 0;
                            let isCorrectChoice = false;

                            if (isStudentChoice) {
                                isCorrectChoice = !!opt.isCorrect;
                                percentage = isCorrectChoice ? 100 : 0;
                            }

                            const progressStyle: React.CSSProperties = {
                                width: `${percentage}%`,
                            };
                            if (isStudentChoice) {
                                progressStyle.backgroundColor = isCorrectChoice ? 'rgba(46, 204, 113, 0.2)' : 'rgba(231, 76, 60, 0.2)';
                            }

                            return (
                                <div key={opt.id} className="poll-option result-mode" style={{ borderColor: isStudentChoice ? (isCorrectChoice ? '#2ecc71' : '#e74c3c') : undefined }}>
                                    <div className="poll-option-progress" style={progressStyle}></div>
                                    <div className="poll-option-content">
                                        <div className="poll-option-text">
                                            <span className="poll-option-letter" style={{ backgroundColor: isStudentChoice ? (isCorrectChoice ? '#2ecc71' : '#e74c3c') : undefined, color: isStudentChoice ? 'white' : undefined }}>{letter}</span>
                                            <span>{opt.text} {isStudentChoice && <span style={{ fontWeight: 'bold', color: isCorrectChoice ? '#2ecc71' : '#e74c3c' }}>{isCorrectChoice ? ' (Correct)' : ' (Incorrect)'}</span>}</span>
                                        </div>
                                        {isStudentChoice && <span className="poll-option-percent" style={{ color: isCorrectChoice ? '#2ecc71' : '#e74c3c', fontWeight: 'bold' }}>{percentage}%</span>}
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    <div className="text-center mt-4">
                        <h3 style={{ fontSize: '1rem', color: 'var(--text-gray)' }}>Wait for the teacher to ask a new question..</h3>
                    </div>
                </div>
            )}

            {/* FAB Chat Button */}
            <div className="chat-fab">
                <MessageSquare size={24} />
            </div>
        </div>
    );
};

export default StudentDashboard;
