const Razorpay = require("razorpay");

exports.instance = new Razorpay({
	key_id: process.env.RAZORPAY_KEY_ID || process.env.RAZORPAY_KEY,
	key_secret: process.env.RAZORPAY_KEY_SECRET || process.env.RAZORPAY_SECRET,
});
