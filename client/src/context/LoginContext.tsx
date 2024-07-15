import { createContext, ReactNode, useState } from "react";

export interface LoginContextInterface {
  isLoggedIn: boolean;
  setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
}

export const LoginContext = createContext<LoginContextInterface>({
  isLoggedIn: false,
  setIsLoggedIn: () => {},
});

const LoginContextProvider = ({ children }: { children: ReactNode }) => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  return (
    <LoginContext.Provider value={{ isLoggedIn, setIsLoggedIn }}>
      {children}
    </LoginContext.Provider>
  );
};

export default LoginContextProvider;
