import { Router, Request, Response } from 'express';
import db, { generateId } from '../db/database';

const router = Router();

// Types
interface DbRequest {
    id: string;
    title: string;
    description: string | null;
    location: string;
    latitude: number | null;
    longitude: number | null;
    skills: string;
    urgency: string;
    status: string;
    volunteers_needed: number;
    organization_id: string | null;
    organization_name: string | null;
    posted_time: string | null;
    created_at: string;
    updated_at: string;
}

interface DbVolunteer {
    id: string;
    full_name: string;
    email: string;
    skills: string;
    status: string;
    rating: number;
    tasks_completed: number;
}

interface DbAssignment {
    id: string;
    request_id: string;
    volunteer_id: string;
    status: string;
}

/**
 * GET /api/requests
 * Returns all requests from the database
 */
router.get('/requests', (req: Request, res: Response) => {
    try {
        const requests = db.prepare(`
            SELECT * FROM requests ORDER BY created_at DESC
        `).all() as DbRequest[];

        // Transform to match frontend shape
        const transformedRequests = requests.map(request => {
            const skills = JSON.parse(request.skills || '[]');

            // Get assignment counts for this request
            const assignments = db.prepare(`
                SELECT status FROM assignments WHERE request_id = ?
            `).all(request.id) as { status: string }[];

            const confirmed = assignments.filter(a => a.status === 'accepted' || a.status === 'completed').length;
            const matched = assignments.length;

            // Get matched volunteers
            const matchedVolunteers = db.prepare(`
                SELECT v.full_name, v.status, v.rating, v.skills
                FROM volunteers v
                INNER JOIN assignments a ON v.id = a.volunteer_id
                WHERE a.request_id = ?
            `).all(request.id) as DbVolunteer[];

            const matches = matchedVolunteers.map(vol => {
                const volSkills = JSON.parse(vol.skills || '[]');
                return {
                    name: vol.full_name,
                    verified: vol.status === 'verified',
                    rating: vol.rating || 0,
                    specialty: volSkills[0] || 'Volunteer'
                };
            });

            return {
                id: request.id,
                title: request.title,
                description: request.description,
                location: request.location,
                skills,
                urgency: request.urgency,
                status: request.status,
                volunteers: {
                    needed: request.volunteers_needed,
                    matched,
                    confirmed
                },
                postedTime: request.posted_time || 'Just now',
                organizationName: request.organization_name,
                matches
            };
        });

        res.json({
            success: true,
            data: transformedRequests,
            count: transformedRequests.length
        });
    } catch (error) {
        console.error('Error fetching requests:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch requests'
        });
    }
});

/**
 * POST /api/requests
 * Creates a new request
 */
router.post('/requests', (req: Request, res: Response) => {
    try {
        const { title, description, location, skills, urgency, volunteersNeeded, organizationName } = req.body;

        // Validation
        const errors: string[] = [];
        if (!title || title.trim().length === 0) errors.push('Title is required');
        if (!location || location.trim().length === 0) errors.push('Location is required');
        if (!skills || !Array.isArray(skills) || skills.length === 0) errors.push('At least one skill is required');

        if (errors.length > 0) {
            return res.status(400).json({
                success: false,
                error: errors.join(', ')
            });
        }

        const id = generateId('req');
        const now = new Date().toISOString();

        const stmt = db.prepare(`
            INSERT INTO requests (
                id, title, description, location, skills, urgency, 
                status, volunteers_needed, organization_name, posted_time, created_at, updated_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `);

        stmt.run(
            id,
            title.trim(),
            description?.trim() || null,
            location.trim(),
            JSON.stringify(skills),
            urgency || 'medium',
            'active',
            volunteersNeeded || 1,
            organizationName?.trim() || null,
            'Just now',
            now,
            now
        );

        console.log(`📋 New request created: ${title}`);

        return res.status(201).json({
            success: true,
            data: {
                id,
                title: title.trim(),
                location: location.trim(),
                skills,
                urgency: urgency || 'medium',
                status: 'active',
                volunteers: { needed: volunteersNeeded || 1, matched: 0, confirmed: 0 },
                postedTime: 'Just now',
                matches: []
            },
            message: 'Request created successfully'
        });
    } catch (error) {
        console.error('Error creating request:', error);
        return res.status(500).json({
            success: false,
            error: 'Failed to create request'
        });
    }
});

