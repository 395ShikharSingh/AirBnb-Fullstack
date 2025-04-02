import { ChangeEvent, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

interface LabelledInputType {
  label: string;
  placeholder: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  value: string;
}

function LabelInput({ label, placeholder, onChange, type, value }: LabelledInputType) {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      <label className="block mb-2 text-sm font-medium text-black font-semibold">
        {label}
      </label>
      <input
        onChange={onChange}
        type={type || "text"}
        value={value}
        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
        placeholder={placeholder}
        required
      />
    </motion.div>
  );
}

export const Auth = ({ type }: { type: "signup" | "signin" }) => {
  const [name, setName] = useState("");
  const [username, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async () => {
    setError("");
    setLoading(true);
    try {
      const endpoint = `http://localhost:3000/airbnb/${role}/${type}`;
      const payload = type === "signup" ? { name, username, password, role } : { username, password };
      const response = await axios.post(endpoint, payload);

      if (response.status === 200 || response.status === 201) {
        if (type === "signin" && response.data.token) {
          localStorage.setItem("token", response.data.token);
          localStorage.setItem("user", JSON.stringify(response.data.user));
        }
        navigate("/dashboard");
      }
    } catch (err: any) {
      setError(err.response?.data?.error || "Authentication failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-r from-black to-gray-900 h-screen flex flex-col justify-center">
      <motion.div className="flex justify-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }}>
        <div className="bg-white w-96 rounded-lg p-6 shadow-lg">
          <motion.div className="text-2xl font-bold text-center mb-6" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            {type === "signup" ? "Sign-Up" : "Login"}
          </motion.div>
          
          {error && (
            <motion.div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4" role="alert" initial={{ x: -10 }} animate={{ x: [10, -10, 10, 0] }} transition={{ duration: 0.3 }}>
              <p>{error}</p>
            </motion.div>
          )}

          {type === "signup" && (
            <LabelInput label="Name" placeholder="Shikhar Singh" value={name} onChange={(e) => setName(e.target.value)} />
          )}

          <LabelInput label="Username" placeholder="ShikharSingh@gmail.com" value={username} onChange={(e) => setUserName(e.target.value)} />
          <LabelInput label="Password" type="password" placeholder="••••••" value={password} onChange={(e) => setPassword(e.target.value)} />

          <div className="mb-4">
            <label className="block mb-2 text-sm font-medium text-black font-semibold">Role</label>
            <select 
              value={role} 
              onChange={(e) => setRole(e.target.value)}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5">
              <option value="user">User</option>
              <option value="manager">Manager</option>
            </select>
          </div>

          <motion.button
            onClick={handleSubmit}
            disabled={loading}
            className="bg-blue-600 text-white py-2 px-4 rounded-md w-full mt-4"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {loading ? (
              <motion.span className="flex justify-center items-center" animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }}>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </motion.span>
            ) : (
              type === "signup" ? "Sign Up" : "Login"
            )}
          </motion.button>

          <div className="text-center mt-4">
            {type === "signup" ? (
              <p className="text-sm text-gray-600">
                Already have an account? <a href="/signin" className="text-blue-600 hover:underline">Login</a>
              </p>
            ) : (
              <p className="text-sm text-gray-600">
                Don't have an account? <a href="/signup" className="text-blue-600 hover:underline">Sign up</a>
              </p>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Auth;
