import { AddIcon } from "@chakra-ui/icons";
import { Box, Button, Stack, Text, useToast } from "@chakra-ui/react";
import axios from "axios";
import { useEffect, useState } from "react";
import { getAuthHeaderConfig, getSender } from "../config/ChatLogics";
import { ChatState } from "../context/ChatProvider";
import { USER } from "../customTypes";
import ChatLoading from "./ChatLoading";
import GroupChatModal from "./miscellaneous/GroupChatModal";

type PROPTypes = {
  fetchAgain: boolean;
};

const MyChats = ({ fetchAgain }: PROPTypes) => {
  const [loggedUser, setLoggedUser] = useState<USER>(null);
  const { selectedChat, setSelectedChat, currentUser, chats, setChats } =
    ChatState();
  const toast = useToast();

  const makeToast = (
    title: string,
    duration: number | null,
    status: any,
    position?: any,
    description?: string
  ) =>
    toast({
      title,
      description,
      status,
      duration,
      isClosable: true,
      position,
    });

  const fetchChats = async () => {
    try {
      const config = getAuthHeaderConfig(currentUser);
      const { data } = await axios.get("/api/chat", config);
      setChats(data);
    } catch (error) {
      makeToast("Error Occured!", 5000, "error", "bottom-left");
    }
  };

  useEffect(() => {
    setLoggedUser(JSON.parse(localStorage.getItem("userInfo") as string));
    fetchChats();
  }, [fetchAgain]);

  return (
    <Box
      display={{ base: selectedChat ? "none" : "flex", md: "flex" }}
      flexDir="column"
      alignItems="center"
      p={3}
      w={{ base: "100%", md: "31%" }}
      borderRadius="lg"
      borderWidth="1px"
      bg="white"
    >
      <Box
        pb={3}
        px={3}
        fontSize={{ base: "28px", md: "30px" }}
        fontFamily="Work sans"
        display="flex"
        w="100%"
        justifyContent="space-between"
        alignItems="center"
      >
        MyChats
        <GroupChatModal>
          <Button
            display="flex"
            fontSize={{ base: "17px", md: "10px", lg: "17px" }}
            rightIcon={<AddIcon />}
          >
            New Group Chat
          </Button>
        </GroupChatModal>
      </Box>
      <Box
        display="flex"
        flexDir="column"
        p={3}
        bg="#F8F8F8"
        w="100%"
        h="100%"
        borderRadius="lg"
        overflowY="hidden"
      >
        {chats ? (
          <Stack overflowY="scroll">
            {chats?.map((c) => (
              <Box
                onClick={() => setSelectedChat(c)}
                cursor="pointer"
                bg={selectedChat?._id === c?._id ? "#38B2AC" : "#E8E8E8"}
                color={selectedChat?._id === c?._id ? "white" : "black"}
                px={3}
                py={2}
                borderRadius="lg"
                key={c?._id}
              >
                <Text>
                  {!c?.isGroupChat
                    ? getSender(loggedUser, c?.users as USER[])
                    : c?.chatName}
                </Text>
              </Box>
            ))}
          </Stack>
        ) : (
          <ChatLoading />
        )}
      </Box>
    </Box>
  );
};

export default MyChats;
