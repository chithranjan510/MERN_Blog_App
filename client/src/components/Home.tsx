import {
  Avatar,
  Box,
  Button,
  HStack,
  Image,
  Input,
  SimpleGrid,
  Stack,
  Switch,
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
import { PlusCircle } from "@emotion-icons/bootstrap/PlusCircle";
import useCustomToast, { CustomToastStatusEnum } from "../hooks/useCustomToast";

const blogCategories: string[] = [
  "Finance",
  "Agriculture",
  "Technology",
  "Health & Wellness",
  "Travel",
  "Food & Cooking",
  "Lifestyle",
  "Fashion",
  "Education",
  "Entertainment",
  "Sports",
  "Business",
  "Personal Development",
  "Parenting",
  "Science",
  "Environment",
  "Politics",
  "Art & Design",
  "Real Estate",
  "Automotive",
  "Home Improvement",
  "DIY & Crafts",
  "Relationships",
  "History",
  "Books & Literature",
];

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
  const [loading, setLoading] = useState<boolean>(true);
  const [myPost, setMyPost] = useState<boolean>(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const { api } = useApi();
  const customToast = useCustomToast();

  const blogCategoryOptions = blogCategories.filter((d) =>
    d.toLocaleLowerCase().includes(selectedCategory.toLocaleLowerCase())
  );

  const addCategory = async () => {
    const res = await api("/blog/category", {
      method: "POST",
      body: JSON.stringify({ category: selectedCategory.toLocaleLowerCase() }),
      credentials: "include",
      headers: { "Content-Type": "application/json" },
    });

    if (res.ok) {
      customToast("Category added successfully", CustomToastStatusEnum.success);
      return;
    }
  };

  useEffect(() => {
    const input = document.getElementById("blogCategoryInput");
    const container = document.getElementById("blogCategoryContainer");

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

  return (
    <Box px={[5, 10, null, 20]} py={[5, 8, 14]}>
      <Stack
        w="100%"
        direction={["column", null, "row"]}
        mb={[5, 10]}
        justifyContent="space-between"
        spacing={5}
      >
        {isLoggedIn && (
          <HStack w={["100%", null, "fit-content"]} justify="space-between">
            <Link to="/create">
              <Button
                h="40px"
                w={["100%", null, "100%"]}
                color="#fff"
                bgColor="orange.500"
                _hover={{
                  bgColor: "orange.600",
                }}
                leftIcon={<PlusCircle width="18px" />}
              >
                Create new post
              </Button>
            </Link>
            <HStack
              h="40px"
              w="120px"
              borderRadius="6px"
              bgColor="gray.700"
              color="#fff"
              cursor="pointer"
              onClick={() => {
                setMyPost((prev) => !prev);
                setLoading(true);
              }}
              justifyContent="center"
            >
              <Text fontWeight={500}>My Post</Text>
              <Switch size="md" isChecked={myPost} pointerEvents="none" />
            </HStack>
          </HStack>
        )}
        <Box
          minW={["100%", null, "300px"]}
          maxW={["100%", null, "400px"]}
          h="42px"
          position="relative"
        >
          <Input
            id="blogCategoryInput"
            w="100%"
            h="100%"
            border="1px solid #ccc"
            bgColor="#fff"
            placeholder="Filter by category"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          />
          <Box
            id="blogCategoryContainer"
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
                {!isLoggedIn ? (
                  <Button w="100%" onClick={() => addCategory}>
                    Add above value to category
                  </Button>
                ) : (
                  <Text textAlign="center">No Data Found</Text>
                )}
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
                      setTimeout(() => setSelectedCategory(category), 100);
                    }}
                  >
                    {category}
                  </Text>
                );
              })
            )}
          </Box>
        </Box>
      </Stack>
      <HomaPageContent
        myPost={myPost}
        loading={loading}
        setLoading={setLoading}
      />
    </Box>
  );
};

const HomaPageContent = ({
  myPost,
  loading,
  setLoading,
}: {
  myPost: boolean;
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const [blogs, setBlogs] = useState<GetPostInterface[]>([]);
  const navigate = useNavigate();
  const { userId } = useContext(LoginContext);
  const { api } = useApi();

  useEffect(() => {
    api(myPost ? `/blog/?userId=${userId}` : "/blog", {
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
  }, [myPost]);

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
            borderRadius="16px"
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
            maxW="400px"
            mx="auto"
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
                  <Text fontSize={["12px", "13px", null, "14px"]}>
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
  );
};

export default Home;
