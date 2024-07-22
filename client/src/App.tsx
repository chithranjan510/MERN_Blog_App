import { Link, Route, Routes } from "react-router-dom";
import Home from "./components/Home";
import Sidebar from "./components/Sidebar";
import {
  Box,
  Drawer,
  DrawerCloseButton,
  DrawerContent,
  DrawerOverlay,
  HStack,
  Image,
  SimpleGrid,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import CreateBlog from "./components/CreateBlog";
import EditPost from "./components/EditBlog";
import Register from "./components/Register";
import Login from "./components/Login";
import Blog from "./components/Blog";
import Authors from "./components/Authors";
import Profile from "./components/Profile";
import Dashboard from "./components/dashboard/Dashboard";
import { MenuUnfold } from "@emotion-icons/remix-fill/MenuUnfold";
import { useContext } from "react";
import { FilterContext } from "./context/filterContext";

export const REACT_APP_BACKEND_URL =
  "https://mern-blog-app-backend-p9d3.onrender.com";

function App() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { setLoadingHomePage } = useContext(FilterContext);
  return (
    <Box bgColor="gray.600">
      {isOpen && (
        <Drawer isOpen={isOpen} placement="left" onClose={onClose}>
          <DrawerOverlay />
          <DrawerContent>
            <DrawerCloseButton color="#fff" />
            <Sidebar />
          </DrawerContent>
        </Drawer>
      )}
      <HStack
        bgColor="gray.800"
        w="100%"
        justifyContent="space-between"
        alignItems="center"
        position="fixed"
        top={0}
        left={0}
        right={0}
        px={5}
        py={3}
        zIndex={10}
        display={["flex", null, "none"]}
      >
        <Link to="/">
          <HStack onClick={() => setLoadingHomePage(true)}>
            <Box w="30px" h="30px" borderRadius="5px" overflow="hidden">
              <Image src="/favicon.png" alt="web-logo" w="100%" h="100%" />
            </Box>
            <Text fontWeight={600} fontSize="18px" color="#fff">
              Blogify
            </Text>
          </HStack>
        </Link>
        <Box onClick={onOpen}>
          <MenuUnfold width="30px" color="#fff" />
        </Box>
      </HStack>
      <SimpleGrid
        h="100%"
        templateColumns={["minmax(0, 1fr)", null, "300px minmax(0, 1fr)"]}
        spacing={5}
      >
        <Box
          py={5}
          pl={5}
          position="sticky"
          top={0}
          h="100vh"
          display={["none", null, "block"]}
        >
          <Sidebar />
        </Box>
        <Box
          py={[0, null, 5]}
          pr={[0, null, 5]}
          position="sticky"
          top={0}
          h="100vh"
        >
          <Box
            borderRadius={["none", null, "8px"]}
            bgColor="gray.800"
            h="100%"
            p={[7, null, 10]}
            pt={["60px", null, 10]}
            overflowY="auto"
          >
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/create" element={<CreateBlog />} />
              <Route path="/edit/:id" element={<EditPost />} />
              <Route path="/blog/:id" element={<Blog />} />
              <Route path="/authors" element={<Authors />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/dashboard" element={<Dashboard />} />
            </Routes>
          </Box>
        </Box>
      </SimpleGrid>
    </Box>
  );
}

export default App;
