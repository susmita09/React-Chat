import React, { useState, useEffect } from "react";
import { io } from "socket.io-client";
import {
  Box,
  Text,
  IconButton,
  Spinner,
  useToast,
  FormControl,
  Input,
} from "@chakra-ui/react";
import axios from "axios";
import { ChatState } from "../Context/ChatProvider";
import { ArrowBackIcon, ChevronRightIcon } from "@chakra-ui/icons";
import { getSender, getSenderFull } from "../config/chatConfig";
import ProfileModel from "./Misslenious/ProfileModel";
import EditGroupChatModal from "./Misslenious/EditGroupChatModal";
import ScrollMessage from "./ScrollMessage";
import "./style.css";

const ENDPOINT = "http://localhost:5000";
let socket, selectedChatCompare;

const SingleChat = ({ fetchAgain, setFetchAgain }) => {
  const { selectedChat, setSelectedChat, user, notification, setNotification } =
    ChatState();
  const [fetchMessage, setFetchMessage] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [socketConnected, setSocketConnected] = useState(false);

  const toast = useToast();

  useEffect(() => {
    socket = io(ENDPOINT);
    socket.emit("setup", user);
    socket.on("connection", () => setSocketConnected(false));
  }, []);

  const fetchAllMessage = async () => {
    if (!selectedChat) return;
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      setLoading(true);
      const { data } = await axios.get(
        `http://localhost:5000/api/message/${selectedChat._id}`,

        config
      );

      setFetchMessage(data);
      setLoading(false);
      socket.emit("join room", selectedChat._id);
    } catch (err) {
      toast({
        title: "Server Error!",
        description: "Can't Load Message at This Movement",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top-left",
      });
    }
  };

  useEffect(() => {
    fetchAllMessage(); // eslint-disable-next-line
    selectedChatCompare = selectedChat;
  }, [selectedChat]);

  useEffect(() => {
    socket.on("message recieved", (newMessageRec) => {
      if (
        !selectedChatCompare ||
        selectedChatCompare._id !== newMessageRec.chat._id
      ) {
        if (!notification.includes(newMessageRec)) {
          setNotification([newMessageRec, ...notification]);
          setFetchAgain(!fetchAgain);
        }
      } else {
        setFetchMessage([...fetchMessage, newMessageRec]);
      }
    });
  });

  const sendMessage = async (event) => {
    if ((event.key === "Enter" || event.type === "click") && newMessage) {
      try {
        const config = {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        };
        setNewMessage("");
        const { data } = await axios.post(
          "http://localhost:5000/api/message",
          {
            text: newMessage,
            chatId: selectedChat._id,
          },
          config
        );
        socket.emit("new message", data);
        setFetchMessage([...fetchMessage, data]);
      } catch (err) {
        toast({
          title: "Server Error!",
          description: "Failed to send the Message",
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "top-left",
        });
      }
    }
  };

  const typingHandler = (e) => {
    setNewMessage(e.target.value);
    // typing indicator
  };
  return (
    <>
      {selectedChat ? (
        <>
          <Text
            fontSize={{ base: "28px", md: "30px" }}
            pb={3}
            px={2}
            w="100%"
            display="flex"
            justifyContent={{ base: "space-between" }}
            alignItems="center"
          >
            <IconButton
              display={{ base: "flex", md: "none" }}
              icon={<ArrowBackIcon />}
              onClick={() => setSelectedChat("")}
            />

            {!selectedChat.isGroupChat ? (
              <>
                {getSender(user, selectedChat.users)}
                <ProfileModel user={getSenderFull(user, selectedChat.users)} />
              </>
            ) : (
              <>
                {selectedChat.chatName.toUpperCase()}
                <EditGroupChatModal
                  fetchAgain={fetchAgain}
                  setFetchAgain={setFetchAgain}
                />
              </>
            )}
          </Text>
          <Box
            display="flex"
            flexDir="column"
            justifyContent="flex-end"
            p={3}
            bg="#E8E8E8"
            width="100%"
            height="100%"
            borderRadius="lg"
            overflowY="hidden"
          >
            {/* messages here */}
            {loading ? (
              <Spinner
                size="xl"
                alignSelf="center"
                width={20}
                height={20}
                margin="auto"
              />
            ) : (
              <div className="messages">
                <ScrollMessage messages={fetchMessage} />
              </div>
            )}
            <FormControl
              display="flex"
              onKeyDown={sendMessage}
              isRequired
              mt={4}
              justifyContent="space-between"
              alignItems="center"
            >
              <Input
                variant="outline"
                placeholder="Enter Message"
                bg="#FEFCBF"
                value={newMessage}
                onChange={typingHandler}
              />
              <IconButton
                bg="#ECC94B"
                aria-label="Call Segun"
                size="md"
                icon={<ChevronRightIcon fontSize={30} />}
                onClick={sendMessage}
              />
            </FormControl>
          </Box>
        </>
      ) : (
        // to get socket.io on same page
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          h="100%"
        >
          <Text fontSize="3xl" pb={3} fontFamily="Work sans">
            Click on a user to start chatting
          </Text>
        </Box>
      )}
    </>
  );
};

export default SingleChat;

{
  /* {messages &&
              (!selectedChat.isGroupChat ? (
                <>
                  {getSender(user, selectedChat.users)}
                  <ProfileModal
                    user={getSenderFull(user, selectedChat.users)}
                  />
                </>
              ) : (
                <>
                  {selectedChat.chatName.toUpperCase()}
                  <UpdateGroupChatModal
                    fetchMessages={fetchMessages}
                    fetchAgain={fetchAgain}
                    setFetchAgain={setFetchAgain}
                  />
                </>
              ))} */
}
