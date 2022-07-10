import { ViewIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  FormControl,
  IconButton,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spinner,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";
import { useState } from "react";
import { getAuthHeaderConfig } from "../../config/ChatLogics";
import { ChatState } from "../../context/ChatProvider";
import { USER } from "../../customTypes";
import UserBadgeItem from "../User/UserBadgeItem";
import UserListItem from "../User/UserListItem";

type PROPTypes = {
  fetchAgain: boolean;
  setFetchAgain: React.Dispatch<React.SetStateAction<boolean>>;
};

const UpdateGroupChatModal = ({ fetchAgain, setFetchAgain }: PROPTypes) => {
  const [groupChatName, setGroupChatName] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [searchResults, setSearchResults] = useState<USER[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [renameLoading, setRenameLoading] = useState(false);

  const { isOpen, onOpen, onClose } = useDisclosure();
  const { selectedChat, setSelectedChat, currentUser } = ChatState();
  const toast = useToast();

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

  const renameTheGroup = async () => {
    if (!groupChatName) return;
    try {
      setRenameLoading(true);
      const config = getAuthHeaderConfig(currentUser);
      const reqBody = { chatId: selectedChat?._id, chatName: groupChatName };
      const { data } = await axios.put(
        "/api/chat/renamegroup",
        reqBody,
        config
      );
      setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      setRenameLoading(false);
    } catch (err: any) {
      makeToast("Error Occured!", "error", "bottom", err.response.data.message);
      setRenameLoading(false);
    }
    setGroupChatName("");
  };

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

  const addUserToGroup = async (newUser: USER) => {
    if (selectedChat?.users.find((usr) => usr?._id === newUser?._id)) {
      makeToast("User already in Group!", "warning", "bottom");
      return;
    }

    if (selectedChat?.groupAdmin?._id !== currentUser?._id) {
      makeToast("Only admins can add someone!", "error", "bottom");
      return;
    }

    try {
      setIsLoading(true);
      const config = getAuthHeaderConfig(currentUser);
      const reqBody = { chatId: selectedChat?._id, userId: newUser?._id };
      const { data } = await axios.put("/api/chat/groupadd", reqBody, config);
      setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      setIsLoading(false);
    } catch (err: any) {
      makeToast("Error Occured!", "error", "bottom", err.response.data.message);
      setIsLoading(false);
    }
  };

  const removeUserFromGroup = async (usr: USER) => {
    if (selectedChat?.groupAdmin?._id !== currentUser?._id) {
      makeToast("Only admins can remove someone!", "error", "bottom");
      return;
    }

    try {
      setIsLoading(true);
      const config = getAuthHeaderConfig(currentUser);
      const reqBody = { chatId: selectedChat?._id, userId: usr?._id };
      const { data } = await axios.put(
        "/api/chat/groupremove",
        reqBody,
        config
      );
      usr?._id === currentUser?._id // when user tries to leave the group
        ? setSelectedChat(null) // leave (unselect) the chat
        : setSelectedChat(data); // or update the chat
      setFetchAgain(!fetchAgain);
      setIsLoading(false);
    } catch (err: any) {
      makeToast("Error Occured!", "error", "bottom", err.response.data.message);
      setIsLoading(false);
    }
  };

  return (
    <>
      <IconButton
        display={{ base: "flex" }}
        icon={<ViewIcon />}
        onClick={onOpen}
        aria-label=""
      />

      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{selectedChat?.chatName}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Box w="100%" display="flex" flexWrap="wrap" pb={3}>
              {selectedChat?.users.map((usr) => (
                <UserBadgeItem
                  key={usr?._id}
                  usr={usr}
                  handle={() => removeUserFromGroup(usr)}
                />
              ))}
            </Box>
            <FormControl display="flex">
              <Input
                placeholder="Chat Name"
                mb={3}
                value={groupChatName}
                onChange={(e: any) => setGroupChatName(e.target.value)}
              />
              <Button
                variant="solid"
                colorScheme="teal"
                ml={1}
                isLoading={renameLoading}
                onClick={renameTheGroup}
              >
                Update
              </Button>
            </FormControl>
            <FormControl>
              <Input
                placeholder="Add Users to Group"
                mb={1}
                onChange={(e: any) => handleSearch(e.target.value)}
              />
            </FormControl>
            {isLoading ? (
              <Spinner size="md" />
            ) : (
              searchResults.map((usr) => (
                <UserListItem
                  key={usr?._id}
                  usr={usr}
                  handle={() => addUserToGroup(usr)}
                />
              ))
            )}
          </ModalBody>
          <ModalFooter>
            <Button
              onClick={() => removeUserFromGroup(currentUser)}
              colorScheme="red"
            >
              Leave Group
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default UpdateGroupChatModal;
