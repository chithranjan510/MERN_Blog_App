import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import useCustomToast, { CustomToastStatusEnum } from "./useCustomToast";
import { REACT_APP_BACKEND_URL } from "../App";

const useApi = () => {
  const navigate = useNavigate();
  const customToast = useCustomToast();

  const api = async (
    route: string,
    options: RequestInit
  ): Promise<Response> => {
    const res = await fetch(`${REACT_APP_BACKEND_URL}/api${route}`, options);

    if (res.status === 401) {
      Cookies.remove("token");
      navigate("/login");
      customToast("Unauthorize access", CustomToastStatusEnum.error);
    }

    return res;
  };

  return { api };
};

export default useApi;
