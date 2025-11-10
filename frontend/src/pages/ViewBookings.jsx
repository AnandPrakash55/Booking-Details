import { useState, useEffect } from "react"; 
import { getBookingsByDate, updateBooking, getBuses } from "../services/api";

export default function ViewBookings() {
  const [date, setDate] = useState("");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [buses, setBuses] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({
    bus_id: "",
    customer_name: "",
    phone: "",
    amount: "",
    journey_date: ""
  });
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState("");
  const [editSuccess, setEditSuccess] = useState(false);

  useEffect(() => {
    getBuses().then(res => setBuses(res.data));
  }, []);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape" && editingId) {
        setEditingId(null);
        setEditForm({
          bus_id: "",
          customer_name: "",
          phone: "",
          amount: "",
          journey_date: ""
        });
        setEditError("");
        setEditSuccess(false);
      }
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [editingId]);

  const search = async () => {
    if (!date) return;
    setLoading(true);
    const res = await getBookingsByDate(date);
    setData(res.data);
    setLoading(false);
  };

  const handleEdit = (booking) => {
    setEditingId(booking.id);
    setEditForm({
      bus_id: booking.bus_id,
      customer_name: booking.customer_name,
      phone: booking.phone,
      amount: booking.amount,
      journey_date: booking.journey_date
    });
    setEditError("");
    setEditSuccess(false);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditForm({
      bus_id: "",
      customer_name: "",
      phone: "",
      amount: "",
      journey_date: ""
    });
    setEditError("");
    setEditSuccess(false);
  };

  const handleSaveEdit = async () => {
    if (!editForm.bus_id || !editForm.customer_name || !editForm.phone || !editForm.amount || !editForm.journey_date) {
      setEditError("⚠ Please fill all fields");
      return;
    }

    try {
      setEditError("");
      setEditLoading(true);
      await updateBooking(editingId, editForm);
      setEditSuccess(true);
      setTimeout(() => {
        setEditSuccess(false);
        setEditingId(null);
        search(); // Refresh the list
      }, 1500);
    } catch (err) {
      setEditError(err.response?.data?.message || "❌ Failed to update booking");
    } finally {
      setEditLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-start md:items-center p-6 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600">

      <div className="bg-white/90 backdrop-blur-xl shadow-2xl rounded-2xl p-6 md:p-8 w-full max-w-4xl border border-white/40">

        <h2 className="text-2xl md:text-3xl font-bold text-indigo-700 mb-3 flex items-center gap-2">
          📆 View Bookings
        </h2>
        <p className="text-gray-600 mb-6 text-sm md:text-base">Search passenger bookings by date</p>

        {/* Search box */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <input
            type="date"
            onChange={(e) => setDate(e.target.value)}
            className="border p-3 rounded-xl w-full focus:ring-2 focus:ring-indigo-500 outline-none shadow-sm bg-white"
          />

          <button
            onClick={search}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-3 rounded-xl shadow-lg transition flex items-center justify-center gap-2 font-medium"
          >
            🔍 Search
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-lg bg-white">
          <table className="w-full text-sm md:text-base">
            <thead>
              <tr className="bg-indigo-100 text-indigo-700 font-semibold text-left">
                <th className="p-3">Bus Number</th>
                <th className="p-3">Customer</th>
                <th className="p-3">Phone</th>
                <th className="p-3">Amount</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="5" className="p-6 text-center">
                    <div className="w-6 h-6 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
                  </td>
                </tr>
              ) : data.length > 0 ? (
                data.map((b) => (
                  <tr key={b.id} className="border-b hover:bg-indigo-50 transition">
                    <td className="p-3">{b.bus_number}</td>
                    <td className="p-3">{b.customer_name}</td>
                    <td className="p-3">{b.phone}</td>
                    <td className="p-3">₹{b.amount}</td>
                    <td className="p-3">
                      <button
                        onClick={() => handleEdit(b)}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-lg text-sm font-medium transition"
                      >
                        ✏️ Edit
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center p-6 text-gray-600">
                    No bookings found for selected date 📭
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Edit Modal */}
        {editingId && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                handleCancelEdit();
              }
            }}
          >
            <div 
              className="bg-white rounded-2xl shadow-2xl p-6 md:p-8 w-full max-w-lg max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-2xl font-bold text-indigo-700 mb-4 flex items-center gap-2">
                ✏️ Edit Booking
              </h3>

              {editError && <p className="bg-red-100 text-red-700 p-2 rounded mb-4">{editError}</p>}
              {editSuccess && <p className="bg-green-100 text-green-700 p-2 rounded mb-4">✅ Booking updated successfully!</p>}

              <div className="space-y-4">
                {/* Bus Selection */}
                <select
                  value={editForm.bus_id}
                  onChange={e => setEditForm({ ...editForm, bus_id: e.target.value })}
                  className="w-full p-3 bg-white shadow-sm rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-600 outline-none"
                >
                  <option value="">🚌 Select Bus</option>
                  {buses.map(bus => (
                    <option key={bus.id} value={bus.id}>🚌 {bus.bus_number}</option>
                  ))}
                </select>

                {/* Customer Name */}
                <input
                  value={editForm.customer_name}
                  placeholder="👤 Customer Name"
                  onChange={e => setEditForm({ ...editForm, customer_name: e.target.value })}
                  className="w-full p-3 bg-white shadow-sm rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-600 outline-none"
                />

                {/* Phone */}
                <input
                  value={editForm.phone}
                  placeholder="📞 Phone Number"
                  onChange={e => setEditForm({ ...editForm, phone: e.target.value })}
                  className="w-full p-3 bg-white shadow-sm rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-600 outline-none"
                />

                {/* Amount */}
                <input
                  type="number"
                  value={editForm.amount}
                  placeholder="💰 Amount"
                  onChange={e => setEditForm({ ...editForm, amount: e.target.value })}
                  className="w-full p-3 bg-white shadow-sm rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-600 outline-none"
                />

                {/* Journey Date */}
                <input
                  type="date"
                  value={editForm.journey_date}
                  onChange={e => setEditForm({ ...editForm, journey_date: e.target.value })}
                  className="w-full p-3 bg-white shadow-sm rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-600 outline-none"
                />

                {/* Action Buttons */}
                <div className="flex gap-3 mt-6">
                  <button
                    onClick={handleSaveEdit}
                    disabled={editLoading}
                    className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl font-semibold shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {editLoading ? (
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      "💾 Save Changes"
                    )}
                  </button>
                  <button
                    onClick={handleCancelEdit}
                    disabled={editLoading}
                    className="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-3 rounded-xl font-semibold shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

