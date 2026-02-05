import express from "express";
import { verifyToken } from "../utlis/verifyUser.js";
import {
  addNote,
  deleteNote,
  editNote,
  getAllnotes,
  handleisPinned,
  searchNotes,
} from "../controllers/note_controllers.js";

export const noteRoute = express.Router();

noteRoute.post("/add", verifyToken, addNote);
noteRoute.post("/delete/:id", verifyToken, deleteNote);
noteRoute.post("/edit/:id", verifyToken, editNote);
noteRoute.put("/pinned/:id", verifyToken, handleisPinned);
noteRoute.get("/all", verifyToken, getAllnotes);
noteRoute.get("/find", verifyToken, searchNotes);
