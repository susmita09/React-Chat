const express = require("express");
const router = express.Router(); //creating instance of router
const {verifyToken} = require('../middleware/authmiddleware');

const {createChat,fetchChats,createGroupChat,renameGroup,addToGroup,removeFromGroup} = require('../controllers/ChatController');

//creating chat -- user must be logginin
router.post("/",verifyToken,createChat);

//fetching all chat for the particular user

router.get("/",verifyToken,fetchChats);

//creating group chat
router.post("/group",verifyToken,createGroupChat)

//rename froup
router.put("/rename-group",verifyToken,renameGroup);

//leave or remove from group
router.put("/groupremove",verifyToken,removeFromGroup);


//add someone into the group
router.put('/addgroup',verifyToken,addToGroup);

module.exports = router;