import { useState } from "react";
import { getBookingsByDate } from "../services/api";

export default function DriverDashboard() {
  const [date, setDate] = useState("");
  const [data, setData] = useState([]);

  const search = async () => {
    const res = await getBookingsByDate(date);
    setData(res.data);
  };

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Driver Booking View</h1>

      <input
        type="date"
        className="border p-2 rounded"
        onChange={(e) => setDate(e.target.value)}
      />
      <button onClick={search} className="bg-blue-600 text-white p-2 ml-3 rounded">
        Search
      </button>

      <table className="w-full mt-4 border">
        <tr className="bg-gray-200">
          <th className="p-2 border">Customer</th>
          <th className="p-2 border">Phone</th>
          <th className="p-2 border">Amount</th>
        </tr>
        {data.map((b) => (
          <tr key={b.id}>
            <td className="border p-2">{b.customer_name}</td>
            <td className="border p-2">{b.phone}</td>
            <td className="border p-2">₹{b.amount}</td>
          </tr>
        ))}
      </table>
    </div>
  );
}
