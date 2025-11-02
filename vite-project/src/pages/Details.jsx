// src/pages/ExperienceDetails.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function Details() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [experience, setExperience] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [selectedSlotId, setSelectedSlotId] = useState(null);


  useEffect(() => {
    const fetchExperience = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/experiences/${id}`);
        const data = await res.json();
        setExperience(data);

        // Set default selections if any slots exist
        if (data.slots && data.slots.length > 0) {
          const firstAvailable = data.slots.find((s) => s.available);
          if (firstAvailable) {
            setSelectedDate(firstAvailable.date);
            setSelectedTime(firstAvailable.time);
            setSelectedSlotId(firstAvailable.id);
          }
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchExperience();
  }, [id]);

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen text-gray-600">
        Loading...
      </div>
    );

  if (!experience)
    return (
      <div className="flex justify-center items-center h-screen text-red-500">
        Experience not found.
      </div>
    );

  const groupedSlots = experience.slots?.reduce((acc, slot) => {
    const date = new Date(slot.date).toDateString();
    if (!acc[date]) acc[date] = [];
    acc[date].push(slot);
    return acc;
  }, {}) || {};

  // Sample static tax calculation
  const tax = Math.round(experience.price * 0.06);
  const total = experience.price + tax;

  return (
    <div className="min-h-screen bg-gray-50">
     
      <div className="max-w-6xl mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left Section */}
        <div className="md:col-span-2">
          <button
            onClick={() => navigate(-1)}
            className="mb-6 bg-gray-100 px-4 py-2 rounded-lg hover:bg-gray-200 text-sm"
          >
            ← Details
          </button>

          <img
            src={experience.image}
            alt={experience.title}
            className="w-full h-80 object-cover rounded-xl shadow-md mb-6"
          />

          <h1 className="text-3xl font-semibold text-gray-800 mb-2">
            {experience.title}
          </h1>
          <p className="text-gray-500 mb-4">{experience.location}</p>
          <p className="text-gray-700 mb-4">{experience.description}</p>

          {/* Choose Date */}
          <div className="mb-4">
            <h3 className="text-gray-800 font-medium mb-2">Choose date</h3>
            <div className="flex gap-2 flex-wrap">
              {Object.keys(groupedSlots).length > 0 ? (
                Object.keys(groupedSlots).map((date) => (
                  <button
                    key={date}
                    onClick={() => {
  setSelectedDate(date);
  setSelectedTime(null);
  setSelectedSlotId(null);
}}
                    className={`px-3 py-1 rounded-lg text-sm border ${
                      selectedDate === date
                        ? "bg-yellow-400 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {date}
                  </button>
                ))
              ) : (
                <p className="text-gray-500 text-sm">No available dates</p>
              )}
            </div>
          </div>

          {/* Choose Time */}
          <div className="mb-6">
            <h3 className="text-gray-800 font-medium mb-2">Choose time</h3>
            <div className="flex gap-2 flex-wrap">
              {selectedDate && groupedSlots[selectedDate] ? (
                groupedSlots[selectedDate].map((slot) => (
                  <button
                    key={slot.id}
                    disabled={!slot.available}
                    onClick={() => {
  if (slot.available) {
    setSelectedTime(slot.time);
    setSelectedSlotId(slot._id || slot.id); 
  }
}}

                    className={`px-3 py-1 rounded-lg text-sm border transition-all ${
                      slot.available
                        ? selectedTime === slot.time
                          ? "bg-yellow-400 text-white"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        : "bg-gray-300 text-gray-400 cursor-not-allowed"
                    }`}
                  >
                    {slot.time}
                  </button>
                ))
              ) : (
                <p className="text-gray-500 text-sm">
                  Select a date to see available slots
                </p>
              )}
            </div>
            <p className="text-xs text-gray-400 mt-2">
              All times are in IST (GMT +5:30)
            </p>
          </div>

          {/* About */}
          <div className="mt-6">
            <h3 className="text-gray-800 font-medium mb-2">About</h3>
            <p className="bg-gray-100 text-gray-700 text-sm p-3 rounded-lg">
              {experience.about}
            </p>
          </div>
        </div>

        {/* Right Section (Booking Summary) */}
        <div className="bg-gray-150 rounded-2xl shadow-md p-6 h-fit">
          <div className="flex justify-between mb-3">
            <span className="text-gray-600 text-sm">Starts at</span>
            <span className="font-semibold text-gray-800">
              ₹{experience.price}
            </span>
          </div>

          <div className="flex justify-between text-sm text-gray-500 mb-1">
            <span>Subtotal</span>
            <span>₹{experience.price}</span>
          </div>
          <div className="flex justify-between text-sm text-gray-500 mb-1">
            <span>Taxes</span>
            <span>₹{tax}</span>
          </div>

          <hr className="my-3" />

          <div className="flex justify-between text-lg font-semibold text-gray-800 mb-4">
            <span>Total</span>
            <span>₹{total}</span>
          </div>
<button
  disabled={!selectedDate || !selectedTime}
  onClick={() => {
    if (selectedDate && selectedTime) {
      navigate(`/checkout/${id}`, {
        state: {
          experience,        
          selectedDate,
          selectedTime,
          selectedSlotId, // pass slot id
        },
      });
    }
  }}
  className={`w-full font-medium py-2 rounded-lg transition-all ${
    selectedDate && selectedTime
      ? "bg-yellow-500 hover:bg-yellow-600 text-white"
      : "bg-gray-300 text-gray-500 cursor-not-allowed"
  }`}
>
  {selectedDate && selectedTime
    ? "Confirm Booking"
    : "Select a slot to continue"}
</button>
        </div>
      </div>
    </div>
  );
}
