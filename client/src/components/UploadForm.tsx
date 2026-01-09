import React, { useState } from 'react';
import { uploadFile } from '../api';

interface Props {
    onUploadSuccess: () => void;
}

const UploadForm: React.FC<Props> = ({ onUploadSuccess }) => {
    const [file, setFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);
    const [message, setMessage] = useState('');

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setFile(e.target.files[0]);
        }
    };

    const handleUpload = async () => {
        if (!file) return;
        setUploading(true);
        setMessage('');
        try {
            await uploadFile(file);
            setMessage('Upload successful!');
            onUploadSuccess();
        } catch (error) {
            setMessage('Upload failed.');
            console.error(error);
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="p-6 bg-white rounded-xl shadow-md space-y-4">
            <h2 className="text-xl font-bold text-gray-800">Upload Marks Excel</h2>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-500 transition-colors">
                <input
                    type="file"
                    accept=".xlsx, .xls"
                    onChange={handleFileChange}
                    className="block w-full text-sm text-gray-500
            file:mr-4 file:py-2 file:px-4
            file:rounded-full file:border-0
            file:text-sm file:font-semibold
            file:bg-blue-50 file:text-blue-700
            hover:file:bg-blue-100"
                />
            </div>
            <button
                onClick={handleUpload}
                disabled={!file || uploading}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors cursor-pointer disabled:cursor-not-allowed"
            >
                {uploading ? 'Uploading...' : 'Upload Data'}
            </button>
            {message && <p className={`text-sm ${message.includes('success') ? 'text-green-600' : 'text-red-600'}`}>{message}</p>}
        </div>
    );
};

export default UploadForm;
