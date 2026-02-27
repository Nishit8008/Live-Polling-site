import { Router } from 'express';
import { PollController } from '../controllers/PollController';
import { StudentController } from '../controllers/StudentController';
import { Server } from 'socket.io';

export function setupRoutes(io: Server) {
    const router = Router();

    const pollController = new PollController(io);
    const studentController = new StudentController(io);

    // Poll Routes
    router.post('/poll', pollController.createPoll);
    router.get('/poll/active', pollController.getActivePoll);
    router.get('/poll/history', pollController.getHistory);

    // Student Routes
    router.post('/student', studentController.register);
    router.get('/student', studentController.getAll);
    router.post('/student/kick', studentController.kick);

    return router;
}
