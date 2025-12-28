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
  ArrowLeft
} from 'lucide-react';

interface VolunteerDashboardProps {
  onBack: () => void;
}

const nearbyRequests = [
  {
    id: 1,
    title: 'Flood Relief - Doctors Needed',
    organization: 'Kerala State Disaster Management',
    location: 'Kochi, Kerala',
    distance: '2.3 km',
    urgency: 'high',
    skillsNeeded: ['Medical', 'Doctor', 'Emergency Care'],
    volunteers: '3/5 filled',
    time: '2 hours ago',
    icon: Stethoscope,
  },
  {
    id: 2,
    title: 'Medical Camp - Nurses Required',
    organization: 'Red Cross India',
    location: 'Mumbai, Maharashtra',
    distance: '5.1 km',
    urgency: 'medium',
    skillsNeeded: ['Nursing', 'First Aid', 'Healthcare'],
    volunteers: '7/10 filled',
    time: '4 hours ago',
    icon: Heart,
  },
  {
    id: 3,
    title: 'Food Distribution - Drivers Needed',
    organization: 'Goonj NGO',
    location: 'Delhi NCR',
    distance: '8.7 km',
    urgency: 'low',
    skillsNeeded: ['Driving', 'Logistics', 'Distribution'],
    volunteers: '12/15 filled',
    time: '6 hours ago',
    icon: Truck,
  },
];

const myTasks = [
  {
    id: 1,
    title: 'Blood Donation Camp',
    date: 'Dec 30, 2025',
    time: '10:00 AM',
    status: 'upcoming',
  },
  {
    id: 2,
    title: 'Vaccination Drive',
    date: 'Jan 2, 2026',
    time: '9:00 AM',
    status: 'upcoming',
  },
];

export function VolunteerDashboard({ onBack }: VolunteerDashboardProps) {
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
                <div className="text-3xl mb-1">24</div>
                <div className="text-sm text-gray-600">Tasks Completed</div>
              </div>
              <div className="bg-white rounded-xl p-6 border border-gray-200">
                <div className="text-3xl mb-1">156</div>
                <div className="text-sm text-gray-600">Hours Served</div>
              </div>
              <div className="bg-white rounded-xl p-6 border border-gray-200">
                <div className="text-3xl mb-1">4.9</div>
                <div className="text-sm text-gray-600">Rating</div>
              </div>
            </div>

            {/* Nearby Requests */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3>Nearby Emergency Requests</h3>
                <Button variant="outline" size="sm">View All</Button>
              </div>
              
              <div className="space-y-4">
                {nearbyRequests.map((request) => {
                  const IconComponent = request.icon;
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
                            >
                              Accept Task
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
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
                  </div>
                ))}
              </div>
              
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
