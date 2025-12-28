import { Button } from '../ui/button';
import { CheckCircle, Clock, Shield, FileCheck, HelpCircle } from 'lucide-react';
import { Badge } from '../ui/badge';

interface VerificationPendingProps {
  onGoToDashboard: () => void;
}

export function VerificationPending({ onGoToDashboard }: VerificationPendingProps) {
  const verificationStages = [
    {
      stage: 'Document Review',
      status: 'in-progress',
      icon: FileCheck,
      description: 'Our team is reviewing your uploaded documents',
    },
    {
      stage: 'Background Check',
      status: 'pending',
      icon: Shield,
      description: 'Verification of credentials and references',
    },
    {
      stage: 'Manual Approval',
      status: 'pending',
      icon: CheckCircle,
      description: 'Final review by our verification team',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#10B981] via-[#059669] to-[#047857] flex items-center justify-center px-6 py-12">
      <div className="max-w-2xl w-full">
        {/* Success Animation */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-white rounded-full mb-6 animate-bounce">
            <CheckCircle className="w-12 h-12 text-[#10B981]" />
          </div>
          <h1 className="text-white mb-3">Application Submitted!</h1>
          <p className="text-green-100 text-lg">
            Thank you for joining RESPOND. We're reviewing your application.
          </p>
        </div>

        {/* Verification Timeline */}
        <div className="bg-white rounded-xl p-8 border border-gray-200 mb-6">
          <h3 className="mb-6">Verification Timeline</h3>
          
          <div className="space-y-6">
            {verificationStages.map((stage, index) => {
              const IconComponent = stage.icon;
              return (
                <div key={index} className="flex items-start gap-4">
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center border-2 ${
                        stage.status === 'in-progress'
                          ? 'bg-blue-100 border-blue-500 text-blue-600'
                          : stage.status === 'completed'
                          ? 'bg-green-100 border-green-500 text-green-600'
                          : 'bg-gray-100 border-gray-300 text-gray-400'
                      }`}
                    >
                      {stage.status === 'in-progress' ? (
                        <Clock className="w-6 h-6 animate-pulse" />
                      ) : (
                        <IconComponent className="w-6 h-6" />
                      )}
                    </div>
                    {index < verificationStages.length - 1 && (
                      <div className="w-0.5 h-12 bg-gray-300 my-2" />
                    )}
                  </div>
                  
                  <div className="flex-1 pt-2">
                    <div className="flex items-center gap-2 mb-1">
                      <h5>{stage.stage}</h5>
                      {stage.status === 'in-progress' && (
                        <Badge className="bg-blue-100 text-blue-700 border-blue-200 text-xs">
                          In Progress
                        </Badge>
                      )}
                      {stage.status === 'pending' && (
                        <Badge variant="outline" className="bg-gray-100 text-gray-600 border-gray-200 text-xs">
                          Pending
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-gray-600">{stage.description}</p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-start gap-3">
              <Clock className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <h5 className="text-blue-900 mb-1">Estimated Time: 24-48 Hours</h5>
                <p className="text-sm text-blue-700">
                  We'll send you an email and SMS notification once your verification is complete.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* What Happens Next Card */}
        <div className="bg-white rounded-xl p-8 border border-gray-200 mb-6">
          <h3 className="mb-4">What Happens Next?</h3>
          
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-[#10B981] text-white rounded-full flex items-center justify-center flex-shrink-0 text-sm">
                1
              </div>
              <div>
                <h5 className="mb-1">Document Verification</h5>
                <p className="text-sm text-gray-600">
                  Our team will verify your ID and certifications for authenticity
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-[#10B981] text-white rounded-full flex items-center justify-center flex-shrink-0 text-sm">
                2
              </div>
              <div>
                <h5 className="mb-1">Background Check</h5>
                <p className="text-sm text-gray-600">
                  We'll conduct a basic background verification for community safety
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-[#10B981] text-white rounded-full flex items-center justify-center flex-shrink-0 text-sm">
                3
              </div>
              <div>
                <h5 className="mb-1">Approval & Activation</h5>
                <p className="text-sm text-gray-600">
                  Once approved, you'll get full access to all volunteer opportunities
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Temporary Access Card */}
        <div className="bg-white rounded-xl p-6 border border-gray-200 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h5 className="mb-1">Limited Dashboard Access</h5>
              <p className="text-sm text-gray-600">
                You can explore the platform while we verify your account
              </p>
            </div>
            <Button
              onClick={onGoToDashboard}
              className="bg-[#1E3A8A] hover:bg-[#1E40AF]"
            >
              View Dashboard
            </Button>
          </div>
        </div>

        {/* Contact Support */}
        <div className="text-center">
          <Button
            variant="ghost"
            className="text-white hover:bg-white/10"
          >
            <HelpCircle className="w-5 h-5 mr-2" />
            Contact Support
          </Button>
          <p className="text-sm text-green-100 mt-2">
            Need help? Email us at support@respond.in
          </p>
        </div>
      </div>
    </div>
  );
}
