import { USER } from "../customTypes";

export const getSender = (loggedUser: USER, users: USER[]) => {
  return users[0]?._id === loggedUser?._id ? users[1]?.name : users[0]?.name;
};

export const getSenderObject = (loggedUser: USER, users: USER[]) => {
  return users[0]?._id === loggedUser?._id ? users[1] : users[0];
};

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
