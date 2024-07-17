import { Box, Button, Center, Input, Text, Textarea } from "@chakra-ui/react";
import { useContext, useEffect, useState } from "react";
import { LoginContext } from "../context/LoginContext";
import { useNavigate } from "react-router-dom";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { FileUpload } from "@emotion-icons/material/FileUpload";
import { FileEarmarkImage } from "@emotion-icons/bootstrap/FileEarmarkImage";
import useApi from "../hooks/useApi";

const CreatePost = () => {
  const { isLoggedIn } = useContext(LoginContext);
  const navigate = useNavigate();
  const { api } = useApi();
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [image, setImage] = useState<FileList | null>(null);
  const [content, setContent] = useState<string>("");

  const handleCreatePost = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!image || content === "") {
      return;
    }

    const formData = new FormData();
    formData.set("title", title);
    formData.set("description", description);
    formData.set("content", content);
    formData.set("blogImage", image[0]);

    api("/upload", { method: "POST", body: formData, credentials: "include" });
  };

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/login");
    }
  }, [isLoggedIn, navigate]);

  if (!isLoggedIn) {
    return <></>;
  }

  return (
    <Box py={[5, 10, 20]} px={[5, 10, 20, "200px"]}>
      <form onSubmit={handleCreatePost}>
        <Box
          w="100%"
          h={["180px", "250px", null, "300px"]}
          border="2px dashed #ccc"
          borderRadius="5px"
          mb={5}
          position="relative"
        >
          <Input
            type="file"
            accept="image/png, image/jpeg, image/jpg, image/webp"
            id="image"
            w="100%"
            h="100%"
            opacity="0"
            cursor="pointer"
            onChange={(e) => setImage(e.target.files)}
          />
          <Center
            position="absolute"
            top={0}
            left={0}
            right={0}
            bottom={0}
            pointerEvents="none"
          >
            {image ? (
              <Box textAlign="center">
                <FileEarmarkImage width="40px" color="steelBlue" />
                <Text pt={2}>{image[0].name}</Text>
              </Box>
            ) : (
              <Box textAlign="center">
                <FileUpload width="40px" color="green" />
                <Text>Upload an Image</Text>
              </Box>
            )}
          </Center>
        </Box>
        <Input
          type="text"
          placeholder="Title"
          required
          mb={5}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <Textarea
          placeholder="Description"
          required
          mb={5}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <ReactQuill
          value={content}
          onChange={(data) => setContent(data)}
          style={{ height: "200px" }}
        />
        <Button type="submit">Create Post</Button>
      </form>
    </Box>
  );
};

export default CreatePost;
