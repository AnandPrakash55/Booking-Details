import { useEffect, useState } from "react"; 
import { addBooking, getBuses } from "../services/api";

export default function AddBooking() {
  const [buses, setBuses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    bus_id: "",
    customer_name: "",
    phone: "",
    amount: "",
    journey_date: ""
  });

  useEffect(() => {
    getBuses().then(res => setBuses(res.data));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.bus_id || !form.customer_name || !form.phone || !form.amount || !form.journey_date) {
      setError("⚠ Please fill all fields");
      return;
    }
    
    try {
      setError("");
      setLoading(true);
      await addBooking(form);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 2000);

      setForm({ bus_id:"", customer_name:"", phone:"", amount:"", journey_date:"" });
    } catch {
      setError("❌ Something went wrong");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-blue-500 via-indigo-600 to-purple-600">
      <form 
        onSubmit={handleSubmit} 
        className="bg-white/90 backdrop-blur-xl shadow-2xl rounded-2xl p-6 md:p-8 w-full max-w-lg space-y-4 border border-white/40"
      >
        <h2 className="text-2xl md:text-3xl font-bold text-center text-indigo-700 mb-2">
          🚍 Book Your Bus
        </h2>
        <p className="text-center text-gray-600 text-sm mb-3">Fill passenger & travel details below</p>

        {error && <p className="bg-red-100 text-red-700 p-2 rounded">{error}</p>}
        {success && <p className="bg-green-100 text-green-700 p-2 rounded">✅ Booking Saved!</p>}

        {/* Select Bus */}
        <select
          value={form.bus_id}
          onChange={e => setForm({ ...form, bus_id: e.target.value })}
          className="w-full p-3 bg-white shadow-sm rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-600 outline-none"
        >
          <option value="">🚌 Select Bus</option>
          {buses.map(bus => (
            <option key={bus.id} value={bus.id}>🚌 {bus.bus_number}</option>
          ))}
        </select>

        {/* Form Inputs */}
        <input
          value={form.customer_name}
          placeholder="👤 Customer Name"
          onChange={e => setForm({ ...form, customer_name: e.target.value })}
          className="w-full p-3 bg-white shadow-sm rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-600 outline-none"
        />

        <input
          value={form.phone}
          placeholder="📞 Phone Number"
          onChange={e => setForm({ ...form, phone: e.target.value })}
          className="w-full p-3 bg-white shadow-sm rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-600 outline-none"
        />

        <input
          type="number"
          value={form.amount}
          placeholder="💰 Amount"
          onChange={e => setForm({ ...form, amount: e.target.value })}
          className="w-full p-3 bg-white shadow-sm rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-600 outline-none"
        />

        <input
          type="date"
          value={form.journey_date}
          onChange={e => setForm({ ...form, journey_date: e.target.value })}
          className="w-full p-3 bg-white shadow-sm rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-600 outline-none"
        />

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl font-semibold shadow-lg flex justify-center items-center gap-2 transition transform hover: scale-[1.02]"
          disabled={loading}
        >
          {loading ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          ) : (
            "✅ Confirm Booking"
          )}
        </button>
      </form>
    </div>
  );
}


