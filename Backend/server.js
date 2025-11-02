// server.js=
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import experiencesRouter from "./routes/experiences.js";
import bookingsRouter from "./routes/bookings.js";
dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

// prefix API
app.use("/api/experiences", experiencesRouter);
app.use("/api/bookings", bookingsRouter);

app.get("/", (req, res) => res.json({ message: "BookIt backend running" }));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
