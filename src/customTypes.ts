export type USER = {
  _id: string;
  name: string;
  email: string;
  pic: string;
  token?: string;
  password?: string;
} | null;

export type MESSAGE = {
  sender: USER;
  content: string;
  chat: CHAT;
};

export type CHAT = {
  name: string;
  isGroupChat: boolean;
  users: USER[];
  latestMessage: MESSAGE;
  groupAdmin?: USER;
} | null;

export type CHAT_CONTEXT = {
  user: USER;
  setUser: React.Dispatch<React.SetStateAction<USER>>;
  chats: CHAT[];
  setChats: React.Dispatch<React.SetStateAction<CHAT[]>>;
  selectedChat: CHAT;
  setSelectedChat: React.Dispatch<React.SetStateAction<CHAT>>;
};
