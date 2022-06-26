import {
  Button,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  VStack,
} from "@chakra-ui/react";
import { useState } from "react";

const SignUp = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [pic, setPic] = useState("");
  const [show, setShow] = useState(false);

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
          <InputRightElement width="4.5rem"></InputRightElement>
          <Button h="1.75rem" size="sm" onClick={() => setShow((p) => !p)}>
            {show ? "Hide" : "Show"}
          </Button>
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
          <InputRightElement width="4.5rem"></InputRightElement>
          <Button h="1.75rem" size="sm" onClick={() => setShow((p) => !p)}>
            {show ? "Hide" : "Show"}
          </Button>
        </InputGroup>
      </FormControl>
    </VStack>
  );
};

export default SignUp;
