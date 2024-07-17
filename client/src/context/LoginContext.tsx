import { createContext, ReactNode, useEffect, useState } from "react";
import Cookies from "js-cookie";
import useApi from "../hooks/useApi";

export interface LoginContextInterface {
  username: string | null;
  email: string | null;
  userId: string | null;
  isLoggedIn: boolean;
  setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
}

export const LoginContext = createContext<LoginContextInterface>({
  username: null,
  email: null,
  userId: null,
  isLoggedIn: false,
  setIsLoggedIn: () => {},
});

const LoginContextProvider = ({ children }: { children: ReactNode }) => {
  const token = Cookies.get("token");
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(Boolean(token));
  const [username, setUsername] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const { api } = useApi();

  useEffect(() => {
    if (!token) {
      setEmail(null);
      setUserId(null);
      setUsername(null);
      return;
    }

    api("/auth/profile", {
      method: "GET",
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        setUsername(data.username);
        setUserId(data.id);
        setEmail(data.email);
      })
      .catch((err) => {
        console.log(err);
      });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  return (
    <LoginContext.Provider
      value={{ username, email, userId, isLoggedIn, setIsLoggedIn }}
    >
      {children}
    </LoginContext.Provider>
  );
};

export default LoginContextProvider;
