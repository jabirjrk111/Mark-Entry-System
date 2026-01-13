import React from 'react';
import type { Student } from '../types';

interface Props {
    students: Student[];
    onSelectStudent: (student: Student) => void;
    onDeleteStudent: (id: string) => void;
    onDeleteAll: () => void;
    onEditStudent: (student: Student) => void;
}

const ResultList: React.FC<Props> = ({ students, onSelectStudent, onDeleteStudent, onDeleteAll, onEditStudent }) => {
    const [searchTerm, setSearchTerm] = React.useState('');

    const filteredStudents = students.filter(student =>
        student.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="flex flex-col sm:flex-row justify-between items-center p-6 border-b gap-4">
                <h2 className="text-xl font-bold text-gray-800">Results List</h2>
                <div className="flex items-center gap-3 w-full sm:w-auto">
                    <input
                        type="text"
                        placeholder="Search by name..."
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none flex-grow"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    {students.length > 0 && (
                        <button
                            onClick={() => {
                                if (window.confirm('Are you sure you want to delete ALL data? This cannot be undone.')) {
                                    onDeleteAll();
                                }
                            }}
                            className="bg-red-50 text-red-600 px-4 py-2 rounded-lg hover:bg-red-100 font-medium transition-colors text-sm whitespace-nowrap"
                        >
                            Reset Data
                        </button>
                    )}
                </div>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                            <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Place</th>
                            <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Stream</th>
                            <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Total Marks</th>
                            <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider text-right">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {filteredStudents.map((student) => (
                            <tr key={student._id} className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{student.name}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{student.place}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{student.stream || '-'}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-bold">{student.total}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-right space-x-3">
                                    <button
                                        onClick={() => onSelectStudent(student)}
                                        className="text-blue-600 hover:text-blue-900 font-medium"
                                    >
                                        View
                                    </button>
                                    <button
                                        onClick={() => onEditStudent(student)}
                                        className="text-amber-500 hover:text-amber-700 font-medium"
                                        title="Edit"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
                                    </button>
                                    <button
                                        onClick={() => {
                                            if (window.confirm(`Delete result for ${student.name}?`)) {
                                                onDeleteStudent(student._id);
                                            }
                                        }}
                                        className="text-red-500 hover:text-red-700 font-medium"
                                        title="Delete"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {filteredStudents.length === 0 && (
                            <tr>
                                <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                                    {searchTerm ? 'No student found with that name.' : 'No results found. Upload a file to get started.'}
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ResultList;
