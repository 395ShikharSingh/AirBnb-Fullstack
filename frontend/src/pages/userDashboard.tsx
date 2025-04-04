import { useEffect, useState } from "react";
import {  useNavigate } from "react-router-dom";
import Header from "../components/Header";

interface Hotel {
  id: number;
  name: string;
  location: string;
  price: number;
  description: string;
}

export default function Dashboard() {
  const [userName, setUserName] = useState("");
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUserName(JSON.parse(storedUser).name);
    }
    
    fetch("https://airbnb-fullstack-sgjd.onrender.com/airbnb/user/allHotel")
      .then((response) => response.json())
      .then((data) => {
        setHotels(data.hotels);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching hotels:", error);
        setLoading(false);
      });
  }, []);
  
  

  return (
    <div className="bg-white text-black min-h-screen">
        <Header />
      <main className="p-4">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-600"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {hotels.map((hotel) => (
              <div key={hotel.id} className="bg-gray-100 p-4 rounded-lg shadow-md">
                <h2 className="text-xl font-bold">{hotel.name}</h2>
                <p className="text-gray-700">Location: {hotel.location}</p>
                <p className="text-gray-700">Price: ${hotel.price}</p>
                <p className="text-gray-700">{hotel.description}</p>
                <button 
                  className="mt-2 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg w-full"
                  onClick={() => navigate(`/booking/${hotel.id}?name=${encodeURIComponent(hotel.name)}`)}
                >
                  Book Now
                </button>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
