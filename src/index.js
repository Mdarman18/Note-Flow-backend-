import express from "express";
const app = express();
import dotenv from "dotenv";
dotenv.config();
const port = process.env.PORT || 4000;

// ==-------Db connections ==--------
import { dbConnection } from "./connections/connection.js";
import { route } from "./route/UserRoute.js";
dbConnection();

// ===---Middlewares ==------------
import cookieParser from "cookie-parser";
import cors from "cors";
import { noteRoute } from "./route/note_route.js";
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  cors({
    origin: [
      "https://note-flow-frontend-rose.vercel.app",
      "http://localhost:5173",
    ],
    credentials: true,
  }),
);
// ====---Main Routes -----==========
app.get("/", (req, res) => {
  res.send("Note-Flow Backend is Live 🚀");
});
// ===---Log in and signup routes =====-----
app.use("/api/user", route);

// ===------Note detalis route ======------
app.use("/api/note", noteRoute);

app.listen(port, () => {
  console.log(`http://localhost:${port}`);
});
