import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Header() {
  const navigate = useNavigate();
  const storedUser = localStorage.getItem("user");
  const userName = storedUser ? JSON.parse(storedUser).name : "";
  const [showLogout, setShowLogout] = useState(false);

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      localStorage.clear();
      setShowLogout(false);
      navigate("/signin");  // Redirects to login page
    }
  };

  return (
    <header className="flex justify-between items-center w-full mb-6 bg-gray-200 shadow-md shadow-gray-400 p-4">
      {/* ✅ Clickable Title Redirecting to /dashboard */}
      <Link to="/dashboard" className="text-2xl font-bold text-blue-600 hover:text-blue-800 transition">
        HotelBnB
      </Link>

      <div className="flex items-center space-x-4">
        <Link
          to="/myBooking"
          className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg"
        >
          My Bookings
        </Link>

        {userName && (
          <div className="relative">
            <div 
              className="w-10 h-10 flex items-center justify-center rounded-full bg-blue-500 text-white text-lg font-bold cursor-pointer"
              onClick={() => setShowLogout(!showLogout)}
            >
              {userName.charAt(0).toUpperCase()}
            </div>

            {showLogout && (
              <button 
                onClick={handleLogout} 
                className="absolute top-12 right-0 bg-red-500 hover:bg-red-600 text-white py-1 px-4 rounded-md shadow-md"
              >
                Logout
              </button>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
