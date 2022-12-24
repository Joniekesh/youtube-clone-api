import Post from "../models/Post.js";

// Create post
export const createPost = async (req, res, next) => {
	const newPost = new Post({
		userId: req.user.id,
		text: req.body.text,
	});
	try {
		const savedPost = await newPost.save();
		res.status(201).json(savedPost);
	} catch (err) {
		next(err);
	}
};

// Get all posts
export const getPosts = async (req, res, next) => {
	try {
		const posts = await Post.find();
		res.status(200).json(posts);
	} catch (err) {
		next(err);
	}
};

// Get post by ID
export const getPostById = async (req, res, next) => {
	try {
		const post = await Post.findById(req.params.id);
		res.status(200).json(post);
	} catch (err) {
		next(err);
	}
};

// Update post
export const updatePost = async (req, res, next) => {
	try {
		const post = await Post.findById(req.params.id);
		if (req.user.id === post.userId) {
			const updatedPost = await Post.findByIdAndUpdate(
				req.params.id,
				{ $set: req.body },
				{ new: true }
			);
			res.status(200).json(updatedPost);
		} else {
			res.status(404).json("You can only update your own post");
		}
	} catch (err) {
		next(err);
	}
};

// Delete post
export const deletePost = async (req, res, next) => {
	try {
		await Post.findByIdAndDelete(req.params.id);
		res.status(200).json("Post deleted");
	} catch (err) {
		next(err);
	}
};

// Like/Unlike post
export const likeUnlikePost = async (req, res, next) => {
	try {
		const post = await Post.findById(req.params.id);
		if (!post) {
			return res.status(404).json("Post not found");
		}

		if (!post.likes.includes(req.user.id)) {
			await Post.findByIdAndUpdate(req.params.id, {
				$push: { likes: req.user.id },
			});
			res.status(200).json("Like added");
		} else {
			await Post.findByIdAndUpdate(req.params.id, {
				$pull: { likes: req.user.id },
			});
			res.status(200).json("Like removed");
		}
	} catch (err) {
		next(err);
	}
};

// Create comment
export const comment = async (req, res, next) => {
	const newComment = {
		userId: req.user.id,
		text: req.body.text,
	};
	try {
		const post = await Post.findById(req.params.id);

		if (!post) {
			return res.status(404).json("Post not found");
		}

		post.comments.unshift(newComment);
		await post.save();

		res.status(201).json(newComment);
	} catch (err) {
		next(err);
	}
};

// Like/Unlike comment
export const likeUnlikeComment = async (req, res, next) => {
	try {
		const post = await Post.findById(req.params.id);

		if (!post) {
			return res.status(404).json("Post not found");
		}

		//pull comment
		const comment = post.comments.find(
			(comment) => comment._id.toString() === req.params.commentId
		);

		if (!comment) {
			return res.status(404).json("Comment not found");
		}
		if (!comment.likes.includes(req.user.id)) {
			comment.likes.push(req.user.id);
			await post.save();

			return res.status(200).json("Comment liked");
		} else {
			comment.likes = comment.likes.filter((like) => like !== req.user.id);
			await post.save();

			return res.status(200).json("Comment disliked");
		}
	} catch (err) {
		next(err);
	}
};

// Update comment
export const updateComment = async (req, res, next) => {
	try {
		const post = await Post.findById(req.params.id);

		if (!post) {
			return res.status(404).json("Post not found");
		}

		//pull comment
		const comment = post.comments.find(
			(comment) => comment._id.toString() === req.params.commentId
		);

		if (!comment) {
			return res.status(404).json("Comment not found");
		}

		if (comment.userId === req.user.id) {
			comment.text = req.body.text || comment.text;
			await post.save();
			return res.status(200).json(comment);
		} else {
			res.status().json("You can only update your own comment");
		}
	} catch (err) {
		next(err);
	}
};

