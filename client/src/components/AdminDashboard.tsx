import React, { useState, useEffect } from 'react';
import UploadForm from './UploadForm';
import ResultList from './ResultList';
import ResultCard from './ResultCard';
import ExamConfigForm from './ExamConfigForm';
import StudentForm from './StudentForm';
import { getResults, deleteAllStudents, deleteStudent, getExamConfig, saveExamConfig, createStudent, updateStudent } from '../api';
import { useAuth } from '../context/AuthContext';
import type { Student, ExamConfig } from '../types';

const AdminDashboard: React.FC = () => {
    const { logout } = useAuth();
    const [students, setStudents] = useState<Student[]>([]);
    const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
    const [loading, setLoading] = useState(false);
    const [examConfig, setExamConfig] = useState<ExamConfig | null>(null);

    // State for manual entry/editing
    const [isStudentFormOpen, setIsStudentFormOpen] = useState(false);
    const [editingStudent, setEditingStudent] = useState<Student | null>(null);

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

    const handleAddStudentClick = () => {
        setEditingStudent(null);
        setIsStudentFormOpen(true);
    };

    const handleEditStudentClick = (student: Student) => {
        setEditingStudent(student);
        setIsStudentFormOpen(true);
    };

    const handleSaveStudent = async (studentData: Partial<Student>) => {
        try {
            if (editingStudent) {
                // Update
                const updated = await updateStudent(editingStudent._id, studentData);
                setStudents(prev => prev.map(s => s._id === updated._id ? updated : s));
            } else {
                // Create
                const created = await createStudent(studentData);
                setStudents(prev => [...prev, created]);
            }
            setIsStudentFormOpen(false);
        } catch (error) {
            console.error("Failed to save student", error);
            alert("Failed to save student data.");
        }
    };

    const detectedSubjects = React.useMemo(() => {
        if (students.length === 0 && !examConfig) return [];
        const subjectSet = new Set<string>();
        if (examConfig) {
            Object.keys(examConfig).forEach(k => subjectSet.add(k));
        }
        students.forEach(student => {
            Object.keys(student.marks).forEach(s => subjectSet.add(s));
        });
        return Array.from(subjectSet);
    }, [students, examConfig]);

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
                    <div className="md:col-span-1 space-y-6">
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-blue-50">
                            <h3 className="font-bold text-gray-700 mb-4">Actions</h3>
                            <button
                                onClick={handleAddStudentClick}
                                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-md transition-all font-semibold flex justify-center items-center mb-4"
                            >
                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg>
                                Add Student Manually
                            </button>
                            <UploadForm onUploadSuccess={() => { fetchData(); }} />
                        </div>

                        {examConfig && (
                            <div className="bg-white p-6 rounded-xl shadow-sm border border-blue-100">
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="font-bold text-gray-700">Exam Settings</h3>
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
                                        onClick={() => setExamConfig(null)}
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
                                onEditStudent={handleEditStudentClick}
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

                {isStudentFormOpen && (
                    <StudentForm
                        initialStudent={editingStudent}
                        examConfig={examConfig}
                        subjects={detectedSubjects}
                        onSave={handleSaveStudent}
                        onCancel={() => setIsStudentFormOpen(false)}
                    />
                )}
            </div>
        </div>
    );
};

export default AdminDashboard;
