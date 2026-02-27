import mongoose, { Document, Schema } from 'mongoose';

export interface IVote extends Document {
    pollId: mongoose.Types.ObjectId;
    optionId: string;
    studentSessionId: string;
    createdAt: Date;
}

const VoteSchema = new Schema<IVote>({
    pollId: { type: Schema.Types.ObjectId, ref: 'Poll', required: true },
    optionId: { type: String, required: true },
    studentSessionId: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
});

// Ensure a student can only vote once per poll
VoteSchema.index({ pollId: 1, studentSessionId: 1 }, { unique: true });

export const Vote = mongoose.model<IVote>('Vote', VoteSchema);
