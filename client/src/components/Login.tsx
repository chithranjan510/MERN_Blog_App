import { Input, Box, Center, VStack, FormLabel } from "@chakra-ui/react";
import { FormEvent, useContext, useEffect, useState } from "react";
import { Visibility } from "@emotion-icons/material/Visibility";
import { VisibilityOff } from "@emotion-icons/material/VisibilityOff";
import { useNavigate } from "react-router-dom";
import { FormSubmitButton } from "./common/Button";
import { LoginContext } from "../context/LoginContext";
import useCustomToast, { CustomToastStatusEnum } from "../hooks/useCustomToast";
import useApi from "../hooks/useApi";
import Cookies from "js-cookie";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState<boolean>(false);
  const { isLoggedIn, setIsLoggedIn } = useContext(LoginContext);

  const customToast = useCustomToast();
  const navigate = useNavigate();
  const { api } = useApi();

  const loginHandler = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const payload = {
      email,
      password,
    };

    const res = await api("/user/login", {
      method: "POST",
      body: JSON.stringify(payload),
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });

    const data: { message?: string; token: string } = await res.json();

    if (res.ok) {
      Cookies.set("token", data.token, {
        maxAge: 24 * 60 * 60 * 1000,
      });
      customToast("Logged in Successfully", CustomToastStatusEnum.success);
      setIsLoggedIn(true);
      navigate("/");
      return;
    }

    customToast(
      data.message || "Something went wrong, Please try again",
      CustomToastStatusEnum.error
    );
  };

  useEffect(() => {
    if (isLoggedIn) {
      navigate("/");
    }
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
        <form onSubmit={loginHandler}>
          <VStack w="100%" alignItems="stretch" spacing={8}>
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
                pr={14}
                borderRadius="10px"
                h="50px"
                border="2px solid steelBlue"
                _hover={{}}
              />
              <FormLabel position="absolute" top="13px" bgColor="#fff" px={1}>
                Password
              </FormLabel>
              <Center
                position="absolute"
                h="50px"
                w="50px"
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
            <FormSubmitButton label="Login" />
          </VStack>
        </form>
      </Box>
    </Center>
  );
};

export default Login;
