import mongoose from "mongoose";

export const NoteBookUserSchema = mongoose.Schema({
  Name: {
    type: String,
  },
  Email: {
    type: String,
    required: true,
    unique: true,
  },
  Username: {
    type: String,
    required: true,
    unique: true,
  },
  Password: {
    type: String,
    required: true,
  },
  CreatedAt: {
    type: Date,
    default: Date.now(),
  },
});

export const NoteUser = mongoose.model("noteBookUser", NoteBookUserSchema);
