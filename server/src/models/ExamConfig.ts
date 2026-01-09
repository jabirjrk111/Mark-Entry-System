import mongoose, { Schema, Document } from 'mongoose';

export interface IExamConfig extends Document {
    config: Record<string, { maxMark: number; passMark: number }>;
}

const ExamConfigSchema: Schema = new Schema({
    config: {
        type: Map,
        of: new Schema({
            maxMark: { type: Number, required: true },
            passMark: { type: Number, required: true }
        }, { _id: false }),
        required: true
    }
}, { timestamps: true });

export default mongoose.model<IExamConfig>('ExamConfig', ExamConfigSchema);
