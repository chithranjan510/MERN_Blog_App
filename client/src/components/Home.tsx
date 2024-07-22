import {
  Avatar,
  Box,
  HStack,
  IconButton,
  Image,
  SimpleGrid,
  Text,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";
import { useContext, useEffect, useState } from "react";
import useApi from "../hooks/useApi";
import { useNavigate } from "react-router-dom";
import NoDataFound from "./common/NoDataFound";
import CustomSpinner from "./common/CustomSpinner";
import { getBlogDate } from "../utils/getDate";
import { REACT_APP_BACKEND_URL } from "../App";
import { FilterContext } from "../context/filterContext";
import { Delete } from "@emotion-icons/fluentui-system-regular/Delete";
import DeleteAlertModal from "./common/DeleteAlertModal";
import { LoginContext } from "../context/LoginContext";

export interface GetPostInterface {
  _id: string;
  userId: { profileImagePath: string | null; username: string; _id: string };
  categoryId: { category: string; _id: string };
  title: string;
  description: string;
  coverImagePath: string;
  content: string;
  createdAt: string;
}

export interface GetCategoryFilterInterface {
  _id: string;
  category: string;
}

export interface GetUserFilterInterface {
  _id: string;
  username: string;
}

export interface PostFilterInterface {
  myPost: boolean;
  categoryId: string;
}

const Home = () => {
  const [blogs, setBlogs] = useState<GetPostInterface[]>([]);
  const [selectedBlog, setSelectedBlog] = useState<GetPostInterface | null>(
    null
  );
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();
  const {
    selectedUserId,
    selectedCategoryId,
    setLoadingHomePage,
    loadingHomepage,
  } = useContext(FilterContext);
  const { isAdmin, token } = useContext(LoginContext);
  const { api } = useApi();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const deletePost = () => {
    if (!selectedBlog) {
      return;
    }

    api(
      `/blog/delete/${selectedBlog._id}/?coverImagePath=${selectedBlog.coverImagePath}&token=${token}`,
      {
        method: "DELETE",
      }
    )
      .then(() => {
        onClose();
      })
      .catch((err) => console.log(err));
  };

  const url =
    selectedUserId && selectedCategoryId
      ? `/blog/?userId=${selectedUserId}&categoryId=${selectedCategoryId}`
      : selectedUserId
      ? `/blog/?userId=${selectedUserId}`
      : selectedCategoryId
      ? `/blog/?categoryId=${selectedCategoryId}`
      : "/blog";

  useEffect(() => {
    if (!loadingHomepage && !loading) {
      return;
    }

    api(url, {
      method: "GET",
    })
      .then((res) => res.json())
      .then((data) => {
        setBlogs(data);
        setLoadingHomePage(false);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoadingHomePage(false);
        setLoading(false);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedUserId, selectedCategoryId, loadingHomepage]);

  if (loadingHomepage || loading) {
    return <CustomSpinner />;
  }

  if (blogs.length === 0) {
    return <NoDataFound />;
  }

  return (
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
      <DeleteAlertModal
        isOpen={isOpen}
        onClose={onClose}
        onClick={() => deletePost()}
        description="Are your sure, you want to delete this post?"
      />
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
            {isAdmin && (
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
                  setSelectedBlog(post);
                  onOpen();
                }}
                _hover={{}}
                _active={{}}
              />
            )}
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
  );
};

export default Home;
