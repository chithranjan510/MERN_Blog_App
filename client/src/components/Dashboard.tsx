import { useContext, useEffect, useState } from "react";
import { LoginContext } from "../context/LoginContext";
import CustomSpinner from "./common/CustomSpinner";
import { useNavigate } from "react-router-dom";
import useCustomToast, { CustomToastStatusEnum } from "../hooks/useCustomToast";
import {
  Avatar,
  Box,
  Button,
  Center,
  HStack,
  IconButton,
  Image,
  SimpleGrid,
  Text,
  VStack,
  Wrap,
  WrapItem,
  chakra,
  useDisclosure,
} from "@chakra-ui/react";
import useApi from "../hooks/useApi";
import { REACT_APP_BACKEND_URL } from "../App";
import NoDataFound from "./common/NoDataFound";
import { ArrowBackOutline } from "@emotion-icons/evaicons-outline/ArrowBackOutline";
import { GetPostInterface } from "./Home";
import { getBlogDate } from "../utils/getDate";
import DeleteAlertModal from "./common/DeleteAlertModal";
import { Delete } from "@emotion-icons/fluentui-system-regular/Delete";

interface AdminAuthorDetailInterface {
  userId: string;
  postCount: number;
  username: string;
  email: string;
  profileImagePath: string | null;
}

interface AdminDashboardDetailInterface {
  totalUsers: number;
  users: AdminAuthorDetailInterface[];
}

