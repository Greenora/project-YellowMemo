import React, { useState, useEffect } from "react";
import useCustomFetch from "../../hooks/useCustomFetch";
import AdminHeader from "../../components/AdminHeader"; 
import ProfileIcon from "../../assets/sticky-note.png"; // 포스트잇 아이콘으로 사용

export default function AdminMemberPage() {
  const [members, setMembers] = useState([]);
  const [editedMembers, setEditedMembers] = useState([]);
  const [loading, setLoading] = useState(false);

  const apiFetch = useCustomFetch();
  
  // Member DTO 필드 정의
  const MEMBER_FIELDS = {
    name: "이름",
    introduction: "소개",
    imageUrl: "이미지 URL",
  };

  // --- 1. 데이터 로드 ---
  useEffect(() => {
    fetchMembers();
  }, []);

  // --- 2. READ: 데이터 가져오기 (GET /members) ---
  const fetchMembers = async () => {
    setLoading(true);
    try {
      const res = await apiFetch("/members", { method: "GET" });
      if (!res.ok || !res.data) throw new Error("데이터 로딩 실패");

      const data = Array.isArray(res.data) ? res.data : [];
      setMembers(data);
      setEditedMembers(data);
    } catch (err) {
      console.error("데이터 로딩 중 에러:", err);
      setMembers([]);
      setEditedMembers([]);
    } finally {
      setLoading(false);
    }
  };

  // --- 3. CREATE: 새 멤버 추가 (POST /members) ---
  const handleAdd = async () => {
    const newMember = {
      name: "새 멤버",
      introduction: "소개 내용을 입력하세요.",
      imageUrl: "",
    };

    try {
      const res = await apiFetch("/members", {
        method: "POST",
        body: JSON.stringify(newMember),
      });

      if (!res.ok || !res.data) throw new Error("생성 실패");

      setMembers((prev) => [...prev, res.data]);
      setEditedMembers((prev) => [...prev, res.data]);
    } catch (err) {
      console.error("멤버 생성 실패:", err);
      alert("멤버 생성 실패");
    }
  };

  // --- 4. UPDATE: 수정 버튼 클릭 시 PATCH 요청 (PATCH /members/{id}) ---
  const handleSave = async (id) => {
    const original = members.find((m) => m.id === id);
    const edited = editedMembers.find((m) => m.id === id);

    // 변경된 필드만 PATCH
    const patchData = {};
    for (let key in edited) {
      // id, createdAt 등 변경 불가 필드 제외 후 비교
      if (key !== 'id' && edited[key] !== original[key]) {
        patchData[key] = edited[key];
      }
    }

    if (Object.keys(patchData).length === 0) {
      alert("변경된 내용이 없습니다.");
      return;
    }

    try {
      const res = await apiFetch(`/members/${id}`, {
        method: "PATCH",
        body: JSON.stringify(patchData),
      });

      if (!res.ok) throw new Error("서버 수정 실패");

      // 성공 → 메인 상태 업데이트
      setMembers((prev) =>
        prev.map((m) => (m.id === id ? { ...m, ...patchData } : m))
      );

      alert("수정되었습니다.");
    } catch (err) {
      console.error("수정 실패:", err);
      alert("수정 실패. 서버 데이터로 롤백합니다.");
      fetchMembers();
    }
  };

  // --- 5. DELETE (DELETE /members/{id}) ---
  const handleDelete = async (id) => {
    if (!window.confirm("정말 삭제할까요?")) return;

    try {
      const res = await apiFetch(`/members/${id}`, { method: "DELETE" });
      // 204 No Content도 성공으로 처리
      if (res.status !== 200 && res.status !== 204) {
        throw new Error("삭제 실패");
      }

      setMembers((prev) => prev.filter((m) => m.id !== id));
      setEditedMembers((prev) => prev.filter((m) => m.id !== id));
    } catch (err) {
      console.error("삭제 실패:", err);
      alert("삭제 실패");
    }
  };

  // --- 관리자 페이지 렌더링 ---
  return (
    <div className="min-h-screen p-4 bg-gray-100">
      <AdminHeader />
    
      {loading ? (
        <p className="text-center text-xl text-indigo-600">데이터 로딩 중...</p>
      ) : members.length === 0 ? (
        <p className="text-center text-lg text-gray-500 border-2 border-dashed p-10 rounded-lg bg-white">
          아직 등록된 멤버가 없습니다. '새 멤버 추가'를 눌러 시작하세요.
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {editedMembers.map((member) => (
            <div
              key={member.id}
              className="border p-5 rounded-xl bg-white shadow-lg space-y-3 flex flex-col"
            >
              <h3 className="text-lg font-bold text-gray-700">
                ID: {member.id}
              </h3>

              {/* 이름 (name) */}
              <label className="text-sm font-medium text-gray-600">{MEMBER_FIELDS.name}:</label>
              <input
                className="w-full border p-2 rounded"
                value={member.name}
                onChange={(e) =>
                  setEditedMembers((prev) =>
                    prev.map((m) =>
                      m.id === member.id
                        ? { ...m, name: e.target.value }
                        : m
                    )
                  )
                }
              />

              {/* 소개 (introduction) */}
              <label className="text-sm font-medium text-gray-600">{MEMBER_FIELDS.introduction}:</label>
              <textarea
                className="w-full border p-2 rounded h-24 resize-none"
                value={member.introduction}
                onChange={(e) =>
                  setEditedMembers((prev) =>
                    prev.map((m) =>
                      m.id === member.id
                        ? { ...m, introduction: e.target.value }
                        : m
                    )
                  )
                }
              />

              {/* 이미지 URL (imageUrl) */}
              <label className="text-sm font-medium text-gray-600">
                {MEMBER_FIELDS.imageUrl}:
              </label>
              <input
                className="w-full border p-2 rounded text-sm"
                value={member.imageUrl || ""}
                onChange={(e) =>
                  setEditedMembers((prev) =>
                    prev.map((m) =>
                      m.id === member.id
                        ? { ...m, imageUrl: e.target.value }
                        : m
                    )
                  )
                }
              />

              {/* 버튼 영역 */}
              <div className="mt-4 pt-3 border-t border-gray-100 space-y-2">
                <button
                  onClick={() => handleSave(member.id)}
                  className="w-full px-4 py-2 bg-black text-white font-semibold rounded-lg hover:bg-gray-800 transition"
                >
                  수정
                </button>

                <button
                  onClick={() => handleDelete(member.id)}
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