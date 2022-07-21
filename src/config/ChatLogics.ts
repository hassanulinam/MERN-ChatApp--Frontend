import { MESSAGE, USER } from "../customTypes";

export const getAuthHeaderConfig = (usr: USER, isJsonContent?: boolean) =>
  isJsonContent
    ? {
        headers: {
          Authorization: `Bearer ${usr?.token}`,
        },
        "Content-type": "application/json",
      }
    : {
        headers: {
          Authorization: `Bearer ${usr?.token}`,
        },
      };

export const getSenderName = (loggedUser: USER, users: USER[]) => {
  return users[0]?._id === loggedUser?._id ? users[1]?.name : users[0]?.name;
};

export const getSender = (loggedUser: USER, users: USER[]) => {
  return users[0]?._id === loggedUser?._id ? users[1] : users[0];
};

export const isSameSender = (
  messages: MESSAGE[],
  m: MESSAGE,
  i: number,
  userId: string
) =>
  i < messages.length - 1 &&
  (messages[i + 1].sender?._id !== m.sender?._id ||
    messages[i + 1].sender?._id === undefined) &&
  messages[i].sender?._id !== userId;

export const isLastMessage = (messages: MESSAGE[], i: number, userId: string) =>
  i === messages.length - 1 &&
  messages[messages.length - 1].sender?._id !== userId &&
  messages[messages.length - 1].sender?._id;

export const isSameSenderMargin = (
  messages: MESSAGE[],
  m: MESSAGE,
  i: number,
  userId: string
) => {
  let n = messages.length;
  if (
    i < n - 1 &&
    messages[i + 1].sender?._id === m.sender?._id &&
    messages[i].sender?._id !== userId
  )
    return 33;
  else if (
    (i < n - 1 &&
      messages[i + 1].sender?._id !== m.sender?._id &&
      messages[i].sender?._id !== userId) ||
    (i === n - 1 && messages[i].sender?._id !== userId)
  )
    return 0;
  return "auto";
};

export const isSameUser = (messages: MESSAGE[], m: MESSAGE, i: number) =>
  i > 0 && messages[i - 1].sender?._id === m.sender?._id;
