// 삭제 요청
// async -> promise 반환 (비동기로 동작)
// await -> promise 완료될 때까지 기다리고 결과 반환
export async function handleAlertYes({ id, setShowAlert, navigate, customFetch }) {
  try {
    await customFetch(`/posts/${id}`, { method: "DELETE" });

    setShowAlert(false);

    alert("삭제되었습니다!");
      navigate("/board");

  } catch (error) {
    console.error("삭제 요청 실패:", error);
    alert("삭제 중 오류가 발생했습니다.🥲");
  }
}
