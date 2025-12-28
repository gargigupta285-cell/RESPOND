import { Button } from './ui/button';
import { Heart, MapPin, Users, Shield, Clock, CheckCircle } from 'lucide-react';

interface LandingProps {
  onGetStarted: () => void;
}

export function Landing({ onGetStarted }: LandingProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1E3A8A] via-[#1E40AF] to-[#1E3A8A] text-white relative overflow-hidden">
      {/* India map outline with glowing emergency icons - decorative background */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-1/4 left-1/4 w-3 h-3 bg-[#F59E0B] rounded-full animate-pulse" />
        <div className="absolute top-1/3 right-1/3 w-3 h-3 bg-[#10B981] rounded-full animate-pulse" style={{ animationDelay: '0.5s' }} />
        <div className="absolute bottom-1/3 left-1/2 w-3 h-3 bg-[#EF4444] rounded-full animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      {/* Navigation */}
      <nav className="relative z-10 px-6 py-6 flex justify-between items-center max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-[#F59E0B] rounded-lg flex items-center justify-center">
            <Heart className="w-6 h-6 text-white" />
          </div>
          <span className="text-2xl tracking-tight">RESPOND</span>
        </div>
        <div className="flex gap-6 items-center">
          <a href="#about" className="hover:text-[#F59E0B] transition-colors">About</a>
          <a href="#how-it-works" className="hover:text-[#F59E0B] transition-colors">How It Works</a>
          <a href="#contact" className="hover:text-[#F59E0B] transition-colors">Contact</a>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative z-10 max-w-5xl mx-auto px-6 pt-20 pb-32 text-center">
        <h1 className="text-5xl md:text-7xl mb-6 tracking-tight max-w-4xl mx-auto">
          Connect skilled citizens with emergencies — fast, verified, reliable.
        </h1>
        <p className="text-xl md:text-2xl mb-10 text-blue-100 max-w-3xl mx-auto">
          India's premier volunteer management platform for emergency response. 
          Match verified needs with qualified volunteers in minutes.
        </p>
        <Button
          onClick={onGetStarted}
          className="bg-[#F59E0B] hover:bg-[#D97706] text-white px-12 py-6 h-auto shadow-2xl hover:shadow-[#F59E0B]/50 transition-all"
        >
          Get Started
        </Button>

        {/* Feature highlights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-20">
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
            <Clock className="w-12 h-12 text-[#F59E0B] mb-4 mx-auto" />
            <h3 className="mb-2">4 Min Avg Response</h3>
            <p className="text-blue-100 text-sm">Lightning-fast volunteer matching for critical situations</p>
          </div>
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
            <Shield className="w-12 h-12 text-[#10B981] mb-4 mx-auto" />
            <h3 className="mb-2">100% Verified</h3>
            <p className="text-blue-100 text-sm">All volunteers and requests thoroughly authenticated</p>
          </div>
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
            <Users className="w-12 h-12 text-[#60A5FA] mb-4 mx-auto" />
            <h3 className="mb-2">87% Match Rate</h3>
            <p className="text-blue-100 text-sm">Precision skill-based matching for optimal outcomes</p>
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div id="how-it-works" className="relative z-10 bg-white text-gray-900 py-20">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-center mb-16">How RESPOND Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-[#1E3A8A] text-white rounded-full flex items-center justify-center">1</div>
                <div>
                  <h4 className="mb-2">For Volunteers</h4>
                  <p className="text-gray-600">Sign up, verify your skills, and set your availability. Get matched with nearby emergencies instantly.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-[#1E3A8A] text-white rounded-full flex items-center justify-center">2</div>
                <div>
                  <h4 className="mb-2">Accept Tasks</h4>
                  <p className="text-gray-600">Browse verified requests, see location and urgency levels, and accept tasks that match your expertise.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-[#10B981] text-white rounded-full flex items-center justify-center">
                  <CheckCircle className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="mb-2">Make Impact</h4>
                  <p className="text-gray-600">Complete tasks, track your contributions, and build your verified volunteer profile.</p>
                </div>
              </div>
            </div>
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-[#F59E0B] text-white rounded-full flex items-center justify-center">1</div>
                <div>
                  <h4 className="mb-2">For Organizations</h4>
                  <p className="text-gray-600">Register your NGO or government agency. Post verified emergency volunteer needs instantly.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-[#F59E0B] text-white rounded-full flex items-center justify-center">2</div>
                <div>
                  <h4 className="mb-2">Get Matched</h4>
                  <p className="text-gray-600">Our AI matches your needs with qualified volunteers based on skills, location, and availability.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-[#10B981] text-white rounded-full flex items-center justify-center">
                  <CheckCircle className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="mb-2">Coordinate Relief</h4>
                  <p className="text-gray-600">Track volunteers in real-time, manage tasks efficiently, and deliver faster emergency response.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="relative z-10 bg-[#0F172A] text-white py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-[#F59E0B] rounded-lg flex items-center justify-center">
                  <Heart className="w-5 h-5 text-white" />
                </div>
                <span className="tracking-tight">RESPOND</span>
              </div>
              <p className="text-gray-400 text-sm">Connecting skilled citizens with verified emergency needs across India.</p>
            </div>
            <div>
              <h4 className="mb-4 text-sm">Platform</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-[#F59E0B]">For Volunteers</a></li>
                <li><a href="#" className="hover:text-[#F59E0B]">For Organizations</a></li>
                <li><a href="#" className="hover:text-[#F59E0B]">How It Works</a></li>
              </ul>
            </div>
            <div>
              <h4 className="mb-4 text-sm">Resources</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-[#F59E0B]">Documentation</a></li>
                <li><a href="#" className="hover:text-[#F59E0B]">Training</a></li>
                <li><a href="#" className="hover:text-[#F59E0B]">Support</a></li>
              </ul>
            </div>
            <div>
              <h4 className="mb-4 text-sm">Contact</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>support@respond.in</li>
                <li>Emergency: 1800-XXX-XXXX</li>
                <li>Mumbai, Maharashtra</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
            © 2025 RESPOND. Built for India's emergency response community.
          </div>
        </div>
      </footer>
    </div>
  );
}
