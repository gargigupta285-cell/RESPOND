/**
 * API Configuration for RESPOND Frontend
 * Handles communication with the backend server
 */

export const API_BASE_URL = 'http://localhost:4000';

/**
 * API Response types
 */
export interface ApiSuccessResponse<T = unknown> {
    success: true;
    data: T;
    message?: string;
}

export interface ApiErrorResponse {
    success: false;
    error: string;
}

export type ApiResponse<T = unknown> = ApiSuccessResponse<T> | ApiErrorResponse;

/**
 * Custom error class for API errors
 */
export class ApiError extends Error {
    constructor(
        message: string,
        public status: number,
        public response?: ApiErrorResponse
    ) {
        super(message);
        this.name = 'ApiError';
    }
}

/**
 * API client helper function
 * Wraps fetch with error handling and JSON parsing
 * 
 * @param path - API endpoint path (e.g., '/api/health')
 * @param options - Fetch options
 * @returns Parsed JSON response
 * @throws ApiError on non-OK responses
 */
export async function apiClient<T = unknown>(
    path: string,
    options: RequestInit = {}
): Promise<ApiSuccessResponse<T>> {
    const url = `${API_BASE_URL}${path}`;

    const defaultOptions: RequestInit = {
        headers: {
            'Content-Type': 'application/json',
        },
    };

    const mergedOptions: RequestInit = {
        ...defaultOptions,
        ...options,
        headers: {
            ...defaultOptions.headers,
            ...options.headers,
        },
    };

    try {
        const response = await fetch(url, mergedOptions);
        const data: ApiResponse<T> = await response.json();

        if (!response.ok || !data.success) {
            throw new ApiError(
                (data as ApiErrorResponse).error || 'Request failed',
                response.status,
                data as ApiErrorResponse
            );
        }

        return data as ApiSuccessResponse<T>;
    } catch (error) {
        if (error instanceof ApiError) {
            throw error;
        }

        // Network or parsing error
        throw new ApiError(
            error instanceof Error ? error.message : 'Network error',
            0
        );
    }
}

/**
 * API Data Types for Dashboard Integration
 */
export interface VolunteerMatch {
    id?: string;
    name: string;
    verified: boolean;
    rating: number;
    specialty: string;
    skills?: string[];
    tasksCompleted?: number;
}

export interface RequestData {
    id: string;
    title: string;
    description?: string;
    location: string;
    skills: string[];
    urgency: string;
    status: string;
    volunteers: { needed: number; matched: number; confirmed: number };
    postedTime: string;
    organizationName?: string;
    matches: VolunteerMatch[];
}

export interface VolunteerStats {
    tasksCompleted: number;
    hoursServed: number;
    rating: number;
}

export interface VolunteerTask {
    id: string;
    status: string;
    assignedAt: string;
    acceptedAt?: string;
    completedAt?: string;
    request: {
        id: string;
        title: string;
        location: string;
        urgency: string;
        postedTime?: string;
    };
}

export interface CreateRequestData {
    title: string;
    description?: string;
    location: string;
    skills: string[];
    urgency: string;
    volunteersNeeded: number;
    organizationName?: string;
}

/**
 * Convenience methods for common API operations
 */
export const api = {
    /**
     * Check API health
     */
    health: () => apiClient<{ status: string; timestamp: string }>('/api/health'),

    /**
     * Submit contact form
     */
    contact: (data: { name: string; email: string; message: string }) =>
        apiClient('/api/contact', {
            method: 'POST',
            body: JSON.stringify(data),
        }),

    /**
     * Register a volunteer
     */
    volunteerRegister: (data: {
        personalInfo: Record<string, unknown>;
        skills: Record<string, unknown>;
        verification: Record<string, unknown>;
        availability: Record<string, unknown>;
    }) =>
        apiClient('/api/volunteer/register', {
            method: 'POST',
            body: JSON.stringify(data),
        }),

    // ============================================
    // Request APIs
    // ============================================

    /**
     * Get all requests
     */
    getRequests: () => apiClient<RequestData[]>('/api/requests'),

    /**
     * Create a new request
     */
    createRequest: (data: CreateRequestData) =>
        apiClient<RequestData>('/api/requests', {
            method: 'POST',
            body: JSON.stringify(data),
        }),

    /**
     * Get matching volunteers for a request
     */
    getRequestMatches: (id: string) =>
        apiClient<VolunteerMatch[]>(`/api/requests/${id}/matches`),

    /**
     * Assign volunteers to a request
     */
    assignVolunteers: (id: string, volunteerIds: string[]) =>
        apiClient<{ requestId: string; assignmentsCreated: number }>(
            `/api/requests/${id}/assign`,
            {
                method: 'POST',
                body: JSON.stringify({ volunteerIds }),
            }
        ),

    // ============================================
    // Volunteer APIs
    // ============================================

    /**
     * Get volunteer stats
     */
    getVolunteerStats: (id: string) =>
        apiClient<VolunteerStats>(`/api/volunteers/${id}/stats`),

    /**
     * Get volunteer tasks
     */
    getVolunteerTasks: (id: string) =>
        apiClient<VolunteerTask[]>(`/api/volunteers/${id}/tasks`),

    // ============================================
    // Task APIs
    // ============================================

    /**
     * Accept a task assignment
     */
    acceptTask: (id: string) =>
        apiClient<{ id: string; status: string; acceptedAt: string }>(
            `/api/tasks/${id}/accept`,
            { method: 'PUT' }
        ),
};
