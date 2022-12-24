import mongoose from "mongoose";
import brcrypt from "bcryptjs";

const UserSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
			unique: true,
		},
		email: {
			type: String,
			required: true,
			unique: true,
		},
		password: {
			type: String,
		},
		img: {
			type: String,
			default: "",
		},
		subscribers: {
			type: [String],
		},
		subscribedUsers: {
			type: [String],
		},
		fromGoogle: {
			type: Boolean,
			default: false,
		},
		isAdmin: {
			type: Boolean,
			default: false,
		},
	},
	{ timestamps: true }
);

UserSchema.pre("save", async function (next) {
	if (!this.isModified("password")) {
		next();
	}

	const salt = await brcrypt.genSaltSync(10);
	this.password = await brcrypt.hashSync(this.password, salt);

	next();
});

export default mongoose.model("User", UserSchema);
