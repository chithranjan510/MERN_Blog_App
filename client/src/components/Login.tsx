import { Input, Box, useToast } from "@chakra-ui/react";
import { FormEvent, useContext, useEffect, useState } from "react";
import { Visibility } from "@emotion-icons/material/Visibility";
import { VisibilityOff } from "@emotion-icons/material/VisibilityOff";
import { useNavigate } from "react-router-dom";
import { LoginAndRegisterFormButton } from "./common/Button";
import { LoginContext } from "../context/LoginContext";

const loginToastId = "loginToastId";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState<boolean>(false);
  const { isLoggedIn, setIsLoggedIn } = useContext(LoginContext);

  const toast = useToast();
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
      if (!toast.isActive(loginToastId)) {
        toast({
          id: loginToastId,
          description: "Logged in Successfully",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      }
      setIsLoggedIn(true);
      navigate("/");
      return;
    }

    const data: { message?: string } = await res.json();

    if (!toast.isActive(loginToastId)) {
      toast({
        id: loginToastId,
        description: data.message || "Something went wrong, Please try again",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  useEffect(() => {
    if (isLoggedIn) {
      navigate("/");
    }
  }, [isLoggedIn, navigate]);

  return (
    <form
      onSubmit={loginHandler}
      style={{
        padding: "20px",
        paddingTop: "100px",
        maxWidth: "500px",
        margin: "auto",
      }}
    >
      <Input
        type="email"
        placeholder="Email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        mt={5}
      />
      <Box position="relative">
        <Input
          type={passwordVisible ? "text" : "password"}
          placeholder="Password"
          required
          value={password}
          autoComplete="off"
          onChange={(e) => {
            setPassword(e.target.value);
          }}
          mt={5}
          pr={10}
        />
        <Box
          position="absolute"
          top="43%"
          right={3}
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
        </Box>
      </Box>
      <LoginAndRegisterFormButton label="Login" />
    </form>
  );
};

export default Login;
