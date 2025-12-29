// In-memory storage for contact submissions
interface ContactEntry {
    id: string;
    name: string;
    email: string;
    message: string;
    createdAt: string;
}

const contactSubmissions: ContactEntry[] = [];

export default function handler(req: any, res: any) {
  if (req.method === 'POST') {
    try {
        const { name, email, message } = req.body;

        // Validation
        const errors: string[] = [];

        if (!name || typeof name !== 'string' || name.trim().length === 0) {
            errors.push('Name is required');
        }

        if (!email || typeof email !== 'string' || email.trim().length === 0) {
            errors.push('Email is required');
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            errors.push('Invalid email format');
        }

        if (!message || typeof message !== 'string' || message.trim().length === 0) {
            errors.push('Message is required');
        }

        if (errors.length > 0) {
            return res.status(400).json({
                success: false,
                error: errors.join(', ')
            });
        }

        // Create and store the contact entry
        const newEntry: ContactEntry = {
            id: `contact_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            name: name.trim(),
            email: email.trim().toLowerCase(),
            message: message.trim(),
            createdAt: new Date().toISOString()
        };

        contactSubmissions.push(newEntry);

        console.log(`📧 New contact submission from: ${newEntry.email}`);
        console.log(`   Total submissions: ${contactSubmissions.length}`);

        return res.status(201).json({
            success: true,
            data: newEntry
        });
    } catch (error) {
        console.error('Error processing contact submission:', error);
        return res.status(500).json({
            success: false,
            error: 'Failed to process contact submission'
        });
    }
  } else if (req.method === 'GET') {
    res.json({
      success: true,
      data: contactSubmissions,
      count: contactSubmissions.length
    });
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}