import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { BarChart2 } from 'lucide-react';

const API_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000/api';

const StudentOnboarding: React.FC = () => {
    const [name, setName] = useState('');
    const [loading, setLoading] = useState(false);
    const { setStudentName, sessionId } = useAppContext();
    const navigate = useNavigate();

    const handleContinue = async () => {
        if (!name.trim()) return;

        setLoading(true);
        try {
            const res = await fetch(`${API_URL}/student`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ sessionId, name })
            });

            if (res.ok) {
                setStudentName(name);
                navigate('/student');
            }
        } catch (error) {
            console.error('Failed to register student', error);
            alert('Failed to register. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="center-layout">
            <div className="brand-pill">
                <BarChart2 size={14} /> Intervue Poll
            </div>

            <h1>Let's Get Started</h1>
            <p className="subtitle">
                If you're a student, you'll be able to submit your answers, participate in live polls, and see how your responses compare with your classmates.
            </p>

            <div className="input-group" style={{ maxWidth: '400px' }}>
                <label className="input-label" style={{ textAlign: 'center' }}>Enter your Name</label>
                <input
                    type="text"
                    className="input-field text-center"
                    placeholder="Rahul Bajaj"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleContinue()}
                />
            </div>

            <button
                className="btn"
                onClick={handleContinue}
                disabled={!name.trim() || loading}
            >
                {loading ? 'Joining...' : 'Continue'}
            </button>
        </div>
    );
};

export default StudentOnboarding;
