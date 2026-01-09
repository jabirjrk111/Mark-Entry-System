import React, { useState, useEffect } from 'react';
import UploadForm from './UploadForm';
import ResultList from './ResultList';
import ResultCard from './ResultCard';
import ExamConfigForm from './ExamConfigForm';
import { getResults, deleteAllStudents, deleteStudent, getExamConfig, saveExamConfig } from '../api';
import { useAuth } from '../context/AuthContext';
import type { Student, ExamConfig } from '../types';

const AdminDashboard: React.FC = () => {
    const { logout } = useAuth();
    const [students, setStudents] = useState<Student[]>([]);
    const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
    const [loading, setLoading] = useState(false);
    const [examConfig, setExamConfig] = useState<ExamConfig | null>(null);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [studentsData, configData] = await Promise.all([
                getResults(),
                getExamConfig()
            ]);
            setStudents(studentsData);
            setExamConfig(configData);
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleSaveConfig = async (config: ExamConfig) => {
        try {
            await saveExamConfig(config);
            setExamConfig(config);
            alert("Configuration saved successfully!");
        } catch (error) {
            console.error("Failed to save config", error);
            alert("Failed to save configuration.");
        }
    };

    const handleDeleteAll = async () => {
        if (!window.confirm("Are you sure you want to delete ALL students?")) return;
        try {
            await deleteAllStudents();
            setStudents([]);
            // converting null to undefined to match state type if strict, but let's keep null as "no config"
            // Actually, we might want to Keep config even if students are deleted?
            // The user request didn't specify, but usually config is independent. 
            // However, existing code wiped it. Let's keep it if we persist it now.
            // setExamConfig(null); 
        } catch (error) {
            console.error("Failed to delete all students", error);
            alert("Failed to reset data.");
        }
    };

    const handleDeleteStudent = async (id: string) => {
        if (!window.confirm("Are you sure you want to delete this student?")) return;
        try {
            await deleteStudent(id);
            setStudents(prev => prev.filter(s => s._id !== id));
        } catch (error) {
            console.error("Failed to delete student", error);
            alert("Failed to delete student.");
        }
    };

    const detectedSubjects = React.useMemo(() => {
        if (students.length === 0) return [];
        const subjectSet = new Set<string>();
        students.forEach(student => {
            Object.keys(student.marks).forEach(s => subjectSet.add(s));
        });
        return Array.from(subjectSet);
    }, [students]);

    return (
        <div className="min-h-screen bg-gray-100 p-8 font-sans">
            <div className="max-w-6xl mx-auto space-y-8">
                <header className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm">
                    <div className="flex-1 text-center">
                        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Admin Dashboard</h1>
                        <p className="text-gray-500 text-sm mt-1">Manage Student Records</p>
                    </div>
                    <button
                        onClick={logout}
                        className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-medium transition-colors"
                    >
                        Logout
                    </button>
                </header>

                {/* Configuration Step */}
                {students.length > 0 && !examConfig && !loading && (
                    <div className="mb-8 animate-fade-in-down">
                        <ExamConfigForm
                            subjects={detectedSubjects}
                            initialConfig={examConfig}
                            onSave={handleSaveConfig}
                        />
                    </div>
                )}

                <div className="grid grid-cols-1 md:col-span-3 gap-8">
                    <div className="md:col-span-1">
                        <UploadForm onUploadSuccess={() => { fetchData(); }} />

                        {examConfig && (
                            <div className="mt-6 bg-white p-6 rounded-xl shadow-sm border border-blue-100">
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="font-bold text-gray-700">Exam Settings</h3>
                                    {/* <button
                                        onClick={() => setExamConfig(null)}
                                        className="text-xs text-blue-600 hover:text-blue-800 font-medium"
                                    >
                                        Edit
                                    </button> */}
                                    {/* Edit button removes config in local state previously. Now we want to just show it. Form is above. 
                                        Actually, if config exists, we probably want to show the form populated, OR just show the summary.
                                        The Form checks if !examConfig to show itself. 
                                        
                                        We should probably Allow editing. 
                                        Let's change the logic: Always show form? Or show form if "Edit" clicked.
                                        
                                        For now, let's keep it simple. If config exists, we show summary. If user wants to edit, we need a way.
                                        The previous code had `setExamConfig(null)` to "Edit".
                                        If I do that, `examConfig` becomes null, so the Form appears (line 82 condition).
                                        Then user saves, `handleSaveConfig` called, `examConfig` set again.
                                        This flow still works for UI, but "Edit" implies modifying existing, not starting from scratch.
                                        `ExamConfigForm` handles `initialConfig`.
                                        
                                        Let's update `ExamConfigForm` usage to pass `examConfig` as `initialConfig`.
                                    */}
                                </div>
                                <div className="space-y-2 text-sm">
                                    {Object.entries(examConfig).map(([subject, conf]) => (
                                        <div key={subject} className="flex justify-between text-gray-600">
                                            <span className="capitalize">{subject}</span>
                                            <span>{conf.passMark} / {conf.maxMark}</span>
                                        </div>
                                    ))}
                                </div>
                                <div className="mt-4 flex justify-end">
                                    <button
                                        onClick={() => setExamConfig(null)} // This effectively hides this block and shows the Form
                                        className="text-sm text-blue-600 hover:underline"
                                    >
                                        Edit Configuration
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="md:col-span-2">
                        {loading ? (
                            <div className="bg-white p-12 rounded-xl shadow-md text-center">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                                <p className="text-gray-500 font-medium">Loading results...</p>
                            </div>
                        ) : (
                            <ResultList
                                students={students}
                                onSelectStudent={setSelectedStudent}
                                onDeleteStudent={handleDeleteStudent}
                                onDeleteAll={handleDeleteAll}
                            />
                        )}
                    </div>
                </div>

                {selectedStudent && (
                    <ResultCard
                        student={selectedStudent}
                        onClose={() => setSelectedStudent(null)}
                        examConfig={examConfig}
                    />
                )}
            </div>
        </div>
    );
};

export default AdminDashboard;
