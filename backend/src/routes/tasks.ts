import { Router, Request, Response } from 'express';
import db from '../db/database';

const router = Router();

/**
 * PUT /api/tasks/:id/accept
 * Sets assignment.status = "accepted"
 */
router.put('/tasks/:id/accept', (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        // Check assignment exists
        const assignment = db.prepare('SELECT * FROM assignments WHERE id = ?').get(id) as {
            id: string;
            request_id: string;
            volunteer_id: string;
            status: string;
        } | undefined;

        if (!assignment) {
            return res.status(404).json({
                success: false,
                error: 'Task/Assignment not found'
            });
        }

        // Update status to accepted
        const now = new Date().toISOString();
        db.prepare(`
            UPDATE assignments SET status = 'accepted', accepted_at = ? WHERE id = ?
        `).run(now, id);

        console.log(`✅ Task ${id} accepted`);

        return res.json({
            success: true,
            data: {
                id,
                status: 'accepted',
                acceptedAt: now
            },
            message: 'Task accepted successfully'
        });
    } catch (error) {
        console.error('Error accepting task:', error);
        return res.status(500).json({
            success: false,
            error: 'Failed to accept task'
        });
    }
});

export default router;
