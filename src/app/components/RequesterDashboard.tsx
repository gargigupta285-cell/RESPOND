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
} from 'lucide-react';

interface RequesterDashboardProps {
  onBack: () => void;
}

const openRequests = [
  {
    id: 1,
    title: 'Medical Camp Setup',
    location: 'Mumbai Central',
    skills: ['Medical', 'Setup'],
    urgency: 'high',
    volunteers: {
      needed: 10,
      matched: 7,
      confirmed: 5,
    },
    postedTime: '3 hours ago',
    matches: [
      { name: 'Dr. Sharma', verified: true, rating: 4.9, specialty: 'General Medicine' },
      { name: 'Dr. Patel', verified: true, rating: 4.8, specialty: 'Pediatrics' },
      { name: 'Nurse Reddy', verified: true, rating: 5.0, specialty: 'Emergency Care' },
    ],
  },
  {
    id: 2,
    title: 'Flood Relief Distribution',
    location: 'Kerala, Kochi',
    skills: ['Logistics', 'Driving'],
    urgency: 'high',
    volunteers: {
      needed: 15,
      matched: 12,
      confirmed: 10,
    },
    postedTime: '1 hour ago',
    matches: [
      { name: 'Raj Kumar', verified: true, rating: 4.7, specialty: 'Heavy Vehicle Driver' },
      { name: 'Amit Singh', verified: true, rating: 4.9, specialty: 'Logistics Manager' },
    ],
  },
  {
    id: 3,
    title: 'Community Kitchen Support',
    location: 'Delhi NCR',
    skills: ['Cooking', 'Food Safety'],
    urgency: 'medium',
    volunteers: {
      needed: 8,
      matched: 8,
      confirmed: 8,
    },
    postedTime: '5 hours ago',
    matches: [
      { name: 'Priya Menon', verified: true, rating: 5.0, specialty: 'Chef' },
      { name: 'Rajesh Verma', verified: false, rating: 4.6, specialty: 'Volunteer' },
    ],
  },
];

const allRequests = [
  { id: 1, title: 'Medical Camp Setup', status: 'active', volunteers: '5/10', urgency: 'high', location: 'Mumbai' },
  { id: 2, title: 'Flood Relief Distribution', status: 'active', volunteers: '10/15', urgency: 'high', location: 'Kerala' },
  { id: 3, title: 'Community Kitchen Support', status: 'completed', volunteers: '8/8', urgency: 'medium', location: 'Delhi' },
  { id: 4, title: 'Blood Donation Drive', status: 'scheduled', volunteers: '0/20', urgency: 'low', location: 'Bangalore' },
];

export function RequesterDashboard({ onBack }: RequesterDashboardProps) {
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
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'completed':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'scheduled':
        return 'bg-purple-100 text-purple-700 border-purple-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
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
            <Button className="bg-[#F59E0B] hover:bg-[#D97706]">
              <Plus className="w-5 h-5 mr-2" />
              New Request
            </Button>
            <Button variant="ghost" className="relative">
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
            <div className="text-sm text-gray-600">Across 8 requests</div>
          </div>

          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Open Requests</span>
              <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs">
                3
              </div>
            </div>
            <div className="text-3xl mb-1">3</div>
            <div className="text-sm text-gray-600">2 high priority</div>
          </div>
        </div>

        {/* Open Requests Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h3>Open Requests ({openRequests.length})</h3>
            <Button variant="outline" size="sm">View History</Button>
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
                  <Button className="bg-[#10B981] hover:bg-[#059669]">
                    <Users className="w-4 h-4 mr-2" />
                    Assign Volunteers
                  </Button>
                  <Button variant="outline">View Details</Button>
                  <Button variant="outline">Message All</Button>
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
                      <Button variant="ghost" size="sm">
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
  );
}
