import React, { useState, useEffect } from 'react';
import type { Student, ExamConfig } from '../types';

interface StudentFormProps {
    initialStudent?: Partial<Student> | null;
    examConfig: ExamConfig | null;
    subjects: string[];
    onSave: (student: Partial<Student>) => void;
    onCancel: () => void;
}

const StudentForm: React.FC<StudentFormProps> = ({ initialStudent, examConfig, subjects, onSave, onCancel }) => {
    const [name, setName] = useState(initialStudent?.name || '');
    const [dob, setDob] = useState(initialStudent?.dob || '');
    const [place, setPlace] = useState(initialStudent?.place || '');
    const [stream, setStream] = useState(initialStudent?.stream || '');
    const [marks, setMarks] = useState<Record<string, number>>(initialStudent?.marks || {});

    // Ensure all subjects from config are present in marks state
    useEffect(() => {
        if (examConfig) {
            // Merge existing marks with default 0 for config-defined subjects
            const newMarks = { ...marks };
            Object.keys(examConfig).forEach(sub => {
                if (newMarks[sub] === undefined) {
                    newMarks[sub] = 0;
                }
            });
            // If explicit subjects passed and not in config? Use them too.
            subjects.forEach(sub => {
                if (newMarks[sub] === undefined) {
                    newMarks[sub] = 0;
                }
            });
            setMarks(newMarks);
        } else if (Object.keys(marks).length === 0 && subjects.length > 0) {
            const newMarks: Record<string, number> = {};
            subjects.forEach(sub => newMarks[sub] = 0);
            setMarks(newMarks);
        }
    }, [examConfig, subjects]);


    const handleMarkChange = (subject: string, value: string) => {
        setMarks(prev => ({
            ...prev,
            [subject]: Number(value)
        }));
    };

    const handleAddSubject = () => {
        const sub = prompt("Enter new subject name:");
        if (sub && !marks[sub]) {
            setMarks(prev => ({ ...prev, [sub]: 0 }));
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Calculate Total
        const total = Object.values(marks).reduce((sum, current) => sum + current, 0);

        onSave({
            ...initialStudent,
            name,
            dob,
            place,
            stream,
            marks,
            total
        });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm overflow-y-auto">
            <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full flex flex-col max-h-[90vh]">
                <div className="flex justify-between items-center p-6 border-b">
                    <h3 className="text-xl font-bold text-gray-800">
                        {initialStudent ? 'Edit Student' : 'Add New Student'}
                    </h3>
                    <button onClick={onCancel} className="text-gray-400 hover:text-gray-600">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                            <input
                                type="text"
                                required
                                value={name}
                                onChange={e => setName(e.target.value)}
                                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth (Password)</label>
                            <input
                                type="text"
                                placeholder="DD-MM-YYYY"
                                required
                                value={dob}
                                onChange={e => setDob(e.target.value)}
                                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Place</label>
                            <input
                                type="text"
                                required
                                value={place}
                                onChange={e => setPlace(e.target.value)}
                                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Stream</label>
                            <input
                                type="text"
                                value={stream}
                                onChange={e => setStream(e.target.value)}
                                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                            />
                        </div>
                    </div>

                    <div className="border-t pt-4 mt-4">
                        <div className="flex justify-between items-center mb-4">
                            <h4 className="font-semibold text-gray-700">Marks</h4>
                            <button type="button" onClick={handleAddSubject} className="text-sm text-blue-600 hover:text-blue-800">
                                + Add Subject
                            </button>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            {Object.entries(marks).map(([subject, mark]) => (
                                <div key={subject}>
                                    <label className="block text-xs font-medium text-gray-500 mb-1 capitalize">{subject}</label>
                                    <input
                                        type="number"
                                        min="0"
                                        required
                                        value={mark}
                                        onChange={e => handleMarkChange(subject, e.target.value)}
                                        className="w-full px-3 py-2 border rounded bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                </form>

                <div className="p-6 border-t bg-gray-50 flex justify-end space-x-3">
                    <button type="button" onClick={onCancel} className="px-4 py-2 text-gray-600 hover:bg-gray-200 rounded-lg transition-colors font-medium">Cancel</button>
                    <button onClick={handleSubmit} className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow-lg shadow-blue-500/30 transition-all font-medium">
                        Save Student
                    </button>
                </div>
            </div>
        </div>
    );
};

export default StudentForm;
