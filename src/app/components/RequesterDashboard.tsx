import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Progress } from './ui/progress';
import {
  Bell,
  Clock,
  MapPin,
  Users,
  CheckCircle,
  TrendingUp,
  Plus,
  ArrowLeft,
  MoreVertical,
  X,
  Send,
  UserPlus,
  Eye,
  MessageSquare,
  Loader2,
} from 'lucide-react';
import { api, RequestData, VolunteerMatch, CreateRequestData } from '../config/api';

interface RequesterDashboardProps {
  onBack: () => void;
}

export function RequesterDashboard({ onBack }: RequesterDashboardProps) {
  // Data state from API
  const [requests, setRequests] = useState<RequestData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [assignLoading, setAssignLoading] = useState(false);
  const [matchesLoading, setMatchesLoading] = useState(false);
  const [matchesError, setMatchesError] = useState<string | null>(null);
  const [availableMatches, setAvailableMatches] = useState<VolunteerMatch[]>([]);
  const [selectedVolunteerIds, setSelectedVolunteerIds] = useState<Set<string>>(new Set());

  // UI state for modals and interactions
  const [showNewRequestModal, setShowNewRequestModal] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<RequestData | null>(null);
  const [showOptionsMenu, setShowOptionsMenu] = useState<number | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Form state for new request
  const [formData, setFormData] = useState({
    title: '',
    location: '',
    skills: '',
    volunteersNeeded: 1,
    urgency: 'high',
    description: '',
  });

  // Notifications data
  const notifications = [
    { id: 1, message: '5 new volunteers matched for Medical Camp Setup', time: '2 min ago' },
    { id: 2, message: 'Dr. Sharma confirmed availability', time: '15 min ago' },
    { id: 3, message: 'Flood Relief Distribution is now fully staffed', time: '1 hour ago' },
  ];

  // Fetch requests on mount
  useEffect(() => {
    loadRequests();
  }, []);

  const loadRequests = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.getRequests();
      setRequests(response.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load requests');
      console.error('Error loading requests:', err);
    } finally {
      setLoading(false);
    }
  };

  // Derived data
  const openRequests = requests.filter(r => r.status === 'open' || r.status === 'active');
  const allRequests = requests.map(r => ({
    id: r.id,
    title: r.title,
    status: r.status,
    volunteers: `${r.volunteers.confirmed}/${r.volunteers.needed}`,
    urgency: r.urgency,
    location: r.location,
  }));

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'high':
        return 'bg-red-500 text-white';
      case 'medium':
        return 'bg-yellow-500 text-white';
      case 'low':
        return 'bg-green-500 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
      case 'open':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'completed':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'scheduled':
        return 'bg-purple-100 text-purple-700 border-purple-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  // Handler functions
  const handleAssignVolunteers = async (request: RequestData) => {
    setSelectedRequest(request);
    setShowAssignModal(true);
    setMatchesLoading(true);
    setMatchesError(null);
    setSelectedVolunteerIds(new Set());

    try {
      const response = await api.getRequestMatches(request.id);
      setAvailableMatches(response.data);
      // Pre-select all matches by default
      const allIds = new Set(response.data.filter(m => m.id).map(m => m.id!));
      setSelectedVolunteerIds(allIds);
    } catch (err) {
      console.error('Error loading matches:', err);
      setMatchesError(err instanceof Error ? err.message : 'Failed to load volunteers');
      // Fall back to existing matches from request
      setAvailableMatches(request.matches);
    } finally {
      setMatchesLoading(false);
    }
  };

  const handleViewDetails = (request: RequestData) => {
    setSelectedRequest(request);
    setShowDetailsModal(true);
  };

  const handleMessageAll = (request: RequestData) => {
    setSelectedRequest(request);
    setShowMessageModal(true);
  };

  const handleViewRequest = (requestId: string) => {
    const request = requests.find(r => r.id === requestId);
    if (request) {
      setSelectedRequest(request);
      setShowDetailsModal(true);
    } else {
      setSuccessMessage(`Viewing request #${requestId}`);
      setTimeout(() => setSuccessMessage(null), 2000);
    }
  };

  const handleConfirmAssign = async () => {
    if (!selectedRequest) return;

    setAssignLoading(true);
    try {
      const volunteerIds = Array.from(selectedVolunteerIds);
      await api.assignVolunteers(selectedRequest.id, volunteerIds);
      setSuccessMessage(`Volunteers assigned to ${selectedRequest?.title}!`);
      setShowAssignModal(false);
      setSelectedRequest(null);
      // Reload requests to get updated data
      await loadRequests();
    } catch (err) {
      console.error('Error assigning volunteers:', err);
      setSuccessMessage('Failed to assign volunteers. Please try again.');
    } finally {
      setAssignLoading(false);
      setTimeout(() => setSuccessMessage(null), 3000);
    }
  };

  const handleSendMessage = () => {
    setSuccessMessage(`Message sent to all volunteers for ${selectedRequest?.title}!`);
    setShowMessageModal(false);
    setSelectedRequest(null);
    setTimeout(() => setSuccessMessage(null), 3000);
  };

  const handleCreateRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const createData: CreateRequestData = {
        title: formData.title,
        description: formData.description,
        location: formData.location,
        skills: formData.skills.split(',').map(s => s.trim()).filter(Boolean),
        urgency: formData.urgency,
        volunteersNeeded: formData.volunteersNeeded,
      };

      await api.createRequest(createData);
      setSuccessMessage('New request created successfully!');
      setShowNewRequestModal(false);
      setFormData({ title: '', location: '', skills: '', volunteersNeeded: 1, urgency: 'high', description: '' });
      // Reload requests
      await loadRequests();
    } catch (err) {
      console.error('Error creating request:', err);
      setSuccessMessage('Failed to create request. Please try again.');
    } finally {
      setSubmitting(false);
      setTimeout(() => setSuccessMessage(null), 3000);
    }
  };

  const toggleVolunteerSelection = (volunteerId: string) => {
    setSelectedVolunteerIds(prev => {
      const newSet = new Set(prev);
      if (newSet.has(volunteerId)) {
        newSet.delete(volunteerId);
      } else {
        newSet.add(volunteerId);
      }
      return newSet;
    });
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-[#1E3A8A]" />
          <p className="text-gray-600">Loading requests...</p>
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
          <Button onClick={loadRequests}>Retry</Button>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Success Message Toast */}
      {successMessage && (
        <div className="fixed top-20 right-6 z-50 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2 animate-fade-in">
          <CheckCircle className="w-5 h-5" />
          {successMessage}
        </div>
      )}

      {/* New Request Modal */}
      {showNewRequestModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowNewRequestModal(false)}>
          <div className="bg-white rounded-xl p-6 max-w-lg w-full mx-4 max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold">Create New Request</h3>
              <Button variant="ghost" size="sm" onClick={() => setShowNewRequestModal(false)}>
                <X className="w-5 h-5" />
              </Button>
            </div>
            <form onSubmit={handleCreateRequest}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Request Title</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., Medical Camp Setup"
                    value={formData.title}
                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Location</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., Mumbai Central"
                    value={formData.location}
                    onChange={e => setFormData({ ...formData, location: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Skills Required</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., Medical, Setup (comma separated)"
                    value={formData.skills}
                    onChange={e => setFormData({ ...formData, skills: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Volunteers Needed</label>
                  <input
                    type="number"
                    min="1"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="10"
                    value={formData.volunteersNeeded}
                    onChange={e => setFormData({ ...formData, volunteersNeeded: parseInt(e.target.value) || 1 })}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Urgency</label>
                  <select
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={formData.urgency}
                    onChange={e => setFormData({ ...formData, urgency: e.target.value })}
                    required
                  >
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Description</label>
                  <textarea
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 h-24"
                    placeholder="Describe the request details..."
                    value={formData.description}
                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <Button type="submit" className="flex-1 bg-[#F59E0B] hover:bg-[#D97706]" disabled={submitting}>
                  {submitting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Plus className="w-4 h-4 mr-2" />}
                  {submitting ? 'Creating...' : 'Create Request'}
                </Button>
                <Button type="button" variant="outline" onClick={() => setShowNewRequestModal(false)}>Cancel</Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Notifications Dropdown */}
      {showNotifications && (
        <div className="fixed top-16 right-20 z-50 bg-white rounded-xl shadow-xl border border-gray-200 w-80" onClick={e => e.stopPropagation()}>
          <div className="p-4 border-b border-gray-200 flex items-center justify-between">
            <h4 className="font-semibold">Notifications</h4>
            <Button variant="ghost" size="sm" onClick={() => setShowNotifications(false)}>
              <X className="w-4 h-4" />
            </Button>
          </div>
          <div className="max-h-64 overflow-y-auto">
            {notifications.map(notif => (
              <div key={notif.id} className="p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer">
                <p className="text-sm">{notif.message}</p>
                <p className="text-xs text-gray-500 mt-1">{notif.time}</p>
              </div>
            ))}
          </div>
          <div className="p-3 text-center">
            <Button variant="ghost" size="sm" className="text-blue-600">View All Notifications</Button>
          </div>
        </div>
      )}

      {/* History Modal */}
      {showHistoryModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowHistoryModal(false)}>
          <div className="bg-white rounded-xl p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold">Request History</h3>
              <Button variant="ghost" size="sm" onClick={() => setShowHistoryModal(false)}>
                <X className="w-5 h-5" />
              </Button>
            </div>
            <div className="space-y-3">
              {allRequests.map(req => (
                <div key={req.id} className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">{req.title}</h4>
                      <p className="text-sm text-gray-600">{req.location} • {req.volunteers}</p>
                    </div>
                    <Badge variant="outline" className={getStatusColor(req.status)}>{req.status}</Badge>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Assign Volunteers Modal */}
      {showAssignModal && selectedRequest && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowAssignModal(false)}>
          <div className="bg-white rounded-xl p-6 max-w-lg w-full mx-4" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold">Assign Volunteers</h3>
              <Button variant="ghost" size="sm" onClick={() => setShowAssignModal(false)}>
                <X className="w-5 h-5" />
              </Button>
            </div>
            <p className="text-gray-600 mb-4">Select volunteers to assign to <strong>{selectedRequest.title}</strong>:</p>

            {matchesLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin text-[#1E3A8A]" />
                <span className="ml-2 text-gray-600">Loading matches...</span>
              </div>
            ) : matchesError ? (
              <div className="py-4 text-center">
                <p className="text-red-500 mb-2">{matchesError}</p>
                <Button variant="outline" size="sm" onClick={() => selectedRequest && handleAssignVolunteers(selectedRequest)}>Retry</Button>
              </div>
            ) : (
              <div className="space-y-2 mb-6">
                {availableMatches.length > 0 ? availableMatches.map((vol) => (
                  <label key={vol.id || vol.name} className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      type="checkbox"
                      checked={vol.id ? selectedVolunteerIds.has(vol.id) : false}
                      onChange={() => vol.id && toggleVolunteerSelection(vol.id)}
                      className="w-4 h-4 text-blue-600 rounded"
                    />
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-[#1E3A8A] text-white text-xs">
                        {vol.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{vol.name}</span>
                        {vol.verified && <CheckCircle className="w-3 h-3 text-[#10B981]" />}
                      </div>
                      <div className="text-sm text-gray-500">
                        {vol.specialty} • ★ {vol.rating.toFixed(1)}
                      </div>
                    </div>
                  </label>
                )) : (
                  <p className="text-gray-500 text-center py-4">No matching volunteers found.</p>
                )}
              </div>
            )}

            <div className="flex gap-3">
              <Button
                className="flex-1 bg-[#10B981] hover:bg-[#059669]"
                onClick={handleConfirmAssign}
                disabled={assignLoading || selectedVolunteerIds.size === 0}
              >
                {assignLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <UserPlus className="w-4 h-4 mr-2" />}
                {assignLoading ? 'Assigning...' : 'Confirm Assignment'}
              </Button>
              <Button variant="outline" onClick={() => setShowAssignModal(false)}>Cancel</Button>
            </div>
          </div>
        </div>
      )}

      {/* View Details Modal */}
      {showDetailsModal && selectedRequest && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowDetailsModal(false)}>
          <div className="bg-white rounded-xl p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <h3 className="text-xl font-semibold">{selectedRequest.title}</h3>
                <Badge className={`${getUrgencyColor(selectedRequest.urgency)} border-0`}>
                  {selectedRequest.urgency.toUpperCase()}
                </Badge>
              </div>
              <Button variant="ghost" size="sm" onClick={() => setShowDetailsModal(false)}>
                <X className="w-5 h-5" />
              </Button>
            </div>
            <div className="space-y-4">
              <div className="flex items-center gap-4 text-gray-600">
                <div className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  {selectedRequest.location}
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  Posted {selectedRequest.postedTime}
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {selectedRequest.skills.map(skill => (
                  <Badge key={skill} variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">{skill}</Badge>
                ))}
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium mb-2">Volunteer Status</h4>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-blue-600">{selectedRequest.volunteers.needed}</div>
                    <div className="text-sm text-gray-600">Needed</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-yellow-600">{selectedRequest.volunteers.matched}</div>
                    <div className="text-sm text-gray-600">Matched</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-green-600">{selectedRequest.volunteers.confirmed}</div>
                    <div className="text-sm text-gray-600">Confirmed</div>
                  </div>
                </div>
              </div>
              <div>
                <h4 className="font-medium mb-3">Matched Volunteers</h4>
                <div className="space-y-2">
                  {selectedRequest.matches.map((vol, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarFallback className="bg-[#1E3A8A] text-white">
                            {vol.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{vol.name}</span>
                            {vol.verified && <CheckCircle className="w-4 h-4 text-[#10B981]" />}
                          </div>
                          <div className="text-sm text-gray-600">{vol.specialty} • ★ {vol.rating}</div>
                        </div>
                      </div>
                      <Button size="sm" variant="outline">Contact</Button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <Button className="bg-[#10B981] hover:bg-[#059669]" onClick={() => { setShowDetailsModal(false); handleAssignVolunteers(selectedRequest); }}>
                <UserPlus className="w-4 h-4 mr-2" />
                Assign Volunteers
              </Button>
              <Button variant="outline" onClick={() => { setShowDetailsModal(false); handleMessageAll(selectedRequest); }}>
                <MessageSquare className="w-4 h-4 mr-2" />
                Message All
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Message All Modal */}
      {showMessageModal && selectedRequest && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowMessageModal(false)}>
          <div className="bg-white rounded-xl p-6 max-w-lg w-full mx-4" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold">Message Volunteers</h3>
              <Button variant="ghost" size="sm" onClick={() => setShowMessageModal(false)}>
                <X className="w-5 h-5" />
              </Button>
            </div>
            <p className="text-gray-600 mb-4">Send a message to all volunteers for <strong>{selectedRequest.title}</strong>:</p>
            <div className="mb-4">
              <div className="flex flex-wrap gap-2 mb-3">
                {selectedRequest.matches.map((vol, idx) => (
                  <Badge key={idx} variant="outline" className="bg-gray-100">
                    {vol.name}
                  </Badge>
                ))}
              </div>
              <textarea
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 h-32"
                placeholder="Type your message here..."
              />
            </div>
            <div className="flex gap-3">
              <Button className="flex-1 bg-[#1E3A8A] hover:bg-[#1E3A8A]/90" onClick={handleSendMessage}>
                <Send className="w-4 h-4 mr-2" />
                Send Message
              </Button>
              <Button variant="outline" onClick={() => setShowMessageModal(false)}>Cancel</Button>
            </div>
          </div>
        </div>
      )}

      {/* Options Menu */}
      {showOptionsMenu !== null && (
        <div className="fixed inset-0 z-40" onClick={() => setShowOptionsMenu(null)} />
      )}
      <div className="min-h-screen bg-gray-50">
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
              <div>
                <h2>Requester Dashboard</h2>
                <p className="text-sm text-gray-600">Kerala State Disaster Management</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <Button className="bg-[#F59E0B] hover:bg-[#D97706]" onClick={() => setShowNewRequestModal(true)}>
                <Plus className="w-5 h-5 mr-2" />
                New Request
              </Button>
              <Button variant="ghost" className="relative" onClick={() => setShowNotifications(!showNotifications)}>
                <Bell className="w-5 h-5" />
                <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full" />
              </Button>
              <Avatar>
                <AvatarFallback className="bg-[#1E3A8A] text-white">KS</AvatarFallback>
              </Avatar>
            </div>
          </div>
        </header>

        <div className="max-w-7xl mx-auto px-6 py-8">
          {/* Analytics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">Avg Response Time</span>
                <Clock className="w-5 h-5 text-[#10B981]" />
              </div>
              <div className="text-3xl mb-1">4 min</div>
              <div className="flex items-center gap-1 text-sm text-green-600">
                <TrendingUp className="w-4 h-4" />
                <span>12% faster</span>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">Match Rate</span>
                <CheckCircle className="w-5 h-5 text-[#1E3A8A]" />
              </div>
              <div className="text-3xl mb-1">87%</div>
              <div className="flex items-center gap-1 text-sm text-green-600">
                <TrendingUp className="w-4 h-4" />
                <span>5% increase</span>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">Active Volunteers</span>
                <Users className="w-5 h-5 text-[#F59E0B]" />
              </div>
              <div className="text-3xl mb-1">142</div>
              <div className="text-sm text-gray-600">Across {requests.length} requests</div>
            </div>

            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">Open Requests</span>
                <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs">
                  {openRequests.length}
                </div>
              </div>
              <div className="text-3xl mb-1">{openRequests.length}</div>
              <div className="text-sm text-gray-600">{openRequests.filter(r => r.urgency === 'high').length} high priority</div>
            </div>
          </div>

          {/* Open Requests Section */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <h3>Open Requests ({openRequests.length})</h3>
              <Button variant="outline" size="sm" onClick={() => setShowHistoryModal(true)}>View History</Button>
            </div>

            <div className="space-y-6">
              {openRequests.map((request) => (
                <div
                  key={request.id}
                  className="bg-white rounded-xl p-6 border border-gray-200"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <h4>{request.title}</h4>
                        <Badge className={`${getUrgencyColor(request.urgency)} border-0`}>
                          {request.urgency.toUpperCase()}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          {request.location}
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          Posted {request.postedTime}
                        </div>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">
                      <MoreVertical className="w-5 h-5" />
                    </Button>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {request.skills.map((skill) => (
                      <Badge key={skill} variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                        {skill}
                      </Badge>
                    ))}
                  </div>

                  {/* Progress */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span className="text-gray-600">Volunteer Progress</span>
                      <span>
                        {request.volunteers.confirmed}/{request.volunteers.needed} confirmed
                      </span>
                    </div>
                    <Progress
                      value={(request.volunteers.confirmed / request.volunteers.needed) * 100}
                      className="h-2"
                    />
                    <div className="flex items-center justify-between text-xs text-gray-500 mt-1">
                      <span>{request.volunteers.matched} matched</span>
                      <span>{request.volunteers.needed - request.volunteers.confirmed} still needed</span>
                    </div>
                  </div>

                  {/* Matched Volunteers */}
                  <div className="mb-4">
                    <h5 className="text-sm mb-3">Matched Volunteers</h5>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      {request.matches.map((volunteer, idx) => (
                        <div key={idx} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                          <Avatar className="h-10 w-10">
                            <AvatarFallback className="bg-[#1E3A8A] text-white text-sm">
                              {volunteer.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="text-sm truncate">{volunteer.name}</span>
                              {volunteer.verified && (
                                <CheckCircle className="w-3 h-3 text-[#10B981] flex-shrink-0" />
                              )}
                            </div>
                            <div className="text-xs text-gray-600 truncate">{volunteer.specialty}</div>
                            <div className="text-xs text-gray-500">★ {volunteer.rating}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-3">
                    <Button className="bg-[#10B981] hover:bg-[#059669]" onClick={() => handleAssignVolunteers(request)}>
                      <Users className="w-4 h-4 mr-2" />
                      Assign Volunteers
                    </Button>
                    <Button variant="outline" onClick={() => handleViewDetails(request)}>View Details</Button>
                    <Button variant="outline" onClick={() => handleMessageAll(request)}>Message All</Button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* All Requests Table */}
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <h3>All Requests</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left px-6 py-3 text-sm text-gray-600">Request</th>
                    <th className="text-left px-6 py-3 text-sm text-gray-600">Status</th>
                    <th className="text-left px-6 py-3 text-sm text-gray-600">Volunteers</th>
                    <th className="text-left px-6 py-3 text-sm text-gray-600">Urgency</th>
                    <th className="text-left px-6 py-3 text-sm text-gray-600">Location</th>
                    <th className="text-left px-6 py-3 text-sm text-gray-600">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {allRequests.map((request) => (
                    <tr key={request.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div>{request.title}</div>
                      </td>
                      <td className="px-6 py-4">
                        <Badge variant="outline" className={getStatusColor(request.status)}>
                          {request.status}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 text-sm">{request.volunteers}</td>
                      <td className="px-6 py-4">
                        <Badge className={`${getUrgencyColor(request.urgency)} border-0 text-xs`}>
                          {request.urgency}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">{request.location}</td>
                      <td className="px-6 py-4">
                        <Button variant="ghost" size="sm" onClick={() => handleViewRequest(request.id)}>
                          View
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
