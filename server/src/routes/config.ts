import express from 'express';
import ExamConfig from '../models/ExamConfig';

const router = express.Router();

// Get Configuration
router.get('/', async (req, res) => {
    try {
        // We assume there is only one global config for simplicity
        const configDoc = await ExamConfig.findOne().sort({ createdAt: -1 });
        if (configDoc) {
            res.json(configDoc.config);
        } else {
            res.json(null);
        }
    } catch (error) {
        console.error("Error fetching config:", error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Save/Update Configuration
router.post('/', async (req, res) => {
    try {
        const newConfig = req.body;

        // Option 1: Always update the single document
        // Option 2: Create new document (history). Let's do Option 1 for simplicity of this app.

        // Delete existing and create new to keep it simple, or updateOne with upsert
        await ExamConfig.deleteMany({});

        const configEntry = new ExamConfig({ config: newConfig });
        await configEntry.save();

        res.json({ message: 'Configuration saved', config: configEntry.config });
    } catch (error) {
        console.error("Error saving config:", error);
        res.status(500).json({ message: 'Server error' });
    }
});

export default router;
