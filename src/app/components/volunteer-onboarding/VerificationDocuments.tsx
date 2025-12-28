import { useState } from 'react';
import { Button } from '../ui/button';
import { ProgressSteps } from '../ui/progress-steps';
import { FileUpload } from '../ui/file-upload';
import { Shield, Camera, CheckCircle, AlertCircle } from 'lucide-react';
import { Badge } from '../ui/badge';

interface VerificationDocumentsProps {
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

const DOCUMENT_TYPES = [
  { value: 'aadhaar', label: 'Aadhaar Card', recommended: true },
  { value: 'pan', label: 'PAN Card' },
  { value: 'driving', label: 'Driving License' },
  { value: 'passport', label: 'Passport' },
  { value: 'voter', label: 'Voter ID' },
];

export function VerificationDocuments({ onNext, onBack }: VerificationDocumentsProps) {
  const [documentType, setDocumentType] = useState('aadhaar');
  const [frontUploaded, setFrontUploaded] = useState(false);
  const [backUploaded, setBackUploaded] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNext({ documentType, frontUploaded, backUploaded });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-6">
        <ProgressSteps currentStep={3} totalSteps={5} steps={ONBOARDING_STEPS} />

        <div className="bg-white rounded-xl p-8 border border-gray-200">
          <div className="flex items-center gap-3 mb-2">
            <Shield className="w-6 h-6 text-[#10B981]" />
            <h2>Verification Documents</h2>
          </div>
          <p className="text-gray-600 mb-8">
            Upload a government-issued ID for verification. This builds trust in our community.
          </p>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Security Badge */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-start gap-3">
              <Shield className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <h5 className="text-blue-900 mb-1">256-bit Encrypted Upload</h5>
                <p className="text-sm text-blue-700">
                  Your documents are encrypted and stored securely. We never share your personal information without consent.
                </p>
              </div>
            </div>

            {/* Document Type Selection */}
            <div>
              <label className="block mb-3">Select Document Type *</label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {DOCUMENT_TYPES.map((doc) => (
                  <button
                    key={doc.value}
                    type="button"
                    onClick={() => setDocumentType(doc.value)}
                    className={`p-4 rounded-lg border-2 text-left transition-all ${
                      documentType === doc.value
                        ? 'border-[#1E3A8A] bg-blue-50'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span>{doc.label}</span>
                      {doc.recommended && (
                        <Badge variant="outline" className="bg-green-100 text-green-700 border-green-200 text-xs">
                          Recommended
                        </Badge>
                      )}
                      {documentType === doc.value && (
                        <CheckCircle className="w-5 h-5 text-[#1E3A8A]" />
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Upload Instructions */}
            <div className="border border-gray-200 rounded-xl p-6 bg-gray-50">
              <h4 className="mb-4">Upload Guidelines</h4>
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Ensure all text is clearly visible and readable</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>No glare or shadows on the document</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>All four corners of the document should be visible</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>File format: JPG, PNG, or PDF</span>
                </div>
              </div>
            </div>

            {/* Front Side Upload */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <label>Document Front Side *</label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                >
                  <Camera className="w-4 h-4 mr-2" />
                  Take Photo
                </Button>
              </div>
              <FileUpload
                accept="image/*,.pdf"
                maxSize={10}
                onFilesChange={(files) => setFrontUploaded(files.length > 0)}
              />
              {frontUploaded && (
                <div className="flex items-center gap-2 mt-2 text-sm text-green-600">
                  <CheckCircle className="w-4 h-4" />
                  <span>Front side uploaded successfully</span>
                </div>
              )}
            </div>

            {/* Back Side Upload */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <label>Document Back Side *</label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                >
                  <Camera className="w-4 h-4 mr-2" />
                  Take Photo
                </Button>
              </div>
              <FileUpload
                accept="image/*,.pdf"
                maxSize={10}
                onFilesChange={(files) => setBackUploaded(files.length > 0)}
              />
              {backUploaded && (
                <div className="flex items-center gap-2 mt-2 text-sm text-green-600">
                  <CheckCircle className="w-4 h-4" />
                  <span>Back side uploaded successfully</span>
                </div>
              )}
            </div>

            {/* Real-time Validation Feedback */}
            {frontUploaded && backUploaded && (
              <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h5 className="text-green-900 mb-1">Documents Uploaded Successfully</h5>
                  <p className="text-sm text-green-700">
                    Your documents will be reviewed within 24-48 hours. You'll receive a notification once verified.
                  </p>
                </div>
              </div>
            )}

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
                disabled={!frontUploaded || !backUploaded}
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
