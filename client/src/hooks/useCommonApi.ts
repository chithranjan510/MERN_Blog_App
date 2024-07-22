import { useContext } from "react";
import useApi from "./useApi";
import { LoginContext } from "../context/LoginContext";

const useCommonApi = () => {
  const { api } = useApi();
  const { token } = useContext(LoginContext);

  const addCategory = (category: string) => {
    return api(`/blogCategory/?token=${token}`, {
      method: "POST",
      body: JSON.stringify({
        category: category.toLocaleLowerCase(),
      }),
      headers: { "Content-Type": "application/json" },
    });
  };

  return { addCategory };
};

export default useCommonApi;
