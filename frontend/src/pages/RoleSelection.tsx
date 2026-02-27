import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { BarChart2 } from 'lucide-react';

const RoleSelection: React.FC = () => {
    const [selectedRole, setSelectedRole] = useState<'student' | 'teacher' | null>(null);
    const { setRole } = useAppContext();
    const navigate = useNavigate();

    const handleContinue = () => {
        if (selectedRole) {
            setRole(selectedRole);
            if (selectedRole === 'teacher') {
                navigate('/teacher');
            } else {
                navigate('/student/onboard');
            }
        }
    };

    return (
        <div className="center-layout">
            <div className="brand-pill">
                <BarChart2 size={14} /> Intervue Poll
            </div>

            <h1>Welcome to the Live Polling System</h1>
            <p className="subtitle">
                Please select the role that best describes you to begin using the live polling system
            </p>

            <div className="cards-grid">
                <div
                    className={`card selectable ${selectedRole === 'student' ? 'selected' : ''}`}
                    onClick={() => setSelectedRole('student')}
                >
                    <h3 style={{ marginBottom: '0.5rem', fontSize: '1.25rem' }}>I'm a Student</h3>
                    <p style={{ color: 'var(--text-gray)', fontSize: '0.875rem' }}>
                        Lorem ipsum is simply dummy text of the printing and typesetting industry.
                    </p>
                </div>

                <div
                    className={`card selectable ${selectedRole === 'teacher' ? 'selected' : ''}`}
                    onClick={() => setSelectedRole('teacher')}
                >
                    <h3 style={{ marginBottom: '0.5rem', fontSize: '1.25rem' }}>I'm a Teacher</h3>
                    <p style={{ color: 'var(--text-gray)', fontSize: '0.875rem' }}>
                        Submit answers and view the poll results in real-time.
                    </p>
                </div>
            </div>

            <button
                className="btn"
                onClick={handleContinue}
                disabled={!selectedRole}
            >
                Continue
            </button>
        </div>
    );
};

export default RoleSelection;
