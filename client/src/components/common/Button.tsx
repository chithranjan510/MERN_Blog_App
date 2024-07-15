import { Button, ButtonProps } from "@chakra-ui/react";

export const LoginAndRegisterFormButton = ({
  label,
  ...props
}: { label: string } & ButtonProps) => {
  return (
    <Button
      type="submit"
      w="100%"
      mt={5}
      bgColor="gray.300"
      _hover={{
        color: "#fff",
        bgColor: "gray.700",
      }}
      {...props}
    >
      {label}
    </Button>
  );
};

export const LoginRegisterAndLogoutNavButton = ({
  label,
  ...props
}: { label: string } & ButtonProps) => {
  return (
    <Button
      size={["xs", "sm", null, "md"]}
      _hover={{
        color: "#fff",
        bgColor: "gray.600",
      }}
      {...props}
    >
      {label}
    </Button>
  );
};