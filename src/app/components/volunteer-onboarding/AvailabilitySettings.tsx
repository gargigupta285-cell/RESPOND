import { useState } from 'react';
import { Button } from '../ui/button';
import { ProgressSteps } from '../ui/progress-steps';
import { Slider } from '../ui/slider';
import { Badge } from '../ui/badge';
import { Switch } from '../ui/switch';
import { Label } from '../ui/label';
import { Clock, MapPin, Bell, Mail, MessageSquare, Phone } from 'lucide-react';

interface AvailabilitySettingsProps {
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

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const HOURS = Array.from({ length: 24 }, (_, i) => i);

const QUICK_PRESETS = [
  { label: 'Weekdays 9-5', value: 'weekdays-9-5' },
  { label: 'Weekends Only', value: 'weekends' },
  { label: '24/7 Emergency', value: '24-7' },
  { label: 'Evenings Only', value: 'evenings' },
];

const EMERGENCY_TYPES = [
  'Natural Disasters',
  'Medical Emergencies',
  'Community Services',
  'Search & Rescue',
  'Food Distribution',
  'Blood Donation',
];

export function AvailabilitySettings({ onNext, onBack }: AvailabilitySettingsProps) {
  const [maxDistance, setMaxDistance] = useState([10]);
  const [selectedPreset, setSelectedPreset] = useState('');
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [selectedEmergencies, setSelectedEmergencies] = useState<string[]>([]);
  const [notifications, setNotifications] = useState({
    sms: true,
    email: true,
    push: true,
    whatsapp: false,
  });

  const toggleDay = (day: string) => {
    setSelectedDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  const toggleEmergency = (type: string) => {
    setSelectedEmergencies((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  const applyPreset = (preset: string) => {
    setSelectedPreset(preset);
    if (preset === 'weekdays-9-5') {
      setSelectedDays(['Mon', 'Tue', 'Wed', 'Thu', 'Fri']);
    } else if (preset === 'weekends') {
      setSelectedDays(['Sat', 'Sun']);
    } else if (preset === '24-7') {
      setSelectedDays(DAYS);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNext({ maxDistance: maxDistance[0], selectedDays, selectedEmergencies, notifications });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-6">
        <ProgressSteps currentStep={4} totalSteps={5} steps={ONBOARDING_STEPS} />

        <div className="bg-white rounded-xl p-8 border border-gray-200">
          <h2 className="mb-2">Availability Settings</h2>
          <p className="text-gray-600 mb-8">
            Set your availability so we can match you with opportunities that fit your schedule.
          </p>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Quick Presets */}
            <div>
              <h4 className="mb-4">Quick Availability Presets</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {QUICK_PRESETS.map((preset) => (
                  <button
                    key={preset.value}
                    type="button"
                    onClick={() => applyPreset(preset.value)}
                    className={`p-3 rounded-lg border-2 text-sm transition-all ${
                      selectedPreset === preset.value
                        ? 'border-[#1E3A8A] bg-blue-50 text-[#1E3A8A]'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Weekly Calendar */}
            <div>
              <h4 className="mb-4 flex items-center gap-2">
                <Clock className="w-5 h-5" />
                Weekly Availability
              </h4>
              <div className="border border-gray-200 rounded-xl p-6">
                <div className="grid grid-cols-7 gap-2">
                  {DAYS.map((day) => {
                    const isSelected = selectedDays.includes(day);
                    return (
                      <button
                        key={day}
                        type="button"
                        onClick={() => toggleDay(day)}
                        className={`p-4 rounded-lg border-2 transition-all ${
                          isSelected
                            ? 'border-[#10B981] bg-green-50 text-[#10B981]'
                            : 'border-gray-300 hover:border-gray-400'
                        }`}
                      >
                        <div className="text-xs mb-1">{day}</div>
                        {isSelected && (
                          <div className="w-2 h-2 bg-[#10B981] rounded-full mx-auto" />
                        )}
                      </button>
                    );
                  })}
                </div>
                <p className="text-sm text-gray-600 mt-4">
                  Select the days you're typically available. You can always update this later.
                </p>
              </div>
            </div>

            {/* Maximum Distance */}
            <div>
              <h4 className="mb-4 flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                Maximum Travel Distance
              </h4>
              <div className="border border-gray-200 rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm text-gray-600">How far are you willing to travel?</span>
                  <Badge variant="outline" className="bg-blue-100 text-blue-700 border-blue-200">
                    {maxDistance[0]} km
                  </Badge>
                </div>
                <Slider
                  value={maxDistance}
                  onValueChange={setMaxDistance}
                  max={50}
                  min={1}
                  step={1}
                  className="w-full"
                />
                <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
                  <span>1 km</span>
                  <span>50 km</span>
                </div>
              </div>
            </div>

            {/* Preferred Emergency Types */}
            <div>
              <h4 className="mb-4">Preferred Emergency Types</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {EMERGENCY_TYPES.map((type) => {
                  const isSelected = selectedEmergencies.includes(type);
                  return (
                    <button
                      key={type}
                      type="button"
                      onClick={() => toggleEmergency(type)}
                      className={`p-4 rounded-lg border-2 text-left transition-all ${
                        isSelected
                          ? 'border-[#1E3A8A] bg-blue-50'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm">{type}</span>
                        {isSelected && (
                          <div className="w-5 h-5 bg-[#1E3A8A] rounded-full flex items-center justify-center">
                            <div className="w-2 h-2 bg-white rounded-full" />
                          </div>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Notification Preferences */}
            <div>
              <h4 className="mb-4 flex items-center gap-2">
                <Bell className="w-5 h-5" />
                Notification Preferences
              </h4>
              <div className="border border-gray-200 rounded-xl p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Phone className="w-5 h-5 text-gray-400" />
                    <div>
                      <Label>SMS Alerts</Label>
                      <p className="text-sm text-gray-500">Receive urgent notifications via SMS</p>
                    </div>
                  </div>
                  <Switch
                    checked={notifications.sms}
                    onCheckedChange={(checked) =>
                      setNotifications((prev) => ({ ...prev, sms: checked }))
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-gray-400" />
                    <div>
                      <Label>Email Notifications</Label>
                      <p className="text-sm text-gray-500">Get updates and summaries via email</p>
                    </div>
                  </div>
                  <Switch
                    checked={notifications.email}
                    onCheckedChange={(checked) =>
                      setNotifications((prev) => ({ ...prev, email: checked }))
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Bell className="w-5 h-5 text-gray-400" />
                    <div>
                      <Label>Push Notifications</Label>
                      <p className="text-sm text-gray-500">Real-time alerts on your device</p>
                    </div>
                  </div>
                  <Switch
                    checked={notifications.push}
                    onCheckedChange={(checked) =>
                      setNotifications((prev) => ({ ...prev, push: checked }))
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <MessageSquare className="w-5 h-5 text-gray-400" />
                    <div>
                      <Label>WhatsApp Updates</Label>
                      <p className="text-sm text-gray-500">Receive updates on WhatsApp</p>
                    </div>
                  </div>
                  <Switch
                    checked={notifications.whatsapp}
                    onCheckedChange={(checked) =>
                      setNotifications((prev) => ({ ...prev, whatsapp: checked }))
                    }
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
                disabled={selectedDays.length === 0}
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
