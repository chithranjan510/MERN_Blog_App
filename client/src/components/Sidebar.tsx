import { useContext } from "react";
import Cookies from "js-cookie";
import {
  HStack,
  Image,
  Box,
  Text,
  Avatar,
  VStack,
  Spacer,
} from "@chakra-ui/react";
import { LoginContext } from "../context/LoginContext";
import { Link, useNavigate } from "react-router-dom";
import { REACT_APP_BACKEND_URL } from "../App";
import { PlusCircle } from "@emotion-icons/bootstrap/PlusCircle";
import SidebarSection from "./common/SidebarSection";
import { LogOut } from "@emotion-icons/boxicons-regular/LogOut";
import { PersonCircle } from "@emotion-icons/bootstrap/PersonCircle";
import { PeopleFill } from "@emotion-icons/bootstrap/PeopleFill";
import { BarGraph } from "@emotion-icons/entypo/BarGraph";

const Sidebar = () => {
  const {
    isLoggedIn,
    setIsLoggedIn,
    username,
    email,
    profileImagePath,
    isAdmin,
  } = useContext(LoginContext);
  const navigate = useNavigate();

  const logoutHandler = () => {
    Cookies.remove("token");
    setIsLoggedIn(false);
    navigate("/login");
  };

  return (
    <VStack
      alignItems="stretch"
      w="100%"
      h="100%"
      p={5}
      borderRadius={["none", null, "8px"]}
      bgColor="gray.800"
      overflowY="auto"
      overflowX="hidden"
      spacing={3}
    >
      <Link to="/">
        <HStack mb={5} display={["none", null, "flex"]}>
          <Box w="50px" h="50px" borderRadius="5px" overflow="hidden">
            <Image src="/favicon.png" alt="web-logo" w="100%" h="100%" />
          </Box>
          <Text
            fontWeight={600}
            fontSize={["18px", "22px", null, "26px"]}
            color="#fff"
          >
            Blogify
          </Text>
        </HStack>
      </Link>
      {isAdmin && (
        <Link to="/create">
          <SidebarSection
            icon={<BarGraph width="25px" />}
            label="Dashboard"
            onClick={() => {}}
          />
        </Link>
      )}
      {isLoggedIn && (
        <Link to="/create">
          <SidebarSection
            icon={<PlusCircle width="25px" />}
            label="Create new post"
            onClick={() => {}}
          />
        </Link>
      )}
      {isLoggedIn && (
        <Link to="/profile">
          <SidebarSection
            icon={<PersonCircle width="25px" />}
            label="My Profile"
            onClick={() => {}}
          />
        </Link>
      )}
      {isLoggedIn && (
        <Link to="/authors">
          <SidebarSection
            icon={<PeopleFill width="25px" />}
            label="Authors"
            onClick={() => {}}
          />
        </Link>
      )}
      <Spacer />
      <VStack
        w="100%"
        alignItems="stretch"
        spacing={3}
        pt={3}
        borderTop="1px solid #fff"
      >
        {isLoggedIn && (
          <SidebarSection
            icon={<LogOut width="25px" />}
            label="Logout"
            onClick={logoutHandler}
          />
        )}
        {isLoggedIn && (
          <HStack>
            <Avatar
              name={username || "guest"}
              src={`${REACT_APP_BACKEND_URL}/${profileImagePath}`}
              h="50px"
              w="50px"
              p="5px"
            />
            <Box color="#fff">
              <Text fontWeight={500} fontSize="15px">
                {username}
              </Text>
              <Text fontSize="12px">{email}</Text>
            </Box>
          </HStack>
        )}
        {!isLoggedIn && (
          <Link to="/login">
            <SidebarSection
              icon={<LogOut width="25px" />}
              label="Login"
              onClick={logoutHandler}
            />
          </Link>
        )}
        {!isLoggedIn && (
          <Link to="/register">
            <SidebarSection
              icon={<LogOut width="25px" />}
              label="Register"
              onClick={logoutHandler}
            />
          </Link>
        )}
      </VStack>
    </VStack>
  );
};

export default Sidebar;
