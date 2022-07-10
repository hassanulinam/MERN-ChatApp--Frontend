export type USER = {
  _id: string;
  name: string;
  email: string;
  pic: string;
  token?: string;
  password?: string;
} | null;

export type MESSAGE = {
  _id: string;
  sender: USER;
  content: string;
  chat: CHAT;
};

export type CHAT = {
  _id: string;
  chatName: string;
  isGroupChat: boolean;
  users: USER[];
  latestMessage: MESSAGE;
  groupAdmin?: USER;
} | null;

export type CHAT_CONTEXT = {
  currentUser: USER;
  setCurrentUser: React.Dispatch<React.SetStateAction<USER>>;
  chats: CHAT[];
  setChats: React.Dispatch<React.SetStateAction<CHAT[]>>;
  selectedChat: CHAT;
  setSelectedChat: React.Dispatch<React.SetStateAction<CHAT>>;
};
