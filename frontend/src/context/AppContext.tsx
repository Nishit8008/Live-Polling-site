import React, { createContext, useContext, useState, useEffect } from 'react';
type Role = 'student' | 'teacher' | null;

interface AppContextProps {
    role: Role;
    setRole: (role: Role) => void;
    sessionId: string;
    studentName: string;
    setStudentName: (name: string) => void;
    logout: () => void;
}

const AppContext = createContext<AppContextProps | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [role, setRoleState] = useState<Role>(null);
    const [sessionId, setSessionId] = useState<string>('');
    const [studentName, setStudentNameState] = useState<string>('');

    useEffect(() => {
        // Rehydrate session
        let sid = sessionStorage.getItem('sessionId');
        if (!sid) {
            sid = crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2, 15);
            sessionStorage.setItem('sessionId', sid);
        }
        setSessionId(sid);

        const storedRole = sessionStorage.getItem('role') as Role;
        if (storedRole) setRoleState(storedRole);

        const storedName = sessionStorage.getItem('studentName');
        if (storedName) setStudentNameState(storedName);
    }, []);

    const setRole = (newRole: Role) => {
        setRoleState(newRole);
        if (newRole) {
            sessionStorage.setItem('role', newRole);
        } else {
            sessionStorage.removeItem('role');
        }
    };

    const setStudentName = (name: string) => {
        setStudentNameState(name);
        sessionStorage.setItem('studentName', name);
    };

    const logout = () => {
        setRoleState(null);
        setStudentNameState('');
        sessionStorage.removeItem('role');
        sessionStorage.removeItem('studentName');
        // Keeping sessionId so we don't look like a completely new browser instance immediately, or we can reset it too.
    };

    return (
        <AppContext.Provider value={{ role, setRole, sessionId, studentName, setStudentName, logout }}>
            {children}
        </AppContext.Provider>
    );
};

export const useAppContext = () => {
    const context = useContext(AppContext);
    if (!context) throw new Error('useAppContext must be used within AppProvider');
    return context;
};
