import { useState } from 'react';
import { Landing } from './components/Landing';
import { RoleSelection } from './components/RoleSelection';
import { VolunteerDashboard } from './components/VolunteerDashboard';
import { RequesterDashboard } from './components/RequesterDashboard';
import { VolunteerOnboarding } from './components/VolunteerOnboarding';

type Screen = 
  | 'landing' 
  | 'role-selection' 
  | 'volunteer-onboarding'
  | 'volunteer-dashboard' 
  | 'requester-dashboard';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('landing');

  const renderScreen = () => {
    switch (currentScreen) {
      case 'landing':
        return <Landing onGetStarted={() => setCurrentScreen('role-selection')} />;
      case 'role-selection':
        return (
          <RoleSelection
            onSelectVolunteer={() => setCurrentScreen('volunteer-onboarding')}
            onSelectRequester={() => setCurrentScreen('requester-dashboard')}
          />
        );
      case 'volunteer-onboarding':
        return (
          <VolunteerOnboarding
            onComplete={() => setCurrentScreen('volunteer-dashboard')}
            onBack={() => setCurrentScreen('role-selection')}
          />
        );
      case 'volunteer-dashboard':
        return <VolunteerDashboard onBack={() => setCurrentScreen('role-selection')} />;
      case 'requester-dashboard':
        return <RequesterDashboard onBack={() => setCurrentScreen('role-selection')} />;
      default:
        return <Landing onGetStarted={() => setCurrentScreen('role-selection')} />;
    }
  };

  return <div className="min-h-screen">{renderScreen()}</div>;
}