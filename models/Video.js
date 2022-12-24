import mongoose from "mongoose";

const VideoSchema = new mongoose.Schema(
	{
		userId: {
			type: String,
			required: true,
		},
		imgUrl: {
			type: String,
			required: true,
		},
		title: {
			type: String,
			required: true,
		},
		desc: {
			type: String,
			required: true,
		},
		videoUrl: {
			type: String,
			required: true,
		},
		views: {
			type: Number,
			default: 0,
		},
		tags: {
			type: [String],
			default: [],
		},
		likes: {
			type: [String],
			default: [],
		},
		dislikes: {
			type: [String],
			default: [],
		},
		comments: [
			{
				userId: {
					type: String,
					required: true,
				},
				videoId: {
					type: String,
					required: true,
				},
				text: {
					type: String,
					required: true,
				},
				date: {
					type: Date,
					default: Date.now,
				},
				likes: [
					{
						userId: {
							type: String,
						},
					},
				],
				dislikes: [
					{
						userId: {
							type: String,
						},
					},
				],
			},
		],
	},
	{ timestamps: true }
);

export default mongoose.model("Video", VideoSchema);
