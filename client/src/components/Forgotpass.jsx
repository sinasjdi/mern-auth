
import { Link } from 'react-router-dom'; // Import Link from React Router

const ForgotPasswordButton = () => {
  return (
    <Link to="/forgot-password"> 
      <button>Forgot Password</button>
    </Link>
  );
};

export default ForgotPasswordButton;

