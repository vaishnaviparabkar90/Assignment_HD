import React, { useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";

export default function Checkout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { id } = useParams(); 

  const { experience, selectedDate, selectedTime, selectedSlotId } = location.state || {};

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [promoCode, setPromoCode] = useState("");
const [discount, setDiscount] = useState(0);
const [promoError, setPromoError] = useState("");

const applyPromo = () => {
  const code = promoCode.trim().toUpperCase();
  if (code === "WELCOME10") {
    const discountAmount = Math.round((experience.price + tax) * 0.10);
    setDiscount(discountAmount);
    setPromoError("");
  } else {
    setDiscount(0);
    setPromoError("Invalid promo code");
  }
};


  if (!experience || !selectedDate || !selectedTime) {
    return (
      <div className="flex flex-col items-center justify-center h-screen text-gray-600">
        <p className="text-lg">Missing booking data. Please select a slot again.</p>
        <button
          onClick={() => navigate("/")}
          className="mt-4 px-5 py-2 bg-yellow-500 hover:bg-yellow-600 text-white font-medium rounded-lg transition"
        >
          Go Back Home
        </button>
      </div>
    );
  }

  const tax = Math.round(experience.price * 0.06);
  const total = experience.price + tax;
const finalTotal = total - discount;
  const handleBooking = async () => {
    
    if (!fullName.trim() || !email.trim()) {
      setErrorMsg("Please fill in both name and email before continuing.");
      return;
    }

    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setErrorMsg("Please enter a valid email address.");
      return;
    }

    setErrorMsg("");
    setIsLoading(true);

    try {
      const response = await fetch("http://localhost:5000/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
  fullName,
  email,
  experienceId: experience.id,
  slotId: selectedSlotId || null, 
  selectedDate,
  selectedTime,
  quantity: 1,
  subtotal: experience.price,
  taxes: tax,
  total,
}),
      });
      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Booking failed");
      }

      navigate("/success", { state: { booking: data.booking } });
    } catch (err) {
      console.error("Booking error:", err);
      setErrorMsg(err.message || "Something went wrong while booking.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
  <div className="bg-grey-200 min-h-screen p-6">
    <div className="max-w-6xl mx-auto">
      <div className="bg-black-500 text-white p-6 flex items-center gap-3">
   <button
    onClick={() => navigate(-1)}
    className="text-black font-semibold text-2xl px-2 py-1 hover:opacity-70"
  >
    ← Back
  </button>
</div>

      <h2 className="text-lg font-semibold text-gray-800 mb-6">Checkout</h2>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* LEFT SECTION */}
        <div className="flex-1 space-y-6">

          {/* User Info + Promo Card */}
          <div className="bg-gray-100 border border-gray-200 rounded-xl p-5 shadow-sm">
            {/* Full Name + Email */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <input
                type="text"
                placeholder="Full name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-1 focus:ring-yellow-400 focus:outline-none"
              />
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-1 focus:ring-yellow-400 focus:outline-none"
              />
            </div>

            {/* Promo Code */}
            <div className="flex gap-3 mb-3">
              <input
                type="text"
                placeholder="Promo code"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value)}
                className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:ring-1 focus:ring-yellow-400 focus:outline-none"
              />
              <button
                onClick={applyPromo}
                className="px-5 py-2 bg-gray-600 hover:bg-gray-900 text-white font-medium rounded-lg transition"
              >
                Apply
              </button>
            </div>

            <div className="flex items-center gap-2">
              <input type="checkbox" className="w-4 h-4" />
              <p className="text-xs text-gray-600">I agree to the terms and safety policy</p>
            </div>

            {/* Promo Messages */}
            {discount > 0 && (
              <p className="text-green-600 text-sm mt-2 font-medium">
                Promo applied! You saved ₹{discount}
              </p>
            )}
            {promoError && (
              <p className="text-red-500 text-sm mt-2 font-medium">{promoError}</p>
            )}
          </div>
        </div>

        {/* RIGHT SECTION - SUMMARY CARD */}
        <div className="w-full lg:w-80 bg-gray-100 border border-gray-200 shadow-sm rounded-xl p-5 h-fit">
          <div className="text-right text-sm text-gray-600 space-y-1 mb-3">
            <p className="text-right font-semibold text-gray-800"> Experience:{experience.title}</p>
            <p>Date: {selectedDate}</p>
            <p>Time: {selectedTime}</p>
            <p>Qty: 1</p>
          </div>

          <div className="border-t border-gray-200 pt-2 space-y-2 text-sm">
            <div className="flex justify-between text-gray-600">
              <span>Subtotal</span>
              <span>₹{experience.price}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Taxes</span>
              <span>₹{tax}</span>
            </div>

            {discount > 0 && (
              <div className="flex justify-between text-green-600 font-medium">
                <span>Promo Discount</span>
                <span>-₹{discount}</span>
              </div>
            )}

            <div className="flex justify-between font-semibold text-gray-900 text-base pt-2">
              <span>Total</span>
              <span>₹{finalTotal}</span>
            </div>
          </div>

          {/* Pay Button */}
          <button
            onClick={handleBooking}
            disabled={isLoading}
            className={`w-full mt-5 py-3 font-semibold rounded-lg text-white ${
              isLoading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-yellow-500 hover:bg-yellow-600"
            }`}
          >
            {isLoading ? "Processing..." : "Pay and Confirm"}
          </button>
        </div>
      </div>
    </div>
  </div>
);
}
