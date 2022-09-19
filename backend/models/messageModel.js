const mongoose = require("mongoose");

const messageModel = mongoose.Schema(
  {
    //will contai all the mesg of all chats
    //sender
    //chatName
    //content of message

    sender: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    content: { type: String, trim: true },
    chat: { type: mongoose.Schema.Types.ObjectId, ref: "Chat" },
  },
  { timestapms: true }
);

const Message = mongoose.model("Message", messageModel);

module.exports = Message;
