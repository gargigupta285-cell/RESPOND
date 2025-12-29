import { Router, Request, Response } from 'express';

const router = Router();

// Types for volunteer registration data
interface PersonalInfo {
    fullName?: string;
    email?: string;
    phone?: string;
    dateOfBirth?: string;
    city?: string;
    state?: string;
    pincode?: string;
    emergencyContactName?: string;
    emergencyContactPhone?: string;
}

interface SkillsData {
    selectedSkills?: string[];
    experience?: { [key: string]: number };
    licenseNumber?: string;
}

interface AvailabilityData {
    maxDistance?: number;
    selectedDays?: string[];
    selectedEmergencies?: string[];
    notifications?: {
        sms?: boolean;
        email?: boolean;
        push?: boolean;
        whatsapp?: boolean;
    };
}

interface VolunteerRegistration {
    id: string;
    personalInfo: PersonalInfo;
    skills: SkillsData;
    verification: Record<string, unknown>;
    availability: AvailabilityData;
    status: 'pending' | 'verified' | 'rejected';
    createdAt: string;
    updatedAt: string;
}

// In-memory storage for volunteer registrations
const volunteerRegistrations: VolunteerRegistration[] = [];

/**
 * POST /api/volunteer/register
 * Receives volunteer onboarding data (personal info, skills, availability)
 */
