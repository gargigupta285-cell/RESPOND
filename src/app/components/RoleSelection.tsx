import { useState } from 'react';
import { Button } from './ui/button';
import { Building2, HandHeart, ArrowRight } from 'lucide-react';

interface RoleSelectionProps {
  onSelectVolunteer: () => void;
  onSelectRequester: () => void;
}

export function RoleSelection({ onSelectVolunteer, onSelectRequester }: RoleSelectionProps) {
  const [selectedRole, setSelectedRole] = useState<'volunteer' | 'requester' | null>(null);

  const handleContinue = () => {
    if (selectedRole === 'volunteer') {
      onSelectVolunteer();
    } else if (selectedRole === 'requester') {
      onSelectRequester();
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-6 py-12">
      <div className="max-w-5xl w-full">
        <div className="text-center mb-12">
          <h1 className="mb-4">Choose Your Role</h1>
          <p className="text-gray-600">Select how you want to use RESPOND today</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {/* Requester Card */}
          <button
            onClick={() => setSelectedRole('requester')}
            className={`group relative bg-white rounded-2xl p-8 border-2 transition-all hover:scale-[1.02] ${
              selectedRole === 'requester'
                ? 'border-[#1E3A8A] shadow-2xl shadow-[#1E3A8A]/20'
                : 'border-gray-200 hover:border-[#1E3A8A]/50 hover:shadow-xl'
            }`}
          >
            {selectedRole === 'requester' && (
              <div className="absolute top-4 right-4 w-6 h-6 bg-[#1E3A8A] rounded-full flex items-center justify-center">
                <div className="w-2 h-2 bg-white rounded-full" />
              </div>
            )}
            
            <div className="w-20 h-20 bg-gradient-to-br from-[#1E3A8A] to-[#3B82F6] rounded-2xl flex items-center justify-center mb-6 mx-auto group-hover:scale-110 transition-transform">
              <Building2 className="w-10 h-10 text-white" />
            </div>
            
            <h3 className="mb-3 text-[#1E3A8A]">I Need Volunteers</h3>
            <p className="text-gray-600 mb-4">
              Post emergency volunteer needs for your NGO, government agency, or verified organization.
            </p>
            
            <ul className="space-y-2 text-sm text-left">
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-[#1E3A8A] rounded-full" />
                <span>Post verified emergency requests</span>
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-[#1E3A8A] rounded-full" />
                <span>Get matched with qualified volunteers</span>
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-[#1E3A8A] rounded-full" />
                <span>Track and coordinate relief efforts</span>
              </li>
            </ul>
          </button>

          {/* Volunteer Card */}
          <button
            onClick={() => setSelectedRole('volunteer')}
            className={`group relative bg-white rounded-2xl p-8 border-2 transition-all hover:scale-[1.02] ${
              selectedRole === 'volunteer'
                ? 'border-[#10B981] shadow-2xl shadow-[#10B981]/20'
                : 'border-gray-200 hover:border-[#10B981]/50 hover:shadow-xl'
            }`}
          >
            {selectedRole === 'volunteer' && (
              <div className="absolute top-4 right-4 w-6 h-6 bg-[#10B981] rounded-full flex items-center justify-center">
                <div className="w-2 h-2 bg-white rounded-full" />
              </div>
            )}
            
            <div className="w-20 h-20 bg-gradient-to-br from-[#10B981] to-[#34D399] rounded-2xl flex items-center justify-center mb-6 mx-auto group-hover:scale-110 transition-transform">
              <HandHeart className="w-10 h-10 text-white" />
            </div>
            
            <h3 className="mb-3 text-[#10B981]">I Want to Volunteer</h3>
            <p className="text-gray-600 mb-4">
              Use your skills to help during emergencies. Connect with verified needs in your area.
            </p>
            
            <ul className="space-y-2 text-sm text-left">
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-[#10B981] rounded-full" />
                <span>Browse nearby emergency requests</span>
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-[#10B981] rounded-full" />
                <span>Match your skills with needs</span>
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-[#10B981] rounded-full" />
                <span>Build your verified volunteer profile</span>
              </li>
            </ul>
          </button>
        </div>

        {/* Continue Button */}
        {selectedRole && (
          <div className="text-center">
            <Button
              onClick={handleContinue}
              className={`px-8 py-6 h-auto ${
                selectedRole === 'volunteer'
                  ? 'bg-[#10B981] hover:bg-[#059669]'
                  : 'bg-[#1E3A8A] hover:bg-[#1E40AF]'
              }`}
            >
              Continue
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
