import useApi from "./useApi";

const useImageApi = () => {
  const { api } = useApi();
  const uploadImage = ({
    userId,
    file,
  }: {
    userId: string;
    file: FileList;
  }): Promise<Response> => {
    const formData = new FormData();
    formData.set("profileImage", file[0]);

    return api(`/auth/profileImage/${userId}`, {
      method: "POST",
      body: formData,
      credentials: "include",
    });
  };

  const deleteImage = ({
    userId,
    imagePath,
  }: {
    userId: string;
    imagePath: string;
  }): Promise<Response> => {
    return api(`/auth/profileImage/${userId}/?profileImagePath=${imagePath}`, {
      method: "DELETE",
      credentials: "include",
    });
  };
  return { uploadImage, deleteImage };
};

export default useImageApi;
