import { Box, Button, Center, Input, Text, Textarea } from "@chakra-ui/react";
import { useContext, useEffect, useState } from "react";
import { LoginContext } from "../context/LoginContext";
import { useNavigate } from "react-router-dom";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { FileUpload } from "@emotion-icons/material/FileUpload";
import { FileEarmarkImage } from "@emotion-icons/bootstrap/FileEarmarkImage";
import useApi from "../hooks/useApi";
import { FormSubmitButton } from "./common/Button";
import useCustomToast, { CustomToastStatusEnum } from "../hooks/useCustomToast";
import { GetCategoryFilterInterface } from "./Home";
import useCommonApi from "../hooks/useCommonApi";

const CreateBlog = () => {
  const { isLoggedIn, userId } = useContext(LoginContext);
  const navigate = useNavigate();
  const { api } = useApi();
  const { addCategory } = useCommonApi();
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [image, setImage] = useState<FileList | null>(null);
  const [content, setContent] = useState<string>("");
  const [isNewCategoryAdded, setIsNewCategoryAdded] = useState<boolean>(false);
  const customToast = useCustomToast();
  const [selectedCategory, setSelectedCategory] =
    useState<GetCategoryFilterInterface>({ _id: "", category: "" });
  const [availableCategory, setAvailableCategory] = useState<
    GetCategoryFilterInterface[]
  >([]);

  const blogCategoryOptions = availableCategory.filter(
    (d: GetCategoryFilterInterface) =>
      d.category
        .toLocaleLowerCase()
        .includes(selectedCategory.category.toLocaleLowerCase())
  );

  const handleCreatePost = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!image) {
      customToast("Image cannot be empty", CustomToastStatusEnum.error);
      return;
    }

    if (content === "") {
      customToast("Blog content cannot be empty", CustomToastStatusEnum.error);
      return;
    }

    const formData = new FormData();

    formData.set("userId", userId || "");
    formData.set("title", title);
    formData.set("description", description);
    formData.set("content", content);
    formData.set("categoryId", selectedCategory._id);
    formData.set("blogImage", image[0]);

    const res = await api("/blog/create", {
      method: "POST",
      body: formData,
      credentials: "include",
    });

    if (res.ok) {
      customToast("Blog created successfully", CustomToastStatusEnum.success);
      navigate("/");
      return;
    }

    const data: { message?: string } = await res.json();

    customToast(
      data.message || "Something went wrong, Please try again",
      CustomToastStatusEnum.error
    );
  };

  const addNewCategory = async () => {
    const res = await addCategory(selectedCategory.category);

    if (res.ok) {
      setSelectedCategory({ _id: "", category: "" });
      setIsNewCategoryAdded((prev) => !prev);
      customToast("Category added successfully", CustomToastStatusEnum.success);
      return;
    }
  };

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/login");
    }
  }, [isLoggedIn, navigate]);

  useEffect(() => {
    api("/blogCategory", {
      method: "GET",
    })
      .then((res) => res.json())
      .then((data) => {
        setAvailableCategory(data);
      })
      .catch((err) => console.log(err));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isNewCategoryAdded]);

  useEffect(() => {
    const input = document.getElementById("createPageBlogCategoryInput");
    const container = document.getElementById(
      "createPageBlogCategoryContainer"
    );

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
    <Box>
      <Box p={[5, 10]} bgColor="#fff" borderRadius="12px">
        <form onSubmit={handleCreatePost}>
          <Box w="100%" position="relative" mb={5}>
            <Input
              id="createPageBlogCategoryInput"
              border="1px solid #ccc"
              bgColor="#fff"
              placeholder="Select category"
              value={selectedCategory.category}
              autoComplete="off"
              maxLength={30}
              onChange={(e) =>
                setSelectedCategory((prev) => ({
                  ...prev,
                  category: e.target.value,
                }))
              }
            />
            <Box
              id="createPageBlogCategoryContainer"
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
                  {isLoggedIn ? (
                    <Button w="100%" onClick={addNewCategory}>
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
                      textTransform="capitalize"
                    >
                      {category.category}
                    </Text>
                  );
                })
              )}
            </Box>
          </Box>
          <Box
            w="100%"
            h="120px"
            border="2px dashed #ccc"
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
            minH="120px"
          />
          <ReactQuill
            value={content}
            onChange={(data) => setContent(data)}
            style={{ height: "400px" }}
          />
          <FormSubmitButton type="submit" mt={20} label="Create Post" />
        </form>
      </Box>
    </Box>
  );
};

export default CreateBlog;
