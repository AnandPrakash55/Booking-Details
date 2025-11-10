import { useState } from "react";
import { addBus } from "../services/api";

export default function AddBus() {
  const [form, setForm] = useState({
    bus_number: "",
    route_from: "",
    route_to: "",
    total_seats: "",
    driver_name: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await addBus(form);
    alert("Bus Added ✅");
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-blue-400 via-indigo-500 to-purple-600 p-6">
      
      <div className="bg-white/90 backdrop-blur-md shadow-2xl rounded-2xl p-8 w-full max-w-md border border-white/40">
        
        <h2 className="text-3xl font-semibold mb-6 text-center text-indigo-700 drop-shadow-sm">
          Add New Bus 🚌
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Input Field Reusable Style */}
          {[
            { key:"bus_number", label:"Bus Number" },
            { key:"route_from", label:"From" },
            { key:"route_to", label:"To" },
            { key:"total_seats", label:"Total Seats", type:"number" },
            { key:"driver_name", label:"Driver Name" }
          ].map((input, i) => (
            <input
              key={i}
              type={input.type || "text"}
              className="w-full p-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-600 bg-white shadow-sm"
              placeholder={input.label}
              onChange={(e) => setForm({ ...form, [input.key]: e.target.value })}
              required
            />
          ))}

          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl font-semibold shadow-md transform hover:scale-[1.02] transition duration-200"
          >
            ✅ Add Bus
          </button>
        </form>
      </div>
    </div>
  );
}
