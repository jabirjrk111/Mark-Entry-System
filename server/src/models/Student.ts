import mongoose, { Schema, Document } from 'mongoose';

export interface IStudent extends Document {
    name: string;
    place: string;
    stream?: string;
    dob?: string;
    marks: Record<string, number>; // e.g., { "Math": 90, "Science": 85 }
    total: number;
}

const StudentSchema: Schema = new Schema({
    name: { type: String, required: true },
    place: { type: String, required: true },
    stream: { type: String, required: false },
    dob: { type: String, required: false },
    marks: { type: Map, of: Number, required: true },
    total: { type: Number, required: false }
}, { timestamps: true });

export default mongoose.model<IStudent>('Student', StudentSchema);
