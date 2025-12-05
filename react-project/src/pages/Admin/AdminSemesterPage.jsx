import React, { useState, useEffect } from "react";
import useCustomFetch from "../../hooks/useCustomFetch";
import AdminHeader from "../../components/AdminHeader";
import ProfileIcon from "../../assets/sticky-note.png"; // 포스트잇 아이콘으로 사용

export default function AdminSemesterPage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [semesters, setSemesters] = useState([]);
  const [editedSemesters, setEditedSemesters] = useState([]); // ⭐ 입력값 전용 상태
  const [loading, setLoading] = useState(false);

  const apiFetch = useCustomFetch();

  // --- 1. 인증 후 데이터 로드 ---
  useEffect(() => {
    fetchSemesters();
  }, []);

  // --- 2. READ: 데이터 가져오기 ---
  const fetchSemesters = async () => {
    setLoading(true);
    try {
      const res = await apiFetch("/semesters/type/semester_info", { method: "GET" });
      if (!res.ok || !res.data) throw new Error("데이터 로딩 실패");

      const data = Array.isArray(res.data) ? res.data : [];
      setSemesters(data);
      setEditedSemesters(data);
    } catch (err) {
      console.error("데이터 로딩 중 에러:", err);
      setSemesters([]);
      setEditedSemesters([]);
    } finally {
      setLoading(false);
    }
  };

  // --- 3. CREATE: 새 프로그램 추가 ---
  const handleAdd = async () => {
    const newProgram = {
      title: "새 프로그램",
      content: "내용을 입력하세요.",
      imageUrl: "",
      type: "semester_info"
    };

    try {
      const res = await apiFetch("/semesters", {
        method: "POST",
        body: JSON.stringify(newProgram),
      });

      if (!res.ok || !res.data) throw new Error("생성 실패");

      setSemesters((prev) => [...prev, res.data]);
      setEditedSemesters((prev) => [...prev, res.data]); // ⭐ 편집 상태에도 추가
    } catch (err) {
      console.error("프로그램 생성 실패:", err);
      alert("프로그램 생성 실패");
    }
  };

  // --- 4. UPDATE: 수정 버튼 클릭 시 PATCH 요청 ---
  const handleSave = async (id) => {
    const original = semesters.find((s) => s.id === id);
    const edited = editedSemesters.find((s) => s.id === id);

    // 변경된 필드만 PATCH
    const patchData = {};
    for (let key in edited) {
      if (edited[key] !== original[key]) {
        patchData[key] = edited[key];
      }
    }

    if (Object.keys(patchData).length === 0) {
      alert("변경된 내용이 없습니다.");
      return;
    }

    try {
      const res = await apiFetch(`/semesters/${id}`, {
        method: "PATCH",
        body: JSON.stringify(patchData),
      });

      if (!res.ok) throw new Error("서버 수정 실패");

      // 성공 → 메인 상태 업데이트
      setSemesters((prev) =>
        prev.map((s) => (s.id === id ? { ...s, ...patchData } : s))
      );

      alert("수정되었습니다.");
    } catch (err) {
      console.error("수정 실패:", err);
      alert("수정 실패. 서버 데이터로 롤백합니다.");
      fetchSemesters();
    }
  };

  // --- 5. DELETE ---
  const handleDelete = async (id) => {
    if (!window.confirm("정말 삭제할까요?")) return;

    try {
      const res = await apiFetch(`/semesters/${id}`, { method: "DELETE" });
      if (res.status !== 200 && res.status !== 204) {
        throw new Error("삭제 실패");
      }

      setSemesters((prev) => prev.filter((s) => s.id !== id));
      setEditedSemesters((prev) => prev.filter((s) => s.id !== id));
    } catch (err) {
      console.error("삭제 실패:", err);
      alert("삭제 실패");
    }
  };

  // --- 관리자 페이지 ---
  return (
    <div className="min-h-screen p-4 bg-gray-100">
      <AdminHeader />
      {loading ? (
        <p className="text-center text-xl text--600">데이터 로딩 중...</p>
      ) : semesters.length === 0 ? (
        <p className="text-center text-lg text-gray-500 border-2 border-dashed p-10 rounded-lg bg-white">
          아직 프로그램이 없습니다. '새 프로그램 추가'를 눌러 시작하세요.
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {editedSemesters.map((semester) => (
            <div
              key={semester.id}
              className="border p-5 rounded-xl bg-white shadow-lg space-y-3 flex flex-col"
            >
              <h3 className="text-lg font-bold text-gray-700">
                ID: {semester.id}
              </h3>

              {/* 제목 */}
              <label className="text-sm font-medium text-gray-600">제목:</label>
              <input
                className="w-full border p-2 rounded"
                value={semester.title}
                onChange={(e) =>
                  setEditedSemesters((prev) =>
                    prev.map((s) =>
                      s.id === semester.id
                        ? { ...s, title: e.target.value }
                        : s
                    )
                  )
                }
              />

              {/* 내용 */}
              <label className="text-sm font-medium text-gray-600">내용:</label>
              <textarea
                className="w-full border p-2 rounded h-24 resize-none"
                value={semester.content}
                onChange={(e) =>
                  setEditedSemesters((prev) =>
                    prev.map((s) =>
                      s.id === semester.id
                        ? { ...s, content: e.target.value }
                        : s
                    )
                  )
                }
              />

              {/* 이미지 */}
              <label className="text-sm font-medium text-gray-600">
                이미지 URL:
              </label>
              <input
                className="w-full border p-2 rounded text-sm"
                value={semester.imageUrl || ""}
                onChange={(e) =>
                  setEditedSemesters((prev) =>
                    prev.map((s) =>
                      s.id === semester.id
                        ? { ...s, imageUrl: e.target.value }
                        : s
                    )
                  )
                }
              />

              {/* 버튼 영역 */}
              <div className="mt-4 pt-3 border-t border-gray-100 space-y-2">
                <button
                  onClick={() => handleSave(semester.id)}
                  className="w-full px-4 py-2 bg-black text-white font-semibold rounded-lg hover:bg-gray-800 transition"
                >
                  수정
                </button>

                <button
                  onClick={() => handleDelete(semester.id)}
                  className="w-full px-4 py-2 font-semibold border border-gray-100 rounded-lg hover:bg-gray-300 transition"
                >
                  삭제
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      <button
        onClick={handleAdd}
        className="fixed bottom-10 right-10 bg-white p-4 rounded-full shadow-lg hover:bg-gray-200 transition z-40 flex items-center justify-center text-sm font-bold"
        aria-label="글 작성하기"
        title="새 글 작성하기"
      >
        <img src={ProfileIcon} alt="Write" className="w-6 h-6 mr-2" />
        글 작성하기
      </button>
    </div>
  );
}