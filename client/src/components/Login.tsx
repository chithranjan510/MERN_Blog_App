import { Input, Box, Center, VStack, FormLabel } from "@chakra-ui/react";
import { FormEvent, useContext, useEffect, useState } from "react";
import { Visibility } from "@emotion-icons/material/Visibility";
import { VisibilityOff } from "@emotion-icons/material/VisibilityOff";
import { useNavigate } from "react-router-dom";
import { FormSubmitButton } from "./common/Button";
import { LoginContext } from "../context/LoginContext";
import useCustomToast, { CustomToastStatusEnum } from "../hooks/useCustomToast";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState<boolean>(false);
  const { isLoggedIn, setIsLoggedIn } = useContext(LoginContext);

  const customToast = useCustomToast();
  const navigate = useNavigate();

  const loginHandler = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const payload = {
      email,
      password,
    };

    const res = await fetch("http://localhost:5000/api/auth/login", {
      method: "POST",
      body: JSON.stringify(payload),
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });

    if (res.ok) {
      customToast("Logged in Successfully", CustomToastStatusEnum.success);
      setIsLoggedIn(true);
      navigate("/");
      return;
    }

    const data: { message?: string } = await res.json();

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
    <Box px={[5, 10, null, 20]} py={[10, null, 20]}>
      <Box
        p={[5, 10]}
        maxW="500px"
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
    </Box>
  );
};

export default Login;
