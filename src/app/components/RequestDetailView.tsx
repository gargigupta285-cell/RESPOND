import { useState } from 'react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Progress } from './ui/progress';
import {
  X,
  MapPin,
  Clock,
  Users,
  CheckCircle,
  Bookmark,
  Share2,
  Flag,
  Navigation,
  Shield,
  AlertCircle,
  Calendar,
  Star,
  ChevronDown,
  Heart,
  Image as ImageIcon,
} from 'lucide-react';

interface RequestDetailViewProps {
  onClose: () => void;
  onAccept: () => void;
}

export function RequestDetailView({ onClose, onAccept }: RequestDetailViewProps) {
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const request = {
    id: 1,
    title: 'Medical Camp Setup - Urgent Medical Professionals Needed',
    organization: {
      name: 'Kerala State Disaster Management',
      rating: 4.8,
      totalRequests: 124,
      avgResponseTime: '4 min',
      verified: true,
    },
    urgency: 'high',
    type: 'Medical Emergency',
    location: 'Kochi, Kerala',
    distance: '2.3 km',
    address: 'Community Health Center, MG Road, Kochi, Kerala 682016',
    postedTime: '2 hours ago',
    deadline: 'Dec 30, 2025 - 6:00 PM',
    duration: '4-6 hours',
    volunteers: {
      needed: 10,
      matched: 7,
      confirmed: 5,
    },
    requiredSkills: [
      { name: 'Medical', matched: true },
      { name: 'Doctor', matched: true },
      { name: 'Emergency Care', matched: false },
      { name: 'First Aid', matched: true },
    ],
    description: `We are organizing an emergency medical camp in response to the recent flooding in Kochi. We need experienced medical professionals to provide immediate care and health screening to affected families.

The camp will provide:
- Basic health checkups
- Emergency medical care
- Medication distribution
- Health education and counseling

This is an urgent requirement as many families have been displaced and need immediate medical attention. The camp will run from 2 PM to 8 PM.`,
    photos: [
      'Medical Camp Site',
      'Previous Camp',
      'Equipment Available',
    ],
    meetingPoint: {
      address: 'Community Health Center, MG Road, Kochi',
      parking: true,
      publicTransport: true,
    },
    safety: [
      'PPE kits will be provided',
      'Insurance coverage included',
      'Emergency contacts on-site',
      'Sanitization facilities available',
    ],
    faq: [
      {
        question: 'What should I bring?',
        answer: 'Please bring your medical license, ID proof, and any personal medical equipment you prefer. PPE will be provided.',
      },
      {
        question: 'Is transportation provided?',
        answer: 'Transportation can be arranged if needed. Please indicate your requirement when accepting the task.',
      },
      {
        question: 'Will meals be provided?',
        answer: 'Yes, lunch and refreshments will be provided to all volunteers.',
      },
    ],
  };

  const timeUntilDeadline = '4 hours 23 minutes';

  return (
    <div className="fixed inset-0 bg-black/50 z-50 overflow-y-auto">
      <div className="min-h-screen px-4 py-8">
        <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-2xl">
          {/* Header */}
          <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 rounded-t-xl flex items-center justify-between z-10">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="hover:bg-gray-100"
              >
                <X className="w-5 h-5" />
              </Button>
              <h3>Request Details</h3>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsSaved(!isSaved)}
              >
                <Bookmark className={`w-5 h-5 ${isSaved ? 'fill-current text-[#F59E0B]' : ''}`} />
              </Button>
              <Button variant="ghost" size="sm">
                <Share2 className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="sm" className="text-red-600">
                <Flag className="w-5 h-5" />
              </Button>
            </div>
          </div>

          <div className="p-6 space-y-6">
            {/* Hero Section */}
            <div>
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <Badge className="bg-red-500 text-white border-0 animate-pulse">
                      URGENT
                    </Badge>
                    <Badge variant="outline" className="bg-blue-100 text-blue-700 border-blue-200">
                      {request.type}
                    </Badge>
                  </div>
                  <h2 className="mb-3">{request.title}</h2>
                  
                  {/* Organization */}
                  <div className="flex items-center gap-3 mb-4">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className="bg-[#1E3A8A] text-white">
                        KS
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="flex items-center gap-2">
                        <span>{request.organization.name}</span>
                        {request.organization.verified && (
                          <CheckCircle className="w-4 h-4 text-[#10B981]" />
                        )}
                      </div>
                      <div className="flex items-center gap-3 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <Star className="w-3 h-3 fill-current text-yellow-500" />
                          <span>{request.organization.rating}</span>
                        </div>
                        <span>•</span>
                        <span>{request.organization.totalRequests} requests posted</span>
                        <span>•</span>
                        <span>{request.organization.avgResponseTime} avg response</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Deadline Countdown */}
              <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <AlertCircle className="w-5 h-5 text-red-600" />
                  <div>
                    <h5 className="text-red-900">Deadline Approaching</h5>
                    <p className="text-sm text-red-700">
                      {timeUntilDeadline} remaining until {request.deadline}
                    </p>
                  </div>
                </div>
                <Clock className="w-8 h-8 text-red-600 animate-pulse" />
              </div>
            </div>

            {/* Key Information Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="border border-gray-200 rounded-xl p-4">
                <div className="flex items-center gap-2 text-gray-600 mb-1">
                  <MapPin className="w-4 h-4" />
                  <span className="text-sm">Location</span>
                </div>
                <p className="text-sm">{request.location}</p>
                <p className="text-xs text-[#10B981] mt-1">{request.distance} away</p>
              </div>
              
              <div className="border border-gray-200 rounded-xl p-4">
                <div className="flex items-center gap-2 text-gray-600 mb-1">
                  <Clock className="w-4 h-4" />
                  <span className="text-sm">Duration</span>
                </div>
                <p className="text-sm">{request.duration}</p>
                <p className="text-xs text-gray-500 mt-1">Posted {request.postedTime}</p>
              </div>
              
              <div className="border border-gray-200 rounded-xl p-4">
                <div className="flex items-center gap-2 text-gray-600 mb-1">
                  <Users className="w-4 h-4" />
                  <span className="text-sm">Volunteers</span>
                </div>
                <p className="text-sm">{request.volunteers.confirmed}/{request.volunteers.needed} confirmed</p>
                <Progress 
                  value={(request.volunteers.confirmed / request.volunteers.needed) * 100} 
                  className="h-1 mt-2"
                />
              </div>
            </div>

            {/* Required Skills */}
            <div>
              <h4 className="mb-3">Required Skills</h4>
              <div className="flex flex-wrap gap-2">
                {request.requiredSkills.map((skill) => (
                  <Badge
                    key={skill.name}
                    variant="outline"
                    className={
                      skill.matched
                        ? 'bg-green-100 text-green-700 border-green-200'
                        : 'bg-gray-100 text-gray-600 border-gray-200'
                    }
                  >
                    {skill.matched && <CheckCircle className="w-3 h-3 mr-1" />}
                    {skill.name}
                  </Badge>
                ))}
              </div>
              <p className="text-sm text-gray-600 mt-2">
                ✓ You have {request.requiredSkills.filter((s) => s.matched).length} of {request.requiredSkills.length} required skills
              </p>
            </div>

            {/* Description */}
            <div>
              <h4 className="mb-3">Detailed Description</h4>
              <div className={`text-gray-700 whitespace-pre-line ${!showFullDescription ? 'line-clamp-4' : ''}`}>
                {request.description}
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowFullDescription(!showFullDescription)}
                className="mt-2 text-[#1E3A8A]"
              >
                {showFullDescription ? 'Show Less' : 'Read More'}
                <ChevronDown className={`w-4 h-4 ml-1 transition-transform ${showFullDescription ? 'rotate-180' : ''}`} />
              </Button>
            </div>

            {/* Photos */}
            <div>
              <h4 className="mb-3">Photos</h4>
              <div className="grid grid-cols-3 gap-3">
                {request.photos.map((photo, index) => (
                  <div
                    key={index}
                    className="aspect-video bg-gray-100 rounded-lg border border-gray-200 flex items-center justify-center"
                  >
                    <ImageIcon className="w-8 h-8 text-gray-400" />
                  </div>
                ))}
              </div>
            </div>

            {/* Meeting Point */}
            <div>
              <h4 className="mb-3 flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                Meeting Point
              </h4>
              <div className="border border-gray-200 rounded-xl p-4">
                <p className="mb-3">{request.meetingPoint.address}</p>
                <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-4">
                  {request.meetingPoint.parking && (
                    <div className="flex items-center gap-1">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span>Parking Available</span>
                    </div>
                  )}
                  {request.meetingPoint.publicTransport && (
                    <div className="flex items-center gap-1">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span>Public Transport Access</span>
                    </div>
                  )}
                </div>
                <Button variant="outline" size="sm" className="w-full">
                  <Navigation className="w-4 h-4 mr-2" />
                  Get Directions
                </Button>
              </div>
            </div>

            {/* Safety Information */}
            <div>
              <h4 className="mb-3 flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Safety & Equipment
              </h4>
              <div className="space-y-2">
                {request.safety.map((item, index) => (
                  <div key={index} className="flex items-center gap-2 text-sm">
                    <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* FAQ */}
            <div>
              <h4 className="mb-3">Frequently Asked Questions</h4>
              <div className="space-y-3">
                {request.faq.map((item, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <h5 className="mb-2">{item.question}</h5>
                    <p className="text-sm text-gray-600">{item.answer}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Similar Completed Tasks */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <Heart className="w-5 h-5 text-blue-600" />
                <h5 className="text-blue-900">Your Impact</h5>
              </div>
              <p className="text-sm text-blue-700">
                You've completed 3 similar medical emergency tasks with an average rating of 4.9 ⭐
              </p>
            </div>
          </div>

          {/* Sticky Footer Actions */}
          <div className="sticky bottom-0 bg-white border-t border-gray-200 px-6 py-4 rounded-b-xl">
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                className="flex-1"
                onClick={onClose}
              >
                Close
              </Button>
              <Button
                className="flex-1 bg-[#10B981] hover:bg-[#059669]"
                onClick={onAccept}
              >
                <CheckCircle className="w-5 h-5 mr-2" />
                Accept Task
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
