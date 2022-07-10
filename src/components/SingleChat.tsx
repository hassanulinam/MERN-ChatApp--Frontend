import { ArrowBackIcon, ViewIcon } from "@chakra-ui/icons";
import { Box, IconButton, Text } from "@chakra-ui/react";
import React from "react";
import { getSender, getSenderObject } from "../config/ChatLogics";
import { ChatState } from "../context/ChatProvider";
import ProfileModal from "./miscellaneous/ProfileModal";
import UpdateGroupChatModal from "./miscellaneous/UpdateGroupChatModal";

type PROPTypes = {
  fetchAgain: boolean;
  setFetchAgain: React.Dispatch<React.SetStateAction<boolean>>;
};

const SingleChat = ({ fetchAgain, setFetchAgain }: PROPTypes) => {
  const { currentUser, selectedChat, setSelectedChat } = ChatState();

  return (
    <>
      {selectedChat ? (
        <>
          <Text
            fontSize={{ base: "28px", md: "30px" }}
            pb={3}
            px={2}
            fontFamily="Work sans"
            w="100%"
            display="flex"
            justifyContent={{ base: "space-between" }}
            alignItems="center"
          >
            <IconButton
              aria-label="view-profile"
              display={{ base: "flex", md: "none" }}
              icon={<ArrowBackIcon />}
              onClick={() => setSelectedChat(null)}
            />
            {!selectedChat.isGroupChat ? (
              <>
                {getSender(currentUser, selectedChat.users)}
                <ProfileModal
                  user={getSenderObject(currentUser, selectedChat.users)}
                >
                  <IconButton
                    aria-label="view profile"
                    display={{ base: "flex" }}
                    icon={<ViewIcon />}
                  />
                </ProfileModal>
              </>
            ) : (
              <>
                {selectedChat.chatName.toUpperCase()}
                <UpdateGroupChatModal
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
            w="100%"
            h="100%"
            borderRadius="lg"
            overflowY="hidden"
          ></Box>
        </>
      ) : (
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          h="100%"
        >
          <Text fontSize="3xl" pb={3} fontFamily="Work sans">
            Click on an User to start chatting
          </Text>
        </Box>
      )}
    </>
  );
};

export default SingleChat;
