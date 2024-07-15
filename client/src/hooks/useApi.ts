import Cookies from "js-cookie";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { LoginContext } from "../context/LoginContext";
import { useToast } from "@chakra-ui/react";

const unauthorizeToastId = "unauthorizeToastId";

const useApi = () => {
  const navigate = useNavigate();
  const { setIsLoggedIn } = useContext(LoginContext);
  const toast = useToast();

  const api = async (
    route: string,
    options: RequestInit
  ): Promise<Response> => {
    const res = await fetch(`http://localhost:5000${route}`, options);

    if (res.status === 401) {
      Cookies.remove("token");
      setIsLoggedIn(false);
      navigate("/login");
      if (!toast.isActive(unauthorizeToastId)) {
        toast({
          id: unauthorizeToastId,
          status: "error",
          description: "Unauthorize access",
          duration: 3000,
          isClosable: true,
        });
      }
    }

    return res;
  };

  return { api };
};

export default useApi;
