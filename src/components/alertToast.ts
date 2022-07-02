import { useToast } from "@chakra-ui/react";

export const warnToast = (title: string, duration: number) => {
  const toast = useToast();

  return toast({
    title,
    duration,
    position: "bottom",
    isClosable: true,
    status: "warning",
  });
};

export const successToast = (title: string, duration: number) => {
  const toast = useToast();

  return toast({
    title,
    duration,
    position: "bottom",
    isClosable: true,
    status: "success",
  });
};

export const errorToast = (
  title: string,
  description: string,
  duration: number
) => {
  const toast = useToast();

  return toast({
    title,
    duration,
    description,
    position: "bottom",
    isClosable: true,
    status: "error",
  });
};
