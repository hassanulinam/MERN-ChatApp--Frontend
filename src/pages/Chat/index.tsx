import { Button } from "@chakra-ui/react";
import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Chat = () => {
  return (
    <div>
      <h1>Chats Page</h1>
      <Link to="/">
        <Button colorScheme="blue">Go to Home</Button>
      </Link>
    </div>
  );
};

export default Chat;
