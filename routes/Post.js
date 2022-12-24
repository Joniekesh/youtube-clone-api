import { verifyToken } from "../middleware/verifyToken.js";
import express from "express";
import {
	comment,
	createPost,
	deleteComment,
	deletePost,
	getPostById,
	getPosts,
	likeUnlikeComment,
	likeUnlikePost,
	updateComment,
	updatePost,
	createReply,
	updateReply,
	likeUnlikeReply,
	deleteReply,
} from "../controllers/Posts.js";
const router = express.Router();

router.post("/", verifyToken, createPost);
router.get("/find/:id", getPostById);
router.get("/", getPosts);
router.put("/:id", verifyToken, updatePost);
router.delete("/:id", verifyToken, deletePost);
router.put("/likes/:id", verifyToken, likeUnlikePost);
router.post("/comments/:id", verifyToken, comment);
router.put("/comments/likes/:id/:commentId", verifyToken, likeUnlikeComment);
router.put("/comments/:id/:commentId", verifyToken, updateComment);
router.delete("/comments/:id/:commentId", verifyToken, deleteComment);
router.post("/comments/replies/:id/:commentId", verifyToken, createReply);
router.put(
	"/comments/replies/:id/:commentId/:replyId",
	verifyToken,
	updateReply
);
router.put(
	"/comments/replies/likeunlikes/:id/:commentId/:replyId",
	verifyToken,
	likeUnlikeReply
);
router.delete(
	"/comments/replies/likeunlikes/:id/:commentId/:replyId",
	verifyToken,
	deleteReply
);

export default router;
