import React from 'react';
import { useAuth } from '../context/AuthContext';
import ResultCard from './ResultCard';

const StudentDashboard: React.FC = () => {
    const { user, logout } = useAuth();

    // Since user is logged in as student, we should have the student data.
    // However, AuthContext User might just be { id, name, role }.
    // We need to fetch the full student details including marks.
    // In App.tsx or somewhere we should have fetched it, or we fetch it here.

    // Actually, in the plan I mentioned fetching result.
    // Let's check AuthContext user object again. It has id.
    // So we need to fetch the student by ID.

    // To handle this nicely, we'll fetch the student data on mount.
    const [student, setStudent] = React.useState<any>(null);
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState('');


    React.useEffect(() => {
        const fetchData = async () => {
            try {
                // We need an API function to get single student by ID
                if (user?.id) {
                    const { getStudent, getExamConfig } = await import('../api');
                    const [studentData, configData] = await Promise.all([
                        getStudent(user.id),
                        getExamConfig()
                    ]);
                    setStudent(studentData);
                    setExamConfig(configData);
                }
            } catch (err) {
                console.error("Failed to fetch student result", err);
                setError("Failed to load result.");
            } finally {
                setLoading(false);
            }
        };

        if (user?.role === 'student') {
            fetchData();
        }
    }, [user]);

    const [examConfig, setExamConfig] = React.useState<any>(null);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (error || !student) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
                <p className="text-red-500 mb-4">{error || "Student not found"}</p>
                <button
                    onClick={logout}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                    Logout
                </button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100 p-4 md:p-8 font-sans">
            <header className="flex justify-between items-center max-w-4xl mx-auto mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Welcome, {student.name}</h1>
                    <p className="text-gray-500 text-sm">Review your performance</p>
                </div>
                <button
                    onClick={logout}
                    className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium shadow-sm"
                >
                    Logout
                </button>
            </header>

            <div className="max-w-4xl mx-auto flex justify-center">
                <ResultCard
                    student={student}
                    examConfig={examConfig}
                    isModal={false}
                />
            </div>
        </div>
    );
};

export default StudentDashboard;
