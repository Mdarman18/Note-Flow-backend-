import { noteDetalis } from "../Model/note_model.js";
import { errorHandlers } from "../utlis/error.js";

export const addNote = async (req, res, next) => {
  const { title, content, tags } = req.body;
  if (!title) {
    return next(errorHandlers(400, "Title is required"));
  }
  if (!content) {
    return next(errorHandlers(400, "Content is required"));
  }
  try {
    const note = new noteDetalis({
      title: title,
      content: content,
      tags: tags || [],
      userId: req.user.id,
    });
    await note.save();
    console.log(note.userId);

    return res.status(200).json({
      message: "note added successfully..",
      success: true,
      note,
    });
  } catch (error) {
    next(error);
  }
};

// ===----Edit notes =====-----------
export const editNote = async (req, res, next) => {
  const note = await noteDetalis.findById(req.params.id);
  if (!note) {
    return next(errorHandlers(404, "note not found"));
  }
  if (req.user.id !== note.userId) {
    return next(errorHandlers(404, "user not found"));
  }
  const { title, content, tags, isPinned } = req.body;
  if (!title && !content && !tags) {
    return next(errorHandlers(404, "no changes found"));
  }
  try {
    if (title) {
      note.title = title;
    }
    if (content) {
      note.content = content;
    }
    if (tags) {
      note.tags = tags;
    }
    await note.save();
    return res.status(200).json({
      message: "note updated successfully..",
      success: true,
      note,
    });
  } catch (error) {
    next(error);
  }
};

// ======--------getAllnotes ==========--------------------
export const getAllnotes = async (req, res, next) => {
  const userId = req.user.id;
  try {
    const note = await noteDetalis
      .find({ userId: userId })
      .sort({ isPinned: -1 });
    return res.status(200).json({
      message: "all notes are received",
      success: true,
      note,
    });
  } catch (error) {
    next(error);
  }
};
// ====---Delete Note ====-----------
export const deleteNote = async (req, res, next) => {
  try {
    const note = await noteDetalis.deleteOne({
      _id: req.params.id,
      userId: req.user.id,
    });
    if (note.deletedCount === 0) {
      return next(errorHandlers(404, "Note not found"));
    }
    return res.status(200).json({
      message: "note deleted successfully..",
      success: true,
    });
  } catch (error) {
    next(error);
  }
};

// ===-------Handle pinned or unpinned =====-----------------
export const handleisPinned = async (req, res, next) => {
  try {
    const note = await noteDetalis.findById(req.params.id);
    if (!note) {
      return next(errorHandlers(404, "note not found"));
    }
    if (req.user.id !== note.userId) {
      return next(errorHandlers(404, "user not found"));
    }
    const { isPinned } = req.body;
    note.isPinned = isPinned;
    await note.save();
    if (note.isPinned == false)
      return res.status(200).json({
        message: "note is unpinned successfully..",
        success: true,
      });
    return res.status(200).json({
      message: "note is pinned successfully..",
      success: true,
    });
  } catch (error) {
    next(error);
  }
};

// ==========-----search note ===========------
export const searchNotes = async (req, res, next) => {
  const { query } = req.query;
  if (!query) return errorHandlers(400, "Search query is not found");

  try {
    const isMatched = await noteDetalis.find({
      userId: req.user.id,
      $or: [
        { title: { $regex: new RegExp(query, "i") } },
        { content: { $regex: new RegExp(query, "i") } },
      ],
    });

    if (isMatched.length === 0)
      return errorHandlers(404, "No notes matched your query.");

    return res.status(200).json({
      message: "Notes matched successfully.",
      success: true,
      note:isMatched, // 🔥 return matched notes
    });
  } catch (error) {
    next(error);
  }
};
