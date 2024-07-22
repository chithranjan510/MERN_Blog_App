import { Input, Text, Box, Center, VStack, FormLabel } from "@chakra-ui/react";
import { FormEvent, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Visibility } from "@emotion-icons/material/Visibility";
import { VisibilityOff } from "@emotion-icons/material/VisibilityOff";
import { FormSubmitButton } from "./common/Button";
import { LoginContext } from "../context/LoginContext";
import useCustomToast, { CustomToastStatusEnum } from "../hooks/useCustomToast";
import useApi from "../hooks/useApi";
import { FilterContext } from "../context/filterContext";

const Register = () => {
  const [username, setUsername] = useState<string>("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState<string>("");
  const [passwordVisible, setPasswordVisible] = useState<boolean>(false);
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const { isLoggedIn } = useContext(LoginContext);
  const { setLoadingHomePage } = useContext(FilterContext);
  const navigate = useNavigate();
  const { api } = useApi();

  const customToast = useCustomToast();

  const registerHandler = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      return;
    }

    const payload = {
      username,
      email,
      password,
    };

    const response = await api("/user/register", {
      method: "POST",
      body: JSON.stringify(payload),
      headers: {
        "content-type": "application/json",
      },
    });

    if (response.ok) {
      customToast("Registered Successfully", CustomToastStatusEnum.success);
      navigate("/login");
      return;
    }

    const data: { message?: string } = await response.json();

    customToast(
      data.message || "Something went wrong, Please try again",
      CustomToastStatusEnum.error
    );
  };

  useEffect(() => {
    if (isLoggedIn) {
      setLoadingHomePage(true);
      navigate("/");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoggedIn, navigate]);

  return (
    <Center w="100%" h="100%">
      <Box
        w="100%"
        maxW={["330px", "400px", null, "500px"]}
        p={[5, 10]}
        mx="auto"
        bgColor="#fff"
        borderRadius="14px"
      >
        <form onSubmit={registerHandler}>
          <VStack w="100%" alignItems="stretch" spacing={8}>
            <Box position="relative" className="formInputContainer">
              <Input
                type="text"
                required
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
                required
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
                required
                value={password}
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
                required
                value={confirmPassword}
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
            <FormSubmitButton label="Register" />
          </VStack>
        </form>
      </Box>
    </Center>
  );
};

export default Register;