// Delete comment
export const deleteComment = async (req, res, next) => {
	try {
		const post = await Post.findById(req.params.id);

		if (!post) {
			return res.status(404).json("Post not found");
		}

		// pull comment out of post
		const comment = post.comments.find(
			(comment) => comment._id.toString() === req.params.commentId
		);

		if (!comment) {
			return res.status(404).json("comment not found");
		}

		post.comments = post.comments.filter(
			(comment) => comment._id.toString() !== req.params.commentId
		);
		await post.save();
		res.status(200).json("Comment deleted");
	} catch (err) {
		next(err);
	}
};

// Create reply
export const createReply = async (req, res, next) => {
	try {
		const post = await Post.findById(req.params.id);
		if (!post) {
			return res.status(404).json("Post not found");
		}

		// pull comment out of post
		const comment = post.comments.find(
			(comment) => comment._id.toString() === req.params.commentId
		);

		if (!comment) {
			return res.status(404).json("Comment not found");
		}

		const newReply = {
			userId: req.user.id,
			text: req.body.text,
		};
		comment.replies.unshift(newReply);

		await post.save();

		res.status(201).json(newReply);
	} catch (err) {
		next(err);
	}
};

// Update reply
export const updateReply = async (req, res, next) => {
	try {
		const post = await Post.findById(req.params.id);
		if (!post) {
			return res.status(404).json("Post not found");
		}

		// pull comment out of post
		const comment = post.comments.find(
			(comment) => comment._id.toString() === req.params.commentId
		);

		if (!comment) {
			return res.status(404).json("Comment not found");
		}

		// pull reply out of comment
		const reply = comment.replies.find(
			(reply) => reply._id.toString() === req.params.replyId
		);

		if (!reply) {
			return res.status(404).json("Reply not found");
		}

		if (reply.userId === req.user.id) {
			reply.text = req.body.text || reply.text;
			await post.save();

			res.status(200).json(reply);
		} else {
			return res.status(404).json("You can only updated reply created by you");
		}
	} catch (err) {
		next(err);
	}
};

// Like/Unlike reply
export const likeUnlikeReply = async (req, res, next) => {
	try {
		const post = await Post.findById(req.params.id);
		if (!post) {
			return res.status(404).json("Post not found");
		}

		// pull comment out of post
		const comment = post.comments.find(
			(comment) => comment._id.toString() === req.params.commentId
		);

		if (!comment) {
			return res.status(404).json("Comment not found");
		}

		// pull reply out of comment
		const reply = comment.replies.find(
			(reply) => reply._id.toString() === req.params.replyId
		);

		if (!reply) {
			return res.status(404).json("Reply not found");
		}

		if (!reply.likes.includes(req.user.id)) {
			reply.likes.push(req.user.id);
			await post.save();
			res.status(200).json("Like added");
		} else {
			reply.likes = reply.likes.filter((like) => like !== req.user.id);
			await post.save();
			res.status(200).json("Like removed");
		}
	} catch (err) {
		next(err);
	}
};

// Delete reply
export const deleteReply = async (req, res, next) => {
	try {
		const post = await Post.findById(req.params.id);
		if (!post) {
			return res.status(404).json("Post not found");
		}

		// pull comment out of post
		const comment = post.comments.find(
			(comment) => comment._id.toString() === req.params.commentId
		);

		if (!comment) {
			return res.status(404).json("Comment not found");
		}

		// pull reply out of comment
		const reply = comment.replies.find(
			(reply) => reply._id.toString() === req.params.replyId
		);

		if (!reply) {
			return res.status(404).json("Reply not found");
		}

		if (reply.userId === req.user.id) {
			comment.replies = comment.replies.filter(
				(reply) => reply._id.toString() !== req.params.replyId
			);
			await post.save();
			res.status(200).json("Reply removed");
		} else {
			res.status(404).json("You can only delete reply created by you");
		}
	} catch (err) {
		next(err);
	}
};
