import { Request, Response } from 'express';
import { StudentService } from '../services/StudentService';
import { Server } from 'socket.io';

export class StudentController {
    private io: Server;

    constructor(io: Server) {
        this.io = io;
    }

    register = async (req: Request, res: Response): Promise<void> => {
        try {
            const { sessionId, name } = req.body;
            const student = await StudentService.registerStudent(sessionId, name);
            this.io.emit('student:joined', student);
            res.status(200).json(student);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    };

    getAll = async (req: Request, res: Response): Promise<void> => {
        try {
            const students = await StudentService.getAllStudents();
            res.status(200).json(students);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    };

    kick = async (req: Request, res: Response): Promise<void> => {
        try {
            const { sessionId } = req.body;
            await StudentService.kickStudent(sessionId);
            this.io.to(`session_${sessionId}`).emit('student:kicked');
            this.io.emit('student:left', sessionId); // Update UI lists
            res.status(200).json({ message: 'Student kicked' });
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    };
}
