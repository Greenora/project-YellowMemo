import { use, useEffect, useState } from "react";
import useCustomFetch from "./useCustomFetch";

export default function useTextboxes(id) {
  const [textboxes, setTextboxes] = useState([]);
  const customFetch = useCustomFetch();

  useEffect(() => {
    if (!id) return;

    // text box 데이터 가져오기
    const fetchTextboxes = async () => {
      try {
        const response = await customFetch(`/posts/${id}`, { method: "GET" });
        const postData = response.data;

        const contents = postData.contents || [];

        const textData = contents
          .filter(item => item.type === 'text')
          .map(item => ({
            ...item,
            content: item.value,
          }));

        setTextboxes(textData);
      } catch (error) {
        console.error("textboxes load error:", error);
        setTextboxes([]);
      }
    };
    fetchTextboxes();
  }, [id, customFetch]);

  return [textboxes, setTextboxes];
}
