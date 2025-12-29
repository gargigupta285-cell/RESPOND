import db, { generateId, initializeDatabase } from './database';

/**
 * Seed the database with sample data for demo/testing
 */
function seed(): void {
    console.log('🌱 Seeding database...');

    // Initialize schema first
    initializeDatabase();

    // Clear existing data
    db.exec('DELETE FROM assignments');
    db.exec('DELETE FROM requests');
    db.exec('DELETE FROM volunteers');
    console.log('   Cleared existing data');

    // Insert sample volunteers
    const volunteers = [
        {
            // Demo volunteer with static ID for VolunteerDashboard
            id: 'demo-vol-1',
            full_name: 'Amit Kumar',
            email: 'amit@example.com',
            phone: '+91 98765 12345',
            city: 'Delhi',
            state: 'Delhi NCR',
            pincode: '110001',
            skills: JSON.stringify(['Medical', 'First Aid', 'Emergency Care']),
            experience: JSON.stringify({ 'Medical': 5, 'First Aid': 3 }),
            status: 'verified',
            rating: 4.8,
            tasks_completed: 12,
            hours_served: 72,
            selected_days: JSON.stringify(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']),
            max_distance: 15,
        },
        {
            id: generateId('vol'),
            full_name: 'Dr. Sharma',
            email: 'sharma@example.com',
            phone: '+91 98765 43210',
            city: 'Mumbai',
            state: 'Maharashtra',
            pincode: '400001',
            skills: JSON.stringify(['Medical', 'First Aid', 'Emergency Care']),
            experience: JSON.stringify({ 'Medical': 10, 'First Aid': 8 }),
            status: 'verified',
            rating: 4.9,
            tasks_completed: 24,
            hours_served: 156,
            selected_days: JSON.stringify(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']),
            max_distance: 15,
        },
        {
            id: generateId('vol'),
            full_name: 'Dr. Patel',
            email: 'patel@example.com',
            phone: '+91 98765 43211',
            city: 'Mumbai',
            state: 'Maharashtra',
            pincode: '400002',
            skills: JSON.stringify(['Medical', 'Pediatrics']),
            experience: JSON.stringify({ 'Medical': 5 }),
            status: 'verified',
            rating: 4.8,
            tasks_completed: 18,
            hours_served: 120,
            selected_days: JSON.stringify(['Monday', 'Wednesday', 'Friday']),
            max_distance: 10,
        },
        {
            id: generateId('vol'),
            full_name: 'Nurse Reddy',
            email: 'reddy@example.com',
            phone: '+91 98765 43212',
            city: 'Kochi',
            state: 'Kerala',
            pincode: '682001',
            skills: JSON.stringify(['Nursing', 'Emergency Care', 'First Aid']),
            experience: JSON.stringify({ 'Nursing': 7 }),
            status: 'verified',
            rating: 5.0,
            tasks_completed: 32,
            hours_served: 200,
            selected_days: JSON.stringify(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']),
            max_distance: 20,
        },
        {
            id: generateId('vol'),
            full_name: 'Raj Kumar',
            email: 'raj@example.com',
            phone: '+91 98765 43213',
            city: 'Delhi',
            state: 'Delhi NCR',
            pincode: '110001',
            skills: JSON.stringify(['Driving', 'Logistics', 'Heavy Vehicle']),
            experience: JSON.stringify({ 'Driving': 12, 'Logistics': 8 }),
            status: 'verified',
            rating: 4.7,
            tasks_completed: 45,
            hours_served: 280,
            selected_days: JSON.stringify(['Saturday', 'Sunday']),
            max_distance: 50,
        },
        {
            id: generateId('vol'),
            full_name: 'Priya Menon',
            email: 'priya@example.com',
            phone: '+91 98765 43214',
            city: 'Delhi',
            state: 'Delhi NCR',
            pincode: '110002',
            skills: JSON.stringify(['Cooking', 'Food Safety', 'Nutrition']),
            experience: JSON.stringify({ 'Cooking': 15, 'Food Safety': 10 }),
            status: 'verified',
            rating: 5.0,
            tasks_completed: 28,
            hours_served: 180,
            selected_days: JSON.stringify(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']),
            max_distance: 10,
        },
    ];

    const insertVolunteer = db.prepare(`
        INSERT INTO volunteers (
            id, full_name, email, phone, city, state, pincode,
            skills, experience, status, rating, tasks_completed, hours_served,
            selected_days, max_distance
        ) VALUES (
            @id, @full_name, @email, @phone, @city, @state, @pincode,
            @skills, @experience, @status, @rating, @tasks_completed, @hours_served,
            @selected_days, @max_distance
        )
    `);

    for (const volunteer of volunteers) {
        insertVolunteer.run(volunteer);
    }
    console.log(`   Inserted ${volunteers.length} volunteers`);

    // Insert sample requests
    const requests = [
        {
            id: generateId('req'),
            title: 'Medical Camp Setup',
            description: 'Setting up a medical camp for flood-affected areas. Need doctors, nurses, and setup volunteers.',
            location: 'Mumbai Central',
            latitude: 18.9690,
            longitude: 72.8193,
            skills: JSON.stringify(['Medical', 'Setup']),
            urgency: 'high',
            status: 'active',
            volunteers_needed: 10,
            organization_name: 'Kerala State Disaster Management',
            posted_time: '3 hours ago',
        },
        {
            id: generateId('req'),
            title: 'Flood Relief Distribution',
            description: 'Distribution of relief materials to flood-affected families. Need drivers and logistics support.',
            location: 'Kerala, Kochi',
            latitude: 9.9312,
            longitude: 76.2673,
            skills: JSON.stringify(['Logistics', 'Driving']),
            urgency: 'high',
            status: 'active',
            volunteers_needed: 15,
            organization_name: 'Red Cross India',
            posted_time: '1 hour ago',
        },
        {
            id: generateId('req'),
            title: 'Community Kitchen Support',
            description: 'Running community kitchen for displaced families. Need cooks and food safety experts.',
            location: 'Delhi NCR',
            latitude: 28.6139,
            longitude: 77.2090,
            skills: JSON.stringify(['Cooking', 'Food Safety']),
            urgency: 'medium',
            status: 'active',
            volunteers_needed: 8,
            organization_name: 'Goonj NGO',
            posted_time: '5 hours ago',
        },
        {
            id: generateId('req'),
            title: 'Blood Donation Drive',
            description: 'Organizing blood donation drive for local hospitals.',
            location: 'Bangalore',
            latitude: 12.9716,
            longitude: 77.5946,
            skills: JSON.stringify(['Medical', 'First Aid']),
            urgency: 'low',
            status: 'scheduled',
            volunteers_needed: 20,
            organization_name: 'City Hospital',
            posted_time: '1 day ago',
        },
    ];

    const insertRequest = db.prepare(`
        INSERT INTO requests (
            id, title, description, location, latitude, longitude,
            skills, urgency, status, volunteers_needed, organization_name, posted_time
        ) VALUES (
            @id, @title, @description, @location, @latitude, @longitude,
            @skills, @urgency, @status, @volunteers_needed, @organization_name, @posted_time
        )
    `);

    for (const request of requests) {
        insertRequest.run(request);
    }
    console.log(`   Inserted ${requests.length} requests`);

    // Create some sample assignments
    const allVolunteers = db.prepare('SELECT id FROM volunteers').all() as { id: string }[];
    const allRequests = db.prepare('SELECT id FROM requests WHERE status = ?').all('active') as { id: string }[];

    const insertAssignment = db.prepare(`
        INSERT INTO assignments (id, request_id, volunteer_id, status)
        VALUES (@id, @request_id, @volunteer_id, @status)
    `);

    let assignmentCount = 0;
    // Assign first 3 volunteers to first request
    if (allRequests.length > 0 && allVolunteers.length >= 3) {
        for (let i = 0; i < 3; i++) {
            insertAssignment.run({
                id: generateId('asgn'),
                request_id: allRequests[0].id,
                volunteer_id: allVolunteers[i].id,
                status: i === 0 ? 'accepted' : 'pending',
            });
            assignmentCount++;
        }
    }

    // Assign 2 volunteers to second request
    if (allRequests.length > 1 && allVolunteers.length >= 5) {
        for (let i = 3; i < 5; i++) {
            insertAssignment.run({
                id: generateId('asgn'),
                request_id: allRequests[1].id,
                volunteer_id: allVolunteers[i].id,
                status: 'pending',
            });
            assignmentCount++;
        }
    }

    console.log(`   Created ${assignmentCount} assignments`);
    console.log('✅ Database seeded successfully!');
}

// Run seed
seed();
