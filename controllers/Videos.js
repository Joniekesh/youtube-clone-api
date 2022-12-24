import User from "../models/User.js";
import Video from "../models/Video.js";

// @desc   Create video
// @route  POST /api/videos
// @access  Private
export const createVideo = async (req, res, next) => {
	const newVideo = new Video({ userId: req.user.id, ...req.body });
	try {
		const savedVideo = await newVideo.save();
		res.status(200).json(savedVideo);
	} catch (err) {
		next(err);
	}
};

// @desc   Get Video by ID
// @route  GET /api/videos/find/:id
// @access  Public
export const getVideoById = async (req, res, next) => {
	try {
		const video = await Video.findById(req.params.id);

		if (!video) {
			return res.status(404).json("Video not found");
		}

		res.status(200).json(video);
	} catch (err) {
		next(err);
	}
};

// @desc   Get Random Videos
// @route  GET /api/videos/random
// @access  Public
export const random = async (req, res, next) => {
	try {
		const videos = await Video.aggregate([{ $sample: { size: 2 } }]);

		res.status(200).json(videos);
	} catch (err) {
		next(err);
	}
};

// @desc   Get Trending Videos
// @route  GET /api/videos/trend
// @access  Public
export const trend = async (req, res, next) => {
	try {
		const videos = await Video.find().sort({ views: -1 });

		res.status(200).json(videos);
	} catch (err) {
		next(err);
	}
};

// @desc   Get Subscribed Channels Videos
// @route  GET /api/videos/sub
// @access  Public
export const sub = async (req, res, next) => {
	try {
		const user = await User.findById(req.user.id);
		const subScribedChannels = user.subscribedUsers;

		const list = await Promise.all(
			subScribedChannels.map(async (channelId) => {
				return await Video.find({ userId: channelId });
			})
		);
		res.status(200).json(list.flat().sort((a, b) => b.createdAt - a.createdAt));
	} catch (err) {
		next(err);
	}
};

// @desc   Get Videos by Tags
// @route  GET /api/videos/tags
// @access  Public
export const tags = async (req, res, next) => {
	const tags = req.query.tags.split(",");
	try {
		const videos = await Video.find({ tags: { $in: tags } }).limit(20);

		res.status(200).json(videos);
	} catch (err) {
		next(err);
	}
};

// @desc   Get Videos by title search
// @route  GET /api/videos/search
// @access  Public
export const search = async (req, res, next) => {
	const query = req.query.q;
	try {
		const videos = await Video.find({
			title: { $regex: query, $options: "i" },
		}).limit(40);

		res.status(200).json(videos);
	} catch (err) {
		next(err);
	}
};

// @desc   Update Video
// @route  PUT /api/videos/:id
// @access  Private
export const updateVideo = async (req, res, next) => {
	try {
		const video = await Video.findById(req.params.id);

		if (video.userId === req.user.id) {
			const updatedVideo = await Video.findByIdAndUpdate(
				req.params.id,
				{ $set: req.body },
				{ new: true }
			);

			res.status(200).json(updatedVideo);
		} else {
			res.status(404).json("You can only update your own video");
		}
	} catch (err) {
		next(err);
	}
};

// @desc   Add View
// @route  PUT /api/videos/views/:id
// @access  Private
export const addView = async (req, res, next) => {
	try {
		await Video.findByIdAndUpdate(req.params.id, {
			$inc: { views: 1 },
		});
		res.status(200).json("The view has been increased.");
	} catch (err) {
		next(err);
	}
};

// @desc   Add or Remove Video Like
// @route  PUT /api/videos/addRemoveVideoLikes/:id
// @access  Private
export const addRemoveVideoLike = async (req, res, next) => {
	try {
		const video = await Video.findById(req.params.id);

		if (!video.likes.includes(req.user.id)) {
			await Video.findByIdAndUpdate(req.params.id, {
				$addToSet: { likes: req.user.id },
				$pull: { dislikes: req.user.id },
			});
			res.status(200).json("Like Added");
		} else {
			await Video.findByIdAndUpdate(req.params.id, {
				$pull: { likes: req.user.id },
				// $addToSet: { dislikes: req.user.id },
			});
			res.status(200).json("Like Removed");
		}
	} catch (err) {
		next(err);
	}
};
// @desc   Add or Remove Video Dislike
// @route  PUT /api/videos/addRemoveVideoDislikes/:id
// @access  Private
export const addRemoveVideoDislike = async (req, res, next) => {
	try {
		const video = await Video.findById(req.params.id);

		if (video.likes.includes(req.user.id)) {
			await Video.findByIdAndUpdate(req.params.id, {
				$addToSet: { dislikes: req.user.id },
				$pull: { likes: req.user.id },
			});
			res.status(200).json("Dislike Added");
		} else {
			await Video.findByIdAndUpdate(req.params.id, {
				$pull: { dislikes: req.user.id },
				// $push: { dislikes: req.user.id },
			});
			res.status(200).json("Dislike Removed");
		}
	} catch (err) {
		next(err);
	}
};

