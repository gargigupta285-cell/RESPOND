import { useState } from 'react';
import { PersonalInformation } from './volunteer-onboarding/PersonalInformation';
import { SkillsCertifications } from './volunteer-onboarding/SkillsCertifications';
import { VerificationDocuments } from './volunteer-onboarding/VerificationDocuments';
import { AvailabilitySettings } from './volunteer-onboarding/AvailabilitySettings';
import { ReviewConfirmation } from './volunteer-onboarding/ReviewConfirmation';
import { VerificationPending } from './volunteer-onboarding/VerificationPending';
import { api, ApiError } from '../config/api';

interface VolunteerOnboardingProps {
  onComplete: () => void;
  onBack: () => void;
}

export function VolunteerOnboarding({ onComplete, onBack }: VolunteerOnboardingProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    personalInfo: {},
    skills: {},
    verification: {},
    availability: {},
  });

  const handleNext = async (stepData: any) => {
    const stepKeys = ['personalInfo', 'skills', 'verification', 'availability', 'review'];
    const currentKey = stepKeys[currentStep - 1];

    console.log(`Step ${currentStep} (${currentKey}) submitted with data:`, stepData);
    console.log('Current formData before update:', formData);

    const updatedFormData = {
      ...formData,
      [currentKey]: stepData,
    };

    console.log('Updated formData after merging:', updatedFormData);

    setFormData(updatedFormData);

    // If we're on the review step (step 5), submit to backend before proceeding
    if (currentStep === 5) {
      setIsSubmitting(true);
      setSubmitError(null);

      console.log('Submitting to backend with data:', {
        personalInfo: updatedFormData.personalInfo,
        skills: updatedFormData.skills,
        verification: updatedFormData.verification,
        availability: updatedFormData.availability,
      });

      try {
        await api.volunteerRegister({
          personalInfo: updatedFormData.personalInfo,
          skills: updatedFormData.skills,
          verification: updatedFormData.verification,
          availability: updatedFormData.availability,
        });

        // Success - move to verification pending screen
        setCurrentStep(6);
      } catch (error) {
        if (error instanceof ApiError) {
          setSubmitError(error.message);
        } else {
          setSubmitError('Failed to submit registration. Please try again.');
        }
        console.error('Registration error:', error);
      } finally {
        setIsSubmitting(false);
      }
    } else {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    setSubmitError(null);
    if (currentStep === 1) {
      onBack();
    } else {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleEdit = (step: number) => {
    setSubmitError(null);
    setCurrentStep(step);
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <PersonalInformation onNext={handleNext} onBack={handleBack} />;
      case 2:
        return <SkillsCertifications onNext={handleNext} onBack={handleBack} />;
      case 3:
        return <VerificationDocuments onNext={handleNext} onBack={handleBack} />;
      case 4:
        return <AvailabilitySettings onNext={handleNext} onBack={handleBack} />;
      case 5:
        return (
          <>
            {submitError && (
              <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 bg-red-100 border border-red-400 text-red-700 px-6 py-3 rounded-lg shadow-lg">
                <div className="flex items-center gap-2">
                  <span className="font-medium">Error:</span>
                  <span>{submitError}</span>
                  <button
                    onClick={() => setSubmitError(null)}
                    className="ml-4 text-red-700 hover:text-red-900"
                  >
                    ×
                  </button>
                </div>
              </div>
            )}
            {isSubmitting && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                <div className="bg-white rounded-xl p-6 text-center">
                  <div className="w-12 h-12 border-4 border-[#1E3A8A] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                  <p className="text-gray-700">Submitting your registration...</p>
                </div>
              </div>
            )}
            <ReviewConfirmation
              onNext={handleNext}
              onBack={handleBack}
              onEdit={handleEdit}
              data={formData}
            />
          </>
        );
      case 6:
        return <VerificationPending onGoToDashboard={onComplete} />;
      default:
        return <PersonalInformation onNext={handleNext} onBack={handleBack} />;
    }
  };

  return <div>{renderStep()}</div>;
}
