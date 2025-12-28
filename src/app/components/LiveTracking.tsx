import { useState } from 'react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback } from './ui/avatar';
import {
  MapPin,
  Navigation,
  Phone,
  AlertTriangle,
  Flag,
  Clock,
  CheckCircle,
  X,
  MessageSquare,
  User,
  ChevronUp,
} from 'lucide-react';

interface LiveTrackingProps {
  userType: 'volunteer' | 'requester';
  onComplete: () => void;
  onClose: () => void;
}

export function LiveTracking({ userType, onComplete, onClose }: LiveTrackingProps) {
  const [bottomSheetExpanded, setBottomSheetExpanded] = useState(false);
  const [hasArrived, setHasArrived] = useState(false);

  const taskDetails = {
    title: 'Medical Camp Setup',
    organization: 'Kerala State Disaster Management',
    destination: 'Community Health Center, MG Road, Kochi',
    coordinatorName: 'Dr. Rajesh Kumar',
    coordinatorPhone: '+91 98765 43210',
    eta: '12 minutes',
  };

  const volunteers = [
    {
      id: 1,
      name: 'Dr. Sharma',
      photo: 'DS',
      status: 'arrived',
      eta: 'Arrived',
      distance: '0 km',
    },
    {
      id: 2,
      name: 'Dr. Patel',
      photo: 'DP',
      status: 'en-route',
      eta: '5 min',
      distance: '1.2 km',
    },
    {
      id: 3,
      name: 'Nurse Reddy',
      photo: 'NR',
      status: 'en-route',
      eta: '8 min',
      distance: '2.1 km',
    },
    {
      id: 4,
      name: 'Nurse Kumar',
      photo: 'NK',
      status: 'en-route',
      eta: '15 min',
      distance: '4.3 km',
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'arrived':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'en-route':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'completed':
        return 'bg-gray-100 text-gray-700 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="fixed inset-0 bg-white z-50 flex flex-col">
      {/* Map Area */}
      <div className="flex-1 bg-gradient-to-br from-blue-100 to-green-100 relative">
        {/* Simulated Map */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <MapPin className="w-16 h-16 text-red-500 mx-auto mb-4 animate-bounce" />
            <p className="text-gray-600">Live Map View</p>
            <p className="text-sm text-gray-500 mt-2">
              {userType === 'volunteer' ? 'Navigating to destination' : 'Tracking all volunteers'}
            </p>
          </div>
        </div>

        {/* Location Markers (Simulated) */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2">
          <div className="w-4 h-4 bg-blue-500 rounded-full border-4 border-white shadow-lg animate-pulse" />
          <p className="text-xs bg-white px-2 py-1 rounded shadow mt-1 whitespace-nowrap">
            {userType === 'volunteer' ? 'Your Location' : 'Request Location'}
          </p>
        </div>

        {/* Destination Marker */}
        <div className="absolute bottom-1/3 right-1/3">
          <MapPin className="w-8 h-8 text-red-500" />
          <p className="text-xs bg-white px-2 py-1 rounded shadow mt-1 whitespace-nowrap">
            Destination
          </p>
        </div>

        {/* Other Volunteers (For Requester View) */}
        {userType === 'requester' && (
          <>
            <div className="absolute top-1/2 left-1/4">
              <div className="w-3 h-3 bg-green-500 rounded-full border-2 border-white shadow" />
            </div>
            <div className="absolute bottom-1/2 right-1/4">
              <div className="w-3 h-3 bg-blue-500 rounded-full border-2 border-white shadow" />
            </div>
          </>
        )}

        {/* Close Button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={onClose}
          className="absolute top-4 right-4 bg-white shadow-lg hover:bg-gray-100"
        >
          <X className="w-5 h-5" />
        </Button>
      </div>

      {/* Top Card - Task Summary (Only for Volunteer) */}
      {userType === 'volunteer' && (
        <div className="absolute top-0 left-0 right-0 p-4">
          <div className="bg-white rounded-xl shadow-2xl p-4 max-w-md mx-auto border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-sm">{taskDetails.title}</h4>
              <Badge variant="outline" className="bg-blue-100 text-blue-700 border-blue-200 text-xs">
                In Progress
              </Badge>
            </div>
            <p className="text-sm text-gray-600 mb-3">{taskDetails.organization}</p>
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <Navigation className="w-4 h-4 text-blue-500" />
                <span>ETA: {taskDetails.eta}</span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="text-[#1E3A8A]"
              >
                <Phone className="w-4 h-4 mr-1" />
                Call
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Sheet */}
      <div
        className={`bg-white border-t border-gray-200 transition-all duration-300 ${
          bottomSheetExpanded ? 'h-2/3' : 'h-auto'
        }`}
      >
        {/* Handle */}
        <button
          onClick={() => setBottomSheetExpanded(!bottomSheetExpanded)}
          className="w-full py-2 flex justify-center hover:bg-gray-50"
        >
          <div className="w-12 h-1 bg-gray-300 rounded-full" />
        </button>

        <div className={`px-6 pb-6 ${bottomSheetExpanded ? 'overflow-y-auto' : ''}`}>
          {userType === 'volunteer' ? (
            // Volunteer View
            <>
              <div className="space-y-3 mb-6">
                <Button
                  className={`w-full ${
                    hasArrived
                      ? 'bg-green-600 hover:bg-green-700'
                      : 'bg-[#10B981] hover:bg-[#059669]'
                  }`}
                  onClick={() => setHasArrived(true)}
                  disabled={hasArrived}
                >
                  <CheckCircle className="w-5 h-5 mr-2" />
                  {hasArrived ? "You've Arrived" : "I've Arrived"}
                </Button>

                <div className="grid grid-cols-2 gap-3">
                  <Button variant="outline" className="w-full">
                    <Phone className="w-5 h-5 mr-2" />
                    Call Coordinator
                  </Button>
                  <Button variant="outline" className="w-full">
                    <MessageSquare className="w-5 h-5 mr-2" />
                    Message
                  </Button>
                </div>

                <Button variant="outline" className="w-full border-red-500 text-red-600 hover:bg-red-50">
                  <AlertTriangle className="w-5 h-5 mr-2" />
                  Need Help / Emergency
                </Button>

                <Button variant="ghost" className="w-full text-gray-600">
                  <Flag className="w-5 h-5 mr-2" />
                  Report Issue
                </Button>
              </div>

              {/* Coordinator Info */}
              {bottomSheetExpanded && (
                <div className="border border-gray-200 rounded-xl p-4">
                  <h5 className="mb-3">Coordinator Information</h5>
                  <div className="flex items-center gap-3 mb-3">
                    <Avatar>
                      <AvatarFallback className="bg-[#1E3A8A] text-white">
                        {taskDetails.coordinatorName.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p>{taskDetails.coordinatorName}</p>
                      <p className="text-sm text-gray-600">{taskDetails.coordinatorPhone}</p>
                    </div>
                  </div>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm text-blue-700">
                    Safety check-in reminder: You'll be prompted every 30 minutes
                  </div>
                </div>
              )}
            </>
          ) : (
            // Requester View
            <>
              <div className="mb-4">
                <div className="flex items-center justify-between mb-4">
                  <h4>Volunteers En Route</h4>
                  <Badge variant="outline" className="bg-blue-100 text-blue-700 border-blue-200">
                    {volunteers.filter((v) => v.status === 'arrived').length}/{volunteers.length} Arrived
                  </Badge>
                </div>

                <div className="space-y-3">
                  {volunteers.map((volunteer) => (
                    <div
                      key={volunteer.id}
                      className="border border-gray-200 rounded-xl p-4"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10">
                            <AvatarFallback className="bg-[#1E3A8A] text-white text-sm">
                              {volunteer.photo}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p>{volunteer.name}</p>
                            <p className="text-xs text-gray-500">{volunteer.distance} away</p>
                          </div>
                        </div>
                        <Badge variant="outline" className={getStatusColor(volunteer.status)}>
                          {volunteer.status === 'arrived' ? 'Arrived' : `ETA: ${volunteer.eta}`}
                        </Badge>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="flex-1">
                          <Phone className="w-4 h-4 mr-1" />
                          Call
                        </Button>
                        <Button variant="outline" size="sm" className="flex-1">
                          <MessageSquare className="w-4 h-4 mr-1" />
                          Message
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {bottomSheetExpanded && (
                <>
                  <Button variant="outline" className="w-full mb-3">
                    <MessageSquare className="w-5 h-5 mr-2" />
                    Broadcast Message to All Volunteers
                  </Button>

                  <div className="border border-gray-200 rounded-xl p-4">
                    <h5 className="mb-3">Completion Checklist</h5>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span>All volunteers accounted for</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-gray-300 rounded-full" />
                        <span>Equipment distributed</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-gray-300 rounded-full" />
                        <span>Tasks assigned</span>
                      </div>
                    </div>
                    <Button className="w-full mt-4 bg-[#10B981] hover:bg-[#059669]">
                      Mark Request as Resolved
                    </Button>
                  </div>
                </>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
