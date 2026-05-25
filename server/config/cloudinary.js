const cloudinary = require("cloudinary").v2; //! Cloudinary is being required

exports.cloudinaryConnect = () => {
	try {
		const cloudName = process.env.CLOUDINARY_CLOUD_NAME || process.env.CLOUD_NAME;
		const apiKey = process.env.CLOUDINARY_API_KEY || process.env.API_KEY;
		const apiSecret = process.env.CLOUDINARY_API_SECRET || process.env.API_SECRET;

		if (!cloudName || !apiKey || !apiSecret) {
			throw new Error(
				"Missing Cloudinary env vars. Set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET"
			);
		}

		cloudinary.config({
			//!    ########   Configuring the Cloudinary to Upload MEDIA ########
			cloud_name: cloudName,
			api_key: apiKey,
			api_secret: apiSecret,
		});
	} catch (error) {
		console.log("Cloudinary configuration error:", error.message);
		throw error;
	}
};