router.post('/volunteer/register', (req: Request, res: Response) => {
    try {
        const { personalInfo, skills, verification, availability } = req.body;

        // Basic validation
        const errors: string[] = [];

        // Validate personal info
        if (!personalInfo) {
            errors.push('Personal information is required');
        } else {
            if (!personalInfo.fullName || personalInfo.fullName.trim().length === 0) {
                errors.push('Full name is required');
            }
            if (!personalInfo.email || personalInfo.email.trim().length === 0) {
                errors.push('Email is required');
            } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(personalInfo.email)) {
                errors.push('Invalid email format');
            }
            if (!personalInfo.phone || personalInfo.phone.trim().length === 0) {
                errors.push('Phone number is required');
            }
        }

        // Validate skills (at least one skill should be selected)
        if (!skills || !skills.selectedSkills || skills.selectedSkills.length === 0) {
            errors.push('At least one skill must be selected');
        }

        // Validate availability
        if (!availability || !availability.selectedDays || availability.selectedDays.length === 0) {
            errors.push('Availability days must be selected');
        }

        if (errors.length > 0) {
            return res.status(400).json({
                success: false,
                error: errors.join(', ')
            });
        }

        // Check for duplicate email
        const existingVolunteer = volunteerRegistrations.find(
            v => v.personalInfo.email?.toLowerCase() === personalInfo.email?.toLowerCase()
        );

        if (existingVolunteer) {
            return res.status(409).json({
                success: false,
                error: 'A volunteer with this email is already registered'
            });
        }

        // Create the volunteer registration
        const newVolunteer: VolunteerRegistration = {
            id: `vol_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            personalInfo: {
                fullName: personalInfo.fullName?.trim(),
                email: personalInfo.email?.trim().toLowerCase(),
                phone: personalInfo.phone?.trim(),
                dateOfBirth: personalInfo.dateOfBirth,
                city: personalInfo.city?.trim(),
                state: personalInfo.state?.trim(),
                pincode: personalInfo.pincode?.trim(),
                emergencyContactName: personalInfo.emergencyContactName?.trim(),
                emergencyContactPhone: personalInfo.emergencyContactPhone?.trim()
            },
            skills: {
                selectedSkills: skills.selectedSkills || [],
                experience: skills.experience || {},
                licenseNumber: skills.licenseNumber?.trim()
            },
            verification: verification || {},
            availability: {
                maxDistance: availability.maxDistance || 10,
                selectedDays: availability.selectedDays || [],
                selectedEmergencies: availability.selectedEmergencies || [],
                notifications: availability.notifications || {
                    sms: true,
                    email: true,
                    push: true,
                    whatsapp: false
                }
            },
            status: 'pending',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        volunteerRegistrations.push(newVolunteer);

        console.log(`👤 New volunteer registration: ${newVolunteer.personalInfo.fullName}`);
        console.log(`   Email: ${newVolunteer.personalInfo.email}`);
        console.log(`   Skills: ${newVolunteer.skills.selectedSkills?.join(', ')}`);
        console.log(`   Total volunteers: ${volunteerRegistrations.length}`);

        return res.status(201).json({
            success: true,
            data: {
                id: newVolunteer.id,
                fullName: newVolunteer.personalInfo.fullName,
                email: newVolunteer.personalInfo.email,
                status: newVolunteer.status,
                createdAt: newVolunteer.createdAt
            },
            message: 'Volunteer registration submitted successfully. Your application is pending verification.'
        });
    } catch (error) {
        console.error('Error processing volunteer registration:', error);
        return res.status(500).json({
            success: false,
            error: 'Failed to process volunteer registration'
        });
    }
});

/**
 * GET /api/volunteer/registrations
 * Returns all volunteer registrations (for admin/testing purposes)
 */
router.get('/volunteer/registrations', (req: Request, res: Response) => {
    res.json({
        success: true,
        data: volunteerRegistrations,
        count: volunteerRegistrations.length
    });
});

/**
 * GET /api/volunteer/:id
 * Returns a specific volunteer registration by ID
 */
router.get('/volunteer/:id', (req: Request, res: Response) => {
    const { id } = req.params;
    const volunteer = volunteerRegistrations.find(v => v.id === id);

    if (!volunteer) {
        return res.status(404).json({
            success: false,
            error: 'Volunteer not found'
        });
    }

    return res.json({
        success: true,
        data: volunteer
    });
});

/**
 * GET /api/volunteers
 * Returns all volunteers from the database
 */
router.get('/volunteers', (req: Request, res: Response) => {
    try {
        // Import db inline to avoid circular dependency issues
        const db = require('../db/database').default;

        const volunteers = db.prepare(`
            SELECT id, full_name, email, phone, city, state, skills, 
                   status, rating, tasks_completed, hours_served, created_at
            FROM volunteers ORDER BY created_at DESC
        `).all() as Array<{
            id: string;
            full_name: string;
            email: string;
            phone: string;
            city: string | null;
            state: string | null;
            skills: string;
            status: string;
            rating: number;
            tasks_completed: number;
            hours_served: number;
            created_at: string;
        }>;

        const transformedVolunteers = volunteers.map(vol => ({
            id: vol.id,
            name: vol.full_name,
            email: vol.email,
            phone: vol.phone,
            city: vol.city,
            state: vol.state,
            skills: JSON.parse(vol.skills || '[]'),
            verified: vol.status === 'verified',
            status: vol.status,
            rating: vol.rating || 0,
            tasksCompleted: vol.tasks_completed || 0,
            hoursServed: vol.hours_served || 0
        }));

        res.json({
            success: true,
            data: transformedVolunteers,
            count: transformedVolunteers.length
        });
    } catch (error) {
        console.error('Error fetching volunteers:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch volunteers'
        });
    }
});

/**
 * GET /api/volunteers/:id/stats
 * Returns { tasksCompleted, hoursServed, rating } for a volunteer
 */
router.get('/volunteers/:id/stats', (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const db = require('../db/database').default;

        const volunteer = db.prepare(`
            SELECT tasks_completed, hours_served, rating FROM volunteers WHERE id = ?
        `).get(id) as {
            tasks_completed: number;
            hours_served: number;
            rating: number;
        } | undefined;

        if (!volunteer) {
            return res.status(404).json({
                success: false,
                error: 'Volunteer not found'
            });
        }

        return res.json({
            success: true,
            data: {
                tasksCompleted: volunteer.tasks_completed || 0,
                hoursServed: volunteer.hours_served || 0,
                rating: volunteer.rating || 0
            }
        });
    } catch (error) {
        console.error('Error fetching volunteer stats:', error);
        return res.status(500).json({
            success: false,
            error: 'Failed to fetch volunteer stats'
        });
    }
});

/**
 * GET /api/volunteers/:id/tasks
 * Returns assignments for a volunteer with request titles and times
 */
router.get('/volunteers/:id/tasks', (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const db = require('../db/database').default;

        // Check volunteer exists
        const volunteer = db.prepare('SELECT id FROM volunteers WHERE id = ?').get(id);
        if (!volunteer) {
            return res.status(404).json({
                success: false,
                error: 'Volunteer not found'
            });
        }

        // Get assignments with request details
        const tasks = db.prepare(`
            SELECT 
                a.id as assignment_id,
                a.status as assignment_status,
                a.assigned_at,
                a.accepted_at,
                a.completed_at,
                r.id as request_id,
                r.title as request_title,
                r.location,
                r.urgency,
                r.posted_time
            FROM assignments a
            INNER JOIN requests r ON a.request_id = r.id
            WHERE a.volunteer_id = ?
            ORDER BY a.assigned_at DESC
        `).all(id) as Array<{
            assignment_id: string;
            assignment_status: string;
            assigned_at: string;
            accepted_at: string | null;
            completed_at: string | null;
            request_id: string;
            request_title: string;
            location: string;
            urgency: string;
            posted_time: string | null;
        }>;

        const transformedTasks = tasks.map(task => ({
            id: task.assignment_id,
            status: task.assignment_status,
            assignedAt: task.assigned_at,
            acceptedAt: task.accepted_at,
            completedAt: task.completed_at,
            request: {
                id: task.request_id,
                title: task.request_title,
                location: task.location,
                urgency: task.urgency,
                postedTime: task.posted_time
            }
        }));

        return res.json({
            success: true,
            data: transformedTasks,
            count: transformedTasks.length
        });
    } catch (error) {
        console.error('Error fetching volunteer tasks:', error);
        return res.status(500).json({
            success: false,
            error: 'Failed to fetch volunteer tasks'
        });
    }
});

export default router;
