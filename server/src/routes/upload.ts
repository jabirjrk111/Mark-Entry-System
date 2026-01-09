import express from 'express';
import multer from 'multer';
import xlsx from 'xlsx';
import Student from '../models/Student';

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post('/', upload.single('file'), async (req, res): Promise<void> => {
    try {
        if (!req.file) {
            res.status(400).json({ message: 'No file uploaded' });
            return;
        }

        const workbook = xlsx.read(req.file.buffer, { type: 'buffer' });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const data = xlsx.utils.sheet_to_json(sheet);

        // Clear existing data (optional, based on requirement. For now, we append/upsert usually, but let's clear for simplicity or just add)
        // await Student.deleteMany({}); // Uncomment to clear DB on upload

        const studentsToSave: any[] = [];

        for (const row of data as any[]) {
            const name = row['Name'] || row['name'];
            const place = row['Place'] || row['place'];
            const stream = row['Stream'] || row['stream'];
            let dob = row['DOB'] || row['dob'] || row['Date of Birth'];

            // Handle Excel Serial Dates (e.g., 39797 -> 15-12-2008)
            if (typeof dob === 'number') {
                const date = new Date(Math.round((dob - 25569) * 86400 * 1000));
                const day = String(date.getDate()).padStart(2, '0');
                const month = String(date.getMonth() + 1).padStart(2, '0');
                const year = date.getFullYear();
                dob = `${day}-${month}-${year}`;
            }

            if (!name || !place) continue;

            const marks: Record<string, number> = {};
            let total = 0;

            // Iterate over keys to find subjects
            Object.keys(row).forEach(key => {
                const lowerKey = key.toLowerCase().trim();
                const invalidKeys = ['name', 'place', 'stream', 'total', 'dob', 'date of birth', 'bob']; // Added 'bob' just in case
                if (!invalidKeys.includes(lowerKey)) {
                    const val = Number(row[key]);
                    if (!isNaN(val)) {
                        marks[key] = val;
                        total += val;
                    }
                }
            });

            // If total is provided in excel, use it, else use calculated
            if (row['Total'] || row['total']) {
                total = Number(row['Total'] || row['total']);
            }

            studentsToSave.push({ name, place, stream, dob, marks, total });
        }

        if (studentsToSave.length > 0) {
            await Student.insertMany(studentsToSave);
        }

        res.status(200).json({ message: 'File processed successfully', count: studentsToSave.length });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error during upload' });
    }
});

export default router;
