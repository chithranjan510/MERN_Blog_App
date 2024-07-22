import { Center, HStack, StackProps, Text } from "@chakra-ui/react";

const SidebarSection = ({
  icon,
  label,
  onClick,
  isActive,
  ...props
}: {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  isActive: boolean;
} & StackProps) => {
  return (
    <HStack
      w="100%"
      borderRadius="8px"
      _hover={{ bgColor: "gray.700" }}
      color="#fff"
      onClick={onClick}
      cursor="pointer"
      bgColor={isActive ? "gray.700" : "transparent"}
      {...props}
    >
      <Center w="50px" h="50px">
        {icon}
      </Center>
      <Text fontWeight={500}>{label}</Text>
    </HStack>
  );
};

export default SidebarSection;
