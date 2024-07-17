import {
  Box,
  Center,
  Image,
  Text,
  chakra,
  useDisclosure,
} from "@chakra-ui/react";
import { GetPostInterface } from "./Home";
import { useEffect, useState } from "react";
import useApi from "../hooks/useApi";
import { Link, useNavigate, useParams } from "react-router-dom";
import NoDataFound from "./common/NoDataFound";
import CustomSpinner from "./common/CustomSpinner";
import { getBlogDate } from "../utils/getDate";
import { Edit } from "@emotion-icons/boxicons-regular/Edit";
import { Delete } from "@emotion-icons/fluentui-system-regular/Delete";
import DeleteAlertModal from "./common/DeleteAlertModal";
import { deletePost } from "../utils/deletePost";

const Blog = () => {
  const [blog, setBlog] = useState<GetPostInterface | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const { api } = useApi();
  const { id } = useParams();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const navigate = useNavigate();

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
        onClick={() => {
          deletePost(blog, () => {
            onClose();
            navigate("/");
          });
        }}
        description="Are you sure, you want to delete this post?"
      />
        <Link to={`/edit/${id}`}>
          <Center
            w="50px"
            h="50px"
            borderRadius="50%"
            position="fixed"
            top="40%"
            right={4}
            bgColor="#ccc"
            _hover={{
              opacity: 1,
            }}
          >
            <Edit width="20px" />
          </Center>
        </Link>
        <Center
          w="50px"
          h="50px"
          borderRadius="50%"
          position="fixed"
          top="50%"
          right={4}
          bgColor="red.500"
          _hover={{
            opacity: 1,
          }}
          onClick={onOpen}
        >
          <Delete width="23px" color="#fff"/>
        </Center>
        <Image
          src={`http://localhost:5000/${blog.coverImagePath}`}
          alt="coverImage"
          w="100%"
        />
      <Text fontWeight={500} fontSize={["18px", "22px", null, "26px"]} mt={5}>
        {blog.title}
      </Text>
      <Text fontSize={["14px", "16px", null, "18px"]} mt={3}>
        {blog.description}
      </Text>
      <Text fontWeight={500} w="100%" textAlign="right" mt={2}>
        {blog.username}{" "}
        <chakra.span fontWeight={600} opacity={0.7} pl={5}>
          {getBlogDate(blog.createdAt)}
        </chakra.span>
      </Text>
      <Box
        mt={5}
        fontSize={["14px", "16px", null, "18px"]}
        dangerouslySetInnerHTML={{
          __html: blog.content,
        }}
      />
    </Box>
  );
};

export default Blog;
