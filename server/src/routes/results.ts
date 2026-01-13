import express from 'express';
import Student from '../models/Student';

const router = express.Router();

// Get results (Admin gets all, Student gets own)
router.get('/', async (req: any, res) => {
    try {
        if (req.user?.role === 'admin') {
            const students = await Student.find();
            res.json(students);
        } else if (req.user?.role === 'student' && req.user?.id) {
            const student = await Student.findById(req.user.id);
            res.json(student ? [student] : []);
        } else {
            res.status(403).json({ message: 'Access denied' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error fetching results' });
    }
});

// Get single student
router.get('/:id', async (req, res) => {
    try {
        const student = await Student.findById(req.params.id);
        if (!student) {
            res.status(404).json({ message: 'Student not found' });
            return;
        }
        res.json(student);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching student result' });
    }
});

// Delete all students
router.delete('/', async (req, res) => {
    try {
        await Student.deleteMany({});
        res.json({ message: 'All students deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting students' });
    }
});

// Delete single student
router.delete('/:id', async (req, res) => {
    try {
        const result = await Student.findByIdAndDelete(req.params.id);
        if (!result) {
            res.status(404).json({ message: 'Student not found' });
            return;
        }
        res.json({ message: 'Student deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting student' });
    }
});

// Create new student
router.post('/', async (req, res) => {
    try {
        const newStudent = new Student(req.body);
        const savedStudent = await newStudent.save();
        res.status(201).json(savedStudent);
    } catch (error) {
        console.error("Error creating student:", error);
        res.status(500).json({ message: 'Error creating student' });
    }
});

// Update student
router.put('/:id', async (req, res) => {
    try {
        const updatedStudent = await Student.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        if (!updatedStudent) {
            res.status(404).json({ message: 'Student not found' });
            return;
        }
        res.json(updatedStudent);
    } catch (error) {
        console.error("Error updating student:", error);
        res.status(500).json({ message: 'Error updating student' });
    }
});

export default router;
