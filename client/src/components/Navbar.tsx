import { HStack, Link } from "@chakra-ui/react";

const Navbar = () => {
  return (
    <HStack
      justifyContent="space-between"
      alignItems="center"
      px={[4, 6, null, 8]}
      py={[2, 3, null, 4]}
      bgColor="gray.800"
      color="#fff"
    >
      <Link href="/" fontWeight={600}>
        Blog
      </Link>
      <HStack spacing={10}>
        <Link href="/login">Login</Link>
        <Link href="/register">Register</Link>
      </HStack>
    </HStack>
  );
};

export default Navbar;
