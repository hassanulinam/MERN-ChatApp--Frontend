import { USER } from "../customTypes";

export const getSender = (loggedUser: USER, users: USER[]) => {
  return users[0]?._id === loggedUser?._id ? users[1]?.name : users[0]?.name;
};
