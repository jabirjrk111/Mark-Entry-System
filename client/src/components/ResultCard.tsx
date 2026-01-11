import React, { useRef } from 'react';
import type { Student, ExamConfig } from '../types';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

interface Props {
    student: Student;
    onClose?: () => void;
    examConfig: ExamConfig | null;
    isModal?: boolean;
    actions?: React.ReactNode;
}

const ResultCard: React.FC<Props> = ({ student, onClose, examConfig, isModal = true, actions }) => {
    const cardRef = useRef<HTMLDivElement>(null);

    const handleDownloadPDF = async () => {
        if (!cardRef.current) return;

        try {
            // Clone the element to render it with a fixed width, independent of the current device viewport
            const element = cardRef.current;
            const clone = element.cloneNode(true) as HTMLElement;

            // Set a fixed width for the clone (e.g., 800px) to ensure desktop-like rendering
            clone.style.width = '800px';
            clone.style.position = 'absolute';
            clone.style.top = '-10000px';
            clone.style.left = '-10000px';
            // Ensure strict inline styling is preserved or effectively applied
            clone.style.backgroundColor = '#ffffff';

            document.body.appendChild(clone);

            const canvas = await html2canvas(clone, {
                scale: 2,
                useCORS: true,
                logging: false, // Disable logging for production
                windowWidth: 800, // Match the clone width
            });

            // Remove the clone after capturing
            document.body.removeChild(clone);

            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'mm', 'a4');
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = pdf.internal.pageSize.getHeight();

            const imgWidth = canvas.width;
            const imgHeight = canvas.height;

            // Calculate ratio to fit within the page dimensions
            const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);

            const imgX = (pdfWidth - imgWidth * ratio) / 2;
            const imgY = 10; // Top margin
            const imgW = imgWidth * ratio;
            const imgH = imgHeight * ratio;

            pdf.addImage(imgData, 'PNG', imgX, imgY, imgW, imgH);
            pdf.save(`${student.name}_result.pdf`);
        } catch (error) {
            console.error("PDF generation failed", error);
            alert("Failed to generate PDF. Check console for details: " + JSON.stringify(error));
        }
    };

    // Calculate Percentage
    let totalMaxMarks = 0;
    if (examConfig) {
        Object.keys(student.marks).forEach(subject => {
            if (examConfig[subject]) {
                totalMaxMarks += examConfig[subject].maxMark;
            }
        });
    }

    const percentage = totalMaxMarks > 0
        ? ((student.total / totalMaxMarks) * 100).toFixed(2)
        : null;

    const Content = (
        <div className={`bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden flex flex-col ${isModal ? 'max-h-[90vh]' : ''}`}>
            {/* Header */}
            <div className="flex justify-between items-center p-6 border-b">
                <h3 className="text-xl font-bold text-gray-800">Student Result</h3>
                {onClose && (
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                    </button>
                )}
            </div>

            {/* Content to Print */}
            <div className="p-8 overflow-y-auto bg-gray-50" >
                <div ref={cardRef} style={{ fontFamily: "'Montserrat', sans-serif", backgroundColor: '#ffffff', padding: '2.5rem', borderRadius: '0.5rem', borderColor: '#f3f4f6', borderWidth: '1px', boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)' }}>
                    <div style={{ textAlign: 'center', marginBottom: '0.75rem' }}>
                        <h1 style={{ color: '#111827', fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.1rem' }}>Second Term Exam Results</h1>
                        <p style={{ color: '#6b7280', fontSize: '0.55rem' }}>Score Card</p>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '0.5rem', borderColor: '#e5e7eb', marginBottom: '1rem', paddingBottom: '0.75rem', borderBottomWidth: '1px' }}>
                        <div>
                            <p style={{ color: '#9ca3af', fontSize: '0.45rem', textTransform: 'uppercase', fontWeight: '600' }}>Student Name</p>
                            <p style={{ color: '#1f2937', fontSize: '0.65rem', fontWeight: '700' }}>{student.name}</p>
                        </div>
                        <div>
                            <p style={{ color: '#9ca3af', fontSize: '0.45rem', textTransform: 'uppercase', fontWeight: '600' }}>Place</p>
                            <p style={{ color: '#1f2937', fontSize: '0.65rem', fontWeight: '700' }}>{student.place}</p>
                        </div>
                        {student.stream && (
                            <div style={{ gridColumn: 'span 2', marginTop: '0.25rem' }}>
                                <p style={{ color: '#9ca3af', fontSize: '0.45rem', textTransform: 'uppercase', fontWeight: '600' }}>Stream</p>
                                <p style={{ color: '#1f2937', fontSize: '0.65rem', fontWeight: '700' }}>{student.stream}</p>
                            </div>
                        )}
                        {student.dob && (
                            <div style={{ marginTop: '0.25rem' }}>
                                <p style={{ color: '#9ca3af', fontSize: '0.45rem', textTransform: 'uppercase', fontWeight: '600' }}>Date of Birth</p>
                                <p style={{ color: '#1f2937', fontSize: '0.65rem', fontWeight: '700' }}>{student.dob}</p>
                            </div>
                        )}
                    </div>

                    <div style={{ marginBottom: '1rem' }}>

                        <div style={{ overflow: 'hidden', borderRadius: '0.5rem', borderWidth: '1px', borderColor: '#e5e7eb' }}>
                            <table style={{ minWidth: '100%', borderCollapse: 'collapse' }}>
                                <thead style={{ backgroundColor: '#f9fafb' }}>
                                    <tr>
                                        <th style={{ color: '#6b7280', textAlign: 'left', padding: '0.4rem', fontSize: '0.55rem', fontWeight: 'bold', textTransform: 'uppercase' }}>Subject</th>
                                        <th style={{ color: '#6b7280', textAlign: 'center', padding: '0.4rem', fontSize: '0.55rem', fontWeight: 'bold', textTransform: 'uppercase' }}>Max Mark</th>
                                        <th style={{ color: '#6b7280', textAlign: 'center', padding: '0.4rem', fontSize: '0.55rem', fontWeight: 'bold', textTransform: 'uppercase' }}>Obtained</th>
                                        <th style={{ color: '#6b7280', textAlign: 'center', padding: '0.4rem', fontSize: '0.55rem', fontWeight: 'bold', textTransform: 'uppercase' }}>Status</th>
                                    </tr>
                                </thead>
                                <tbody style={{ backgroundColor: '#ffffff' }}>
                                    {Object.entries(student.marks).map(([subject, mark], index) => {
                                        const config = examConfig ? examConfig[subject] : null;
                                        const isFail = config ? mark < config.passMark : false;
                                        const statusColor = isFail ? '#ef4444' : '#16a34a';

                                        return (
                                            <tr key={subject} style={{ borderTop: index > 0 ? '1px solid #e5e7eb' : 'none' }}>
                                                <td style={{ color: '#374151', padding: '0.4rem', fontSize: '0.6rem', fontWeight: '500', textTransform: 'capitalize' }}>{subject}</td>
                                                <td style={{ color: '#6b7280', textAlign: 'center', padding: '0.4rem', fontSize: '0.6rem' }}>{config ? config.maxMark : '-'}</td>
                                                <td style={{ color: '#111827', textAlign: 'center', padding: '0.4rem', fontSize: '0.6rem', fontWeight: 'bold' }}>{mark}</td>
                                                <td style={{ textAlign: 'center', padding: '0.4rem' }}>
                                                    {config ? (
                                                        <span style={{ color: statusColor, fontSize: '0.55rem', fontWeight: 'bold', textTransform: 'uppercase' }}>
                                                            {isFail ? 'FAIL' : 'PASS'}
                                                        </span>
                                                    ) : (
                                                        <span style={{ color: '#9ca3af', fontSize: '0.55rem' }}>-</span>
                                                    )}
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div style={{ backgroundColor: '#eff6ff', paddingTop: '0.5rem', borderTopWidth: '1px', borderColor: '#e5e7eb', padding: '0.5rem', borderRadius: '0.5rem', display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ color: '#1e3a8a', fontSize: '0.7rem', fontWeight: '700' }}>Total Score</span>
                            <span style={{ color: '#2563eb', fontSize: '0.8rem', fontWeight: '900' }}>{student.total} {totalMaxMarks > 0 && <span style={{ fontSize: '0.6rem', color: '#9ca3af', fontWeight: 'normal' }}>/ {totalMaxMarks}</span>}</span>
                        </div>
                        {percentage && (
                            <div style={{ borderTopWidth: '1px', borderColor: '#bfdbfe', paddingTop: '0.2rem', marginTop: '0.2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span style={{ color: '#1e3a8a', fontSize: '0.6rem', fontWeight: '700' }}>Percentage</span>
                                <span style={{ color: '#2563eb', fontSize: '0.7rem', fontWeight: '700' }}>{percentage}%</span>
                            </div>
                        )}
                    </div>

                    <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
                        <p style={{ color: '#d1d5db', fontSize: '0.55rem' }}>Generated by Mark Entry System</p>
                    </div>
                </div>
            </div>

            {/* Footer Actions */}
            <div className="p-6 border-t bg-gray-50 flex justify-end space-x-3">
                {actions}
                {onClose && (
                    <button onClick={onClose} className="px-4 py-2 text-gray-600 hover:bg-gray-200 rounded-lg transition-colors font-medium">Close</button>
                )}
                <button onClick={handleDownloadPDF} className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow-lg shadow-blue-500/30 transition-all font-medium flex items-center">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
                    Download PDF
                </button>
            </div>
        </div>
    );

    if (isModal) {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                {Content}
            </div>
        );
    }

    return Content;
};

export default ResultCard;

