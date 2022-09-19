import { CloseIcon } from "@chakra-ui/icons";
import { Box } from "@chakra-ui/react";
import React from "react";

const UserBadgeItem = ({ user, handleFunction }) => {
  return (
    <Box
      px={2}
      py={1}
      borderRadius="1px"
      fontSize={12}
      cursor="pointer"
      backgroundColor="#744210"
      color="white"
      m={2}
      mb={3}
      onClick={handleFunction}
    >
      {user.name}
      <CloseIcon paddingLeft={1} />
    </Box>
  );
};

export default UserBadgeItem;
