import { Student, IStudent } from '../models/Student';

export class StudentService {
    static async registerStudent(sessionId: string, name: string): Promise<IStudent> {
        return await Student.findOneAndUpdate(
            { sessionId },
            { name, joinedAt: new Date() },
            { upsert: true, new: true }
        );
    }

    static async getStudentCount(): Promise<number> {
        return await Student.countDocuments();
    }

    static async kickStudent(sessionId: string): Promise<void> {
        await Student.deleteOne({ sessionId });
    }

    static async getAllStudents(): Promise<IStudent[]> {
        return await Student.find().sort({ joinedAt: 1 });
    }
}
