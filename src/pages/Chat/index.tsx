import { Button } from "@chakra-ui/react";
import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Chat = () => {
  const [chats, setchats] = useState<any>([]);
  const fetchChatsData = async () => {
    const { data } = await axios.get("/api/chats");
    setchats(data);
  };

  useEffect(() => {
    fetchChatsData();
  }, []);

  return (
    <div>
      {chats.map((c: any) => (
        <p key={c._id}>{c.chatName}</p>
      ))}
      <Link to="/">
        <Button colorScheme="blue">Go to Home</Button>
      </Link>
    </div>
  );
};

export default Chat;
