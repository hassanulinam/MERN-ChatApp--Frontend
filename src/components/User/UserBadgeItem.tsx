import { CloseIcon } from "@chakra-ui/icons";
import { Box } from "@chakra-ui/react";
import { USER } from "../../customTypes";

type PROPTypes = {
  usr: USER;
  handle: () => void;
};

const UserBadgeItem = ({ usr, handle }: PROPTypes) => {
  return (
    <Box
      px={2}
      py={1}
      borderRadius="lg"
      m={1}
      mb={2}
      fontSize={12}
      cursor="pointer"
      backgroundColor="purple"
      color="white"
      onClick={handle}
    >
      {usr?.name}
      <CloseIcon pl={1} ml={1} />
    </Box>
  );
};

export default UserBadgeItem;
