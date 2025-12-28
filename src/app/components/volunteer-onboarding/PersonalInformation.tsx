import { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { ProgressSteps } from '../ui/progress-steps';
import { FileUpload } from '../ui/file-upload';
import { Camera, MapPin } from 'lucide-react';

interface PersonalInformationProps {
  onNext: (data: any) => void;
  onBack: () => void;
}

const ONBOARDING_STEPS = [
  'Personal Info',
  'Skills',
  'Verification',
  'Availability',
  'Review',
];

export function PersonalInformation({ onNext, onBack }: PersonalInformationProps) {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    city: '',
    state: '',
    pincode: '',
    emergencyContactName: '',
    emergencyContactPhone: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNext(formData);
  };

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-6">
        <ProgressSteps currentStep={1} totalSteps={5} steps={ONBOARDING_STEPS} />

        <div className="bg-white rounded-xl p-8 border border-gray-200">
          <h2 className="mb-2">Personal Information</h2>
          <p className="text-gray-600 mb-8">
            Let's start with your basic details. All information is kept secure and confidential.
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Profile Photo */}
            <div>
              <Label>Profile Photo</Label>
              <div className="mt-2 flex items-center gap-4">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center border-2 border-gray-300">
                  <Camera className="w-8 h-8 text-gray-400" />
                </div>
                <div>
                  <FileUpload
                    accept="image/*"
                    maxSize={5}
                    label=""
                    helper="JPG, PNG or GIF. Max 5MB"
                  />
                </div>
              </div>
            </div>

            {/* Full Name */}
            <div>
              <Label htmlFor="fullName">Full Name *</Label>
              <Input
                id="fullName"
                type="text"
                placeholder="Enter your full name as per ID"
                value={formData.fullName}
                onChange={(e) => handleChange('fullName', e.target.value)}
                required
                className="mt-2"
              />
            </div>

            {/* Contact Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="email">Email Address *</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  required
                  className="mt-2"
                />
              </div>
              <div>
                <Label htmlFor="phone">Phone Number *</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+91 XXXXX XXXXX"
                  value={formData.phone}
                  onChange={(e) => handleChange('phone', e.target.value)}
                  required
                  className="mt-2"
                />
              </div>
            </div>

            {/* Date of Birth */}
            <div>
              <Label htmlFor="dob">Date of Birth *</Label>
              <Input
                id="dob"
                type="date"
                value={formData.dateOfBirth}
                onChange={(e) => handleChange('dateOfBirth', e.target.value)}
                required
                className="mt-2"
              />
            </div>

            {/* Location */}
            <div>
              <Label className="mb-2 flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                Location
              </Label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Input
                  placeholder="City"
                  value={formData.city}
                  onChange={(e) => handleChange('city', e.target.value)}
                  required
                />
                <Input
                  placeholder="State"
                  value={formData.state}
                  onChange={(e) => handleChange('state', e.target.value)}
                  required
                />
                <Input
                  placeholder="PIN Code"
                  value={formData.pincode}
                  onChange={(e) => handleChange('pincode', e.target.value)}
                  required
                  maxLength={6}
                />
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="mt-3"
              >
                <MapPin className="w-4 h-4 mr-2" />
                Use Current Location
              </Button>
            </div>

            {/* Emergency Contact */}
            <div className="border-t border-gray-200 pt-6">
              <h4 className="mb-4">Emergency Contact</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="emergencyName">Contact Name *</Label>
                  <Input
                    id="emergencyName"
                    type="text"
                    placeholder="Emergency contact name"
                    value={formData.emergencyContactName}
                    onChange={(e) => handleChange('emergencyContactName', e.target.value)}
                    required
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label htmlFor="emergencyPhone">Contact Phone *</Label>
                  <Input
                    id="emergencyPhone"
                    type="tel"
                    placeholder="+91 XXXXX XXXXX"
                    value={formData.emergencyContactPhone}
                    onChange={(e) => handleChange('emergencyContactPhone', e.target.value)}
                    required
                    className="mt-2"
                  />
                </div>
              </div>
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-between pt-6 border-t border-gray-200">
              <Button
                type="button"
                variant="outline"
                onClick={onBack}
              >
                Back
              </Button>
              <Button
                type="submit"
                className="bg-[#1E3A8A] hover:bg-[#1E40AF]"
              >
                Continue
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
