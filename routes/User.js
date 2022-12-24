import express from "express";
import {
	deleteUser,
	getUserById,
	getUsers,
	subscription,
	updateUser,
} from "../controllers/Users.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

router.put("/me", verifyToken, updateUser);
router.get("/", getUsers);
router.get("/find/:id", getUserById);
router.put("/subunsub/:id", verifyToken, subscription);
router.delete("/me", verifyToken, deleteUser);

export default router;
