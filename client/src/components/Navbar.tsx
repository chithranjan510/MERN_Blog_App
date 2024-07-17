import { useContext } from "react";
import Cookies from "js-cookie";
import { HStack, Image, Box, Text, Button } from "@chakra-ui/react";
import { LoginContext } from "../context/LoginContext";
import { Link, useNavigate } from "react-router-dom";
import { LoginRegisterAndLogoutNavButton } from "./common/Button";

const Navbar = () => {
  const { isLoggedIn, setIsLoggedIn } = useContext(LoginContext);
  const navigate = useNavigate();

  const logoutHandler = () => {
    Cookies.remove("token");
    setIsLoggedIn(false);
    navigate("/login");
  };

  return (
    <HStack
      justifyContent="space-between"
      alignItems="center"
      px={[4, 6, null, 8]}
      py={3}
      bgColor="gray.800"
      color="#fff"
      position="fixed"
      top={0}
      left={0}
      right={0}
      zIndex={10}
    >
      <Link to="/">
        <HStack>
          <Box
            w={["30px", "40px", null, "50px"]}
            h={["30px", "40px", null, "50px"]}
            borderRadius="5px"
            overflow="hidden"
          >
            <Image src="/favicon.png" alt="web-logo" w="100%" h="100%" />
          </Box>
          <Text fontWeight={600} fontSize={["18px", "22px", null, "26px"]}>
            Blogify
          </Text>
        </HStack>
      </Link>
      {isLoggedIn ? (
        <HStack spacing={[2, 3, null, 5]}>
          <Link to="/create">
            <Button
              size={["xs", "sm", null, "md"]}
              color="#fff"
              bgColor="orange.500"
              _hover={{
                bgColor: "orange.600",
              }}
            >
              Create new post
            </Button>
          </Link>
          <LoginRegisterAndLogoutNavButton
            label="Logout"
            onClick={logoutHandler}
          />
        </HStack>
      ) : (
        <HStack spacing={[2, 3, null, 5]}>
          <Link to="/login">
            <LoginRegisterAndLogoutNavButton label="Login" />
          </Link>
          <Link to="/register">
            <LoginRegisterAndLogoutNavButton label="Register" />
          </Link>
        </HStack>
      )}
    </HStack>
  );
};

export default Navbar;
