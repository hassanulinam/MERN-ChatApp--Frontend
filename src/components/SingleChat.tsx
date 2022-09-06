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
  getSenderName,
  getSender,
} from "../config/ChatLogics";
import { ChatState } from "../context/ChatProvider";
import ProfileModal from "./miscellaneous/ProfileModal";
import UpdateGroupChatModal from "./miscellaneous/UpdateGroupChatModal";
import { CHAT, MESSAGE } from "../customTypes";
import axios from "axios";
import "./styles.css";
import ScrollableChat from "./ScrollableChat";
import { io } from "socket.io-client";
import { socketActions, socketEmissions } from "../config/socketConst";
import Lottie from "lottie-react";
import typingAnimationData from "../assets/dote-typing-animation.json";

const ENDPOINT = "http://localhost:5000";
var socket = io(ENDPOINT);
var selectedChatCompare: CHAT;

const lottieDefaultOptions = {
  loop: true,
  auotplay: true,
  animationData: typingAnimationData,
  rendererSettings: { preserveAspectRatio: "xMidYMid slice" },
};

type PROPTypes = {
  fetchAgain: boolean;
  setFetchAgain: React.Dispatch<React.SetStateAction<boolean>>;
};

const SingleChat = ({ fetchAgain, setFetchAgain }: PROPTypes) => {
  const [messages, setMessages] = useState<MESSAGE[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [socketConnected, setSocketConnected] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [typing, setTyping] = useState(false);

  const {
    currentUser,
    selectedChat,
    setSelectedChat,
    notifications,
    setNotifications,
  } = ChatState();

  useEffect(() => {
    socket.emit(socketEmissions.setup, currentUser);
    socket.on(socketActions.connected, () => setSocketConnected(true));
    socket.on(socketActions.startTyping, () => setIsTyping(true));
    socket.on(socketActions.stopTyping, () => setIsTyping(false));
  }, []);

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

      socket.emit(socketEmissions.joinChat, selectedChat._id);
    } catch (error) {
      makeToast(
        "Error Occured!",
        "error",
        "bottom",
        "Failed to load the messages"
      );
    }
  };

  // Fetch previous messages
  useEffect(() => {
    console.log("Fetching previous messages");
    fetchMessages();
    selectedChatCompare = selectedChat;
  }, [selectedChat]);

  // receive or notify new messages
  useEffect(() => {
    socket.on(socketActions.msgReceived, (newMsgReceived) => {
      if (
        !selectedChatCompare ||
        selectedChatCompare._id !== newMsgReceived.chat._id
      ) {
        if (!notifications.includes(newMsgReceived)) {
          setNotifications([newMsgReceived, ...notifications]);
          setFetchAgain(!fetchAgain);
        }
      } else {
        setMessages([...messages, newMsgReceived]);
      }
    });
  });

  const sendMessage = async (e: any) => {
    if (e.key === "Enter" && newMessage) {
      socket.emit(socketEmissions.stopTyping, selectedChat?._id);
      try {
        const config = getAuthHeaderConfig(currentUser, true);
        const reqBody = { content: newMessage, chatId: selectedChat?._id };
        setNewMessage("");
        const { data } = await axios.post("/api/message", reqBody, config);
        setMessages([...messages, data]);
        console.log("MSG DATA:", data);
        socket.emit(socketEmissions.newMsg, data);
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

    if (!socketConnected) return;

    if (!typing) {
      setTyping(true);
      socket.emit(socketEmissions.startTyping, selectedChat?._id);
    }
    let lastTypingTime = new Date().getTime();
    var timeLength = 3000;
    setTimeout(() => {
      var timeNow = new Date().getTime();
      var timeDiff = timeNow - lastTypingTime;

      if (timeDiff >= timeLength && typing) {
        socket.emit(socketEmissions.stopTyping, selectedChat?._id);
        setTyping(false);
      }
    }, timeLength);
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
                {getSenderName(currentUser, selectedChat.users)}
                {isTyping && (
                  <div style={{ height: 40, margin: 0, padding: 0 }}>
                    <Lottie
                      animationData={typingAnimationData}
                      loop={true}
                      style={{ margin: 0, padding: 0 }}
                    />
                  </div>
                )}
                <ProfileModal user={getSender(currentUser, selectedChat.users)}>
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
