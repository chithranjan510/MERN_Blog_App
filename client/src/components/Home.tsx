import {
  Avatar,
  Box,
  Center,
  HStack,
  Image,
  Input,
  SimpleGrid,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useContext, useEffect, useState } from "react";
import { LoginContext } from "../context/LoginContext";
import useApi from "../hooks/useApi";
import { useNavigate } from "react-router-dom";
import NoDataFound from "./common/NoDataFound";
import CustomSpinner from "./common/CustomSpinner";
import { getBlogDate } from "../utils/getDate";
import { REACT_APP_BACKEND_URL } from "../App";
import { Clear } from "@emotion-icons/material-twotone/Clear";

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

export interface GetCategoryInterface {
  _id: string;
  category: string;
}

export interface PostFilterInterface {
  myPost: boolean;
  categoryId: string;
}

const Home = () => {
  const { isLoggedIn } = useContext(LoginContext);
  const [loading, setLoading] = useState<boolean>(true);
  const [postFilters, setPostFilters] = useState<PostFilterInterface>({
    myPost: false,
    categoryId: "",
  });
  const [selectedCategory, setSelectedCategory] =
    useState<GetCategoryInterface>({ _id: "", category: "" });
  const [availableCategory, setAvailableCategory] = useState<
    GetCategoryInterface[]
  >([]);
  const { api } = useApi();

  const blogCategoryOptions = availableCategory.filter(
    (d: GetCategoryInterface) =>
      d.category
        .toLocaleLowerCase()
        .includes(selectedCategory.category.toLocaleLowerCase())
  );

  useEffect(() => {
    const input = document.getElementById("homePageBlogCategoryInput");
    const container = document.getElementById("homePageBlogCategoryContainer");

    if (input && container) {
      input.addEventListener("focus", () => {
        container.style.display = "block";
      });

      input.addEventListener("blur", () => {
        setTimeout(() => {
          container.style.display = "none";
        }, 300);
      });
    }
  }, []);

  useEffect(() => {
    api("/blogCategory", {
      method: "GET",
    })
      .then((res) => res.json())
      .then((data) => setAvailableCategory(data))
      .catch((err) => console.log(err));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Box>
      <HStack
        w="100%"
        px={[5, 7, null, 10]}
        pt={["70px", null, 10]}
        pb={[4, null, 5]}
        justifyContent={isLoggedIn ? "space-between" : "flex-end"}
        spacing={3}
        position="sticky"
        top={0}
        bgColor="gray.800"
        zIndex={10}
      >
        {isLoggedIn && (
          <Center
            h="40px"
            px={[2, 4]}
            borderRadius="6px"
            bgColor={postFilters.myPost ? "green.100" : "none"}
            border="1px"
            borderColor={postFilters.myPost ? "gray.600" : "#fff"}
            color={postFilters.myPost ? "orange.700" : "#fff"}
            cursor="pointer"
            onClick={() => {
              setPostFilters((prev) => ({ ...prev, myPost: !prev.myPost }));
              setLoading(true);
            }}
            fontWeight={500}
          >
            <Text display={["block", "block"]} fontSize="14px">
              My Post
            </Text>
          </Center>
        )}
        <Box w="250px" h="42px" position="relative">
          {selectedCategory.category !== "" && (
            <Center
              w="42px"
              h="42px"
              position="absolute"
              right={0}
              top={0}
              zIndex={10}
              borderRadius="5px"
              cursor="pointer"
              onClick={() => {
                setSelectedCategory({ _id: "", category: "" });
                setPostFilters((prev) => ({
                  ...prev,
                  categoryId: "",
                }));
              }}
            >
              <Clear width="20px" color="#000" />
            </Center>
          )}
          <Input
            id="homePageBlogCategoryInput"
            w="100%"
            h="100%"
            pr="42px"
            border="none"
            bgColor="gray.600"
            placeholder="Filter by category"
            value={selectedCategory.category}
            autoComplete="off"
            onChange={(e) =>
              setSelectedCategory((prev) => ({
                ...prev,
                category: e.target.value,
              }))
            }
            _placeholder={{
              color: "#fff",
            }}
          />
          <Box
            id="homePageBlogCategoryContainer"
            display="none"
            position="absolute"
            w="100%"
            maxH="250px"
            overflowY="auto"
            top="50px"
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
                        setSelectedCategory(category);
                        setPostFilters((prev) => ({
                          ...prev,
                          categoryId: category._id,
                        }));
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
      </HStack>
      <HomaPageContent
        postFilters={postFilters}
        loading={loading}
        setLoading={setLoading}
      />
    </Box>
  );
};

const HomaPageContent = ({
  postFilters,
  loading,
  setLoading,
}: {
  postFilters: PostFilterInterface;
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const [blogs, setBlogs] = useState<GetPostInterface[]>([]);
  const navigate = useNavigate();
  const { userId } = useContext(LoginContext);
  const { api } = useApi();

  const url =
    postFilters.myPost && postFilters.categoryId
      ? `/blog/?userId=${userId}&categoryId=${postFilters.categoryId}`
      : postFilters.myPost
      ? `/blog/?userId=${userId}`
      : postFilters.categoryId
      ? `/blog/?categoryId=${postFilters.categoryId}`
      : "/blog";

  useEffect(() => {
    api(url, {
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
  }, [JSON.stringify(postFilters)]);

  if (loading) {
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
      px={[7, null, 10]}
      pb={[7, null, 10]}
      pt={[3, null, 5]}
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
