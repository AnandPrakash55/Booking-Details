import { useState } from "react";
import { Link } from "react-router-dom";
import { FaBus, FaPlus, FaCalendarAlt, FaBars, FaTimes, FaHome } from "react-icons/fa";

export default function OwnerDashboard() {
  const [totalBuses, setTotalBuses] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500">

      {/* Mobile Top Bar */}
      <header className="md:hidden fixed top-0 left-0 w-full bg-white/90 backdrop-blur-md shadow-lg flex justify-between items-center p-4 z-40 rounded-b-xl">
        <h1 className="font-bold text-lg text-indigo-700">Owner Dashboard</h1>
        <button onClick={() => setMenuOpen(true)} className="p-2 bg-gray-200 rounded-lg">
          <FaBars size={22} />
        </button>
      </header>

      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-24 bg-white/90 backdrop-blur-xl border-r border-white/30 shadow-2xl p-5 flex-col items-center space-y-8">
        <Link to="/" className="text-xl p-3 bg-indigo-100 text-indigo-700 rounded-xl shadow">🏠</Link>
        <Link to="/add-bus" className="text-xl p-3 bg-gray-100 text-gray-700 rounded-xl shadow">🚌</Link>
        <Link to="/view-bookings" className="text-xl p-3 bg-gray-100 text-gray-700 rounded-xl shadow">📅</Link>
      </aside>

      {/* Mobile Drawer */}
      {menuOpen && (
        <div className="md:hidden fixed inset-0 bg-black/50 z-50" onClick={() => setMenuOpen(false)}>
          <div 
            className="w-64 bg-white/95 backdrop-blur-xl h-full shadow-xl p-6 space-y-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-semibold text-indigo-700">Menu</h2>
              <button onClick={() => setMenuOpen(false)}><FaTimes size={20} /></button>
            </div>

            <Link to="/" className="flex items-center gap-3 text-gray-800 hover:text-indigo-600 text-lg font-medium">🏠 Home</Link>
            <Link to="/add-bus" className="flex items-center gap-3 text-gray-800 hover:text-indigo-600 text-lg font-medium">🚌 Add Bus</Link>
            <Link to="/view-bookings" className="flex items-center gap-3 text-gray-800 hover:text-indigo-600 text-lg font-medium">📅 View Bookings</Link>
          </div>
        </div>
      )}

      {/* Main */}
      <main className="flex-1 p-6 md:p-10 mt-16 md:mt-0 md:ml-4">

        {/* Glass Card */}
        <div className="bg-white/90 backdrop-blur-xl p-6 md:p-10 rounded-3xl shadow-2xl border border-white/40">

          <h1 className="text-3xl font-bold text-indigo-700 mb-2">👋 Hello, Owner</h1>
          <p className="text-gray-600 mb-6 text-sm md:text-base">Manage buses & bookings efficiently</p>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-white shadow-lg rounded-2xl p-6 text-center border border-gray-200">
              <h2 className="text-lg font-medium text-gray-700">Total Buses</h2>
              <input
                type="number"
                placeholder="0"
                className="text-3xl font-bold text-indigo-600 w-24 text-center mt-2 border-b outline-none"
                value={totalBuses}
                onChange={(e) => setTotalBuses(e.target.value)}
              />
            </div>
          </div>

          {/* Actions */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">

            <Link to="/add-bus" className="bg-white p-6 rounded-2xl shadow-lg border hover:scale-[1.02] hover:shadow-2xl transition flex items-center gap-4">
              <div className="bg-green-600 text-white p-4 rounded-full text-xl shadow-lg"><FaPlus /></div>
              <div>
                <h3 className="font-semibold text-lg text-gray-800">Add Bus</h3>
                <p className="text-sm text-gray-500">Register buses</p>
              </div>
            </Link>

            <Link to="/add-booking" className="bg-white p-6 rounded-2xl shadow-lg border hover:scale-[1.02] hover:shadow-2xl transition flex items-center gap-4">
              <div className="bg-blue-600 text-white p-4 rounded-full text-xl shadow-lg"><FaBus /></div>
              <div>
                <h3 className="font-semibold text-lg text-gray-800">Add Booking</h3>
                <p className="text-sm text-gray-500">Create bookings</p>
              </div>
            </Link>
          </div>

          <Link to="/view-bookings" className="bg-white p-6 rounded-2xl shadow-lg border hover:scale-[1.02] hover:shadow-2xl transition flex items-center gap-4">
            <div className="bg-gray-700 text-white p-4 rounded-full text-xl shadow-lg"><FaCalendarAlt /></div>
            <div>
              <h3 className="font-semibold text-lg text-gray-800">View Bookings</h3>
              <p className="text-sm text-gray-500">Passenger booking details</p>
            </div>
          </Link>

        </div>
      </main>

      {/* Bottom Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 w-full bg-white/95 backdrop-blur-xl shadow-xl flex justify-around py-3 z-50 border-t">
        <Link to="/" className="text-lg flex flex-col items-center text-indigo-600"><FaHome/><span className="text-xs">Home</span></Link>
        <Link to="/add-bus" className="text-lg flex flex-col items-center"><FaBus/><span className="text-xs">Buses</span></Link>
        <Link to="/view-bookings" className="text-lg flex flex-col items-center"><FaCalendarAlt/><span className="text-xs">Bookings</span></Link>
      </nav>
    </div>
  );
}