const Dashboard = () => {
  const { isLoggedIn, isAdmin } = useContext(LoginContext);
  const navigate = useNavigate();
  const customToast = useCustomToast();
  const [authors, setAuthors] = useState<AdminDashboardDetailInterface | null>(
    null
  );
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedAuthorDetails, setSelectedAuthorDetails] =
    useState<AdminAuthorDetailInterface | null>(null);

  const { api } = useApi();

  useEffect(() => {
    if (!isLoggedIn || !isAdmin) {
      customToast("You donot have admin access", CustomToastStatusEnum.error);
      navigate("/");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoggedIn, isAdmin]);

  useEffect(() => {
    api("/admin/authors", {
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

  if (loading) {
    return <CustomSpinner />;
  }

  if (!authors) {
    return <NoDataFound />;
  }

  return (
    <>
      {selectedAuthorDetails ? (
        <UserPosts
          selectedAuthorDetails={selectedAuthorDetails}
          setSelectedAuthorDetails={setSelectedAuthorDetails}
        />
      ) : (
        <Box>
          <HStack w="100%" justifyContent="flex-end" pb={[5, 7, 10]}>
            <Text
              px={3}
              py={2}
              bgColor="#fff"
              borderRadius="6px"
              w="fit-content"
            >
              Total Users:
              <chakra.span pl={2} fontWeight={700}>
                {authors.totalUsers}
              </chakra.span>
            </Text>
          </HStack>
          <Wrap w="100%" spacing={[7, 10]}>
            {authors.users.map((author, index) => {
              return (
                <WrapItem
                  key={index}
                  bgColor="#fff"
                  borderRadius="8px"
                  minW="300px"
                  w={["100%", "fit-content"]}
                  cursor="pointer"
                  justifyContent="space-between"
                  p={4}
                  onClick={() => setSelectedAuthorDetails(author)}
                >
                  <HStack w="100%" spacing={2}>
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
                  <Center
                    h="100%"
                    minW="50px"
                    borderRadius="6px"
                    px={2}
                    bgColor="gray.300"
                  >
                    {author.postCount}
                  </Center>
                </WrapItem>
              );
            })}
          </Wrap>
        </Box>
      )}
    </>
  );
};

const UserPosts = ({
  selectedAuthorDetails,
  setSelectedAuthorDetails,
}: {
  selectedAuthorDetails: AdminAuthorDetailInterface;
  setSelectedAuthorDetails: React.Dispatch<
    React.SetStateAction<AdminAuthorDetailInterface | null>
  >;
}) => {
  const { api } = useApi();
  const navigate = useNavigate();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isPostDeleteOpen,
    onOpen: onPostDeleteOpen,
    onClose: onPostDeleteClose,
  } = useDisclosure();
  const [blogs, setBlogs] = useState<GetPostInterface[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [blog, setBlog] = useState<GetPostInterface | null>(null);

  const userId = selectedAuthorDetails.userId;

  const deleteUser = () => {
    api(`/user/delete/${userId}`, {
      method: "DELETE",
      credentials: "include",
    })
      .then(() => {
        onClose();
        setSelectedAuthorDetails(null);
        window.location.reload();
      })
      .catch((err) => console.log(err));
  };

  const deletePost = () => {
    if (!blog) {
      return;
    }

    api(`/blog/delete/${blog._id}/?coverImagePath=${blog.coverImagePath}`, {
      method: "DELETE",
      credentials: "include",
    })
      .then(() => {
        onClose();
        navigate("/");
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    api(`/blog/?userId=${userId}`, {
      method: "GET",
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        setBlogs(data);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  if (loading) {
    return <CustomSpinner />;
  }

  if (blogs.length === 0) {
    return <NoDataFound />;
  }

  return (
    <Box>
      <DeleteAlertModal
        isOpen={isOpen}
        onClose={onClose}
        onClick={deleteUser}
        description="User will get deleted permanently, are you sure want to delete this user?"
      />
      <DeleteAlertModal
        isOpen={isPostDeleteOpen}
        onClose={onPostDeleteClose}
        onClick={deletePost}
        description="Are your sure, you want to delete this post?"
      />
      <HStack w="100%" justifyContent="space-between" pb={[5, 7, 10]}>
        <HStack spacing={3}>
          <Button
            aria-label="back"
            color="#fff"
            leftIcon={<ArrowBackOutline width="20px" />}
            bgColor="gray.600"
            _hover={{ bgColor: "gray.700" }}
            _active={{}}
            onClick={() => setSelectedAuthorDetails(null)}
          >Back</Button>
          <Text px={3} py={2} bgColor="#fff" borderRadius="6px" w="fit-content">
            Posts:
            <chakra.span pl={2} fontWeight={700}>
              {selectedAuthorDetails.postCount}
            </chakra.span>
          </Text>
        </HStack>
        <Button
          color="#fff"
          bgColor="red.500"
          _hover={{ bgColor: "red.600" }}
          _active={{}}
          onClick={onOpen}
        >
          Delete User
        </Button>
      </HStack>
      <SimpleGrid
        templateColumns={[
          "minmax(0, 1fr)",
          "repeat(2, minmax(0, 1fr))",
          "minmax(0, 1fr)",
          "repeat(2, minmax(0, 1fr))",
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
              borderRadius="16px"
              overflow="hidden"
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
              maxW={["100%", null, null, "300px"]}
              mx="auto"
            >
              <IconButton
                aria-label="delete-post"
                icon={<Delete width="25px" />}
                borderRadius="50%"
                position="absolute"
                top={3}
                right={3}
                bgColor="red.500"
                color="#fff"
                onClick={(e) => {
                  e.stopPropagation();
                  setBlog(post);
                  onPostDeleteOpen();
                }}
                _hover={{}}
                _active={{}}
              />
              <Box overflow="hidden" maxH="200px" mb={3} borderRadius="10px">
                <Image
                  src={`${REACT_APP_BACKEND_URL}/${post.coverImagePath}`}
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
                <Text fontSize={["12px", "13px", null, "14px"]} noOfLines={4}>
                  {post.description}
                </Text>
              </Box>
              <SimpleGrid
                w="100%"
                templateColumns="minmax(0, 1fr) 80px"
                fontWeight={500}
                spacing={5}
                alignItems="center"
                p={2}
              >
                <HStack>
                  <Avatar
                    name={post.userId.username}
                    src={
                      post.userId.profileImagePath
                        ? `${REACT_APP_BACKEND_URL}/${post.userId.profileImagePath}`
                        : ""
                    }
                    size="xs"
                  />
                  <Text fontSize={["12px", "13px", null, "14px"]}>
                    {post.userId.username}
                  </Text>
                </HStack>
                <Text
                  fontSize={["11px", "12px", null, "13px"]}
                  fontWeight={700}
                  opacity={0.5}
                >
                  {getBlogDate(post.createdAt)}
                </Text>
              </SimpleGrid>
              <Text
                w="100%"
                textAlign="center"
                px={3}
                py={2}
                borderBottomRadius="10px"
                bgColor="gray.600"
                color="#fff"
                fontWeight={500}
                textTransform="capitalize"
                fontSize={["12px", "14px", null, "16px"]}
              >
                {post.categoryId.category}
              </Text>
            </VStack>
          );
        })}
      </SimpleGrid>
    </Box>
  );
};

export default Dashboard;
