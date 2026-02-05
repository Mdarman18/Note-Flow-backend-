import mongoose from "mongoose";

const noteUserSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  tags: {
    type: [String],
    default: [],
  },
  isPinned: {
    type: Boolean,
  },
  // userId: { type: mongoose.Schema.Types.ObjectId, ref: "NoteUser" },
  userId: {
    type: String,
    required: true,
  },
});

export const noteDetalis = mongoose.model("note", noteUserSchema);
