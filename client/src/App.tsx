import { Route, Routes } from "react-router-dom";
import Home from "./components/Home";
import Navbar from "./components/Navbar";
import { Box } from "@chakra-ui/react";
import CreatePost from "./components/CreatePost";
import EditPost from "./components/EditPost";
import Register from "./components/Register";
import Login from "./components/Login";

function App() {
  return (
    <>
      <Navbar />
      <Box w="100%" h={["54px", "64px", null, "74px"]} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/create" element={<CreatePost />} />
        <Route path="/editPost/:id" element={<EditPost />} />
        <Route path="/*" element={<Home />} />
      </Routes>
    </>
  );
}

export default App;
