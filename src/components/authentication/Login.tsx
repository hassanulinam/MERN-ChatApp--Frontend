import {
  Button,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  useToast,
  VStack,
} from "@chakra-ui/react";
import axios from "axios";
import { useState } from "react";
import { useHistory } from "react-router-dom";
import { ChatState } from "../../context/ChatProvider";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();
  const history = useHistory();
  const { setCurrentUser: setUser } = ChatState();

  const makeToast = (
    title: string,
    duration: number | null,
    status: any,
    description?: string
  ) => toast({ title, description, status, duration, isClosable: true });

  const submitHandler = async () => {
    setIsLoading(true);
    if (!email || !password) {
      makeToast("Please fill all the Fields", 5000, "warning");
      setIsLoading(false);
      return;
    }

    try {
      const config = { headers: { "Content-type": "application/json" } };
      const reqBody = { email, password };
      const { data } = await axios.post("/api/user/signin", reqBody, config);
      makeToast("Login Successful", 3000, "success");
      localStorage.setItem("userInfo", JSON.stringify(data));
      setUser(data);
      history.push("/chats");
    } catch (error) {
      const err = error as any;
      makeToast("Error Occured!", 10000, "error", err.response.data.message);
    }
    setIsLoading(false);
  };

  return (
    <VStack spacing="5px">
      <FormControl id="loginEmail" isRequired>
        <FormLabel>Email</FormLabel>
        <Input
          placeholder="Enter Your Email"
          onChange={(e) => setEmail(e.target.value)}
          value={email}
        />
      </FormControl>

      <FormControl id="loginPassword" isRequired>
        <FormLabel>Password</FormLabel>
        <InputGroup>
          <Input
            placeholder="Enter the Password"
            onChange={(e) => setPassword(e.target.value)}
            type={show ? "text" : "password"}
            value={password}
          />
          <InputRightElement width="4.5rem">
            <Button h="1.75rem" size="sm" onClick={() => setShow((p) => !p)}>
              {show ? "Hide" : "Show"}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>

      <Button
        colorScheme="blue"
        width="100%"
        style={{ marginTop: 15 }}
        onClick={submitHandler}
        isLoading={isLoading}
      >
        Sign In
      </Button>
      <Button
        variant="solid"
        colorScheme="red"
        width="100%"
        style={{ marginTop: 15 }}
        onClick={() => {
          setEmail("guest@example.com");
          setPassword("1234567890");
        }}
      >
        Get Guest User Credentials
      </Button>
    </VStack>
  );
};

export default Login;
