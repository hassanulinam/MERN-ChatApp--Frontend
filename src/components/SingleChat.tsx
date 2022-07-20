import { ArrowBackIcon, ViewIcon } from "@chakra-ui/icons";
import {
  Box,
  FormControl,
  IconButton,
  Input,
  Spinner,
  Text,
  useToast,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import {
  getAuthHeaderConfig,
  getSender,
  getSenderObject,
} from "../config/ChatLogics";
import { ChatState } from "../context/ChatProvider";
import ProfileModal from "./miscellaneous/ProfileModal";
import UpdateGroupChatModal from "./miscellaneous/UpdateGroupChatModal";
import { MESSAGE } from "../customTypes";
import axios from "axios";
import "./styles.css";
import ScrollableChat from "./ScrollableChat";

type PROPTypes = {
  fetchAgain: boolean;
  setFetchAgain: React.Dispatch<React.SetStateAction<boolean>>;
};

const SingleChat = ({ fetchAgain, setFetchAgain }: PROPTypes) => {
  const [messages, setMessages] = useState<MESSAGE[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [newMessage, setNewMessage] = useState("");

  const { currentUser, selectedChat, setSelectedChat } = ChatState();

  const toast = useToast();
  const makeToast = (
    title: string,
    status: any,
    position?: any,
    description?: string
  ) =>
    toast({
      title,
      description,
      status,
      duration: 5000,
      isClosable: true,
      position,
    });

  const fetchMessages = async () => {
    if (!selectedChat) return;
    try {
      setIsLoading(true);
      const config = getAuthHeaderConfig(currentUser);
      const { data } = await axios.get(
        `/api/message/${selectedChat._id}`,
        config
      );
      setMessages(data);
      setIsLoading(false);
    } catch (error) {
      makeToast(
        "Error Occured!",
        "error",
        "bottom",
        "Failed to load the messages"
      );
    }
  };

  useEffect(() => {
    console.log("Fetching previous messages");
    fetchMessages();
  }, [selectedChat]);

  const sendMessage = async (e: any) => {
    if (e.key === "Enter" && newMessage) {
      try {
        const config = getAuthHeaderConfig(currentUser, true);
        const reqBody = { content: newMessage, chatId: selectedChat?._id };
        setNewMessage("");
        const { data } = await axios.post("/api/message", reqBody, config);
        setMessages([...messages, data]);
        console.log("MSG DATA:", data);
      } catch (error) {
        makeToast(
          "Error Occured!",
          "error",
          "bottom",
          "Failed to send the Message"
        );
      }
    }
  };
  const typingHandler = (e: any) => {
    setNewMessage(e.target.value);

    // Typing Logic indicator
  };

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
                  fetchMessages={fetchMessages}
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
          >
            {isLoading ? (
              <Spinner
                size="xl"
                w={20}
                h={20}
                alignSelf="center"
                margin="auto"
              />
            ) : (
              <div className="messages">
                <ScrollableChat messages={messages} />
              </div>
            )}
            <FormControl onKeyDown={sendMessage} isRequired mt={3}>
              <Input
                variant="filled"
                bg="#E0E0E0"
                placeholder="Enter a message.."
                onChange={typingHandler}
                value={newMessage}
              />
            </FormControl>
          </Box>
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
