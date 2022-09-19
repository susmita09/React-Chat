const express = require("express");
const router = express.Router(); //creating instance of router

const {
  registerUser,
  signInUser,
  getAllUser,
} = require("../controllers/UserController");

const {verifyToken} = require("../middleware/authmiddleware");


router.post("/signup", registerUser);
router.post("/login", signInUser);
router.get("/alluser", verifyToken, getAllUser);

module.exports = router;
