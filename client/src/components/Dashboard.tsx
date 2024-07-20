import { useContext, useEffect, useState } from "react";
import { LoginContext } from "../context/LoginContext";
import CustomSpinner from "./common/CustomSpinner";
import { useNavigate } from "react-router-dom";
import useCustomToast, { CustomToastStatusEnum } from "../hooks/useCustomToast";
import {
  Avatar,
  Box,
  HStack,
  SimpleGrid,
  Text,
  VStack,
} from "@chakra-ui/react";
import { AuthorsDetailInterface } from "./Authors";
import useApi from "../hooks/useApi";
import { REACT_APP_BACKEND_URL } from "../App";

const Dashboard = () => {
  const { isLoggedIn, isAdmin } = useContext(LoginContext);
  const navigate = useNavigate();
  const customToast = useCustomToast();
  const [authors, setAuthors] = useState<AuthorsDetailInterface[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedAuthor, setSelectedAuthor] = useState<string | null>(null);

  const { api } = useApi();

  useEffect(() => {
    if (!isLoggedIn || !isAdmin) {
      customToast("You donot have admin access", CustomToastStatusEnum.error);
      navigate("/");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoggedIn, isAdmin]);

  useEffect(() => {
    api("/authors", {
      method: "GET",
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        setAuthors(data);
        setLoading(false);
      })
      .catch((err) => console.log(err));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) {
    return <CustomSpinner />;
  }

  return (
    <SimpleGrid
      minH="100vh"
      pt={["62px", "72px", null, "74px"]}
      templateColumns="300px minmax(0, 1fr)"
    >
      <VStack
        alignItems="stretch"
        w="100%"
        p={5}
        spacing={5}
        overflow="auto"
        boxShadow="3px 0 5px #fff"
      >
        {authors.map((author, index) => {
          return (
            <HStack
              key={index}
              w="100%"
              p={4}
              spacing={2}
              bgColor="#fff"
              borderRadius="8px"
              cursor="pointer"
            >
              <Avatar
                name={author.username}
                src={
                  author.profileImagePath
                    ? `${REACT_APP_BACKEND_URL}/${author.profileImagePath}`
                    : ""
                }
                borderRadius="8px"
              />
              <Box>
                <Text fontWeight={700}>{author.username}</Text>
                <Text fontSize="14px">{author.email}</Text>
              </Box>
            </HStack>
          );
        })}
      </VStack>
      <SimpleGrid
        p={10}
        spacing={10}
        templateColumns="repeat(3, minmax(0, 1fr))"
      >
        {authors.map((author, index) => {
          return (
            <HStack
              key={index}
              w="100%"
              p={4}
              spacing={2}
              bgColor="#fff"
              borderRadius="8px"
              _hover={{
                bgColor: "#f5f5f5",
              }}
              boxShadow="3px 3px 6px #aaa"
              cursor="pointer"
              h="fit-content"
            >
              <Avatar
                name={author.username}
                src={
                  author.profileImagePath
                    ? `${REACT_APP_BACKEND_URL}/${author.profileImagePath}`
                    : ""
                }
                borderRadius="8px"
              />
              <Box>
                <Text fontWeight={700}>{author.username}</Text>
                <Text fontSize="14px">{author.email}</Text>
              </Box>
            </HStack>
          );
        })}
      </SimpleGrid>
    </SimpleGrid>
  );
};

export default Dashboard;
