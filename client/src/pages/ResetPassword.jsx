
import { Navigate, useParams } from 'react-router-dom';
import React, { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

 function ResetPassword() {
    const navigate=useNavigate()
  const { token } = useParams();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
 

  const handleResetPassword = async () => {
    try {
     
        if (newPassword !== confirmPassword) {
            toast.error("Passwords don't match.");
            return;
          }
      const response = await axios.post('/reset-password', {newPassword,token,});

      if (response.status === 200) {
        toast.success('Password reset successfully.');
        
        setTimeout(() => {
           navigate('/login') // Replace with your desired route
          }, 2000);

      } else {
        toast.error(response.error);
      }
    } catch (error) {
      console.error(error);
      toast.error('An error occurred while resetting the password.');
    }
  };

  return (
    <div>
      <h2>Reset Password</h2>
      <input
        type="password"
        placeholder="New Password"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
      />
      <input
        type="password"
        placeholder="Confirm Password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
      />
      <button onClick={handleResetPassword}>Reset Password</button>

    </div>
  );
}

export default ResetPassword;