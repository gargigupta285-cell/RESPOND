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

export default function handler(req, res) {
  const url = req.url;
  const path = url.split('?')[0];

  if (req.method === 'POST' && path === '/register') {
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
  } else if (req.method === 'GET' && path === '/registrations') {
    res.status(200).json({
      success: true,
      data: volunteerRegistrations,
      count: volunteerRegistrations.length
    });
  } else if (req.method === 'GET' && path.startsWith('/') && path.split('/').length === 2) {
    const id = path.split('/')[1];
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
  } else if (req.method === 'GET' && path === '/volunteers') {
    return res.status(500).json({
      success: false,
      error: 'Database not available in serverless environment'
    });
  } else if (req.method === 'GET' && path.match(/^\/volunteers\/[^\/]+\/stats$/)) {
    return res.status(500).json({
      success: false,
      error: 'Database not available in serverless environment'
    });
  } else if (req.method === 'GET' && path.match(/^\/volunteers\/[^\/]+\/tasks$/)) {
    return res.status(500).json({
      success: false,
      error: 'Database not available in serverless environment'
    });
  } else {
    res.status(404).json({ error: 'Not found' });
  }
}