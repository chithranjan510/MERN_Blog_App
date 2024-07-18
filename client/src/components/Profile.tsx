import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { LoginContext } from "../context/LoginContext";
import { Box, Center, Image, Input, Text, VStack } from "@chakra-ui/react";
import { Camera } from "@emotion-icons/bootstrap/Camera";
import { Edit } from "@emotion-icons/boxicons-regular/Edit";
import { Delete } from "@emotion-icons/fluentui-system-regular/Delete";
import useApi from "../hooks/useApi";

const Profile = () => {
  const {
    userId,
    username,
    email,
    profileImagePath,
    isLoggedIn,
    setProfileImagePath,
  } = useContext(LoginContext);
  const navigate = useNavigate();
  const { api } = useApi();

  const uploadProfileImage = (file: FileList | null) => {
    if (!file) {
      return;
    }

    const formData = new FormData();
    formData.set("profileImage", file[0]);

    api(`/auth/profileImage/${userId}`, {
      method: "POST",
      body: formData,
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => setProfileImagePath(data.profileImagePath))
      .catch((err) => console.log(err));
  };

  const deleteProfileImage = () => {
    api(`/auth/profileImage/${userId}/?profileImagePath=${profileImagePath}`, {
      method: "DELETE",
      credentials: "include",
    })
      .then(() => setProfileImagePath(null))
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/login");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoggedIn]);

  return (
    <Box p={[10, null, null, 20]}>
      <VStack
        maxW="500px"
        py={10}
        mx="auto"
        borderRadius="8px"
        boxShadow="0 0 8px #aaa"
        bgColor="#fff"
        position="relative"
      >
        <VStack w="100%" position="relative">
          <Box
            w={"40%"}
            aspectRatio="1/1"
            border="2px dashed #ccc"
            borderRadius="50%"
            mb={5}
            position="relative"
            overflow="hidden"
          >
            <Input
              type="file"
              accept="image/png, image/jpeg, image/jpg, image/webp"
              w="100%"
              h="100%"
              opacity="0"
              cursor="pointer"
              onChange={(e) => uploadProfileImage(e.target.files)}
            />

            {profileImagePath ? (
              <Box position="absolute" top={0} left={0} right={0} bottom={0}>
                <Image
                  src={`http://localhost:5000/${profileImagePath}`}
                  w="100%"
                  h="100%"
                />
              </Box>
            ) : (
              <Center
                position="absolute"
                top={0}
                left={0}
                right={0}
                bottom={0}
                pointerEvents="none"
                bgColor="#fafafa"
              >
                <Box textAlign="center">
                  <Camera width="40px" color="#ddd" />
                  <Text fontWeight={500} color="#888">
                    Profile Image
                  </Text>
                </Box>
              </Center>
            )}
          </Box>
          {profileImagePath && (
            <Center
              position="absolute"
              right="35%"
              bottom={5}
              w="40px"
              h="40px"
              borderRadius="50%"
              bgColor="red.600"
              cursor="pointer"
              opacity={0.8}
              _hover={{
                opacity: 1,
              }}
              onClick={deleteProfileImage}
            >
              <Delete width="25px" color="#fff" />
            </Center>
          )}
        </VStack>
        <Text fontSize="18px" fontWeight={700}>
          {username}
        </Text>
        <Text>{email}</Text>
        <Center
          position="absolute"
          right={3}
          top={3}
          w="40px"
          h="40px"
          borderRadius="50%"
          bgColor="#aaa"
          cursor="pointer"
          opacity={0.6}
          _hover={{
            opacity: 1,
          }}
        >
          <Edit width="20px" />
        </Center>
      </VStack>
    </Box>
  );
};

export default Profile;
