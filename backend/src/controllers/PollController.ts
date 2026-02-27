import { Request, Response } from 'express';
import { PollService } from '../services/PollService';
import { Server } from 'socket.io';

export class PollController {
    private io: Server;

    constructor(io: Server) {
        this.io = io;
    }

    createPoll = async (req: Request, res: Response): Promise<void> => {
        try {
            const { question, options, duration } = req.body;
            const poll = await PollService.createPoll(question, options, duration);
            this.io.emit('poll:started', poll);
            res.status(201).json(poll);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    };

    getActivePoll = async (req: Request, res: Response): Promise<void> => {
        try {
            const poll = await PollService.getActivePoll();
            if (poll) {
                res.status(200).json(poll);
            } else {
                res.status(404).json({ message: 'No active poll' });
            }
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    };

    getHistory = async (req: Request, res: Response): Promise<void> => {
        try {
            const history = await PollService.getHistory();
            res.status(200).json(history);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    };
}
