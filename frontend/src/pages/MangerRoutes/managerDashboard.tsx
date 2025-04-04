import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/Header";

type Hotel = {
  id: number;
  name: string;
  location: string;
  description: string;
  price: number;
};

function getAuthHeaders() {
  const token = localStorage.getItem("token");
  return {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };
}

function ManagerDashboard() {
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("https://airbnb-fullstack-sgjd.onrender.com/airbnb/manager/myhotel", {
      headers: getAuthHeaders(),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Unauthorized or failed to fetch hotels.");
        return res.json();
      })
      .then((data) => setHotels(data.hotels))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const handleAddHotel = () => {
    navigate("/manager/addHotel");
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />

      <div className="max-w-6xl mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold">🏨 Your Hotels</h2>
          <button
            onClick={handleAddHotel}
            className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg shadow"
          >
            + Add Hotel
          </button>
        </div>

        {error && <p className="text-red-600 text-center mb-4">{error}</p>}

        {loading ? (
          <div className="text-center text-blue-500 font-semibold">Loading hotels...</div>
        ) : hotels.length === 0 ? (
          <p className="text-gray-600 text-center">No hotels found for this manager.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {hotels.map((hotel) => (
              <div key={hotel.id} className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition">
                <h3 className="text-xl font-semibold mb-2">{hotel.name}</h3>
                <p className="text-gray-600 mb-1"><strong>Location:</strong> {hotel.location}</p>
                <p className="text-gray-700 mb-2">{hotel.description}</p>
                <p className="text-blue-700 font-semibold">₹{hotel.price}/night</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default ManagerDashboard;
