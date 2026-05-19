const mongoose = require("mongoose");
require("dotenv").config();

const { MONGODB_URL } = process.env;

exports.connect = async () => {
	try {
		if (!MONGODB_URL) {
			throw new Error("MONGODB_URL is not defined in the environment");
		}

		await mongoose.connect(MONGODB_URL);
		console.log(`DB Connection Success`);
	} catch (err) {
		console.log(`DB Connection Failed`);
		console.log(err);
		process.exit(1);
	}
};
