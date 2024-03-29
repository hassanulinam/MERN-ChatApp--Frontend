import { createContext, useContext, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { CHAT_CONTEXT, CHAT, USER, MESSAGE } from "../customTypes";

type propTypes = {
  children: JSX.Element;
};

const ChatContext = createContext<CHAT_CONTEXT>({
  currentUser: null,
  setCurrentUser: () => {},
  chats: [],
  setChats: () => {},
  selectedChat: null,
  setSelectedChat: () => {},
  notifications: [],
  setNotifications: () => {},
});

const ChatProvider = ({ children }: propTypes) => {
  const [currentUser, setCurrentUser] = useState<USER>(
    JSON.parse(localStorage.getItem("userInfo") as string)
  );
  const [chats, setChats] = useState<CHAT[]>([]);
  const [selectedChat, setSelectedChat] = useState<CHAT>(null);
  const [notifications, setNotifications] = useState<MESSAGE[]>([]);
  const history = useHistory();

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo") as string);
    setCurrentUser(userInfo);
  }, [history]);

  console.log("USER INFO: ", currentUser?.name);
  return (
    <ChatContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        chats,
        setChats,
        selectedChat,
        setSelectedChat,
        notifications,
        setNotifications,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const ChatState = () => useContext(ChatContext);
export default ChatProvider;
