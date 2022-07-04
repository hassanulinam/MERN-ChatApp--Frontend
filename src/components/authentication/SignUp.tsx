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

const SignUp = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [pic, setPic] = useState<File | null | undefined>(undefined);
  const [show, setShow] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const history = useHistory();
  const toast = useToast();
  const { setUser } = ChatState();

  const makeToast = (
    title: string,
    duration: number,
    status: any,
    description?: string
  ) => toast({ title, description, status, duration, isClosable: true });

  const postDetails = (uploadedPic: File | null | undefined) => {
    setIsLoading(true);
    if (!uploadedPic) {
      makeToast("Please select an Image!", 3000, "warning");
      return;
    }
    if (uploadedPic.type === "image/jpeg" || uploadedPic.type === "image/png") {
      const data = new FormData();
      data.append("file", uploadedPic);
      data.append("upload_preset", "talkative-app");
      data.append("cloud_name", "hassanulinam");
      fetch("https://api.cloudinary.com/v1_1/hassanulinam/image/upload", {
        method: "post",
        body: data,
      })
        .then((res: any) => res.json())
        .then((rdata: any) => {
          setPic(rdata.url.toString());
          console.log(rdata, rdata.url);
          setIsLoading(false);
        })
        .catch((err: any) => {
          console.log(err);
          setIsLoading(false);
        });
    } else {
      makeToast("Please select an jpeg/png Image!", 3000, "warning");
      return;
    }
  };

  const submitHandler = async () => {
    setIsLoading(true);
    if (!name || !email || !password || !confirmPass) {
      makeToast("Please fill all the Fields", 5000, "warning");
      setIsLoading(false);
      return;
    }
    if (password !== confirmPass) {
      makeToast("Passwords do not match", 3000, "warning");
      setIsLoading(false);
      return;
    }

    try {
      const config = { headers: { "Content-type": "application/json" } };
      const reqBody = { name, email, password, pic };
      const { data } = await axios.post("/api/user/", reqBody, config);
      makeToast("Registration Successful", 3000, "success");
      localStorage.setItem("userInfo", JSON.stringify(data));
      setUser(data);
      setIsLoading(false);
      history.push("/chats");
    } catch (error) {
      const err = error as any;
      makeToast("Error Occured", 7000, "error", err.response.data.message);
      setIsLoading(false);
    }
  };

  return (
    <VStack spacing="5px">
      <FormControl id="name" isRequired>
        <FormLabel>Name</FormLabel>
        <Input
          placeholder="Enter Your Name"
          onChange={(e) => setName(e.target.value)}
        />
      </FormControl>

      <FormControl id="email" isRequired>
        <FormLabel>Email</FormLabel>
        <Input
          placeholder="Enter Your Email"
          onChange={(e) => setEmail(e.target.value)}
        />
      </FormControl>

      <FormControl id="password" isRequired>
        <FormLabel>Password</FormLabel>
        <InputGroup>
          <Input
            placeholder="Enter the Password"
            onChange={(e) => setPassword(e.target.value)}
            type={show ? "text" : "password"}
          />
          <InputRightElement width="4.5rem">
            <Button h="1.75rem" size="sm" onClick={() => setShow((p) => !p)}>
              {show ? "Hide" : "Show"}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>

      <FormControl id="confirmPassword" isRequired>
        <FormLabel>Confirm Password</FormLabel>
        <InputGroup>
          <Input
            placeholder="Enter the Confirmation Password"
            onChange={(e) => setConfirmPass(e.target.value)}
            type={show ? "text" : "password"}
          />
          <InputRightElement width="4.5rem">
            <Button h="1.75rem" size="sm" onClick={() => setShow((p) => !p)}>
              {show ? "Hide" : "Show"}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>

      <FormControl id="pic">
        <FormLabel>Upload your profile picture</FormLabel>
        <Input
          type="file"
          p={1.5}
          accept="image/*"
          onChange={(e) => postDetails(e.target.files?.[0])}
        />
      </FormControl>

      <Button
        colorScheme="blue"
        width="100%"
        style={{ marginTop: 15 }}
        onClick={submitHandler}
        isLoading={isLoading}
      >
        Sign Up
      </Button>
    </VStack>
  );
};

export default SignUp;
