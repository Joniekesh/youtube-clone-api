import express from "express";
import dotenv from "dotenv";
import colors from "colors";
import connectDB from "./config/db.js";
import authRoutes from "./routes/Auth.js";
import userRoutes from "./routes/User.js";
import videoRoutes from "./routes/Video.js";
import postRoutes from "./routes/Post.js";
import cors from "cors";

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/videos", videoRoutes);
app.use("/api/posts", postRoutes);

app.use((err, req, res, next) => {
	const status = err.status || 500;
	const message = err.message || "Something went wrong";

	return res.status(status).json({
		success: false,
		status,
		message,
	});
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
	console.log(
		`SERVER runnning in ${process.env.NODE_ENV} MODE on PORT ${PORT}`.yellow
			.underline
	)
);
