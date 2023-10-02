import { useContext } from "react"
import { UserContext } from "../context/userContext"
import {  useParams } from 'react-router-dom';
import  { useEffect } from 'react';
import axios from "axios";
import { useNavigate } from 'react-router-dom';



 
export default function Dashboard() {
    const navigate = useNavigate()
const { token } = useParams();
  const { user, setUser } = useContext(UserContext);
  useEffect(() => {
    try {
        const res =  axios.post('/getProfileViaGoogleToken', {
            token: token
        }
        );
        // Handle the response from the server if needed
        setUser(res.user);
        navigate('/dashboard')
    } catch (error) {
        // Handle errors from the server or network issues
        console.error(error);
    }
}
, []); 
  // Render the Dashboard once the user data is available
  return (
    <div>
      <h1>GoogleLogin</h1>
      {token}
      {!!user && <h2> Hi {user.name}!</h2>}
    </div>
  );
}
