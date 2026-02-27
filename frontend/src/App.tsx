import { Routes, Route, Navigate } from 'react-router-dom';
import { useAppContext } from './context/AppContext';

// Pages
import RoleSelection from './pages/RoleSelection';
import TeacherDashboard from './pages/TeacherDashboard';
import PastPolls from './pages/PastPolls';
import StudentOnboarding from './pages/StudentOnboarding';
import StudentDashboard from './pages/StudentDashboard';

function App() {
  const { role, studentName } = useAppContext();

  return (
    <div className="app-container">
      <Routes>
        <Route path="/" element={
          !role ? <RoleSelection /> :
            role === 'teacher' ? <Navigate to="/teacher" replace /> :
              !studentName ? <Navigate to="/student/onboard" replace /> :
                <Navigate to="/student" replace />
        } />

        {/* Teacher Routes */}
        <Route path="/teacher" element={
          role === 'teacher' ? <TeacherDashboard /> : <Navigate to="/" replace />
        } />
        <Route path="/teacher/history" element={
          role === 'teacher' ? <PastPolls /> : <Navigate to="/" replace />
        } />

        {/* Student Routes */}
        <Route path="/student/onboard" element={
          role === 'student' ? <StudentOnboarding /> : <Navigate to="/" replace />
        } />
        <Route path="/student" element={
          role === 'student' && studentName ? <StudentDashboard /> : <Navigate to="/" replace />
        } />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}

export default App;