/**
 * GET /api/requests/:id/matches
 * Returns volunteers whose skills overlap with the request skills
 */
router.get('/requests/:id/matches', (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        // Get the request
        const request = db.prepare('SELECT * FROM requests WHERE id = ?').get(id) as DbRequest | undefined;

        if (!request) {
            return res.status(404).json({
                success: false,
                error: 'Request not found'
            });
        }

        const requestSkills = JSON.parse(request.skills || '[]') as string[];

        // Get all verified volunteers
        const volunteers = db.prepare(`
            SELECT id, full_name, email, skills, status, rating, tasks_completed
            FROM volunteers WHERE status = 'verified'
        `).all() as DbVolunteer[];

        // Filter by skill overlap
        const matchingVolunteers = volunteers.filter(vol => {
            const volSkills = JSON.parse(vol.skills || '[]') as string[];
            return requestSkills.some(skill =>
                volSkills.some(vs => vs.toLowerCase().includes(skill.toLowerCase()) ||
                    skill.toLowerCase().includes(vs.toLowerCase()))
            );
        }).map(vol => {
            const volSkills = JSON.parse(vol.skills || '[]') as string[];
            return {
                id: vol.id,
                name: vol.full_name,
                verified: vol.status === 'verified',
                rating: vol.rating || 0,
                specialty: volSkills[0] || 'Volunteer',
                skills: volSkills,
                tasksCompleted: vol.tasks_completed || 0
            };
        });

        return res.json({
            success: true,
            data: matchingVolunteers,
            count: matchingVolunteers.length
        });
    } catch (error) {
        console.error('Error fetching matches:', error);
        return res.status(500).json({
            success: false,
            error: 'Failed to fetch matching volunteers'
        });
    }
});

/**
 * POST /api/requests/:id/assign
 * Creates assignments linking volunteers to a request
 */
router.post('/requests/:id/assign', (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { volunteerIds } = req.body;

        // Validate
        if (!volunteerIds || !Array.isArray(volunteerIds) || volunteerIds.length === 0) {
            return res.status(400).json({
                success: false,
                error: 'volunteerIds array is required'
            });
        }

        // Check request exists
        const request = db.prepare('SELECT id FROM requests WHERE id = ?').get(id);
        if (!request) {
            return res.status(404).json({
                success: false,
                error: 'Request not found'
            });
        }

        const insertStmt = db.prepare(`
            INSERT OR IGNORE INTO assignments (id, request_id, volunteer_id, status, assigned_at)
            VALUES (?, ?, ?, ?, ?)
        `);

        const now = new Date().toISOString();
        const createdAssignments: string[] = [];

        for (const volunteerId of volunteerIds) {
            // Check volunteer exists
            const volunteer = db.prepare('SELECT id FROM volunteers WHERE id = ?').get(volunteerId);
            if (volunteer) {
                const assignmentId = generateId('asgn');
                insertStmt.run(assignmentId, id, volunteerId, 'pending', now);
                createdAssignments.push(assignmentId);
            }
        }

        console.log(`✅ Assigned ${createdAssignments.length} volunteers to request ${id}`);

        return res.status(201).json({
            success: true,
            data: {
                requestId: id,
                assignmentsCreated: createdAssignments.length
            },
            message: `${createdAssignments.length} volunteers assigned successfully`
        });
    } catch (error) {
        console.error('Error assigning volunteers:', error);
        return res.status(500).json({
            success: false,
            error: 'Failed to assign volunteers'
        });
    }
});

export default router;
