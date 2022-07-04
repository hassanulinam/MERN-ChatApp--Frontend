import { Avatar, Box, Text } from "@chakra-ui/react";
import { USER } from "../../customTypes";

type PROPTypes = {
  usr: USER;
  handle: (userId: string) => void;
};

const usrListItem = ({ usr, handle }: PROPTypes) => {
  return (
    <Box
      onClick={() => handle(usr?._id as string)}
      cursor="pointer"
      bg="#E8E8E8"
      _hover={{
        background: "#38B2AC",
        color: "white",
      }}
      w="100%"
      display="flex"
      alignItems="center"
      color="black"
      px={3}
      py={2}
      mb={2}
      borderRadius="lg"
    >
      <Avatar
        mr={2}
        size="sm"
        cursor="pointer"
        name={usr?.name}
        src={usr?.pic}
      />
      <Box>
        <Text>{usr?.name}</Text>
        <Text fontSize="xs">
          <b>Email: </b>
          {usr?.email}
        </Text>
      </Box>
    </Box>
  );
};

export default usrListItem;
