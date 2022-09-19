const express = require("express");
const router = express.Router(); //creating instance of router
const { verifyToken } = require("../middleware/authmiddleware");
const {
  sendMessage,
  fetchMessage,
} = require("../controllers/messageController");

//sending the message
router.post("/", verifyToken, sendMessage);

//fetching all the message for one single chat(particular)
router.get("/:chatId", verifyToken, fetchMessage);

module.exports = router;
