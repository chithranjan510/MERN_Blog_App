import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import { useToast } from "@chakra-ui/react";

const unauthorizeToastId = "unauthorizeToastId";

const useApi = () => {
  const navigate = useNavigate();
  const toast = useToast();

  const api = async (
    route: string,
    options: RequestInit
  ): Promise<Response> => {
    const res = await fetch(`http://localhost:5000/api${route}`, options);

    if (res.status === 401) {
      Cookies.remove("token");
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
