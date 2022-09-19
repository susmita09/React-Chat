const Chat = require("../models/chatM");
const User = require("../models/userModel");

//this function will create an one on one chat with the user id provided by the loggedin user
const createChat = async (req, res) => {
  const { userId } = req.body;

  if (!userId) {
    console.log("no user id send by the user");
    return res.status(400);
  }

  //if the chat with the particular user exists
  let chatData;
  let isChat = await Chat.find({
    isGroupChat: false,
    $and: [
      { users: { $elemMatch: { $eq: req.user._id } } }, //both req has to be true
      { users: { $elemMatch: { $eq: userId } } },
    ],
  })
    .populate("users", "-password")
    .populate("latestMessage");

  isChat = await User.populate(isChat, {
    path: "latestMessage.sender",
    select: "name pic email",
  });
  console.log(isChat);
  if (isChat.length > 0) {
    res.send(isChat[0]);
  } else {
    //create a new chat
    chatData = {
      chatName: "sender",
      isGroupChat: false,
      users: [req.user._id, userId],
    };
  }
  try {
    const createdChat = await Chat.create(chatData);
    const FullChat = await Chat.findOne({ _id: createdChat._id }).populate(
      //for the new created chat
      "users",
      "-password"
    );
    res.status(200).send(FullChat);
  } catch (err) {
    res.status(500).send(err);
  }
};

//@description     Fetch all chats for a user
//@route           GET /api/chat/
//@access          Protected
const fetchChats = async (req, res) => {
  try {
    Chat.find({ users: { $elemMatch: { $eq: req.user._id } } })
      .populate("users", "-password")
      .populate("groupAdmin", "-password")
      .populate("latestMessage")
      .sort({ updatedAt: -1 })
      .then(async (results) => {
        results = await User.populate(results, {
          path: "latestMessage.sender",
          select: "name pic email",
        });
        res.status(200).send(results);
      });
  } catch (error) {
    res.status(400).send(error.message);
  }
};

//@description     Create New Group Chat
//@route           POST /api/chat/group
//@access          Protected

const createGroupChat = async (req, res, next) => {
  if (!req.body.users || !req.body.name) {
    return res.status(400).send({ message: "please enter all values" });
  }
  let users = JSON.parse(req.body.users); //send an array
  if (users.length < 2) {
    return res
      .status(400)
      .send({ message: "more than 2 users needed to form a room" });
  }

  users.push(req.user);

  try {
    const groupChat = await Chat.create({
      chatName: req.body.name,
      users: users,
      isGroupChat: true,
      groupAdmin: req.user,
    });
    //get the full group chat
    const fullGroupChat = await Chat.findOne({ _id: groupChat._id })
      .populate("users", "-password")
      .populate("groupAdmin", "-password");
    res.status(200).json(fullGroupChat);
  } catch (err) {
    res.status(500).send({ message: "something went wrong" });
  }
};

// @desc    Rename Group
// @route   PUT /api/chat/rename-group
// @access  Protected
const renameGroup = async (req, res) => {
  const { chatId, chatName } = req.body;

  const updatedChat = await Chat.findByIdAndUpdate(
    chatId,
    { chatName: chatName },
    { new: true }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

  if (!updatedChat) {
    res.status(404).send({ message: "Chat not found" });
  } else {
    res.json(updatedChat);
  }
};

// @desc    Add User To Group
// @route   PUT /api/chat/addgroup
// @access  Protected
const addToGroup = async (req, res) => {
  const { chatId, userId } = req.body;

  if (!chatId || !userId) {
    return res.status(400).send({ message: "Please enter all fields" });
  }

  const updatedGroup = await Chat.findByIdAndUpdate(
    chatId,
    {
      $push: { users: userId },
    },
    { new: true }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

  if (!updatedGroup) {
    res.status(500).send({ message: "Unable To Add Server Error" });
  } else {
    res.status(200).json(updatedGroup);
  }
};

// @desc    Add User To Group
// @route   PUT /api/chat/addgroup
// @access  Protected
const removeFromGroup = async (req, res) => {
  const { chatId, userId } = req.body;

  if (!chatId || !userId) {
    return res.status(400).send({ message: "Please enter all fields" });
  }

  const removed = await Chat.findByIdAndUpdate(
    chatId,
    {
      $pull: { users: userId },
    },
    { new: true }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

  if (!removed) {
    res.status(500).send({ message: "Unable To remove At this movement Server Error" });
  } else {
    res.status(200).json(updatedGroup);
  }
};

module.exports = { createChat, fetchChats, createGroupChat, renameGroup,addToGroup,removeFromGroup };
