import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback } from './ui/avatar';
import {
  MapPin,
  Bell,
  Calendar,
  Clock,
  CheckCircle,
  AlertCircle,
  AlertTriangle,
  Stethoscope,
  Truck,
  Heart,
  ArrowLeft,
  Loader2
} from 'lucide-react';
import { api, RequestData, VolunteerStats, VolunteerTask } from '../config/api';

interface VolunteerDashboardProps {
  onBack: () => void;
  volunteerId?: string; // Default to demo volunteer
}

// Icon mapping for request types
const getIconForRequest = (title: string) => {
  const lowerTitle = title.toLowerCase();
  if (lowerTitle.includes('medical') || lowerTitle.includes('doctor') || lowerTitle.includes('health')) {
    return Stethoscope;
  }
  if (lowerTitle.includes('food') || lowerTitle.includes('distribution') || lowerTitle.includes('driv')) {
    return Truck;
  }
  return Heart;
};

export function VolunteerDashboard({ onBack, volunteerId = 'demo-vol-1' }: VolunteerDashboardProps) {
  // Data state
  const [requests, setRequests] = useState<RequestData[]>([]);
  const [stats, setStats] = useState<VolunteerStats | null>(null);
  const [tasks, setTasks] = useState<VolunteerTask[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [acceptingTaskId, setAcceptingTaskId] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Fetch all data on mount
  useEffect(() => {
    loadDashboardData();
  }, [volunteerId]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch all data in parallel
      const [requestsRes, statsRes, tasksRes] = await Promise.all([
        api.getRequests(),
        api.getVolunteerStats(volunteerId),
        api.getVolunteerTasks(volunteerId),
      ]);

      setRequests(requestsRes.data);
      setStats(statsRes.data);
      setTasks(tasksRes.data);
    } catch (err) {
      console.error('Error loading dashboard data:', err);
      setError(err instanceof Error ? err.message : 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  // Transform requests into nearby requests format
  const nearbyRequests = requests
    .filter(r => r.status === 'open' || r.status === 'active')
    .map(r => ({
      id: r.id,
      title: r.title,
      organization: r.organizationName || 'RESPOND Platform',
      location: r.location,
      distance: '~5 km', // Would be calculated from user location in real app
      urgency: r.urgency,
      skillsNeeded: r.skills,
      volunteers: `${r.volunteers.confirmed}/${r.volunteers.needed} filled`,
      time: r.postedTime,
      icon: getIconForRequest(r.title),
    }));

  // Transform tasks into upcoming tasks format
  const myTasks = tasks
    .filter(t => t.status === 'accepted' || t.status === 'assigned')
    .map(t => ({
      id: t.id,
      title: t.request.title,
      date: t.assignedAt ? new Date(t.assignedAt).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      }) : 'TBD',
      time: t.assignedAt ? new Date(t.assignedAt).toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      }) : 'TBD',
      status: t.status,
    }));

  const handleAcceptTask = async (requestId: string) => {
    setAcceptingTaskId(requestId);
    try {
      await api.acceptTask(requestId);
      setSuccessMessage('Task accepted successfully!');

      // Update the local state to reflect the acceptance
      setTasks(prev => prev.map(t =>
        t.request.id === requestId
          ? { ...t, status: 'accepted', acceptedAt: new Date().toISOString() }
          : t
      ));

      // Optionally reload all data to get fresh state
      await loadDashboardData();
    } catch (err) {
      console.error('Error accepting task:', err);
      setSuccessMessage('Failed to accept task. Please try again.');
    } finally {
      setAcceptingTaskId(null);
      setTimeout(() => setSuccessMessage(null), 3000);
    }
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'high':
        return 'bg-red-500';
      case 'medium':
        return 'bg-yellow-500';
      case 'low':
        return 'bg-green-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getUrgencyLabel = (urgency: string) => {
    switch (urgency) {
      case 'high':
        return 'URGENT';
      case 'medium':
        return 'MODERATE';
      case 'low':
        return 'LOW';
      default:
        return 'NORMAL';
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-[#1E3A8A]" />
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <Button onClick={loadDashboardData}>Retry</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Success Message Toast */}
      {successMessage && (
        <div className="fixed top-20 right-6 z-50 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2 animate-fade-in">
          <CheckCircle className="w-5 h-5" />
          {successMessage}
        </div>
      )}

      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              onClick={onBack}
              className="hover:bg-gray-100"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h2>Volunteer Dashboard</h2>
          </div>

          <div className="flex items-center gap-4">
            <Badge variant="outline" className="bg-[#10B981] text-white border-[#10B981]">
              <CheckCircle className="w-3 h-3 mr-1" />
              Verified
            </Badge>
            <Badge variant="outline" className="bg-blue-100 text-blue-700 border-blue-200">
              Medical Professional
            </Badge>
            <Button variant="ghost" className="relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full" />
            </Button>
            <Avatar>
              <AvatarFallback className="bg-[#1E3A8A] text-white">AK</AvatarFallback>
            </Avatar>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Stats */}
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-white rounded-xl p-6 border border-gray-200">
                <div className="text-3xl mb-1">{stats?.tasksCompleted ?? 0}</div>
                <div className="text-sm text-gray-600">Tasks Completed</div>
              </div>
              <div className="bg-white rounded-xl p-6 border border-gray-200">
                <div className="text-3xl mb-1">{stats?.hoursServed ?? 0}</div>
                <div className="text-sm text-gray-600">Hours Served</div>
              </div>
              <div className="bg-white rounded-xl p-6 border border-gray-200">
                <div className="text-3xl mb-1">{stats?.rating?.toFixed(1) ?? '0.0'}</div>
                <div className="text-sm text-gray-600">Rating</div>
              </div>
            </div>

            {/* Nearby Requests */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3>Nearby Emergency Requests</h3>
                <Button variant="outline" size="sm">View All</Button>
              </div>

              {nearbyRequests.length === 0 ? (
                <div className="bg-white rounded-xl p-8 border border-gray-200 text-center">
                  <p className="text-gray-500">No nearby requests at the moment.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {nearbyRequests.map((request) => {
                    const IconComponent = request.icon;
                    const isAccepting = acceptingTaskId === request.id;
                    return (
                      <div
                        key={request.id}
                        className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-shadow"
                      >
                        <div className="flex items-start gap-4">
                          <div className="w-12 h-12 bg-gradient-to-br from-[#1E3A8A] to-[#3B82F6] rounded-xl flex items-center justify-center flex-shrink-0">
                            <IconComponent className="w-6 h-6 text-white" />
                          </div>

                          <div className="flex-1">
                            <div className="flex items-start justify-between mb-2">
                              <div>
                                <h4 className="mb-1">{request.title}</h4>
                                <p className="text-sm text-gray-600">{request.organization}</p>
                              </div>
                              <Badge className={`${getUrgencyColor(request.urgency)} text-white border-0`}>
                                {getUrgencyLabel(request.urgency)}
                              </Badge>
                            </div>

                            <div className="flex flex-wrap gap-2 mb-3">
                              {request.skillsNeeded.map((skill) => (
                                <Badge key={skill} variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                                  {skill}
                                </Badge>
                              ))}
                            </div>

                            <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                              <div className="flex items-center gap-1">
                                <MapPin className="w-4 h-4" />
                                {request.location} • {request.distance}
                              </div>
                              <div className="flex items-center gap-1">
                                <Clock className="w-4 h-4" />
                                {request.time}
                              </div>
                            </div>

                            <div className="flex items-center justify-between">
                              <span className="text-sm text-gray-600">{request.volunteers} volunteers</span>
                              <Button
                                className="bg-[#10B981] hover:bg-[#059669]"
                                onClick={() => handleAcceptTask(request.id)}
                                disabled={isAccepting}
                              >
                                {isAccepting ? (
                                  <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    Accepting...
                                  </>
                                ) : (
                                  'Accept Task'
                                )}
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Availability Calendar */}
            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h4>Availability</h4>
                <Button variant="ghost" size="sm">
                  <Calendar className="w-4 h-4" />
                </Button>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Monday - Friday</span>
                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                    Available
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Weekends</span>
                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                    Available
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Time</span>
                  <span className="text-sm text-gray-600">9 AM - 6 PM</span>
                </div>
              </div>

              <Button variant="outline" className="w-full mt-4">
                Update Availability
              </Button>
            </div>

            {/* My Tasks */}
            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <h4 className="mb-4">My Upcoming Tasks</h4>

              {myTasks.length === 0 ? (
                <p className="text-sm text-gray-500 text-center py-4">No upcoming tasks.</p>
              ) : (
                <div className="space-y-3">
                  {myTasks.map((task) => (
                    <div key={task.id} className="p-3 bg-blue-50 rounded-lg border border-blue-100">
                      <div className="text-sm mb-1">{task.title}</div>
                      <div className="flex items-center gap-2 text-xs text-gray-600">
                        <Calendar className="w-3 h-3" />
                        {task.date}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-gray-600">
                        <Clock className="w-3 h-3" />
                        {task.time}
                      </div>
                      <Badge
                        variant="outline"
                        className={`mt-2 text-xs ${task.status === 'accepted'
                            ? 'bg-green-50 text-green-700 border-green-200'
                            : 'bg-yellow-50 text-yellow-700 border-yellow-200'
                          }`}
                      >
                        {task.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}

              <Button variant="outline" className="w-full mt-4">
                View All Tasks
              </Button>
            </div>

            {/* Quick Actions */}
            <div className="bg-gradient-to-br from-[#F59E0B] to-[#D97706] rounded-xl p-6 text-white">
              <AlertCircle className="w-8 h-8 mb-3" />
              <h4 className="mb-2 text-white">Emergency Alert</h4>
              <p className="text-sm text-orange-100 mb-4">
                Enable notifications for urgent requests in your area
              </p>
              <Button className="w-full bg-white text-[#F59E0B] hover:bg-gray-100">
                Enable Alerts
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
