import {
  Avatar,
  Box,
  Button,
  HStack,
  Image,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { GetPostInterface } from "./Home";
import { useContext, useEffect, useState } from "react";
import useApi from "../hooks/useApi";
import { Link, useNavigate, useParams } from "react-router-dom";
import NoDataFound from "./common/NoDataFound";
import CustomSpinner from "./common/CustomSpinner";
import { getBlogDate } from "../utils/getDate";
import { Edit } from "@emotion-icons/boxicons-regular/Edit";
import { Delete } from "@emotion-icons/fluentui-system-regular/Delete";
import DeleteAlertModal from "./common/DeleteAlertModal";
import { LoginContext } from "../context/LoginContext";

const Blog = () => {
  const [blog, setBlog] = useState<GetPostInterface | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const { api } = useApi();
  const { id } = useParams();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const navigate = useNavigate();
  const { userId } = useContext(LoginContext);

  const deletePost = () => {
    if (!blog) {
      return;
    }

    fetch(
      `http://localhost:5000/api/blog/delete/${blog._id}/?coverImagePath=${blog.coverImagePath}`,
      {
        method: "DELETE",
        credentials: "include",
      }
    )
      .then(() => {
        onClose();
        navigate("/");
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    api(`/blog/${id}`, {
      method: "GET",
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        setLoading(false);
        setBlog(data);
      })
      .catch((err) => console.log(err));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  if (loading) {
    return <CustomSpinner />;
  }

  if (!blog) {
    return <NoDataFound />;
  }

  return (
    <Box px={[8, 16, null, "150px"]} py={[5, 10, null, 20]}>
      <DeleteAlertModal
        isOpen={isOpen}
        onClose={onClose}
        onClick={deletePost}
        description="Are you sure, you want to delete this post?"
      />
      <Text
        w="100%"
        textAlign="center"
        fontWeight={700}
        fontSize={["28px", "34px", null, "40px"]}
      >
        {blog.title}
      </Text>
      <HStack w="fit-content" mx="auto" alignItems="center" mt={2}>
        <Avatar
          name={blog.userId.username}
          src={
            blog.userId.profileImagePath
              ? `http://localhost:5000/${blog.userId.profileImagePath}`
              : ""
          }
        />
        <Box>
          <Text fontWeight={500} w="100%">
            @{blog.userId.username}{" "}
          </Text>
          <Text fontWeight={600} opacity={0.7} w="100%">
            {getBlogDate(blog.createdAt)}
          </Text>
        </Box>
      </HStack>
      {userId === blog.userId._id && (
        <HStack w="100%" justifyContent="center" mt={5}>
          <Link to={`/edit/${id}`}>
            <Button
              w="150px"
              color="#fff"
              bgColor="gray.700"
              leftIcon={<Edit width="18px" />}
              _hover={{
                opacity: 0.8,
              }}
              _active={{}}
            >
              Edit Post
            </Button>
          </Link>
          <Button
            w="150px"
            color="#fff"
            bgColor="red.500"
            leftIcon={<Delete width="22px" />}
            onClick={onOpen}
            _hover={{
              opacity: 0.8,
            }}
            _active={{}}
          >
            Delete Post
          </Button>
        </HStack>
      )}
      <Image
        src={`http://localhost:5000/${blog.coverImagePath}`}
        alt="coverImage"
        w="100%"
        mt={5}
      />
      <Box
        mt={[5, 10]}
        fontSize={["14px", "16px", null, "18px"]}
        dangerouslySetInnerHTML={{
          __html: blog.content,
        }}
      />
    </Box>
  );
};

export default Blog;
