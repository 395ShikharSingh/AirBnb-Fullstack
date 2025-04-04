// pages/ManagerBookings.tsx

import { useEffect, useState } from "react";
import Header from "../../components/Header";

type Booking = {
  id: number;
  checkIn: string;
  checkOut: string;
  hotel: {
    name: string;
    location: string;
  };
  user: {
    name: string;
    username: string;
  };
};

function getAuthHeaders() {
  const token = localStorage.getItem("token");
  return {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };
}

export default function ManagerBookings() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("https://airbnb-fullstack-sgjd.onrender.com/airbnb/manager/managerBookings", {
      headers: getAuthHeaders(),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch manager bookings");
        return res.json();
      })
      .then((data) => setBookings(data.bookings))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <div className="max-w-6xl mx-auto p-4">
        <h2 className="text-3xl font-bold mb-6">📑 Manager Bookings</h2>

        {loading ? (
          <div className="flex justify-center items-center h-40">
            <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-blue-600 border-solid"></div>
          </div>
        ) : error ? (
          <p className="text-red-600">{error}</p>
        ) : bookings.length === 0 ? (
          <p className="text-gray-600">No bookings found for your hotels.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {bookings.map((booking) => (
              <div key={booking.id} className="bg-white shadow-md rounded-xl p-4">
                <h3 className="text-xl font-semibold mb-1">{booking.hotel.name}</h3>
                <p className="text-gray-600 mb-2">{booking.hotel.location}</p>

                <p className="text-sm">
                  <span className="font-medium">Check-in:</span>{" "}
                  {new Date(booking.checkIn).toLocaleDateString()}
                </p>
                <p className="text-sm mb-2">
                  <span className="font-medium">Check-out:</span>{" "}
                  {new Date(booking.checkOut).toLocaleDateString()}
                </p>

                <div className="text-sm text-gray-700 mt-3">
                  <p>
                    <span className="font-semibold">Guest:</span> {booking.user.name}
                  </p>
                  <p>
                    <span className="font-semibold">Email:</span> {booking.user.username}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
