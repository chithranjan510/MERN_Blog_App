import useApi from "./useApi";

const useCommonApi = () => {
  const { api } = useApi();

  const addCategory = (category: string) => {
    return api("/blogCategory", {
      method: "POST",
      body: JSON.stringify({
        category: category.toLocaleLowerCase(),
      }),
      credentials: "include",
      headers: { "Content-Type": "application/json" },
    });
  };

  return { addCategory };
};

export default useCommonApi;
