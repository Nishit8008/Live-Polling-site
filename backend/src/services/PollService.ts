import { Poll, IPoll } from '../models/Poll';
import { Vote } from '../models/Vote';

export class PollService {
    /**
     * Creates a new poll. Closes any existing active poll.
     */
    static async createPoll(question: string, options: { id: string; text: string; isCorrect: boolean }[], duration: number): Promise<IPoll> {
        // Close any currently active poll
        await Poll.updateMany({ status: 'active' }, { status: 'closed' });

        const poll = new Poll({
            question,
            options: options.map(opt => ({ ...opt, voteCount: 0 })),
            duration,
            startTime: new Date(),
            status: 'active',
        });

        return await poll.save();
    }

    /**
     * Retrieves the currently active poll, if any.
     */
    static async getActivePoll(): Promise<IPoll | null> {
        const poll = await Poll.findOne({ status: 'active' });
        if (!poll) return null;

        // Check if it should be closed due to time expiration
        const now = new Date().getTime();
        const startTime = poll.startTime!.getTime();
        const elapsed = (now - startTime) / 1000;

        if (elapsed >= poll.duration) {
            poll.status = 'closed';
            await poll.save();
            return null; // Return null if just closed
        }

        return poll;
    }

    /**
     * Manually closes the active poll.
     */
    static async closeActivePoll(): Promise<IPoll | null> {
        const poll = await Poll.findOneAndUpdate(
            { status: 'active' },
            { status: 'closed' },
            { new: true }
        );
        return poll;
    }

    /**
     * Gets the complete poll history.
     */
    static async getHistory(): Promise<IPoll[]> {
        return await Poll.find({ status: 'closed' }).sort({ createdAt: -1 });
    }
}
