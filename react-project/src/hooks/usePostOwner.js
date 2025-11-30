import { useEffect, useState } from "react";
import useCustomFetch from "./useCustomFetch";

export default function usePostOwner(id) {
  const [ownerId, setOwnerId] = useState(null);
  const customFetch = useCustomFetch();

  // ownerId 가져오기
  useEffect(() => {
    if (!id) return;

    const getPostOwner = async () => {
      try {
        const response = await customFetch(`/posts/${id}`, { method: "GET" });

        const data = response.data;

        if (data && data.userId) {
          setOwnerId(data.userId);
        }
      } catch (error) {
        console.error("게시글 작성자 정보 에러", error);
        setOwnerId(null);
      }
    };

    getPostOwner();
  }, [id, customFetch]);

  return ownerId;
}
