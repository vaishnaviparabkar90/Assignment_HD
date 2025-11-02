import React from "react";
import { useNavigate } from "react-router-dom";

const Success = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white text-center px-4">
      <div className="w-20 h-20 bg-green-500 text-white flex items-center justify-center rounded-full text-4xl">
        ✓
      </div>

      <h1 className="text-3xl font-semibold mt-6">Booking Successful!</h1>
      <p className="text-gray-600 mt-2 max-w-md">
        Thank you for your booking.
      </p>

      <button
        onClick={() => navigate("/")}
        className="mt-6 bg-gray-600 text-white px-5 py-2 rounded-lg hover:bg-gray-800 transition"
      >
        Back to Home
      </button>
    </div>
  );
};

export default Success;