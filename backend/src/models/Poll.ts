import mongoose, { Document, Schema } from 'mongoose';

export interface IOption {
  id: string;
  text: string;
  isCorrect: boolean;
  voteCount: number;
}

export interface IPoll extends Document {
  question: string;
  options: IOption[];
  duration: number;
  startTime: Date | null;
  status: 'waiting' | 'active' | 'closed';
  createdAt: Date;
}

const OptionSchema = new Schema<IOption>({
  id: { type: String, required: true },
  text: { type: String, required: true },
  isCorrect: { type: Boolean, default: false },
  voteCount: { type: Number, default: 0 },
});

const PollSchema = new Schema<IPoll>({
  question: { type: String, required: true },
  options: { type: [OptionSchema], required: true },
  duration: { type: Number, required: true },
  startTime: { type: Date, default: null },
  status: { type: String, enum: ['waiting', 'active', 'closed'], default: 'waiting' },
  createdAt: { type: Date, default: Date.now },
});

export const Poll = mongoose.model<IPoll>('Poll', PollSchema);
