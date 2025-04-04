import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/Header";

function getAuthHeaders() {
  const token = localStorage.getItem("token");
  return {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };
}

export default function AddHotel() {
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    location: "",
    description: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const response = await fetch("https://airbnb-fullstack-sgjd.onrender.com/airbnb/manager/addHotel", {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({
          name: formData.name,
          price: parseInt(formData.price),
          location: formData.location,
          description: formData.description,
        }),
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.error || "Something went wrong");

      setSuccess("Hotel added successfully!");
      setTimeout(() => navigate("/manager/dashboard"), 1500); // Redirect after success
    } catch (err: any) {
      setError(err.message || "Failed to add hotel.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <div className="max-w-xl mx-auto p-6 mt-4 bg-white rounded shadow-md">
        <h2 className="text-2xl font-bold mb-4 text-center">Add New Hotel</h2>

        {error && <p className="text-red-600 text-center mb-2">{error}</p>}
        {success && <p className="text-green-600 text-center mb-2">{success}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="name"
            placeholder="Hotel Name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border rounded"
          />
          <input
            type="number"
            name="price"
            placeholder="Price per night"
            value={formData.price}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border rounded"
          />
          <input
            type="text"
            name="location"
            placeholder="Location"
            value={formData.location}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border rounded"
          />
          <textarea
            name="description"
            placeholder="Hotel Description"
            value={formData.description}
            onChange={handleChange}
            rows={4}
            className="w-full px-4 py-2 border rounded"
          />

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
            disabled={loading}
          >
            {loading ? "Adding..." : "Add Hotel"}
          </button>
        </form>
      </div>
    </div>
  );
}
