//contain the user model
const mongoose = require("mongoose");

const userModel = mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    pic: {
      type: String,

      default:
        "https://res.cloudinary.com/dpp28yxat/image/upload/v1662282272/default-avatar-profile-icon-vector-social-media-user-portrait-176256935_vdlmvq.jpg",
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userModel);

module.exports = User;
