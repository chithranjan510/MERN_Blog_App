import { useContext } from "react";
import Cookies from "js-cookie";
import { HStack, Image, Link, Box } from "@chakra-ui/react";
import { LoginContext } from "../context/LoginContext";
import { useNavigate } from "react-router-dom";
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
      py={[3, 4]}
      bgColor="gray.800"
      color="#fff"
    >
      <HStack>
        <Box
          w={["25px", "30px", null, "40px"]}
          h={["25px", "33px", null, "40px"]}
          borderRadius="5px"
          overflow="hidden"
        >
          <Image src="MERN-blog-favicon.png" alt="web-logo" w="100%" h="100%" />
        </Box>
        <Link
          href="/"
          fontWeight={600}
          fontSize={["18px", "22px", null, "26px"]}
          _hover={{}}
        >
          Blogify
        </Link>
      </HStack>
      {isLoggedIn ? (
        <LoginRegisterAndLogoutNavButton
          label="Logout"
          onClick={logoutHandler}
        />
      ) : (
        <HStack spacing={[2, 3, null, 5]}>
          <Link href="/login">
            <LoginRegisterAndLogoutNavButton label="Login" />
          </Link>
          <Link href="/register">
            <LoginRegisterAndLogoutNavButton label="Register" />
          </Link>
        </HStack>
      )}
    </HStack>
  );
};

export default Navbar;
