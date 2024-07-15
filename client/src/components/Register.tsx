import { Input, Text, useToast, Box } from "@chakra-ui/react";
import Layout from "./Layout";
import { FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Visibility } from "@emotion-icons/material/Visibility";
import { VisibilityOff } from "@emotion-icons/material/VisibilityOff";
import { LoginAndRegisterFormButton } from "./common/Button";

const registerToastId = "registerToastId";

const Register = () => {
  const [username, setUsername] = useState<string>("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState<string>("");
  const [passwordVisible, setPasswordVisible] = useState<boolean>(false);
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const navigate = useNavigate();

  const toast = useToast();

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

    const response = await fetch("http://localhost:5000/api/auth/register", {
      method: "POST",
      body: JSON.stringify(payload),
      headers: {
        "content-type": "application/json",
      },
    });

    if (response.ok) {
      if (!toast.isActive(registerToastId)) {
        toast({
          id: registerToastId,
          description: "Registered Successfully",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      }
      navigate("/login");
      return;
    }

    const data: { message?: string } = await response.json();

    if (!toast.isActive(registerToastId)) {
      toast({
        id: registerToastId,
        description: data.message || "Something went wrong, Please try again",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Layout>
      <form
        onSubmit={registerHandler}
        style={{
          padding: "20px",
          paddingTop: "100px",
          maxWidth: "500px",
          margin: "auto",
        }}
      >
        <Input
          type="text"
          placeholder="username"
          required
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <Input
          type="email"
          placeholder="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          mt={5}
        />
        <Box position="relative">
          <Input
            type={passwordVisible ? "text" : "password"}
            placeholder="password"
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
        <Input
          type={passwordVisible ? "text" : "password"}
          placeholder="confirm password"
          required
          value={confirmPassword}
          autoComplete="off"
          onChange={(e) => setConfirmPassword(e.target.value)}
          mt={5}
        />
        {password !== "" &&
          confirmPassword !== "" &&
          password !== confirmPassword && (
            <Text color="red" fontSize="12px" pl={2}>
              Password do not match
            </Text>
          )}
        <LoginAndRegisterFormButton label="Register"/>
      </form>
    </Layout>
  );
};

export default Register;
