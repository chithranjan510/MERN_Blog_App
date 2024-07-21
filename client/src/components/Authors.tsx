import { useContext, useEffect, useState } from "react";
import useApi from "../hooks/useApi";
import CustomSpinner from "./common/CustomSpinner";
import NoDataFound from "./common/NoDataFound";
import { LoginContext } from "../context/LoginContext";
import { useNavigate } from "react-router-dom";
import { Avatar, Box, HStack, Text, Wrap, WrapItem } from "@chakra-ui/react";
import { REACT_APP_BACKEND_URL } from "../App";

export interface AuthorsDetailInterface {
  username: string;
  email: string;
  profileImagePath: string | null;
  _id: string;
}

const Authors = () => {
  const [authors, setAuthors] = useState<AuthorsDetailInterface[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const { isLoggedIn } = useContext(LoginContext);
  const navigate = useNavigate();

  const { api } = useApi();

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
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/login");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoggedIn]);

  if (loading) {
    return <CustomSpinner />;
  }

  if (!authors) {
    return <NoDataFound />;
  }

  return (
    <Wrap w="100%" spacing={[7, 10]} p={[3, 6, 10]}>
      {authors.map((author, index) => {
        return (
          <WrapItem
            key={index}
            bgColor="#fff"
            borderRadius="8px"
            minW="300px"
            w={["100%", "fit-content"]}
          >
            <HStack p={4} spacing={2}>
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
                <Text fontWeight={700} wordBreak="break-word">
                  {author.username}
                </Text>
                <Text fontSize="14px" wordBreak="break-word">
                  {author.email}
                </Text>
              </Box>
            </HStack>
          </WrapItem>
        );
      })}
    </Wrap>
  );
};

export default Authors;
