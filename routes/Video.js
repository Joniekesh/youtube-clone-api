import express from "express";
import {
	addRemoveDislike,
	addRemoveLike,
	addRemoveVideoDislike,
	addRemoveVideoLike,
	addView,
	createComment,
	createVideo,
	deleteVideo,
	getVideoById,
	random,
	search,
	sub,
	tags,
	trend,
	updateVideo,
	deleteComment,
} from "../controllers/Videos.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

router.post("/", verifyToken, createVideo);
router.get("/find/:id", getVideoById);
router.get("/random", random);
router.get("/trend", trend);
router.get("/sub", verifyToken, sub);
router.get("/tags", tags);
router.get("/search", search);
router.put("/find/:id/update", verifyToken, updateVideo);
router.put("/views/:id", addView);
router.put("/addRemoveVideoLikes/:id", verifyToken, addRemoveVideoLike);
router.put("/addRemoveVideoDislikes/:id", verifyToken, addRemoveVideoDislike);
router.delete("/:id", verifyToken, deleteVideo);
router.post("/comments/:videoId", verifyToken, createComment);
router.put(
	"/comments/addRemoveLikes/:videoId/:commentId",
	verifyToken,
	addRemoveLike
);
router.put(
	"/comments/addRemoveDislikes/:videoId/:commentId",
	verifyToken,
	addRemoveDislike
);
router.delete("/comments/:videoId/:commentId", verifyToken, deleteComment);

export default router;
