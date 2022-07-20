import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
  useToast,
  FormControl,
  Input,
  Box,
} from "@chakra-ui/react";
import axios from "axios";
import { useState } from "react";
import { getAuthHeaderConfig } from "../../config/ChatLogics";
import { ChatState } from "../../context/ChatProvider";
import { USER } from "../../customTypes";
import UserBadgeItem from "../User/UserBadgeItem";
import UserListItem from "../User/UserListItem";

type PROPTypes = {
  children: JSX.Element;
};

const GroupChatModal = ({ children }: PROPTypes) => {
  const [groupChatName, setGroupChatName] = useState("");
  const [selectedUsers, setSelectedUsers] = useState<USER[]>([]);
  const [searchInput, setSearchInput] = useState("");
  const [searchResults, setSearchResults] = useState<USER[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  const { currentUser, chats, setChats } = ChatState();

  const makeToast = (
    title: string,
    status: any,
    position?: any,
    description?: string
  ) =>
    toast({
      title,
      description,
      status,
      duration: 5000,
      isClosable: true,
      position,
    });

  const handleSearch = async (query: string) => {
    setSearchInput(query);
    if (!query) return;
    try {
      setIsLoading(true);
      const config = getAuthHeaderConfig(currentUser);
      const URL = `/api/user?search=${query}`;
      const { data } = await axios.get(URL, config);
      console.log(data);
      setIsLoading(false);
      setSearchResults(data);
    } catch (error) {
      makeToast(
        "Error Occured!",
        "error",
        "bottom-left",
        "Failed to fetch results"
      );
    }
  };

  const selectUser = (newUser: USER) => {
    if (selectedUsers.includes(newUser)) {
      makeToast("User already added", "warning", "top");
      return;
    }
    setSelectedUsers([...selectedUsers, newUser]);
  };

  const unselectUser = (usr: USER) => {
    setSelectedUsers(selectedUsers.filter((u) => u?._id !== usr?._id));
  };

  const handleSubmit = async () => {
    if (!groupChatName || selectedUsers.length === 0) {
      makeToast("Please fill all the fields", "warning", "top");
      return;
    }
    try {
      const config = getAuthHeaderConfig(currentUser);
      const reqBody = {
        name: groupChatName,
        users: JSON.stringify(selectedUsers.map((u) => u?._id)),
      };
      const { data } = await axios.post("/api/chat/group", reqBody, config);

      setChats([data, ...chats]);
      onClose();
      makeToast("new group chat created!", "success", "bottom");
    } catch (err: any) {
      makeToast(
        "Failed to Create the Group",
        "error",
        "bottom",
        err.reponse.data
      );
    }
  };

  return (
    <>
      <span onClick={onOpen}>{children}</span>

      <Modal blockScrollOnMount={false} isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
            fontSize="35px"
            fontFamily="Work sans"
            display="flex"
            justifyContent="center"
          >
            Create Group Chat
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody display="flex" flexDir="column" alignItems="center">
            <FormControl>
              <Input
                placeholder="Chat Name"
                mb={3}
                value={groupChatName}
                onChange={(e: any) => setGroupChatName(e.target.value)}
              />
            </FormControl>
            <FormControl>
              <Input
                placeholder="Add Users eg: John, Tom, Inam"
                mb={1}
                value={searchInput}
                onChange={(e: any) => handleSearch(e.target.value)}
              />
            </FormControl>
            <Box w="100%" display="flex" flexWrap="wrap">
              {selectedUsers.map((usr) => (
                <UserBadgeItem
                  key={usr?._id}
                  usr={usr}
                  handle={() => unselectUser(usr)}
                />
              ))}
            </Box>

            {isLoading ? (
              <div>Loading...</div>
            ) : (
              searchResults
                ?.slice(0, 4)
                .map((usr) => (
                  <UserListItem
                    key={usr?._id}
                    usr={usr}
                    handle={() => selectUser(usr)}
                  />
                ))
            )}
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={handleSubmit}>
              Create Group
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default GroupChatModal;
