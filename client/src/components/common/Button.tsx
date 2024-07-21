import { Button, ButtonProps } from "@chakra-ui/react";

export const FormSubmitButton = ({
  label,
  ...props
}: { label: string } & ButtonProps) => {
  return (
    <Button
      type="submit"
      w="100%"
      color="#fff"
      bgGradient="linear(to-br, yellow.500, orange.600)"
      borderRadius="10px"
      h="50px"
      fontSize="18px"
      letterSpacing={2}
      {...props}
    >
      {label}
    </Button>
  );
};

export const PrimaryButton = ({
  label,
  ...props
}: { label: string } & ButtonProps) => {
  return (
    <Button
      size={["xs", "sm", null, "md"]}
      border="1px solid #fff"
      color="#fff"
      bgColor="transparent"
      _hover={{
        bgColor: "#000",
        color: "orange.200",
      }}
      {...props}
    >
      {label}
    </Button>
  );
};
