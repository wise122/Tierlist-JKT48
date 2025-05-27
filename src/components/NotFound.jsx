import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const NotFound = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Automatically redirect to homepage after 0 seconds
    navigate('/');
  }, [navigate]);

  return null; // No need to render anything as we're redirecting immediately
};

export default NotFound; 