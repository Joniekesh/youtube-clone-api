import jwt from "jsonwebtoken";
import User from "../models/User.js";
const verifyToken = async (req, res, next) => {
	let token;
	if (
		req.headers.authorization &&
		req.headers.authorization.startsWith("Bearer")
	) {
		try {
			token = req.headers.authorization.split(" ")[1];

			if (!token) {
				return res.status(400).json({ msg: "Not authorized. No token." });
			}

			const decoded = jwt.verify(token, process.env.JWT);

			req.user = await User.findById(decoded.id);

			next();
		} catch (err) {
			next(err);
		}
	}
};

const admin = (req, res, next) => {
	if (req.user && req.user.isAdmin) {
		return next();
	} else {
		return res
			.status(401)
			.json({ msg: "You are not authorized to access this route" });
	}
};

export { verifyToken, admin };
