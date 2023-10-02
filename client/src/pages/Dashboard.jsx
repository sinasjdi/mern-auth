import { useContext } from "react"
import { UserContext } from "../context/userContext"


import { useEffect } from "react";
import axios from "axios";

export default function Dashboard() {
  
  const { user, setUser } = useContext(UserContext);
  useEffect(() => {
    if (!user) {
      axios.get('/profile').then(({ data }) => {
        setUser(data);
      });
    }
  }, []); 
  // Render the Dashboard once the user data is available
  return (
    <div>
      <h1>Dashboard!!</h1>
      {!!user && <h2> Hi {user.name}!</h2>}
    </div>
  );
}
