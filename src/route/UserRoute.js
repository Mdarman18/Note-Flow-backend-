import express from "express";
import {
  HandleLogin,
  HandleLogout,
  HandleSignUp,
} from "../controllers/UserController.js";
import { verifyToken } from "../utlis/verifyUser.js";

export const route = express.Router();

route.post("/login", HandleLogin);
route.post("/signup", HandleSignUp);
route.get("/logout", verifyToken, HandleLogout);
