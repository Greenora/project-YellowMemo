import React, { useState, useEffect } from "react";
import useCustomFetch from "../../hooks/useCustomFetch";
import AdminHeader from "../../components/AdminHeader";
import ProfileIcon from "../../assets/sticky-note.png";

export default function AdminMembersPage() {
  const apiFetch = useCustomFetch();
  const [members, setMembers] = useState([]);
  const [editedMembers, setEditedMembers] = useState([]);
  const [loading, setLoading] = useState(false);

  const getAbsoluteUrl = (path) => {
    if (!path) return "";
    if (path.startsWith("http://") || path.startsWith("https://")) return path;
    return `${process.env.REACT_APP_API_URL}${path}`;
  };

  const fetchMembers = async () => {
    setLoading(true);
    try {
      const res = await apiFetch("/members", { method: "GET" });

      if (!res.ok || !res.data) throw new Error("멤버 불러오기 실패");

      const normalized = res.data.map((m) => ({
        ...m,
        imageUrl: getAbsoluteUrl(m.imageUrl),
      }));

      setMembers(normalized);
      setEditedMembers(normalized);
    } catch (err) {
      console.error(err);
      alert("멤버 불러오기 오류");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  const handleAdd = async () => {
    const newMember = {
      name: "새 멤버",
      introduction: "소개를 입력하세요.",
      imageUrl: null,
    };

    try {
      const res = await apiFetch("/members", {
        method: "POST",
        body: JSON.stringify(newMember),
        headers: { "Content-Type": "application/json" },
      });

      if (!res.ok || !res.data) throw new Error("멤버 생성 실패");

      const created = {
        ...res.data,
        imageUrl: getAbsoluteUrl(res.data.imageUrl),
      };

      setMembers((prev) => [...prev, created]);
      setEditedMembers((prev) => [...prev, created]);
    } catch (err) {
      console.error(err);
      alert("멤버 생성 실패");
    }
  };

  /** 이미지 업로드 + 멤버에 PATCH */
  const handleImageUpload = async (e, id) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("이미지 파일만 업로드 가능합니다.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("file", file);

      const uploadRes = await apiFetch("/uploads", {
        method: "POST",
        body: formData,
      });

      if (!uploadRes.ok || !uploadRes.data?.url) {
        throw new Error("이미지 업로드 실패");
      }

      const imageUrl = getAbsoluteUrl(uploadRes.data.url);

      const patchRes = await apiFetch(`/members/${id}`, {
        method: "PATCH",
        body: JSON.stringify({ imageUrl }),
        headers: { "Content-Type": "application/json" },
      });

      if (!patchRes.ok) throw new Error("이미지 수정 실패");

      setMembers((prev) =>
        prev.map((m) => (m.id === id ? { ...m, imageUrl } : m))
      );
      setEditedMembers((prev) =>
        prev.map((m) => (m.id === id ? { ...m, imageUrl } : m))
      );

      alert("이미지가 업데이트되었습니다.");
    } catch (err) {
      console.error("이미지 오류:", err);
      alert("이미지 업로드 실패");
    }

    e.target.value = "";
  };

  const handleSave = async (id) => {
    const original = members.find((m) => m.id === id);
    const edited = editedMembers.find((m) => m.id === id);

    const patchData = {};
    for (let key in edited) {
      if (key !== "id" && edited[key] !== original[key]) {
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
        headers: { "Content-Type": "application/json" },
      });

      if (!res.ok) throw new Error("멤버 수정 실패");

      setMembers((prev) =>
        prev.map((m) => (m.id === id ? { ...m, ...patchData } : m))
      );

      alert("수정 완료!");
    } catch (err) {
      console.error(err);
      alert("수정 실패 — 새로고침합니다.");
      fetchMembers();
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("정말 삭제하시겠습니까?")) return;

    try {
      const res = await apiFetch(`/members/${id}`, {
        method: "DELETE",
      });

      if (res.status !== 200 && res.status !== 204)
        throw new Error("삭제 실패");

      setMembers((prev) => prev.filter((m) => m.id !== id));
      setEditedMembers((prev) => prev.filter((m) => m.id !== id));
    } catch (err) {
      console.error(err);
      alert("삭제 실패");
    }
  };

  return (
    <div className="min-h-screen p-4 bg-gray-100">
      <AdminHeader />

      {loading ? (
        <p className="text-center">멤버 로딩 중...</p>
      ) : members.length === 0 ? (
        <p className="text-center">아직 멤버가 없습니다.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {editedMembers.map((m) => (
            <div
              key={m.id}
              className="border p-5 rounded-xl bg-white shadow-lg"
            >
              <h3 className="text-lg font-bold">ID: {m.id}</h3>

              <label>이름</label>
              <input
                className="w-full border p-2 rounded"
                value={m.name}
                onChange={(e) =>
                  setEditedMembers((prev) =>
                    prev.map((x) =>
                      x.id === m.id ? { ...x, name: e.target.value } : x
                    )
                  )
                }
              />

              <label>소개</label>
              <textarea
                className="w-full border p-2 rounded h-24 resize-none"
                value={m.introduction}
                onChange={(e) =>
                  setEditedMembers((prev) =>
                    prev.map((x) =>
                      x.id === m.id
                        ? { ...x, introduction: e.target.value }
                        : x
                    )
                  )
                }
              />

              <label>이미지</label>
              <div className="flex flex-col space-y-2">
                <img
                  src={m.imageUrl || ProfileIcon}
                  alt="preview"
                  className="w-24 h-24 object-cover rounded-lg border bg-gray-50"
                />
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageUpload(e, m.id)}
                />
              </div>

              <div className="mt-4 space-y-2">
                <button
                  onClick={() => handleSave(m.id)}
                  className="w-full px-4 py-2 bg-black text-white rounded"
                >
                  수정
                </button>

                <button
                  onClick={() => handleDelete(m.id)}
                  className="w-full px-4 py-2 border rounded"
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
        className="fixed bottom-10 right-10 bg-white p-4 rounded-full shadow-lg"
      >
        새 멤버 추가
      </button>
    </div>
  );
}
