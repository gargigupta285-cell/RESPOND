import { Check } from 'lucide-react';

interface ProgressStepsProps {
  currentStep: number;
  totalSteps: number;
  steps: string[];
}

export function ProgressSteps({ currentStep, totalSteps, steps }: ProgressStepsProps) {
  return (
    <div className="w-full mb-8">
      <div className="flex items-center justify-between mb-2">
        {steps.map((step, index) => (
          <div key={index} className="flex items-center flex-1">
            <div className="flex flex-col items-center flex-1">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all ${
                  index + 1 < currentStep
                    ? 'bg-[#10B981] border-[#10B981] text-white'
                    : index + 1 === currentStep
                    ? 'bg-[#1E3A8A] border-[#1E3A8A] text-white'
                    : 'bg-white border-gray-300 text-gray-400'
                }`}
              >
                {index + 1 < currentStep ? (
                  <Check className="w-5 h-5" />
                ) : (
                  <span>{index + 1}</span>
                )}
              </div>
              <span
                className={`text-xs mt-2 text-center hidden md:block ${
                  index + 1 <= currentStep ? 'text-gray-900' : 'text-gray-400'
                }`}
              >
                {step}
              </span>
            </div>
            {index < steps.length - 1 && (
              <div
                className={`h-0.5 flex-1 mx-2 transition-all ${
                  index + 1 < currentStep ? 'bg-[#10B981]' : 'bg-gray-300'
                }`}
              />
            )}
          </div>
        ))}
      </div>
      <div className="text-center text-sm text-gray-600 md:hidden mt-4">
        Step {currentStep} of {totalSteps}: {steps[currentStep - 1]}
      </div>
    </div>
  );
}
