import { createContext, useContext, useEffect, useState } from "react";
import { CHAT_CONTEXT, CHAT, USER } from "../customTypes";

type propTypes = {
  children: JSX.Element;
};

const ChatContext = createContext<CHAT_CONTEXT>({
  user: null,
  setUser: () => {},
  chats: [],
  setChats: () => {},
  selectedChat: null,
  setSelectedChat: () => {},
});

const ChatProvider = ({ children }: propTypes) => {
  const [user, setUser] = useState<USER>(null);
  const [chats, setChats] = useState<CHAT[]>([]);
  const [selectedChat, setSelectedChat] = useState<CHAT>(null);

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo") as string);
    setUser(userInfo);
  }, []);

  return (
    <ChatContext.Provider
      value={{ user, setUser, chats, setChats, selectedChat, setSelectedChat }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const ChatState = () => useContext(ChatContext);
export default ChatProvider;
