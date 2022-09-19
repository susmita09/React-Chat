import React, { useState } from "react";
import axios from "axios";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Button,
  useToast,
  FormControl,
  FormErrorMessage,
  Input,
  Box,
} from "@chakra-ui/react";
import { ChatState } from "../../Context/ChatProvider";
import UserList from "../UserF/UserList";
import UserBadgeItem from "../UserF/UserBadgeItem";

const GroupChatModel = ({ children }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [groupName, setGroupName] = useState("");
  const [groupUsers, setGroupUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  //after creating group chat we are gonna append it to the list of the chat
  const { user, chats, setChats } = ChatState();

  const toast = useToast();

  const handleSearch = async (name) => {
    setSearch(name);
    if (!name) {
      return;
    }
    //try to get the user if any arr show
    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.get(
        `http://localhost:5000/api/user/alluser?search=${name}`,
        config
      );
      console.log(data);
      setLoading(false);
      setSearchResult(data);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleSubmit = async () => {
    if (!groupName || !groupUsers) {
      toast({
        title: "Please all value",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top-left",
      });
      return;
    }
    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.post(
        `http://localhost:5000/api/chat//group`,
        {
          name: groupName,
          users: JSON.stringify(groupUsers.map((user) => user._id)),
        },
        config
      );
      setChats([data, ...chats]);
      setSearch("");
      setGroupUsers([]);
      setSearchResult([]);
      onClose();
      toast({
        title: "New Room Created",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "top-left",
      });
    } catch (err) {
      toast({
        title: "Failed to Load chat at this movement",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top-left",
      });
    }
  };

  const handleAddUser = (userToAdd) => {
    if (groupUsers.includes(userToAdd)) {
      toast({
        title: "User Already Added",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top-left",
      });
      return;
    }
    setGroupUsers([...groupUsers, userToAdd]);
  };

  const handleDelete = (u) => {
    setGroupUsers(groupUsers.filter((user) => user._id !== u._id));
  };

  return (
    <>
      <span onClick={onOpen}>{children}</span>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader fontSize="30px" display="flex" justifyContent="center">
            Create Chat Room
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody display="flex" flexDir="column" alignItems="center">
            <FormControl>
              <Input
                placeholder="Name of the Group"
                mb={3}
                onChange={(e) => setGroupName(e.target.value)}
                isRequired
              />
            </FormControl>

            <FormControl isInvalid={error}>
              <Input
                placeholder="Add Users"
                mb={1}
                onChange={(e) => handleSearch(e.target.value)}
              />
              {error ? <FormErrorMessage>{error}.</FormErrorMessage> : null}
            </FormControl>

            {/* <SelectedUser/> */}
            <Box width="100%" display="flex" flexWrap="wrap">
              {groupUsers.map((u) => (
                <UserBadgeItem
                  key={u._id}
                  user={u}
                  handleFunction={() => handleDelete(u)}
                />
              ))}
            </Box>

            {/* render searched users */}
            {loading ? (
              <div>Loading</div>
            ) : (
              searchResult
                ?.slice(0, 4)
                .map((user) => (
                  <UserList
                    key={user._id}
                    user={user}
                    handleFunction={() => handleAddUser(user)}
                  />
                ))
            )}
          </ModalBody>

          <ModalFooter>
            <Button
              backgroundColor="#744210"
              color="white"
              mr={3}
              onClick={handleSubmit}
            >
              Create Room
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default GroupChatModel;
