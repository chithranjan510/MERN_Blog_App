import { useContext } from "react";
import Cookies from "js-cookie";
import {
  HStack,
  Image,
  Box,
  Text,
  Menu,
  MenuButton,
  MenuList,
  Avatar,
  MenuItem,
} from "@chakra-ui/react";
import { LoginContext } from "../context/LoginContext";
import { Link, useNavigate } from "react-router-dom";
import { PrimaryButton } from "./common/Button";

const Navbar = () => {
  const { isLoggedIn, setIsLoggedIn, username, email, profileImagePath } =
    useContext(LoginContext);
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
      position="sticky"
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
        <Menu>
          <MenuButton>
            <HStack>
              <Box>
                <Text
                  fontWeight={500}
                  fontSize={["13px", "16px"]}
                  textAlign="right"
                >
                  {username}
                </Text>
                <Text fontSize={["12px", "14px"]}>{email}</Text>
              </Box>
              <Avatar
                name={username || "guest"}
                src={`http://localhost:5000/${profileImagePath}`}
                size={["sm", "md"]}
              />
            </HStack>
          </MenuButton>
          <MenuList py={1} px={1}>
            <Link to="/profile">
              <MenuItem borderRadius="3px" borderBottom="1px solid #ccc" py={2}>
                <Text color="#000" textAlign="center" w="100%" fontWeight={500}>
                  Profile
                </Text>
              </MenuItem>
            </Link>
            <Link to="/authors">
              <MenuItem borderRadius="3px" borderBottom="1px solid #ccc" py={2}>
                <Text color="#000" textAlign="center" w="100%" fontWeight={500}>
                  Authors
                </Text>
              </MenuItem>
            </Link>
            <MenuItem onClick={logoutHandler} borderRadius="3px" py={2}>
              <Text color="#000" textAlign="center" w="100%" fontWeight={500}>
                Logout
              </Text>
            </MenuItem>
          </MenuList>
        </Menu>
      ) : (
        <HStack spacing={[2, 3, null, 5]}>
          <Link to="/login">
            <PrimaryButton label="Login" />
          </Link>
          <Link to="/register">
            <PrimaryButton label="Register" />
          </Link>
        </HStack>
      )}
    </HStack>
  );
};

export default Navbar;
