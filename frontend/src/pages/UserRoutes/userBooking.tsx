import { useEffect, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export default function BookingPage() {
  const { hotelId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  // Extract hotel name correctly
  const queryParams = new URLSearchParams(location.search);
  const hotelName = queryParams.get("name") ? decodeURIComponent(queryParams.get("name")!) : "Unknown Hotel";

  const [userId, setUserId] = useState("");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUserId(JSON.parse(storedUser).id);
    }
  }, []);

  const handleBooking = async () => {
    if (!checkIn || !checkOut) {
      alert("Please select check-in and check-out dates.");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please log in to book.");
      return;
    }

    try {
      const response = await fetch("https://airbnb-fullstack-sgjd.onrender.com/airbnb/user/booking", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          hotelId,
          userId,
          checkIn,
          checkOut,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        alert("Booking successful!");
        navigate("/user/myBooking");
      } else {
        alert(data.error || "Booking failed.");
      }
    } catch (error) {
      console.error("Booking error:", error);
      alert("Something went wrong. Try again later.");
    }
  };

  return (
    <motion.div 
      className="bg-white text-black min-h-screen flex flex-col items-center justify-center p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.h1 
        className="text-3xl font-bold mb-4"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        Book {hotelName}
      </motion.h1>
      <motion.div 
        className="w-full max-w-md bg-gray-100 p-6 rounded-lg shadow-md"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <label className="block mb-2 text-gray-700">Check-in Date:</label>
        <input
          type="date"
          className="w-full p-2 mb-4 border rounded"
          value={checkIn}
          onChange={(e) => setCheckIn(e.target.value)}
        />

        <label className="block mb-2 text-gray-700">Check-out Date:</label>
        <input
          type="date"
          className="w-full p-2 mb-4 border rounded"
          value={checkOut}
          onChange={(e) => setCheckOut(e.target.value)}
        />

        <motion.button
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg cursor-pointer"
          onClick={handleBooking}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Confirm Booking
        </motion.button>
      </motion.div>
    </motion.div>
  );
}
