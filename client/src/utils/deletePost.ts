import { GetPostInterface } from "../components/Home";

export const deletePost = (data: GetPostInterface, onSuccess: () => void) => {
  fetch(
    `http://localhost:5000/api/blog/delete/${data._id}/?coverImagePath=${data.coverImagePath}`,
    {
      method: "DELETE",
      credentials: "include",
    }
  )
    .then(() => onSuccess())
    .catch((err) => console.log(err));
};
