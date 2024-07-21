import { useContext, useEffect, useState } from "react";
import Cookies from "js-cookie";
import {
  HStack,
  Image,
  Box,
  Text,
  Avatar,
  VStack,
  Spacer,
  Center,
  Input,
} from "@chakra-ui/react";
import { LoginContext } from "../context/LoginContext";
import { Link, useNavigate } from "react-router-dom";
import { REACT_APP_BACKEND_URL } from "../App";
import { PlusCircle } from "@emotion-icons/bootstrap/PlusCircle";
import SidebarSection from "./common/SidebarSection";
import { LogOut } from "@emotion-icons/boxicons-regular/LogOut";
import { LogIn } from "@emotion-icons/boxicons-regular/LogIn";
import { PersonCircle } from "@emotion-icons/bootstrap/PersonCircle";
import { PeopleFill } from "@emotion-icons/bootstrap/PeopleFill";
import { BarGraph } from "@emotion-icons/entypo/BarGraph";
import { GetCategoryFilterInterface, GetUserFilterInterface } from "./Home";
import useApi from "../hooks/useApi";
import { FilterContext } from "../context/filterContext";
import { Clear } from "@emotion-icons/material-twotone/Clear";
import { Profile } from "@emotion-icons/remix-line/Profile";

const Sidebar = () => {
  const {
    isLoggedIn,
    setIsLoggedIn,
    username,
    email,
    profileImagePath,
    isAdmin,
  } = useContext(LoginContext);

  const { setLoading, setSelectedCategoryId, setSelectedUserId } =
    useContext(FilterContext);

  const [availableCategory, setAvailableCategory] = useState<
    GetCategoryFilterInterface[]
  >([]);
  const [availableUsers, setAvailableUsers] = useState<
    GetUserFilterInterface[]
  >([]);
  const [categoryFilterInput, setCategoryFilterInput] = useState<string>("");
  const [userFilterInput, setUserFilterInput] = useState<string>("");
  const [showCategoryContainer, setShowCategoryContainer] =
    useState<boolean>(false);
  const [showUserContainer, setShowUserContainer] = useState<boolean>(false);

  const navigate = useNavigate();
  const { api } = useApi();

  const blogCategoryOptions = availableCategory.filter(
    (d: GetCategoryFilterInterface) =>
      d.category
        .toLocaleLowerCase()
        .includes(categoryFilterInput.toLocaleLowerCase())
  );

  const blogUserOptions = availableUsers.filter((d: GetUserFilterInterface) =>
    d.username.toLocaleLowerCase().includes(userFilterInput.toLocaleLowerCase())
  );

  const logoutHandler = () => {
    Cookies.remove("token");
    setIsLoggedIn(false);
    navigate("/login");
  };

  useEffect(() => {
    api("/blogCategory", {
      method: "GET",
    })
      .then((res) => res.json())
      .then((data) => setAvailableCategory(data))
      .catch((err) => console.log(err));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    api("/authors", {
      method: "GET",
    })
      .then((res) => res.json())
      .then((data) => setAvailableUsers(data))
      .catch((err) => console.log(err));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <VStack
      alignItems="stretch"
      w="100%"
      h="100%"
      p={5}
      pt={[10, null, 5]}
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
      <Box w="100%" h="50px" minH="50px" position="relative">
        {categoryFilterInput !== "" && (
          <Center
            w="40px"
            h="50px"
            position="absolute"
            right={0}
            top={0}
            zIndex={10}
            borderRadius="5px"
            cursor="pointer"
            onClick={() => {
              setSelectedCategoryId(null);
              setCategoryFilterInput("");
            }}
          >
            <Clear width="20px" color="#fff" />
          </Center>
        )}
        <Input
          w="100%"
          h="100%"
          pr="40px"
          border="none"
          bgColor="gray.600"
          color="#fff"
          placeholder="Filter by category"
          value={categoryFilterInput}
          autoComplete="off"
          onChange={(e) => setCategoryFilterInput(e.target.value)}
          _placeholder={{
            color: "#fff",
          }}
          onFocus={() => {
            setShowCategoryContainer(true);
          }}
          onBlur={() => {
            setTimeout(() => {
              setShowCategoryContainer(false);
            }, 300);
          }}
        />
        <Box
          id="homePageBlogCategoryContainer"
          display={showCategoryContainer ? "block" : "none"}
          position="absolute"
          w="100%"
          maxH="250px"
          overflowY="auto"
          top="60px"
          bgColor="#fff"
          borderRadius="8px"
          zIndex={10}
          border="2px solid steelBlue"
          css={{
            "&::-webkit-scrollbar": {
              width: "0",
            },
            "&::-webkit-scrollbar-track": {
              width: "0",
            },
          }}
        >
          {blogCategoryOptions.length === 0 ? (
            <Box p={3}>
              <Text textAlign="center">No Data Found</Text>
            </Box>
          ) : (
            blogCategoryOptions.map((category, index) => {
              return (
                <Text
                  key={index}
                  w="100%"
                  h="40px"
                  py="5px"
                  px="20px"
                  cursor="pointer"
                  _hover={{ bgColor: "#eee" }}
                  onClick={() => {
                    setTimeout(() => {
                      setSelectedCategoryId(category._id);
                      setCategoryFilterInput(category.category);
                      setLoading(true);
                    }, 100);
                  }}
                  textTransform="capitalize"
                >
                  {category.category}
                </Text>
              );
            })
          )}
        </Box>
      </Box>
      <Box w="100%" h="50px" minH="50px" position="relative">
        {userFilterInput !== "" && (
          <Center
            w="40px"
            h="50px"
            position="absolute"
            right={0}
            top={0}
            zIndex={10}
            borderRadius="5px"
            cursor="pointer"
            onClick={() => {
              setSelectedUserId(null);
              setUserFilterInput("");
            }}
          >
            <Clear width="20px" color="#fff" />
          </Center>
        )}
        <Input
          w="100%"
          h="100%"
          pr="40px"
          border="none"
          bgColor="gray.600"
          color="#fff"
          placeholder="Filter by author"
          value={userFilterInput}
          autoComplete="off"
          onChange={(e) => setUserFilterInput(e.target.value)}
          _placeholder={{
            color: "#fff",
          }}
          onFocus={() => {
            setShowUserContainer(true);
          }}
          onBlur={() => {
            setTimeout(() => {
              setShowUserContainer(false);
            }, 300);
          }}
        />
        <Box
          id="homePageBlogUserContainer"
          display={showUserContainer ? "block" : "none"}
          position="absolute"
          w="100%"
          maxH="250px"
          overflowY="auto"
          top="60px"
          bgColor="#fff"
          borderRadius="8px"
          zIndex={10}
          border="2px solid steelBlue"
          css={{
            "&::-webkit-scrollbar": {
              width: "0",
            },
            "&::-webkit-scrollbar-track": {
              width: "0",
            },
          }}
        >
          {blogUserOptions.length === 0 ? (
            <Box p={3}>
              <Text textAlign="center">No Data Found</Text>
            </Box>
          ) : (
            blogUserOptions.map((user, index) => {
              return (
                <Text
                  key={index}
                  w="100%"
                  h="40px"
                  py="5px"
                  px="20px"
                  cursor="pointer"
                  _hover={{ bgColor: "#eee" }}
                  onClick={() => {
                    setTimeout(() => {
                      setSelectedUserId(user._id);
                      setUserFilterInput(user.username);
                      setLoading(true);
                    }, 100);
                  }}
                  textTransform="capitalize"
                >
                  {user.username}
                </Text>
              );
            })
          )}
        </Box>
      </Box>
      {isAdmin && (
        <Link to="/dashboard">
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
              <Text fontWeight={500} fontSize="15px" wordBreak="break-word">
                {username}
              </Text>
              <Text fontSize="12px" wordBreak="break-word">
                {email}
              </Text>
            </Box>
          </HStack>
        )}
        {!isLoggedIn && (
          <Link to="/login">
            <SidebarSection
              icon={<LogIn width="25px" />}
              label="Login"
              onClick={logoutHandler}
            />
          </Link>
        )}
        {!isLoggedIn && (
          <Link to="/register">
            <SidebarSection
              icon={<Profile width="25px" />}
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
