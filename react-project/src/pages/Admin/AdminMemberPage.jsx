import React, { useState, useEffect } from "react";
import useCustomFetch from "../../hooks/useCustomFetch";
import AdminHeader from "../../components/AdminHeader";
import ProfileIcon from "../../assets/sticky-note.png";

export default function AdminSemesterPage() {
  const [semesters, setSemesters] = useState([]);
  const [editedSemesters, setEditedSemesters] = useState([]);
  const [loading, setLoading] = useState(false);

  const apiFetch = useCustomFetch();

  const getAbsoluteUrl = (path) => {
    if (!path) return "";
    if (path.startsWith("http://") || path.startsWith("https://")) return path;
    return `${process.env.REACT_APP_API_URL}${path}`;
  };

  useEffect(() => {
    fetchSemesters();
  }, []);

  const fetchSemesters = async () => {
    setLoading(true);
    try {
      const res = await apiFetch("/semesters/type/semester_info", { method: "GET" });
      if (!res.ok || !res.data) throw new Error("데이터 로딩 실패");

      const data = Array.isArray(res.data)
        ? res.data.map((s) => ({
            ...s,
            imageUrl: getAbsoluteUrl(s.imageUrl),
          }))
        : [];

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

  const handleAdd = async () => {
    const newItem = {
      title: "새 프로그램",
      content: "내용을 입력하세요.",
      imageUrl: "",
      type: "semester_info",
    };

    try {
      const res = await apiFetch("/semesters", {
        method: "POST",
        body: JSON.stringify(newItem),
      });

      if (!res.ok || !res.data) throw new Error("생성 실패");

      const saved = {
        ...res.data,
        imageUrl: getAbsoluteUrl(res.data.imageUrl),
      };

      setSemesters((prev) => [...prev, saved]);
      setEditedSemesters((prev) => [...prev, saved]);
    } catch (err) {
      console.error("생성 실패:", err);
      alert("생성 실패");
    }
  };

  const handleImageUpload = async (e, id) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      alert("이미지 파일만 업로드할 수 있습니다.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("file", file);

      const uploadRes = await apiFetch("/uploads", {
        method: "POST",
        body: formData,
      });

      if (!uploadRes.ok) {
        alert("이미지 업로드 실패");
        return;
      }

      const imageUrl = getAbsoluteUrl(uploadRes.data.url);
      const patchRes = await apiFetch(`/semesters/${id}`, {
        method: "PATCH",
        body: JSON.stringify({ imageUrl }),
        headers: { "Content-Type": "application/json" },
      });

      if (!patchRes.ok) throw new Error("이미지 갱신 실패");

      setEditedSemesters((prev) =>
        prev.map((s) => (s.id === id ? { ...s, imageUrl } : s))
      );

      setSemesters((prev) =>
        prev.map((s) => (s.id === id ? { ...s, imageUrl } : s))
      );

      alert("이미지가 업데이트되었습니다.");
    } catch (err) {
      console.error("이미지 업로드 오류:", err);
      alert("이미지 업로드 실패");
    }

    e.target.value = "";
  };

  const handleSave = async (id) => {
    const original = semesters.find((s) => s.id === id);
    const edited = editedSemesters.find((s) => s.id === id);

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
      const res = await apiFetch(`/semesters/${id}`, {
        method: "PATCH",
        body: JSON.stringify(patchData),
      });

      if (!res.ok) throw new Error("서버 수정 실패");

      setSemesters((prev) =>
        prev.map((s) => (s.id === id ? { ...s, ...patchData } : s))
      );

      alert("수정되었습니다.");
    } catch (err) {
      console.error("수정 실패:", err);
      alert("수정 실패. 서버 데이터로 다시 불러옵니다.");
      fetchSemesters();
    }
  };

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

  return (
    <div className="min-h-screen p-4 bg-gray-100">
      <AdminHeader />

      {loading ? (
        <p className="text-center text-xl text-gray-600">데이터 로딩 중...</p>
      ) : semesters.length === 0 ? (
        <p className="text-center text-lg text-gray-500 border-2 border-dashed p-10 rounded-lg bg-white">
          아직 프로그램이 없습니다.
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {editedSemesters.map((s) => (
            <div
              key={s.id}
              className="border p-5 rounded-xl bg-white shadow-lg space-y-3 flex flex-col"
            >
              <h3 className="text-lg font-bold text-gray-700">ID: {s.id}</h3>

              <label className="text-sm font-medium text-gray-600">제목:</label>
              <input
                className="w-full border p-2 rounded"
                value={s.title}
                onChange={(e) =>
                  setEditedSemesters((prev) =>
                    prev.map((x) =>
                      x.id === s.id ? { ...x, title: e.target.value } : x
                    )
                  )
                }
              />

              <label className="text-sm font-medium text-gray-600">내용:</label>
              <textarea
                className="w-full border p-2 rounded h-24 resize-none"
                value={s.content}
                onChange={(e) =>
                  setEditedSemesters((prev) =>
                    prev.map((x) =>
                      x.id === s.id ? { ...x, content: e.target.value } : x
                    )
                  )
                }
              />

              <label className="text-sm font-medium text-gray-600">이미지:</label>

              <div className="flex flex-col space-y-2">
                <img
                  src={s.imageUrl || ProfileIcon}
                  alt="preview"
                  className="w-24 h-24 object-cover rounded-lg border bg-gray-50"
                  onError={(e) => (e.target.src = ProfileIcon)}
                />

                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageUpload(e, s.id)}
                />
              </div>

              <div className="mt-4 pt-3 border-t border-gray-100 space-y-2">
                <button
                  onClick={() => handleSave(s.id)}
                  className="w-full px-4 py-2 bg-black text-white font-semibold rounded-lg hover:bg-gray-800 transition"
                >
                  수정
                </button>

                <button
                  onClick={() => handleDelete(s.id)}
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
        className="fixed bottom-10 right-10 bg-white p-4 rounded-full shadow-lg hover:bg-gray-200 transition z-40 flex items-center justify-center text-sm"
      >
        <img src={ProfileIcon} alt="add" className="w-6 h-6 mr-2" />
        새 멤버 추가
      </button>
    </div>
  );
}