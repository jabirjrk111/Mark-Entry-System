import express from 'express';
import jwt from 'jsonwebtoken';
import Student from '../models/Student';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'secret_key_change_me';

const ADMIN_CREDENTIALS = {
    username: 'admin',
    password: 'admin123'
};

router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    // 1. Check Admin
    if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
        const token = jwt.sign({ name: 'Admin', role: 'admin' }, JWT_SECRET);
        return res.json({ token, role: 'admin', name: 'Admin' });
    }

    // 2. Check Student
    try {
        const student = await Student.findOne({ name: { $regex: new RegExp(`^${username}$`, 'i') } });

        if (!student) {
            return res.status(400).json({ error: 'User not found' });
        }

        // 3. Verify DOB as password
        // Expected password format: ddmmyyyy (e.g., 15052005)
        // Stored DOB format might be: "15-05-2005", "15/05/2005", or "15052005"
        // We strip all non-numeric chars from stored DOB to compare.

        const cleanStoredDob = student.dob ? student.dob.replace(/[^0-9]/g, '') : '';
        const cleanInputPassword = password.replace(/[^0-9]/g, '');

        if (!cleanStoredDob || cleanStoredDob !== cleanInputPassword) {
            return res.status(400).json({ error: 'Invalid password (DOB)' });
        }

        const token = jwt.sign({ id: student._id, name: student.name, role: 'student' }, JWT_SECRET);
        return res.json({ token, role: 'student', name: student.name, id: student._id });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Server error during login' });
    }
});

export default router;
