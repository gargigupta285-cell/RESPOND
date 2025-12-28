import { useState } from 'react';
import { PersonalInformation } from './volunteer-onboarding/PersonalInformation';
import { SkillsCertifications } from './volunteer-onboarding/SkillsCertifications';
import { VerificationDocuments } from './volunteer-onboarding/VerificationDocuments';
import { AvailabilitySettings } from './volunteer-onboarding/AvailabilitySettings';
import { ReviewConfirmation } from './volunteer-onboarding/ReviewConfirmation';
import { VerificationPending } from './volunteer-onboarding/VerificationPending';

interface VolunteerOnboardingProps {
  onComplete: () => void;
  onBack: () => void;
}

export function VolunteerOnboarding({ onComplete, onBack }: VolunteerOnboardingProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    personalInfo: {},
    skills: {},
    verification: {},
    availability: {},
  });

  const handleNext = (stepData: any) => {
    const stepKeys = ['personalInfo', 'skills', 'verification', 'availability', 'review'];
    const currentKey = stepKeys[currentStep - 1];
    
    setFormData((prev) => ({
      ...prev,
      [currentKey]: stepData,
    }));

    setCurrentStep((prev) => prev + 1);
  };

  const handleBack = () => {
    if (currentStep === 1) {
      onBack();
    } else {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleEdit = (step: number) => {
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
          <ReviewConfirmation
            onNext={handleNext}
            onBack={handleBack}
            onEdit={handleEdit}
            data={formData}
          />
        );
      case 6:
        return <VerificationPending onGoToDashboard={onComplete} />;
      default:
        return <PersonalInformation onNext={handleNext} onBack={handleBack} />;
    }
  };

  return <div>{renderStep()}</div>;
}
