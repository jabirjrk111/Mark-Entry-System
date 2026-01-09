import React, { useState, useEffect } from 'react';
import type { ExamConfig } from '../types';

interface Props {
    subjects: string[];
    initialConfig: ExamConfig | null;
    onSave: (config: ExamConfig) => void;
}

const ExamConfigForm: React.FC<Props> = ({ subjects, initialConfig, onSave }) => {
    const [config, setConfig] = useState<ExamConfig>({});

    useEffect(() => {
        if (initialConfig) {
            setConfig(initialConfig);
        } else {
            // Initialize with default values
            const defaultConfig: ExamConfig = {};
            subjects.forEach(subject => {
                defaultConfig[subject] = { maxMark: 100, passMark: 40 };
            });
            setConfig(defaultConfig);
        }
    }, [subjects, initialConfig]);

    const handleChange = (subject: string, field: 'maxMark' | 'passMark', value: string) => {
        setConfig(prev => ({
            ...prev,
            [subject]: {
                ...prev[subject],
                [field]: Number(value)
            }
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(config);
    };

    return (
        <div className="bg-white rounded-xl shadow-md p-6 border border-blue-100">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Exam Configuration</h2>
            <p className="text-sm text-gray-500 mb-6">Please set the maximum marks and pass marks for each subject found in the uploaded file.</p>

            <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 mb-6">
                    {subjects.map(subject => (
                        <div key={subject} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                            <h3 className="font-bold text-gray-700 capitalize mb-3 border-b pb-2">{subject}</h3>
                            <div className="flex gap-4">
                                <div>
                                    <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Max Mark</label>
                                    <input
                                        type="number"
                                        required
                                        min="1"
                                        className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
                                        value={config[subject]?.maxMark || ''}
                                        onChange={(e) => handleChange(subject, 'maxMark', e.target.value)}
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Pass Mark</label>
                                    <input
                                        type="number"
                                        required
                                        min="0"
                                        className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
                                        value={config[subject]?.passMark || ''}
                                        onChange={(e) => handleChange(subject, 'passMark', e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="flex justify-end">
                    <button
                        type="submit"
                        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors"
                    >
                        Save Configuration
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ExamConfigForm;
