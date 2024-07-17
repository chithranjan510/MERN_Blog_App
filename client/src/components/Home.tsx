import {
  Avatar,
  Box,
  chakra,
  HStack,
  Image,
  SimpleGrid,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useContext } from "react";
import { LoginContext } from "../context/LoginContext";

interface GetPostInterface {
  id: string;
  title: string;
  description: string;
  username: string;
  userId: string;
  createdAt: string;
  img: string;
  content: string;
}

const samplePosts: GetPostInterface[] = [
  {
    id: "1",
    title: "Understanding TypeScript",
    description:
      "Understanding TypeScript Understanding TypeScript Understanding TypeScript Understanding TypeScript Understanding TypeScript",
    username: "john_doe",
    userId: "u1",
    createdAt: "2024-07-16T10:00:00Z",
    img: "https://letsenhance.io/static/8f5e523ee6b2479e26ecc91b9c25261e/1015f/MainAfter.jpg",
    content:
      "This is a comprehensive guide to understanding TypeScript and its features...",
  },
  {
    id: "2",
    title: "React Hooks in Depth",
    description:
      "Understanding TypeScript Understanding TypeScript Understanding TypeScript Understanding TypeScript Understanding TypeScript",
    username: "jane_smith",
    userId: "u2",
    createdAt: "2024-07-15T14:30:00Z",
    img: "https://letsenhance.io/static/8f5e523ee6b2479e26ecc91b9c25261e/1015f/MainAfter.jpg",
    content:
      "React hooks have revolutionized the way we write React components...",
  },
  {
    id: "3",
    title: "Getting Started with Node.js and its properties",
    description:
      "Understanding TypeScript Understanding TypeScript Understanding TypeScript Understanding TypeScript Understanding TypeScript",
    username: "developer_joe",
    userId: "u3",
    createdAt: "2024-07-14T09:20:00Z",
    img: "https://letsenhance.io/static/8f5e523ee6b2479e26ecc91b9c25261e/1015f/MainAfter.jpg",
    content:
      "Node.js is a powerful tool for building server-side applications...",
  },
  {
    id: "4",
    title: "CSS Grid Layout",
    description:
      "Understanding TypeScript Understanding TypeScript Understanding TypeScript Understanding TypeScript Understanding TypeScript",
    username: "css_master_css_master",
    userId: "u4",
    createdAt: "2024-07-13T12:45:00Z",
    img: "https://letsenhance.io/static/8f5e523ee6b2479e26ecc91b9c25261e/1015f/MainAfter.jpg",
    content:
      "CSS Grid Layout is a two-dimensional layout system for the web...",
  },
  {
    id: "5",
    title: "Introduction to GraphQL",
    description:
      "Understanding TypeScript Understanding TypeScript Understanding TypeScript Understanding TypeScript Understanding TypeScript",
    username: "graphql_guru",
    userId: "u5",
    createdAt: "2024-07-12T11:00:00Z",
    img: "https://letsenhance.io/static/8f5e523ee6b2479e26ecc91b9c25261e/1015f/MainAfter.jpg",
    content:
      "GraphQL is a query language for APIs and a runtime for fulfilling those queries...",
  },
];

const Home = () => {
  const { username, email, isLoggedIn } = useContext(LoginContext);

  return (
    <Box px={[5, 10, null, 20]} py={[5, 8, 14]}>
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
        {samplePosts.map((post, index) => {
          return (
            <VStack
              alignItems="stretch"
              key={index}
              borderRadius="10px"
              overflow="hidden"
              boxShadow="0 0 5px #aaa"
            >
              <Box overflow="hidden" aspectRatio="16/9">
                <Image src={post.img} alt="post" />
              </Box>
              <Box px={4} flex={1}>
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
              <Text
                fontWeight={500}
                fontSize={["12px", "13px", null, "14px"]}
                textAlign="center"
                px={5}
                py={2}
                bgColor="gray.700"
                color="orange.200"
              >
                {post.username}
                <chakra.span>{` -> `}</chakra.span>
                <chakra.span
                  fontWeight={500}
                  fontSize={["11px", "12px", null, "13px"]}
                  color="#fff"
                >
                  {new Date(post.createdAt).toLocaleDateString()}
                </chakra.span>
              </Text>
            </VStack>
          );
        })}
      </SimpleGrid>
    </Box>
  );
};

export default Home;
