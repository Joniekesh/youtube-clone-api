import User from "../models/User.js";

// @desc   Update user
// @route  PUT /api/users/me
// @access Private
export const updateUser = async (req, res, next) => {
	const { name, email, password, img } = req.body;

	try {
		const user = await User.findById(req.user.id);

		if (user) {
			user.name = name || user.name;
			user.email = email || user.email;
			user.img = img || user.img;
			if (password) {
				user.password = password;
			}
		}

		const updatedUser = await user.save();

		res.status(200).json(updatedUser);
	} catch (err) {
		next(err);
	}
};

// @desc   Get all users
// @route  GET /api/users
// @access Public
export const getUsers = async (req, res, next) => {
	try {
		const users = await User.find();

		res.status(200).json(users);
	} catch (err) {
		next(err);
	}
};

// @desc   Get a user
// @route  GET /api/users/find/:id
// @access Public
export const getUserById = async (req, res, next) => {
	try {
		const user = await User.findById(req.params.id);

		if (!user) return res.status(404).json("User not found");

		res.status(200).json(user);
	} catch (err) {
		next(err);
	}
};

// @desc   Subscribe/Unsubscribe to a channel
// @route  PUT /api/users/subunsub/:id
// @access Private
export const subscription = async (req, res, next) => {
	try {
		const currentUser = await User.findById(req.user.id);
		const user = await User.findById(req.params.id);
		if (!currentUser.subscribedUsers.includes(req.body.id)) {
			await currentUser.updateOne({
				$push: { subscribedUsers: req.body.id },
			});
			await user.updateOne({
				$push: { subscribers: req.user.id },
			});

			res.status(200).json("You have subscribed");
		} else {
			await currentUser.updateOne({
				$pull: { subscribedUsers: req.body.id },
			});
			await user.updateOne({
				$pull: { subscribers: req.user.id },
			});

			res.status(200).json("You have unsubscribed");
		}
	} catch (err) {
		next(err);
	}
};

// @desc   Delete user
// @route  DELETE /api/users/me
// @access Private
export const deleteUser = async (req, res, next) => {
	try {
		await User.findByIdAndDelete(req.user.id);

		res.status(200).json("User deleted");
	} catch (err) {
		next(err);
	}
};
