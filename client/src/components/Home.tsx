import {
  Avatar,
  Box,
  Center,
  HStack,
  Image,
  SimpleGrid,
  Text,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";
import { useContext, useEffect, useState } from "react";
import { LoginContext } from "../context/LoginContext";
import useApi from "../hooks/useApi";
import { Edit } from "@emotion-icons/boxicons-regular/Edit";
import { Delete } from "@emotion-icons/fluentui-system-regular/Delete";
import { useNavigate } from "react-router-dom";
import NoDataFound from "./common/NoDataFound";
import CustomSpinner from "./common/CustomSpinner";
import { getBlogDate } from "../utils/getDate";
import { deletePost } from "../utils/deletePost";
import DeleteAlertModal from "./common/DeleteAlertModal";

export interface GetPostInterface {
  _id: string;
  username: string;
  userId: string;
  title: string;
  description: string;
  coverImagePath: string;
  content: string;
  createdAt: string;
}

const Home = () => {
  const { username, email, isLoggedIn, userId } = useContext(LoginContext);
  const [blogs, setBlogs] = useState<GetPostInterface[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [reload, setReload] = useState<boolean>(false);
  const { api } = useApi();
  const navigate = useNavigate();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [activeBlog, setActiveBlog] = useState<GetPostInterface | null>(null);

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
      <DeleteAlertModal
        isOpen={isOpen}
        onClose={onClose}
        onClick={() => {
          if (activeBlog)
            deletePost(activeBlog, () => {
              onClose();
              setReload(true);
              setLoading(true);
            });
        }}
        description="Are you sure, you want to delete this post?"
      />
      {isLoggedIn && (
        <HStack pb={[8, 12, null, 16]}>
          <Avatar name={username || "guest"} size={["sm", "md"]} />
          <Box>
            <Text fontWeight={500} fontSize={["14px", "18px"]} lineHeight={1}>
              {username}
            </Text>
            <Text fontSize={["13px", "16px"]}>{email}</Text>
          </Box>
        </HStack>
      )}
      <SimpleGrid
        templateColumns={[
          "minmax(0, 1fr)",
          "repeat(2, minmax(0, 1fr))",
          null,
          "repeat(3, minmax(0, 1fr))",
        ]}
        gap={8}
      >
        {blogs.map((post, index) => {
          return (
            <VStack
              key={index}
              p={2}
              alignItems="stretch"
              borderRadius="8px"
              overflow="hidden"
              boxShadow="0px 0px 8px #aaa"
              position="relative"
              cursor="pointer"
              spacing={0}
              onClick={() => {
                navigate(`/blog/${post._id}`);
              }}
            >
              {post.userId === userId && (
                <Center
                  w="40px"
                  h="40px"
                  borderRadius="50%"
                  position="absolute"
                  top={3}
                  right={3}
                  bgColor="#eee"
                  opacity={0.5}
                  _hover={{
                    opacity: 1,
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/edit/${post._id}`);
                  }}
                >
                  <Edit width="20px" />
                </Center>
              )}
              {post.userId === userId && (
                <Center
                  w="40px"
                  h="40px"
                  borderRadius="50%"
                  position="absolute"
                  top={3}
                  left={3}
                  bgColor="#eee"
                  opacity={0.5}
                  _hover={{
                    opacity: 1,
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveBlog(post);
                    onOpen();
                  }}
                >
                  <Delete width="23px" />
                </Center>
              )}
              <Box overflow="hidden" maxH="200px" mb={3}>
                <Image
                  src={"http://localhost:5000/" + post.coverImagePath}
                  alt="post"
                  aspectRatio="16/9"
                  objectFit="cover"
                />
              </Box>
              <Box flex={1} mb={3}>
                <Text
                  fontWeight={500}
                  fontSize={["18px", "20px", null, "22px"]}
                  lineHeight={1.2}
                  pb={1}
                >
                  {post.title}
                </Text>
                <Text fontSize={["12px", "13px", null, "14px"]}>
                  {post.description}
                </Text>
              </Box>
              <SimpleGrid
                w="100%"
                templateColumns="minmax(0, 1fr) 80px"
                fontWeight={500}
                spacing={5}
                alignItems="center"
                textAlign="center"
                px={5}
                py={2}
                bgColor="#eee"
              >
                <Text
                  fontSize={["12px", "13px", null, "14px"]}
                  textAlign="left"
                >
                  {post.username}
                </Text>
                <Text
                  fontSize={["11px", "12px", null, "13px"]}
                  textAlign="right"
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
