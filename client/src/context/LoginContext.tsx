import { createContext, ReactNode, useEffect, useState } from "react";
import Cookies from "js-cookie";
import useApi from "../hooks/useApi";

export interface LoginContextInterface {
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
  const token = Cookies.get("token");
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(Boolean(token));
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [username, setUsername] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [profileImagePath, setProfileImagePath] = useState<string | null>(null);
  const { api } = useApi();

  useEffect(() => {
    if (!token) {
      setEmail(null);
      setUserId(null);
      setUsername(null);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);

    api("/user/profile", {
      method: "GET",
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        setUsername(data.username);
        setUserId(data.id);
        setEmail(data.email);
        setIsAdmin(data.isAdmin);
        setProfileImagePath(data.profileImagePath);
        setIsLoading(false);
      })
      .catch((err) => {
        setIsLoading(false);
        console.log(err);
      });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  if (isLoading) {
    return <></>;
  }

  return (
    <LoginContext.Provider
      value={{
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
