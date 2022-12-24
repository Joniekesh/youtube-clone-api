import express from "express";
import { getProfile, login, register } from "../controllers/Auth.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

router.get("/me", verifyToken, getProfile);
router.post("/", register);
router.post("/login", login);

export default router;
