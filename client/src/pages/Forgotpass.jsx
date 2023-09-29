import React, { useState } from 'react';
import toast from 'react-hot-toast';
import axios from 'axios';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');


  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handleResetPassword = async() => {
    try {
      const response = await axios.post('/forgot-password', { email });

      if (response.data.error) {
        toast.error(response.data.error);
      } else {
        toast.success('Password reset instructions sent to your email.');
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <h2>Forgot Password</h2>
      
      <div>
        <label>Email:</label>
        <input type="email" value={email} onChange={handleEmailChange} />
      </div>
      <div>
        <button onClick={handleResetPassword}>Reset Password</button>
      </div>
    </div>
  );
};

export default ForgotPassword;

