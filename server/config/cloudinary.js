const cloudinary = require("cloudinary").v2;
const keys = require("../config/keys");

cloudinary.config({
  cloud_name: keys.cloud_name,
  api_key: keys.cloudinary_key,
  api_secret: keys.cloudinary_secret
});

module.exports = cloudinary;