// @desc   Delete Video
// @route  DELETE /api/videos/:id
// @access  Private
export const deleteVideo = async (req, res, next) => {
	try {
		const video = await Video.findById(req.params.id);

		if (video.userId === req.user.id) {
			await Video.findByIdAndDelete(req.params.id);

			res.status(200).json("Video deleted");
		} else {
			res.status(404).json("You can only delete your own video");
		}
	} catch (err) {
		next(err);
	}
};

// @desc   Add Comment
// @route  POST /api/videos/comments/:videoId
// @access  Private
export const createComment = async (req, res, next) => {
	const { text } = req.body;
	try {
		const video = await Video.findById(req.params.videoId);

		if (!video) {
			return res.status(404).json("Video not found");
		}

		const newComment = {
			userId: req.user.id,
			videoId: video._id,
			text,
		};

		video.comments.unshift(newComment);
		await video.save();

		return res.status(201).json(newComment);
	} catch (err) {
		next(err);
	}
};

// @desc   Add or Remove Comment Like
// @route  PUT /api/videos/comments/addRemoveLikes/:videoId/:/commentId
// @access  Private
export const addRemoveLike = async (req, res, next) => {
	try {
		const video = await Video.findById(req.params.videoId);

		if (!video) {
			return res.status(404).json("Video not found");
		}

		const comment = video.comments.find(
			(comment) => comment._id.toString() === req.params.commentId
		);

		if (!comment) {
			return res.status(404).json("Comment not found");
		}

		if (!comment.likes.some(({ _id }) => _id.toString() === req.user.id)) {
			comment.likes.push({ _id: req.user.id });

			await video.save();
			res.status(200).json("Like added");
		} else {
			comment.likes = comment.likes.filter(
				({ _id }) => _id.toString() !== req.user.id
			);
			await video.save();

			res.status(200).json("Like removed");
		}
	} catch (err) {
		next(err);
	}
};

// @desc   Add Or Remove  Comment Dislike
// @route  PUT /api/videos/comments/addRemoveDislikes/:videoId/:/commentId
// @access  Private
export const addRemoveDislike = async (req, res, next) => {
	try {
		const video = await Video.findById(req.params.videoId);

		if (!video) {
			return res.status(404).json("Video not found");
		}

		const comment = video.comments.find(
			(comment) => comment._id.toString() === req.params.commentId
		);

		if (!comment) {
			return res.status(404).json("Comment not found");
		}

		if (!comment.dislikes.some(({ _id }) => _id.toString() === req.user.id)) {
			comment.dislikes.push({ _id: req.user.id });

			if (comment.likes.some(({ _id }) => _id.toString() === req.user.id)) {
				comment.likes = comment.likes.filter(
					({ _id }) => _id.toString() !== req.user.id
				);
			}

			await video.save();
			return res.status(200).json("Dislike added");
		} else {
			comment.dislikes = comment.dislikes.filter(
				({ _id }) => _id.toString() !== req.user.id
			);
		}
		await video.save();
		res.status(200).json("Dislike removed");
	} catch (err) {
		next(err);
	}
};

// @desc   Delete Comment
// @route  DELETE /api/videos/comments/:videoId/:commentId
// @access  Private
export const deleteComment = async (req, res, next) => {
	try {
		const video = await Video.findById(req.params.videoId);

		if (!video) {
			return res.status(404).json("Video not found");
		}

		const comment = video.comments.find(
			(comment) => comment._id.toString() === req.params.commentId
		);

		if (!comment) {
			return res.status(404).json("Comment not found");
		}

		if (comment.userId === req.user.id) {
			video.comments = video.comments.filter(
				(comment) => comment._id.toString() !== req.params.commentId
			);
			await video.save();
			res.status(200).json("Comment removed!");
		} else {
			res.status(404).json("You can delete only your own comment.");
		}
	} catch (err) {
		next(err);
	}
};
