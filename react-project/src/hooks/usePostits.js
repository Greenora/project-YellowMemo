import { useEffect, useState } from "react";
import useCustomFetch from "./useCustomFetch";

export default function usePostits(id) {
  const [postits, setPostits] = useState([]);
  const customFetch = useCustomFetch();

  useEffect(() => {
    if (!id) return;

    // 포스트잇 가져오기
    const fetchPostits = async () => {
      try {
        const response = await customFetch(`/posts/${id}/comments`, { method: "GET" });
        const comments = response.data;

        const mappedPostits = (comments || []).map(comment => ({
            ...comment,
            content: comment.text,
            userId: comment.user?.id,
          }));

        setPostits(mappedPostits);
      } catch (error) {
        console.error("postits load error", error);
        setPostits([]);
      }
    };
    fetchPostits();
  }, [id, customFetch]);

  return [postits, setPostits];
}
