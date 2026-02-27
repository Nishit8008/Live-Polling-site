import mongoose, { Document, Schema } from 'mongoose';

export interface IStudent extends Document {
    sessionId: string;
    name: string;
    joinedAt: Date;
}

const StudentSchema = new Schema<IStudent>({
    sessionId: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    joinedAt: { type: Date, default: Date.now },
});

export const Student = mongoose.model<IStudent>('Student', StudentSchema);
