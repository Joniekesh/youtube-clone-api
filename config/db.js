import mongoose from "mongoose";

const connectDB = async () => {
	try {
		const conn = await mongoose.connect(process.env.MONGO_URL);

		console.log(
			`MongoDB Connection SUCCESS: ${conn.connection.host}`.cyan.underline.bold
		);
	} catch (err) {
		console.error(err);
		process.exit(1);
	}
};

export default connectDB;
