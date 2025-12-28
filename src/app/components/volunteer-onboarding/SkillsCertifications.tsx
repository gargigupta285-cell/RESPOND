import { useState } from 'react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { ProgressSteps } from '../ui/progress-steps';
import { FileUpload } from '../ui/file-upload';
import { Slider } from '../ui/slider';
import {
  Stethoscope,
  Truck,
  Wrench,
  Users,
  Waves,
  Check,
} from 'lucide-react';

interface SkillsCertificationsProps {
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

const SKILL_CATEGORIES = [
  {
    category: 'Medical',
    icon: Stethoscope,
    color: 'bg-red-100 text-red-700 border-red-200',
    skills: ['Doctor', 'Nurse', 'Paramedic', 'First Aid', 'Pharmacist'],
  },
  {
    category: 'Logistics',
    icon: Truck,
    color: 'bg-blue-100 text-blue-700 border-blue-200',
    skills: ['Driver', 'Warehouse Manager', 'Distribution', 'Supply Chain'],
  },
  {
    category: 'Technical',
    icon: Wrench,
    color: 'bg-purple-100 text-purple-700 border-purple-200',
    skills: ['IT Support', 'Communications', 'Engineering', 'Electrician'],
  },
  {
    category: 'Community',
    icon: Users,
    color: 'bg-green-100 text-green-700 border-green-200',
    skills: ['Counseling', 'Translation', 'Teaching', 'Social Work'],
  },
  {
    category: 'Search & Rescue',
    icon: Waves,
    color: 'bg-orange-100 text-orange-700 border-orange-200',
    skills: ['Boat Operation', 'Climbing', 'Swimming', 'Rescue Training'],
  },
];

export function SkillsCertifications({ onNext, onBack }: SkillsCertificationsProps) {
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [experience, setExperience] = useState<{ [key: string]: number }>({});
  const [licenseNumber, setLicenseNumber] = useState('');

  const toggleSkill = (skill: string) => {
    setSelectedSkills((prev) =>
      prev.includes(skill)
        ? prev.filter((s) => s !== skill)
        : [...prev, skill]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNext({ selectedSkills, experience, licenseNumber });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-6">
        <ProgressSteps currentStep={2} totalSteps={5} steps={ONBOARDING_STEPS} />

        <div className="bg-white rounded-xl p-8 border border-gray-200">
          <h2 className="mb-2">Skills & Certifications</h2>
          <p className="text-gray-600 mb-8">
            Select your skills and upload relevant certifications. This helps us match you with the right opportunities.
          </p>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Skill Categories */}
            <div>
              <h4 className="mb-4">Select Your Skills</h4>
              <div className="space-y-6">
                {SKILL_CATEGORIES.map((category) => {
                  const IconComponent = category.icon;
                  return (
                    <div key={category.category} className="border border-gray-200 rounded-xl p-6">
                      <div className="flex items-center gap-3 mb-4">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${category.color}`}>
                          <IconComponent className="w-5 h-5" />
                        </div>
                        <h5>{category.category}</h5>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {category.skills.map((skill) => {
                          const isSelected = selectedSkills.includes(skill);
                          return (
                            <button
                              key={skill}
                              type="button"
                              onClick={() => toggleSkill(skill)}
                              className={`px-4 py-2 rounded-lg border-2 transition-all ${
                                isSelected
                                  ? 'bg-[#1E3A8A] border-[#1E3A8A] text-white'
                                  : 'bg-white border-gray-300 text-gray-700 hover:border-[#1E3A8A]'
                              }`}
                            >
                              {isSelected && <Check className="w-4 h-4 inline mr-2" />}
                              {skill}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Experience Level for Selected Skills */}
            {selectedSkills.length > 0 && (
              <div className="border border-gray-200 rounded-xl p-6 bg-blue-50">
                <h4 className="mb-4">Years of Experience</h4>
                <div className="space-y-6">
                  {selectedSkills.map((skill) => (
                    <div key={skill}>
                      <div className="flex items-center justify-between mb-2">
                        <label className="text-sm">{skill}</label>
                        <span className="text-sm text-gray-600">
                          {experience[skill] || 0} years
                        </span>
                      </div>
                      <Slider
                        value={[experience[skill] || 0]}
                        onValueChange={(value) =>
                          setExperience((prev) => ({ ...prev, [skill]: value[0] }))
                        }
                        max={20}
                        step={1}
                        className="w-full"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Professional License */}
            <div>
              <h4 className="mb-2">Professional License (Optional)</h4>
              <p className="text-sm text-gray-600 mb-4">
                If you have a professional license (Medical, Driving, etc.), please enter the number
              </p>
              <input
                type="text"
                placeholder="License Number"
                value={licenseNumber}
                onChange={(e) => setLicenseNumber(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E3A8A]"
              />
            </div>

            {/* Certificate Upload */}
            <div>
              <FileUpload
                accept=".pdf,.jpg,.jpeg,.png"
                maxSize={10}
                multiple
                label="Upload Certifications"
                helper="PDF, JPG, or PNG. Max 10MB per file. You can upload multiple certificates."
              />
              <p className="text-xs text-gray-500 mt-2">
                🔒 All documents are encrypted with 256-bit encryption
              </p>
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
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-600">
                  {selectedSkills.length} skill{selectedSkills.length !== 1 ? 's' : ''} selected
                </span>
                <Button
                  type="submit"
                  className="bg-[#1E3A8A] hover:bg-[#1E40AF]"
                  disabled={selectedSkills.length === 0}
                >
                  Continue
                </Button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
