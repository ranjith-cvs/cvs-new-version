import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const useSessionHandler = () => {
  // const [showWarning, setShowWarning] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();
  let idleTimer;

  useEffect(() => {
    const resetIdleTimer = () => {
      clearTimeout(idleTimer);
      const expiry = new Date().getTime() + 4 * 60 * 1000; // 30 minutes from now
      sessionStorage.setItem('expiry', expiry.toString());
    };

    const handleActivity = () => {
      resetIdleTimer();
      // setShowWarning(false);
    };

    const checkIdle = () => {
      const expiry = sessionStorage.getItem('expiry');
      const now = new Date().getTime();
      if (expiry && now >= parseInt(expiry, 10)) {
        sessionStorage.clear();
        setIsAuthenticated(false);
        localStorage.removeItem("docEntry");
        localStorage.removeItem("branchType");
        localStorage.removeItem("entityDefWhs");
        localStorage.removeItem("entityId");
        localStorage.removeItem("entityName");
        localStorage.removeItem("id");
        localStorage.removeItem("name");
        localStorage.removeItem("roleID");
        setIsAuthenticated(false);
        navigate('/');
      } else if (expiry && parseInt(expiry, 10) - now <= 60000) {
        console.log(expiry , now, "Session handling")
        // setShowWarning(true);
      }
    };

    window.addEventListener('mousemove', handleActivity);
    window.addEventListener('keydown', handleActivity);
    window.addEventListener('click', handleActivity);

    resetIdleTimer();
    const interval = setInterval(checkIdle, 10000); // check every 10s

    return () => {
      window.removeEventListener('mousemove', handleActivity);
      window.removeEventListener('keydown', handleActivity);
      window.removeEventListener('click', handleActivity);
      clearInterval(interval);
    };
  }, [navigate]);

  useEffect(() => {
    const auth = sessionStorage.getItem('auth');
    if (auth === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  return { isAuthenticated };
};

export default useSessionHandler;
