import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const VerifyUser = () => {
  const { token } = useParams(); // Extract the token from URL parameters
  const navigate = useNavigate();

  useEffect(() => {
    const verifyUser = async () => {
      try {
        const response = await axios.post('/verify', { token });
        const { data } = response;

        if (data.error) {
          toast.error(data.message);
        } else {
          toast.success(data.message);
          navigate('/login');
        }
      } catch (error) {
        toast.error(error.message);
      }
    };

    verifyUser(); // Call the async function to verify the user
  }, []); // Include 'token' and 'navigate' in the dependency array

  return (
    <div>
      <h1>Confirming your email</h1>
    </div>
  );
};

export default VerifyUser;