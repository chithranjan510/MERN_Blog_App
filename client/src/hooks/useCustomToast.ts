import { useToast } from "@chakra-ui/react";

const customToastId = "customToastId";

export enum CustomToastStatusEnum {
  error = "error",
  success = "success",
  info = "info",
  warning = "warning",
  loading = "loading",
}

const useCustomToast = () => {
  const toast = useToast();
  const customToast = (label: string, status: CustomToastStatusEnum) => {
    if (!toast.isActive(customToastId)) {
      return toast({
        id: customToastId,
        description: label,
        status: status,
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return customToast;
};

export default useCustomToast;
