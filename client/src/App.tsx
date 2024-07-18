import { Route, Routes } from "react-router-dom";
import Home from "./components/Home";
import Navbar from "./components/Navbar";
import { Box } from "@chakra-ui/react";
import CreateBlog from "./components/CreateBlog";
import EditPost from "./components/EditBlog";
import Register from "./components/Register";
import Login from "./components/Login";
import Blog from "./components/Blog";

function App() {
  return (
    <Box bgColor="#dbecf0" minH="100vh">
      <Navbar />
      <Box w="100%" h={["54px", "64px", null, "74px"]} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/create" element={<CreateBlog />} />
        <Route path="/edit/:id" element={<EditPost />} />
        <Route path="/blog/:id" element={<Blog />} />
        <Route path="/*" element={<Home />} />
      </Routes>
    </Box>
  );
}

export default App;
