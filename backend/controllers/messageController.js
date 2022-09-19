const Message = require("../models/messageModel");
const User = require("../models/userModel");
const Chat = require("../models/chatM");

const sendMessage = async (req, res) => {
  //message model contains - chatId, content, sender
  //chatid in which chat we want to send mesg , mesg content, sender name of the message
  const { text, chatId } = req.body;
  if (!text || !chatId) {
    console.log("invalid data");
    return res
      .status(400)
      .send({
        message: "No chat found, Some error occured while sending message",
      });
  }
  let newMessage = {
    sender: req.user._id,
    content: text,
    chat: chatId,
  };
  try {
    let message = await Message.create(newMessage); //query databse creting new mesg

    // console.log(message);

    message = await message.populate("sender", "name pic");
    message = await message.populate("chat"); //populate chat corresponsing the mesg
    message = await User.populate(message, {
      path: "chat.users",
      select: "name pic email",
    });

    await Chat.findByIdAndUpdate(req.body.chatId, { latestMessage: message }); //update the chat with latest mesg

    res.status(200).json(message);
  } catch (error) {
    res.status(400).send(error.message);
  }
};

const fetchMessage = async (req, res, next) => {
  try {
    //want to fetch all the messages for a particular chat
    const chatId = req.params.chatId;

    const messages = await Message.find({ chat: chatId })
      .populate("sender", "name pic email")
      .populate("chat");

    // console.log(messages);
    res.status(200).json(messages);
  } catch (err) {
    res.status(400).send(err.message);
  }
};

module.exports = { sendMessage, fetchMessage };
