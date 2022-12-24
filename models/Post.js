import mongoose from "mongoose";

const PostSchema = new mongoose.Schema(
	{
		userId: {
			type: String,
			required: true,
		},
		text: {
			type: String,
			required: true,
		},
		postPhoto: {
			type: String,
		},
		likes: {
			type: [String],
		},

		comments: [
			{
				userId: {
					type: String,
					required: true,
				},
				text: {
					type: String,
					required: true,
				},
				likes: {
					type: [String],
				},

				replies: [
					{
						userId: {
							type: String,
							required: true,
						},
						text: {
							type: String,
							required: true,
						},
						likes: {
							type: [String],
						},
						date: {
							type: Date,
							default: Date.now,
						},
					},
				],
				date: {
					type: Date,
					default: Date.now,
				},
			},
		],
	},
	{ timestamps: true }
);

export default mongoose.model("Post", PostSchema);
