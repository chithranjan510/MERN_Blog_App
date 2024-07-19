import {
  Box,
  Center,
  Image,
  Input,
  Text,
  Textarea,
  useToast,
} from "@chakra-ui/react";
import { useContext, useEffect, useState } from "react";
import { LoginContext } from "../context/LoginContext";
import { useNavigate, useParams } from "react-router-dom";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { FileUpload } from "@emotion-icons/material/FileUpload";
import { FileEarmarkImage } from "@emotion-icons/bootstrap/FileEarmarkImage";
import useApi from "../hooks/useApi";
import { FormSubmitButton } from "./common/Button";
import { Delete } from "@emotion-icons/fluentui-system-regular/Delete";
import { GetPostInterface } from "./Home";
import CustomSpinner from "./common/CustomSpinner";
import NoDataFound from "./common/NoDataFound";

const createBlogToastId = "createBlogToastId";

const EditBlog = () => {
  const { isLoggedIn, userId } = useContext(LoginContext);
  const navigate = useNavigate();
  const { api } = useApi();
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [image, setImage] = useState<FileList | null>(null);
  const [imageSrc, setImageSrc] = useState<string>("");
  const [oldImageSrc, setOldImageSrc] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [isData, setIsData] = useState<boolean>(false);
  const [postUserId, setPostUserId] = useState<string | null>(null);
  const toast = useToast();
  const { id } = useParams();

  const handleCreatePost = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!image && imageSrc === "") {
      if (!toast.isActive(createBlogToastId)) {
        toast({
          id: createBlogToastId,
          description: "Image cannot be empty",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
      return;
    }

    if (content === "") {
      if (!toast.isActive(createBlogToastId)) {
        toast({
          id: createBlogToastId,
          description: "Blog content cannot be empty",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
      return;
    }

    const formData = new FormData();

    formData.set("title", title);
    formData.set("description", description);
    formData.set("content", content);
    if (image) {
      formData.set("blogImage", image[0]);
    }
    formData.set("coverImagePath", oldImageSrc);

    const res = await api(`/blog/edit/${id}`, {
      method: "PUT",
      body: formData,
      credentials: "include",
    });

    if (res.ok) {
      if (!toast.isActive(createBlogToastId)) {
        toast({
          id: createBlogToastId,
          description: "Blog updated successfully",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      }
      navigate(`/blog/${id}`);
      return;
    }

    const data: { message?: string } = await res.json();

    if (!toast.isActive(createBlogToastId)) {
      toast({
        id: createBlogToastId,
        description: data.message || "Something went wrong, Please try again",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/login");
    }

    api(`/blog/${id}`, { method: "GET", credentials: "include" })
      .then((res) => res.json())
      .then((data: GetPostInterface) => {
        setImageSrc(data.coverImagePath);
        setOldImageSrc(data.coverImagePath);
        setContent(data.content);
        setDescription(data.description);
        setTitle(data.title);
        setPostUserId(data.userId._id);
        setLoading(false);
        setIsData(true);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, isLoggedIn]);

  useEffect(() => {
    if (!postUserId || !userId) {
      return;
    }

    if (userId !== postUserId) {
      if (!toast.isActive(createBlogToastId)) {
        toast({
          id: createBlogToastId,
          description: "You can only edit your own post",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
      navigate(`/blog/${id}`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [postUserId, userId]);

  if (loading) {
    return <CustomSpinner />;
  }

  if (!isData) {
    return <NoDataFound />;
  }

  return (
    <Box py={[5, 10, 20]} px={[5, 10, 20, "200px"]}>
      <Box p={[5, 10]} bgColor="#fff" borderRadius="12px">
        <form onSubmit={handleCreatePost}>
          <Box
            w="100%"
            aspectRatio="16/9"
            border={imageSrc ? "none" : "2px dashed #ccc"}
            borderRadius="5px"
            mb={5}
            position="relative"
            overflow="hidden"
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
            {imageSrc ? (
              <Box position="absolute" top={0} left={0} right={0} bottom={0}>
                <Image
                  src={`http://localhost:5000/${imageSrc}`}
                  alt="blog-post"
                  w="100%"
                  h="100%"
                />
                <Center
                  w="40px"
                  h="40px"
                  borderRadius="50%"
                  position="absolute"
                  top={3}
                  right={3}
                  bgColor="red.500"
                  opacity={0.8}
                  _hover={{
                    opacity: 1,
                  }}
                  onClick={() => {
                    setImageSrc("");
                  }}
                >
                  <Delete width="23px" color="#fff" />
                </Center>
              </Box>
            ) : (
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
            )}
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
            style={{ height: "500px" }}
          />
          <FormSubmitButton type="submit" mt={20} label="Edit Post" />
        </form>
      </Box>
    </Box>
  );
};

export default EditBlog;
