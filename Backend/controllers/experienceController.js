// controllers/experienceController.js
import db from "../db/index.js";

export const getExperiences = async (req, res) => {
  try {
    const q = `
      select id, title, location, description, about, image, price
      from experiences
      order by title;
    `;
    const { rows } = await db.query(q);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch experiences" });
  }
};

export const getExperienceById = async (req, res) => {
  try {
    const { id } = req.params;

    const expQ = `
      select id, title, location, description, about, image, price
      from experiences where id = $1
    `;
    const expRes = await db.query(expQ, [id]);
    if (expRes.rows.length === 0) {
      return res.status(404).json({ message: "Experience not found" });
    }
    const experience = expRes.rows[0];

    const slotsQ = `
      select id, experience_id, date, time, available
      from slots
      where experience_id = $1
      order by date, time;
    `;
    const slotsRes = await db.query(slotsQ, [id]);
    experience.slots = slotsRes.rows;

    res.json(experience);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch experience" });
  }
};
