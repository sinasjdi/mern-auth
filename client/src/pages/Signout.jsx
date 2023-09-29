import React, { useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../context/userContext'; // Import your UserContext
import Cookies from 'js-cookie';

const SignOut = () => {
  const navigate = useNavigate();
  const { setUser } = useContext(UserContext); // Use useContext to access setUser

  useEffect(() => {
    // Perform the sign-out action here
    // Typically, you would clear the JWT from localStorage or a cookie
    // and redirect the user to the login page
    Cookies.remove('token');
    // Clear the user data by calling setUser with null
    setUser(null);

    setTimeout(() => {
      navigate('/'); // Replace with your desired route
    }, 2000);
  }, []); // Include navigate and setUser in the dependency array

  return (
    <div>
      <h1>Signing Out...</h1>
      {/* You can optionally display a loading message or spinner here */}
    </div>
  );
};

export default SignOut;