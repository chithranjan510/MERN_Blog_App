import {
  Box,
  HStack,
  IconButton,
  Text,
  useDisclosure,
  Wrap,
  WrapItem,
} from "@chakra-ui/react";
import { GetCategoryFilterInterface } from "../Home";
import { useContext, useEffect, useState } from "react";
import { Delete } from "@emotion-icons/fluentui-system-regular/Delete";
import useApi from "../../hooks/useApi";
import DeleteAlertModal from "../common/DeleteAlertModal";
import { LoginContext } from "../../context/LoginContext";
import CustomSpinner from "../common/CustomSpinner";
import NoDataFound from "../common/NoDataFound";

const Categories = ({
  setTotalCategories,
}: {
  setTotalCategories: React.Dispatch<React.SetStateAction<number | null>>;
}) => {
  const [categories, setCategories] = useState<GetCategoryFilterInterface[]>(
    []
  );
  const [selectedCategory, setSelectedCategory] =
    useState<GetCategoryFilterInterface | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const { token } = useContext(LoginContext);

  const { isOpen, onOpen, onClose } = useDisclosure();
  const { api } = useApi();

  const deleteCategory = () => {
    api(`/blogCategory/${selectedCategory?._id}/?token=${token}`, {
      method: "DELETE",
    })
      .then(() => {
        onClose();
        setSelectedCategory(null);
        setLoading(true);
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    if (!loading) {
      return;
    }

    api("/blogCategory", {
      method: "GET",
    })
      .then((res) => res.json())
      .then((data: GetCategoryFilterInterface[]) => {
        setCategories(data);
        setTotalCategories(data.length);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading]);

  if (loading) {
    return <CustomSpinner />;
  }

  if (categories.length === 0) {
    return <NoDataFound />;
  }

  return (
    <Box>
      <DeleteAlertModal
        isOpen={isOpen}
        onClose={onClose}
        onClick={deleteCategory}
        description={`Are you sure want to delete ${selectedCategory?.category} category?`}
      />
      <Wrap w="100%" spacing={[7, 10]}>
        {categories.map((category, index) => {
          return (
            <WrapItem
              key={index}
              bgColor="#fff"
              borderRadius="8px"
              minW="300px"
              w={["100%", "fit-content"]}
              justifyContent="space-between"
              p={4}
            >
              <HStack w="100%" spacing={2} justifyContent="space-between">
                <Box>
                  <Text fontWeight={700} wordBreak="break-word">
                    {category.category}
                  </Text>
                </Box>
                <IconButton
                  aria-label="delete-post"
                  icon={<Delete width="25px" />}
                  borderRadius="50%"
                  bgColor="red.500"
                  color="#fff"
                  onClick={() => {
                    onOpen();
                    setSelectedCategory(category);
                  }}
                  _hover={{}}
                  _active={{}}
                />
              </HStack>
            </WrapItem>
          );
        })}
      </Wrap>
    </Box>
  );
};

export default Categories;
