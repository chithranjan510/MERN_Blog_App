import { createContext, ReactNode, useEffect, useState } from "react";
import Cookies from "js-cookie";
import useApi from "../hooks/useApi";
import CustomSpinner from "../components/common/CustomSpinner";
import { Box } from "@chakra-ui/react";

export interface LoginContextInterface {
  token: string | undefined;
  username: string | null;
  email: string | null;
  userId: string | null;
  profileImagePath: string | null;
  isLoggedIn: boolean;
  isAdmin: boolean;
  setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
  setProfileImagePath: React.Dispatch<React.SetStateAction<string | null>>;
}

export const LoginContext = createContext<LoginContextInterface>({
  token: undefined,
  username: null,
  email: null,
  userId: null,
  profileImagePath: null,
  isLoggedIn: false,
  isAdmin: false,
  setIsLoggedIn: () => {},
  setProfileImagePath: () => {},
});

const LoginContextProvider = ({ children }: { children: ReactNode }) => {
  const cookieToken = Cookies.get("token");
  const [token, setToken] = useState<string | undefined>(cookieToken);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [username, setUsername] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [profileImagePath, setProfileImagePath] = useState<string | null>(null);
  const { api } = useApi();

  useEffect(() => {
    const newToken = Cookies.get("token");

    if (newToken !== token) {
      setToken(newToken);
      return;
    }

    if (!token) {
      setEmail(null);
      setUserId(null);
      setUsername(null);
      setIsLoading(false);
      setIsLoggedIn(false);
      setIsAdmin(false);
      setProfileImagePath(null);
      return;
    }

    setIsLoading(true);

    api(`/user/profile/?token=${token}`, {
      method: "GET",
    })
      .then((res) => res.json())
      .then((data) => {
        setUsername(data.username);
        setUserId(data.id);
        setEmail(data.email);
        setIsAdmin(data.isAdmin);
        setProfileImagePath(data.profileImagePath);
        setIsLoading(false);
        setIsLoggedIn(true);
      })
      .catch((err) => {
        setIsLoading(false);
        console.log(err);
      });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cookieToken, token]);

  if (isLoading) {
    return (
      <Box w="100%" h="100vh">
        <CustomSpinner />
      </Box>
    );
  }

  return (
    <LoginContext.Provider
      value={{
        token,
        username,
        email,
        profileImagePath,
        userId,
        isLoggedIn,
        isAdmin,
        setIsLoggedIn,
        setProfileImagePath,
      }}
    >
      {children}
    </LoginContext.Provider>
  );
};

export default LoginContextProvider;
