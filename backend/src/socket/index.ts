import { Server, Socket } from 'socket.io';
import { VoteService } from '../services/VoteService';
import { PollService } from '../services/PollService';
import { StudentService } from '../services/StudentService';

export function setupSocketHandlers(io: Server) {
    io.on('connection', (socket: Socket) => {
        console.log('New client connected:', socket.id);

        // Join a room based on session ID for targeted events (like kick)
        socket.on('registerSession', (sessionId: string) => {
            socket.join(`session_${sessionId}`);
        });

        socket.on('vote', async (data: { pollId: string; optionId: string; studentSessionId: string }) => {
            try {
                await VoteService.castVote(data.pollId, data.optionId, data.studentSessionId);

                // Fetch updated poll
                const updatedPoll = await PollService.getActivePoll();
                if (updatedPoll) {
                    io.emit('poll:updated', updatedPoll);

                    // Check if all students have voted
                    const totalStudents = await StudentService.getStudentCount();
                    const totalVotes = await VoteService.getVotesForPoll(data.pollId);

                    if (totalVotes >= totalStudents && totalStudents > 0) {
                        // Close the poll
                        const closedPoll = await PollService.closeActivePoll();
                        io.emit('poll:closed', closedPoll);
                    }
                }
            } catch (error: any) {
                socket.emit('vote:error', { message: error.message });
            }
        });

        socket.on('chat:message', (data: { sender: string; text: string; role: 'student' | 'teacher' }) => {
            io.emit('chat:message', data);
        });

        socket.on('disconnect', () => {
            console.log('Client disconnected:', socket.id);
        });
    });
}
