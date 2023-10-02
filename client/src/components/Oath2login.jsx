
// frontend/src/components/GoogleOAuthButton.js
import React from 'react';

const GoogleOAuthButton = () => {
  const handleGoogleLogin = () => {
    window.location.href = `${import.meta.env.VITE_REACT_APP_BACKEND_URL}/auth/google`;
  };

  return (
    <button onClick={handleGoogleLogin}>Login with Google</button>
  );
};

export default GoogleOAuthButton;