import { FormEvent, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { LoginContext } from "../context/LoginContext";
import {
  Box,
  Button,
  Center,
  FormLabel,
  HStack,
  Image,
  Input,
  Text,
  VStack,
} from "@chakra-ui/react";
import { Camera } from "@emotion-icons/bootstrap/Camera";
import { Edit } from "@emotion-icons/boxicons-regular/Edit";
import { Delete } from "@emotion-icons/fluentui-system-regular/Delete";
import useApi from "../hooks/useApi";
import { Visibility } from "@emotion-icons/material/Visibility";
import { VisibilityOff } from "@emotion-icons/material/VisibilityOff";
import { FormSubmitButton } from "./common/Button";
import useCustomToast, { CustomToastStatusEnum } from "../hooks/useCustomToast";

interface UpdateProfilePayload {
  username: string;
  email: string;
  password: string;
}

const Profile = () => {
  const { userId, profileImagePath, isLoggedIn, setProfileImagePath } =
    useContext(LoginContext);
  const navigate = useNavigate();
  const customToast = useCustomToast();
  const { api } = useApi();

  const uploadProfileImage = async (file: FileList | null) => {
    if (!file || !userId) {
      return;
    }

    const formData = new FormData();
    formData.set("profileImage", file[0]);

    const res: Response = await api(`/auth/profileImage/${userId}`, {
      method: "POST",
      body: formData,
      credentials: "include",
    });

    const data: { profileImagePath: string; message?: string } =
      await res.json();

    if (res.ok) {
      setProfileImagePath(data.profileImagePath);
      return;
    }

    customToast(
      data.message || "Something went wrong, Please try again",
      CustomToastStatusEnum.error
    );
  };

  const deleteProfileImage = async () => {
    if (!profileImagePath || !userId) {
      return;
    }

    const res: Response = await api(
      `/auth/profileImage/${userId}/?profileImagePath=${profileImagePath}`,
      {
        method: "DELETE",
        credentials: "include",
      }
    );

    const data: { message?: string } = await res.json();

    if (res.ok) {
      setProfileImagePath(null);
      return;
    }

    customToast(
      data.message || "Something went wrong, Please try again",
      CustomToastStatusEnum.error
    );
  };

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/login");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoggedIn]);

  return (
    <Box py={[10, null, null, 20]} px={[5, 10, null, 20]}>
      <Box
        maxW="500px"
        p={[7, 10]}
        mx="auto"
        borderRadius="14px"
        bgColor="#fff"
      >
        <VStack w="100%" position="relative">
          <Box
            w={"40%"}
            aspectRatio="1/1"
            border={profileImagePath ? "none" : "2px dashed #ccc"}
            borderRadius="50%"
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
          {Boolean(profileImagePath) && (
            <Button
              leftIcon={<Delete width="22px" />}
              bgColor="red.600"
              color="#fff"
              border="2px solid #fff"
              position="absolute"
              bottom={-2}
              _hover={{}}
              _active={{}}
              minH="26px"
              w={["90px", null, "100px"]}
              h={["32px", "35px"]}
              fontSize={["14px", "16px"]}
              onClick={deleteProfileImage}
            >
              Delete
            </Button>
          )}
        </VStack>
        <UserDetails />
      </Box>
    </Box>
  );
};

const UserDetails = () => {
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const { username: oldUsername, email: oldEmail } = useContext(LoginContext);
  const [username, setUsername] = useState<string>("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState<string>("");
  const [passwordVisible, setPasswordVisible] = useState<boolean>(false);
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const customToast = useCustomToast();
  const { api } = useApi();
  const navigate = useNavigate();

  const updateProfile = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!username && !email && !password && !confirmPassword) {
      customToast("Atleast one field is required", CustomToastStatusEnum.error);
      return;
    }

    if (password !== confirmPassword) {
      customToast(
        "Please confirm your password correctly",
        CustomToastStatusEnum.error
      );
      return;
    }

    const payload: UpdateProfilePayload = {
      username,
      email,
      password,
    };

    Object.keys(payload).forEach((key) => {
      const activeKey = key as keyof UpdateProfilePayload;
      if (payload[activeKey] === "") {
        delete payload[activeKey];
      }
    });

    try {
      const res = await api("/auth/updateProfile", {
        method: "PUT",
        body: JSON.stringify(payload),
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });

      if (res.ok) {
        customToast(
          "Profile updated Successfully",
          CustomToastStatusEnum.success
        );
        setIsEdit(false);
        navigate("/profile");
      }

      const data = await res.json();

      customToast(
        data.message || "Something wen wrong please try again",
        CustomToastStatusEnum.error
      );
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    setEmail(oldEmail || "");
    setUsername(oldUsername || "");
  }, [oldEmail, oldUsername]);
  return (
    <Box w="100%" mt={10}>
      {isEdit ? (
        <form onSubmit={updateProfile}>
          <VStack w="100%" alignItems="stretch" spacing={8}>
            <Box position="relative" className="formInputContainer">
              <Input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                borderRadius="10px"
                h="50px"
                border="2px solid steelBlue"
                _hover={{}}
              />
              <FormLabel position="absolute" bgColor="#fff" px={1}>
                Username
              </FormLabel>
            </Box>
            <Box position="relative" className="formInputContainer">
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                borderRadius="10px"
                h="50px"
                border="2px solid steelBlue"
                _hover={{}}
              />
              <FormLabel position="absolute" bgColor="#fff" px={1}>
                Email
              </FormLabel>
            </Box>
            <Box position="relative" className="formInputContainer">
              <Input
                type={passwordVisible ? "text" : "password"}
                value={password}
                required={Boolean(confirmPassword)}
                autoComplete="off"
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
                borderRadius="10px"
                h="50px"
                pr={14}
                border="2px solid steelBlue"
                _hover={{}}
              />
              <FormLabel position="absolute" bgColor="#fff" px={1}>
                Password
              </FormLabel>
              <Center
                position="absolute"
                w="50px"
                h="50px"
                top={0}
                right={0}
                cursor="pointer"
                zIndex={1}
                onClick={() => {
                  setPasswordVisible((prev) => !prev);
                }}
              >
                {passwordVisible ? (
                  <Visibility width="20px" />
                ) : (
                  <VisibilityOff width="20px" />
                )}
              </Center>
            </Box>
            <Box position="relative" className="formInputContainer">
              <Input
                type={passwordVisible ? "text" : "password"}
                value={confirmPassword}
                required={Boolean(password)}
                autoComplete="off"
                onChange={(e) => setConfirmPassword(e.target.value)}
                borderRadius="10px"
                h="50px"
                border="2px solid steelBlue"
                _hover={{}}
              />
              <FormLabel position="absolute" bgColor="#fff" px={1}>
                Confirm Password
              </FormLabel>
              {password !== "" &&
                confirmPassword !== "" &&
                password !== confirmPassword && (
                  <Text color="red" fontSize="12px" pl={2}>
                    Password do not match
                  </Text>
                )}
            </Box>
            <HStack spacing={5}>
              <FormSubmitButton label="Update Profile" />
              <Button
                w="100%"
                borderRadius="10px"
                h="50px"
                fontSize="18px"
                letterSpacing={2}
                bgColor="#fff"
                border="2px solid #c53030"
                color="red.600"
                onClick={() => setIsEdit(false)}
                _hover={{}}
                _active={{}}
              >
                Cancel
              </Button>
            </HStack>
          </VStack>
        </form>
      ) : (
        <HStack w="100%" justifyContent="space-between" alignItems="center">
          <Box w="100%" textAlign="left">
            <Text
              fontSize={["16px", "20px"]}
              fontWeight={500}
              wordBreak="break-word"
            >
              {oldUsername}
            </Text>
            <Text fontSize={["12px", "14px"]} wordBreak="break-word">
              {oldEmail}
            </Text>
          </Box>
          <Button
            leftIcon={<Edit width="20px" />}
            size={["sm", "md"]}
            onClick={() => setIsEdit(true)}
          >
            Edit
          </Button>
        </HStack>
      )}
    </Box>
  );
};

export default Profile;
