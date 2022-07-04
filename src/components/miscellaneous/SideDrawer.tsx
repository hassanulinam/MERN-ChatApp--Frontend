import { BellIcon, ChevronDownIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Tooltip,
  Text,
  Menu,
  MenuButton,
  MenuList,
  Avatar,
  MenuItem,
  MenuDivider,
  Drawer,
  useDisclosure,
  DrawerOverlay,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  Input,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";
import { useState } from "react";
import { useHistory } from "react-router-dom";
import { ChatState } from "../../context/ChatProvider";
import { CHAT, USER } from "../../customTypes";
import ChatLoading from "../ChatLoading";
import UserListItem from "../User/UserListItem";
import ProfileModal from "./ProfileModal";

const SideDrawer = () => {
  const [searchInput, setSearchInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState(false);
  const [SelectedChat, setSelectedChat] = useState<CHAT>(null);
  const [searchResults, setSearchResults] = useState<USER[]>([]);
  const { user } = ChatState();
  const history = useHistory();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  const makeToast = (
    title: string,
    duration: number | null,
    status: any,
    position?: any,
    description?: string
  ) =>
    toast({
      title,
      description,
      status,
      duration,
      isClosable: true,
      position,
    });

  const logoutHandler = () => {
    localStorage.removeItem("userInfo");
    history.push("/");
  };

  const handleSearch = async () => {
    if (!searchInput) {
      makeToast(
        "Please enter something to search",
        3000,
        "warning",
        "top-left"
      );
      return;
    }

    try {
      setIsLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
      };
      const URL = `/api/user?search=${searchInput}`;
      const { data } = await axios.get(URL, config);
      setIsLoading(false);
      setSearchResults(data);
    } catch (error) {
      makeToast(
        "Error Occured!",
        5000,
        "error",
        "bottom-left",
        "Failed to Load the Search Results"
      );
      setIsLoading(false);
    }
  };

  const accessChat = async (userId: string) => {
    try {
      setLoadingChat(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user?.token}`,
          "Content-type": "application/json",
        },
      };
      const { data } = await axios.post("/api/chat", { userId }, config);
      setSelectedChat(data);
      setLoadingChat(false);
      onClose();
    } catch (err) {}
  };

  return (
    <>
      <Box
        display="flex"
        justifyContent="space-between"
        bg="white"
        w="100%"
        p="5px 10px 5px 10px"
        borderWidth="5px"
      >
        <Tooltip label="Search Users to chat" hasArrow placement="bottom-end">
          <Button variant="ghost" onClick={onOpen}>
            <i className="fas fa-search"></i>
            <Text display={{ base: "none", md: "flex" }} px="4">
              Search User
            </Text>
          </Button>
        </Tooltip>

        <Text fontSize="2xl" fontFamily="Work sans">
          Talk-A-Tive
        </Text>
        <div>
          <Menu>
            <MenuButton p={1}>
              <BellIcon fontSize="2xl" m={1} />
            </MenuButton>
            {/* <MenuList></MenuList> */}
          </Menu>
          <Menu>
            <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
              <Avatar
                size="sm"
                cursor="pointer"
                name={user?.name}
                src={user?.pic}
              />
            </MenuButton>
            <MenuList>
              <ProfileModal user={user}>
                <MenuItem>My Profile</MenuItem>
              </ProfileModal>
              <MenuDivider />
              <MenuItem onClick={logoutHandler}>Logout</MenuItem>
            </MenuList>
          </Menu>
        </div>
      </Box>

      <Drawer placement="left" onClose={onClose} isOpen={isOpen}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader borderBottomWidth="1px">Search Users</DrawerHeader>
          <DrawerBody>
            <Box display="flex" pb={2}>
              <Input
                placeholder="Search by name or email"
                mr={2}
                value={searchInput}
                onChange={(e: any) => setSearchInput(e.target.value)}
              />
              <Button onClick={handleSearch}>Go</Button>
            </Box>
            {isLoading ? (
              <ChatLoading />
            ) : (
              searchResults?.map((usr) => (
                <UserListItem key={usr?._id} usr={usr} handle={accessChat} />
              ))
            )}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default SideDrawer;
