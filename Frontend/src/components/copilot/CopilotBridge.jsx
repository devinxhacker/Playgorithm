import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useCopilot } from '../../context/CopilotContext';
import { useAuth } from '../../context/AuthContext';

const CopilotBridge = () => {
  const location = useLocation();
  const { user } = useAuth();
  const { publishEvent } = useCopilot();

  useEffect(() => {
    publishEvent('ROUTE_CHANGE', {
      path: location.pathname,
      title: document.title,
      username: user?.username,
    });
  }, [location.pathname, publishEvent, user?.username]);

  useEffect(() => {
    const handleVisibility = () => {
      publishEvent('VISIBILITY', { hidden: document.hidden });
    };
    document.addEventListener('visibilitychange', handleVisibility);
    return () => document.removeEventListener('visibilitychange', handleVisibility);
  }, [publishEvent]);

  return null;
};

export default CopilotBridge;
