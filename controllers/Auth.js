import User from "../models/User.js";
import bcrypt from "bcryptjs";
import generateToken from "../utils/generateToken.js";

// @desc   Register user
// @route  POST /api/auth
// @access Public
export const register = async (req, res, next) => {
	const { name, email, password } = req.body;

	try {
		const user = await User.findOne({ email });

		if (user) {
			return res
				.status(400)
				.json(`User with email: ${user.email} already exist`);
		}

		const newUser = new User({
			name,
			email,
			password,
		});

		await newUser.save();

		const token = generateToken(newUser._id);

		res.status(201).json({ user: newUser, token });
	} catch (err) {
		next(err);
	}
};

// @desc   Login user
// @route  POST /api/auth/login
// @access Public
export const login = async (req, res, next) => {
	const { email, password } = req.body;

	try {
		const user = await User.findOne({ email });

		if (!user) {
			return res.status(400).json("Invalid Credentials");
		}

		const isMatch = bcrypt.compareSync(password, user.password);

		if (!isMatch) {
			return res.status(400).json("Invalid Credentials");
		}

		const token = generateToken(user._id);

		res.status(200).json({ user, token });
	} catch (err) {
		next(err);
	}
};

// @desc   Get loggegin user
// @route  GET /api/auth/me
// @access Public
export const getProfile = async (req, res, next) => {
	try {
		const user = await User.findById(req.user.id);

		if (!user) {
			return res.status(400).json("User not found ");
		}

		res.status(200).json(user);
	} catch (err) {
		next(err);
	}
};
