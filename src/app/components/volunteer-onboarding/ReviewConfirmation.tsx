import { Button } from '../ui/button';
import { ProgressSteps } from '../ui/progress-steps';
import { Badge } from '../ui/badge';
import { Checkbox } from '../ui/checkbox';
import { Label } from '../ui/label';
import { useState } from 'react';
import {
  User,
  Award,
  Shield,
  Calendar,
  Edit,
  CheckCircle,
  FileText,
} from 'lucide-react';

interface ReviewConfirmationProps {
  onNext: (data: any) => void;
  onBack: () => void;
  onEdit: (step: number) => void;
  data: any;
}

const ONBOARDING_STEPS = [
  'Personal Info',
  'Skills',
  'Verification',
  'Availability',
  'Review',
];

export function ReviewConfirmation({ onNext, onBack, onEdit, data }: ReviewConfirmationProps) {
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [codeOfConductAccepted, setCodeOfConductAccepted] = useState(false);
  const [backgroundCheckConsent, setBackgroundCheckConsent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (termsAccepted && codeOfConductAccepted && backgroundCheckConsent) {
      onNext({ termsAccepted, codeOfConductAccepted, backgroundCheckConsent });
    }
  };

  const canSubmit = termsAccepted && codeOfConductAccepted && backgroundCheckConsent;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-6">
        <ProgressSteps currentStep={5} totalSteps={5} steps={ONBOARDING_STEPS} />

        <div className="bg-white rounded-xl p-8 border border-gray-200">
          <h2 className="mb-2">Review & Confirmation</h2>
          <p className="text-gray-600 mb-8">
            Please review your information before submitting. You can edit any section if needed.
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Personal Information Summary */}
            <div className="border border-gray-200 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <User className="w-5 h-5 text-[#1E3A8A]" />
                  <h4>Personal Information</h4>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => onEdit(1)}
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Edit
                </Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Full Name:</span>
                  <p>{data.personalInfo?.fullName || 'Not provided'}</p>
                </div>
                <div>
                  <span className="text-gray-600">Email:</span>
                  <p>{data.personalInfo?.email || 'Not provided'}</p>
                </div>
                <div>
                  <span className="text-gray-600">Phone:</span>
                  <p>{data.personalInfo?.phone || 'Not provided'}</p>
                </div>
                <div>
                  <span className="text-gray-600">Location:</span>
                  <p>
                    {data.personalInfo?.city || 'Not provided'}, {data.personalInfo?.state || ''}
                  </p>
                </div>
              </div>
            </div>

            {/* Skills Summary */}
            <div className="border border-gray-200 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <Award className="w-5 h-5 text-[#1E3A8A]" />
                  <h4>Skills & Certifications</h4>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => onEdit(2)}
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Edit
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {data.skills?.selectedSkills?.map((skill: string) => (
                  <Badge key={skill} variant="outline" className="bg-blue-100 text-blue-700 border-blue-200">
                    {skill}
                  </Badge>
                )) || <span className="text-gray-500">No skills added</span>}
              </div>
            </div>

            {/* Verification Summary */}
            <div className="border border-gray-200 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <Shield className="w-5 h-5 text-[#1E3A8A]" />
                  <h4>Verification Documents</h4>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => onEdit(3)}
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Edit
                </Button>
              </div>
              <div className="flex items-center gap-2">
                {data.verification?.frontUploaded && data.verification?.backUploaded ? (
                  <>
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span className="text-sm">
                      {data.verification.documentType || 'ID'} uploaded (Front & Back)
                    </span>
                  </>
                ) : (
                  <span className="text-sm text-gray-500">No documents uploaded</span>
                )}
              </div>
            </div>

            {/* Availability Summary */}
            <div className="border border-gray-200 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-[#1E3A8A]" />
                  <h4>Availability Settings</h4>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => onEdit(4)}
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Edit
                </Button>
              </div>
              <div className="space-y-3 text-sm">
                <div>
                  <span className="text-gray-600">Available Days:</span>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {data.availability?.selectedDays?.map((day: string) => (
                      <Badge key={day} variant="outline" className="bg-green-100 text-green-700 border-green-200">
                        {day}
                      </Badge>
                    )) || <span className="text-gray-500">Not set</span>}
                  </div>
                </div>
                <div>
                  <span className="text-gray-600">Maximum Travel Distance:</span>
                  <p>{data.availability?.maxDistance || 0} km</p>
                </div>
              </div>
            </div>

            {/* Terms and Conditions */}
            <div className="border-t border-gray-200 pt-6">
              <h4 className="mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Terms & Agreements
              </h4>
              
              <div className="space-y-4">
                <div className="flex items-start gap-3 p-4 border border-gray-200 rounded-lg">
                  <Checkbox
                    id="terms"
                    checked={termsAccepted}
                    onCheckedChange={(checked) => setTermsAccepted(checked as boolean)}
                  />
                  <div className="flex-1">
                    <Label htmlFor="terms" className="cursor-pointer">
                      I agree to the{' '}
                      <a href="#" className="text-[#1E3A8A] hover:underline">
                        Terms & Conditions
                      </a>
                    </Label>
                    <p className="text-sm text-gray-500 mt-1">
                      By checking this box, you agree to our platform's terms of service and usage policies.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 border border-gray-200 rounded-lg">
                  <Checkbox
                    id="code"
                    checked={codeOfConductAccepted}
                    onCheckedChange={(checked) => setCodeOfConductAccepted(checked as boolean)}
                  />
                  <div className="flex-1">
                    <Label htmlFor="code" className="cursor-pointer">
                      I agree to follow the{' '}
                      <a href="#" className="text-[#1E3A8A] hover:underline">
                        Volunteer Code of Conduct
                      </a>
                    </Label>
                    <p className="text-sm text-gray-500 mt-1">
                      You commit to professional behavior, safety protocols, and respectful conduct.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 border border-gray-200 rounded-lg">
                  <Checkbox
                    id="background"
                    checked={backgroundCheckConsent}
                    onCheckedChange={(checked) => setBackgroundCheckConsent(checked as boolean)}
                  />
                  <div className="flex-1">
                    <Label htmlFor="background" className="cursor-pointer">
                      I consent to a background verification check
                    </Label>
                    <p className="text-sm text-gray-500 mt-1">
                      We'll verify your documents and credentials to ensure community safety.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Estimated Verification Time */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <Shield className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h5 className="text-blue-900 mb-1">What happens next?</h5>
                  <p className="text-sm text-blue-700 mb-2">
                    Your application will be reviewed within <strong>24-48 hours</strong>. 
                    We'll verify your documents and notify you via email and SMS once approved.
                  </p>
                  <p className="text-sm text-blue-700">
                    You'll have limited access to the platform during the verification period.
                  </p>
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
                className="bg-[#10B981] hover:bg-[#059669]"
                disabled={!canSubmit}
              >
                <CheckCircle className="w-5 h-5 mr-2" />
                Submit for Verification
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
