import express from 'express';
import cors from 'cors';
import healthRouter from './routes/health';
import contactRouter from './routes/contact';
import volunteerRouter from './routes/volunteer';
import requestsRouter from './routes/requests';
import tasksRouter from './routes/tasks';
import { initializeDatabase } from './db/database';

// Initialize database schema on startup
initializeDatabase();

const app = express();
const PORT = process.env.PORT || 4000;

// CORS configuration - allow Vite dev server and production domains
const corsOptions = {
    origin: [
        'http://localhost:5173',
        'http://localhost:3000',
        'http://127.0.0.1:5173',
    ],
    credentials: true,
    optionsSuccessStatus: 200
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());

// Request logging middleware
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
});

// Mount routes
app.use('/api', healthRouter);
app.use('/api', contactRouter);
app.use('/api', volunteerRouter);
app.use('/api', requestsRouter);
app.use('/api', tasksRouter);

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        error: 'Route not found'
    });
});

// Error handler
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error('Server error:', err);
    res.status(500).json({
        success: false,
        error: 'Internal server error'
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 RESPOND Backend Server running on http://localhost:${PORT}`);
    console.log(`📋 Health check: http://localhost:${PORT}/api/health`);
});

export default app;
