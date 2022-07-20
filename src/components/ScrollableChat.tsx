import { Avatar, Tooltip } from "@chakra-ui/react";
import ScrollableFeed from "react-scrollable-feed";
import {
  isLastMessage,
  isSameSender,
  isSameSenderMargin,
  isSameUser,
} from "../config/ChatLogics";
import { ChatState } from "../context/ChatProvider";
import { MESSAGE } from "../customTypes";

type CustomProps = {
  messages: MESSAGE[];
};

const ScrollableChat = ({ messages }: CustomProps) => {
  const { currentUser } = ChatState();

  console.table("Scrollable Messages...");

  return (
    <ScrollableFeed>
      {messages.map((m, i) => (
        <div style={{ display: "flex" }} key={m._id}>
          {(isSameSender(messages, m, i, currentUser!._id) ||
            isLastMessage(messages, i, currentUser!._id)) && (
            <Tooltip label={m.sender?.name} placement="bottom-start" hasArrow>
              <Avatar
                mt="7px"
                mr={1}
                size="sm"
                cursor="pointer"
                name={m.sender?.name}
                src={m.sender?.pic}
              />
            </Tooltip>
          )}
          <span
            style={{
              borderRadius: "20px",
              padding: "5px 15px",
              maxWidth: "75%",
              backgroundColor: `${
                m.sender?._id === currentUser?._id ? "#BEE3F8" : "#B9F5D0"
              }`,
              marginLeft: isSameSenderMargin(messages, m, i, currentUser!._id),
              marginTop: isSameUser(messages, m, i) ? 3 : 10,
            }}
          >
            {m.content}
          </span>
        </div>
      ))}
    </ScrollableFeed>
  );
};

export default ScrollableChat;
