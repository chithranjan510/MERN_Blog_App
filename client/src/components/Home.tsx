import {
  Avatar,
  Box,
  Button,
  HStack,
  Image,
  SimpleGrid,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useContext, useEffect, useState } from "react";
import { LoginContext } from "../context/LoginContext";
import useApi from "../hooks/useApi";
import { Link, useNavigate } from "react-router-dom";
import NoDataFound from "./common/NoDataFound";
import CustomSpinner from "./common/CustomSpinner";
import { getBlogDate } from "../utils/getDate";

export interface GetPostInterface {
  _id: string;
  userId: { profileImagePath: string | null; username: string; _id: string };
  title: string;
  description: string;
  coverImagePath: string;
  content: string;
  createdAt: string;
}

const Home = () => {
  const { isLoggedIn } = useContext(LoginContext);
  const [blogs, setBlogs] = useState<GetPostInterface[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [reload, setReload] = useState<boolean>(false);
  const { api } = useApi();
  const navigate = useNavigate();

  useEffect(() => {
    api("/blog", {
      method: "GET",
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        setBlogs(data);
        setLoading(false);
        setReload(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
        setReload(false);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reload]);

  if (loading) {
    return <CustomSpinner />;
  }

  if (blogs.length === 0) {
    return <NoDataFound />;
  }

  return (
    <Box px={[5, 10, null, 20]} py={[5, 8, 14]}>
      {isLoggedIn && (
        <Link to="/create">
          <Button
            size={["sm", null, "md"]}
            color="#fff"
            bgColor="orange.500"
            _hover={{
              bgColor: "orange.600",
            }}
            mb={[5, 10]}
          >
            Create new post
          </Button>
        </Link>
      )}
      <SimpleGrid
        templateColumns={[
          "minmax(0, 1fr)",
          "repeat(2, minmax(0, 1fr))",
          null,
          "repeat(3, minmax(0, 1fr))",
        ]}
        gap={[5, 10]}
      >
        {blogs.map((post, index) => {
          return (
            <VStack
              key={index}
              p={2}
              alignItems="stretch"
              borderRadius="12px"
              overflow="hidden"
              boxShadow="0px 0px 8px #aaa"
              position="relative"
              cursor="pointer"
              spacing={0}
              onClick={() => {
                navigate(`/blog/${post._id}`);
              }}
              bgColor="#fff"
              _hover={{
                transform: "scale(1.02)",
              }}
              transition="all 0.2s ease"
            >
              <Box overflow="hidden" maxH="200px" mb={3} borderRadius="10px">
                <Image
                  src={"http://localhost:5000/" + post.coverImagePath}
                  alt="post"
                  aspectRatio="16/9"
                  objectFit="cover"
                />
              </Box>
              <Box flex={1} mb={3}>
                <Text
                  fontWeight={700}
                  fontSize={["18px", "20px", null, "22px"]}
                  lineHeight={1.2}
                  pb={1}
                  noOfLines={2}
                >
                  {post.title}
                </Text>
                <Text fontSize={["12px", "13px", null, "14px"]} noOfLines={5}>
                  {post.description}
                </Text>
              </Box>
              <SimpleGrid
                w="100%"
                templateColumns="minmax(0, 1fr) 80px"
                fontWeight={500}
                spacing={5}
                alignItems="center"
                px={3}
                py={2}
              >
                <HStack>
                  <Avatar
                    name={post.userId.username}
                    src={
                      post.userId.profileImagePath
                        ? `http://localhost:5000/${post.userId.profileImagePath}`
                        : ""
                    }
                    size="xs"
                  />
                  <Box>
                    <Text
                      fontSize={["12px", "13px", null, "14px"]}
                    >
                      {post.userId.username}
                    </Text>
                  </Box>
                </HStack>
                <Text
                  fontSize={["11px", "12px", null, "13px"]}
                  fontWeight={700}
                  opacity={0.5}
                >
                  {getBlogDate(post.createdAt)}
                </Text>
              </SimpleGrid>
            </VStack>
          );
        })}
      </SimpleGrid>
    </Box>
  );
};

export default Home;
