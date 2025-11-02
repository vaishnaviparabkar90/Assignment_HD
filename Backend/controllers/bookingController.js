// controllers/bookingController.js
import db from "../db/index.js";

export const createBooking = async (req, res) => {
  const client = await db.getClient();
  try {
    const {
      fullName,
      email,
      experienceId,
      slotId,
      selectedDate,
      selectedTime,
      quantity = 1,
      subtotal,
      taxes,
      total,
    } = req.body;

    if (!fullName || !email || !experienceId || !selectedDate || !selectedTime) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    await client.query("BEGIN");
    if (slotId) {
      const slotQ = `select id, available from slots where id = $1 for update`;
      const slotRes = await client.query(slotQ, [slotId]);

      if (slotRes.rowCount === 0) {
        await client.query("ROLLBACK");
        return res.status(404).json({ message: "Slot not found" });
      }

      const slot = slotRes.rows[0];
      if (!slot.available) {
        await client.query("ROLLBACK");
        return res.status(400).json({ message: "Slot is already booked" });
      }

      // mark slot as unavailable
      const updateSlotQ = `update slots set available = false where id = $1`;
      await client.query(updateSlotQ, [slotId]);
    }

    const insertBookingQ = `
      insert into bookings
        (full_name, email, experience_id, slot_id, quantity, subtotal, taxes, total, status, selected_date, selected_time)
      values ($1,$2,$3,$4,$5,$6,$7,$8,'confirmed',$9,$10)
      returning id, full_name, email, experience_id, slot_id, quantity, subtotal, taxes, total, status, selected_date, selected_time, created_at
    `;

    const bookingRes = await client.query(insertBookingQ, [
      fullName,
      email,
      experienceId,
      slotId || null, 
      quantity,
      subtotal,
      taxes,
      total,
      selectedDate,
      selectedTime,
    ]);

    await client.query("COMMIT");

    res.json({ success: true, booking: bookingRes.rows[0] });
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("Booking error:", err);
    res.status(500).json({ message: "Booking failed", error: err.message });
  } finally {
    client.release();
  }
};
