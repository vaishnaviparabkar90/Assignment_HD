// src/components/ExperienceCard.jsx
import React from "react";
import { useNavigate } from "react-router-dom";

export default function ExperienceCard({ experience }) {
  const navigate = useNavigate();

  const handleViewDetails = () => {
    navigate(`/experiences/${experience.id}`);
  };

  return (
    <div className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition duration-300">
      <img
        src={experience.image}
        alt={experience.title}
        className="w-full h-56 object-cover"
      />
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-800">{experience.title}</h3>
        <p className="text-sm text-gray-500">{experience.location}</p>
        <div className="flex items-center justify-between mt-3">
          <span className="text-gray-900 font-medium">₹{experience.price}</span>
          <button
            onClick={handleViewDetails}
            className="bg-yellow-500 hover:bg-yellow-600 text-white text-sm px-3 py-1.5 rounded-lg"
          >
            View Details
          </button>
        </div>
      </div>
    </div>
  );
}
