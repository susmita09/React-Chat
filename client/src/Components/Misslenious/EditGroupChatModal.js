import React from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  IconButton,
  Button,
  useDisclosure,
  useToast,
  Box,
  Input,
  FormControl,
} from "@chakra-ui/react";
import { InfoIcon } from "@chakra-ui/icons";
import { useState } from "react";
import { ChatState } from "../../Context/ChatProvider";
import UserBadgeItem from "../UserF/UserBadgeItem";

const EditGroupChatModal = ({ fetchAgain, setFetchAgain }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [renameGroup, setRenameGroup] = useState("");
  const [groupUsers, setGroupUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [editloading, setEditLoading] = useState(false);

  //after creating group chat we are gonna append it to the list of the chat
  const { user, chats, setChats, selectedChat, setSelectedChat } = ChatState();

  const toast = useToast();

  const handleDelete = (u) => {
    // setGroupUsers(groupUsers.filter((user) => user._id !== u._id));
  };
  const handleRename = () => {};
  
  const handleSearch = ()=>{};

  const handleRemove = ()=>{}

  return (
    <>
      <IconButton
        display={{ base: "flex" }}
        // backgroundColor="#744210"
        // color="white"
        icon={<InfoIcon />}
        onClick={onOpen}
        fontSize="20px"
      />

      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader display="flex" justifyContent="center" fontSize={25}>
            {selectedChat.chatName}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Box width="100%" display="flex" flexWrap="wrap">
              {selectedChat.users.map((user) => (
                <UserBadgeItem
                  key={user._id}
                  user={user}
                  handleFunction={() => handleDelete(user)}
                />
              ))}
            </Box>
            <FormControl display="flex">
              <Input
                value={renameGroup}
                placeholder="Name of the Group"
                mb={3}
                onChange={(e) => setRenameGroup(e.target.value)}
              />
              <Button onClick={handleRename}>Update</Button>
            </FormControl>
            <FormControl display="flex">
              <Input
                value={renameGroup}
                placeholder="Add user to group"
                mb={3}
                onChange={(e) => handleSearch(e.target.value)}
              />
               
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button
              backgroundColor="red"
              color="white"
              mr={3}
              onClick={()=> handleRemove(user)}
            >
              Leave Room
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default EditGroupChatModal;
