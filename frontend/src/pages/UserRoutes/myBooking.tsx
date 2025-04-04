import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/Header";

interface Booking {
  id: string;
  hotel: {
    name: string;
    location: string;
    price: number;
  };
  checkIn: string;
  checkOut: string;
}

export default function MyBookings() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please log in to view bookings.");
      navigate("/login");
      return;
    }

    const fetchBookings = async () => {
      try {
        const response = await fetch("https://airbnb-fullstack-sgjd.onrender.com/airbnb/user/myBooking", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();
        setBookings(data.bookings || []);
      } catch (error) {
        console.error("Error fetching bookings:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <div className="p-6">
        <h1 className="text-3xl font-bold text-center mb-6">My Bookings</h1>
        
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-600"></div>
          </div>
        ) : bookings.length === 0 ? (
          <p className="text-center text-gray-600">No bookings found.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {bookings.map((booking) => (
              <div
                key={booking.id}
                className="bg-white p-4 rounded-lg shadow-md transform transition duration-300 hover:scale-105"
              >
                <h2 className="text-xl font-bold">{booking.hotel?.name || "Unknown Hotel"}</h2>
                <p className="text-gray-600">Location: {booking.hotel?.location || "Unknown"}</p>
                <p className="text-gray-600">Price: ${booking.hotel?.price || "N/A"}</p>
                <p className="text-gray-600">
                  Check-in: {booking.checkIn ? new Date(booking.checkIn).toLocaleDateString() : "N/A"}
                </p>
                <p className="text-gray-600">
                  Check-out: {booking.checkOut ? new Date(booking.checkOut).toLocaleDateString() : "N/A"}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
