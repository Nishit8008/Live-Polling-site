import mongoose from 'mongoose';
import { Vote } from '../models/Vote';
import { Poll } from '../models/Poll';

export class VoteService {
    /**
     * Registers a vote ensuring no duplicate voting.
     */
    static async castVote(pollId: string, optionId: string, studentSessionId: string): Promise<boolean> {
        const session = await mongoose.startSession();
        session.startTransaction();

        try {
            const poll = await Poll.findOne({ _id: pollId, status: 'active' }).session(session);
            if (!poll) {
                throw new Error('Poll is not active or does not exist');
            }

            // MongoDB index will throw E11000 duplicate key error if vote exists,
            // but we explicitly check just in case or for better error messages.
            const existingVote = await Vote.findOne({ pollId, studentSessionId }).session(session);
            if (existingVote) {
                throw new Error('You have already voted on this poll');
            }

            const vote = new Vote({
                pollId,
                optionId,
                studentSessionId,
            });

            await vote.save({ session });

            // Update the poll's vote count for the specific option
            await Poll.updateOne(
                { _id: pollId, 'options.id': optionId },
                { $inc: { 'options.$.voteCount': 1 } },
                { session }
            );

            await session.commitTransaction();
            return true;
        } catch (error) {
            await session.abortTransaction();
            throw error;
        } finally {
            session.endSession();
        }
    }

    /**
     * Gets total vote count for a poll
     */
    static async getVotesForPoll(pollId: string) {
        return await Vote.countDocuments({ pollId });
    }
}
