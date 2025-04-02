import { Auth } from "../components/Auth";
import { useNavigate } from "react-router-dom";

const Signin = () => {
  const navigate = useNavigate();
  
  // Auto-redirect to dashboard on successful login
  // This is already handled in your Auth component, but included here for completeness
  
  return (
    <div>
      {/* Page title can be added for SEO */}
      <title>Login - Hotel Booking System</title>
      
      {/* Use the Auth component with 'signin' type */}
      <Auth type="signin" />
    </div>
  );
};

export default Signin;