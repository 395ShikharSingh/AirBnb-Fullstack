import Auth from "../components/Auth";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const navigate = useNavigate();
  
  // Handle successful signup
  const handleSignupSuccess = () => {
    // Navigate to login page after successful signup
    navigate("/signin");
  };
  
  return (
    <div>
      {/* Page title can be added for SEO */}
      <title>Sign Up - Hotel Booking System</title>
      
      {/* Use the Auth component with 'signup' type */}
      <Auth type="signup" />
    </div>
  );
};

export default Signup;