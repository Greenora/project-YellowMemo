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

      if (!res.ok || !res.data) throw new Error();

      const data = Array.isArray(res.data)
        ? res.data.map((v) => ({ ...v, imageUrl: getAbsoluteUrl(v.imageUrl) }))
        : [];

      setSemesters(data);
      setEditedSemesters(data);
    } catch {
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

      if (!res.ok || !res.data) throw new Error();

      const saved = { ...res.data, imageUrl: getAbsoluteUrl(res.data.imageUrl) };

      setSemesters((prev) => [...prev, saved]);
      setEditedSemesters((prev) => [...prev, saved]);
    } catch {
      alert("생성 실패");
    }
  };

  const handleImageUpload = async (e, id) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const tempPreview = URL.createObjectURL(file);

    setEditedSemesters((prev) =>
      prev.map((s) => (s.id === id ? { ...s, imageUrl: tempPreview } : s))
    );

    const formData = new FormData();
    formData.append("file", file);

    try {
      const uploadRes = await apiFetch("/uploads", {
        method: "POST",
        body: formData,
      });

      if (!uploadRes.ok || !uploadRes.data) {
        alert("이미지 업로드 실패");
        return;
      }

      const newUrl = getAbsoluteUrl(uploadRes.data.url);

      const patchRes = await apiFetch(`/semesters/${id}`, {
        method: "PATCH",
        body: JSON.stringify({ imageUrl: newUrl }),
      });

      if (!patchRes.ok) throw new Error();

      setSemesters((prev) =>
        prev.map((s) => (s.id === id ? { ...s, imageUrl: newUrl } : s))
      );
      setEditedSemesters((prev) =>
        prev.map((s) => (s.id === id ? { ...s, imageUrl: newUrl } : s))
      );
    } catch {
      alert("이미지 업데이트 실패");
    }

    e.target.value = "";
  };

  const handleSave = async (id) => {
    const original = semesters.find((v) => v.id === id);
    const edited = editedSemesters.find((v) => v.id === id);

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

      if (!res.ok) throw new Error();

      setSemesters((prev) =>
        prev.map((s) => (s.id === id ? { ...s, ...patchData } : s))
      );

      alert("수정되었습니다.");
    } catch {
      alert("수정 실패");
      fetchSemesters();
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("삭제할까요?")) return;

    try {
      const res = await apiFetch(`/semesters/${id}`, { method: "DELETE" });

      if (res.status !== 200 && res.status !== 204) throw new Error();

      setSemesters((prev) => prev.filter((v) => v.id !== id));
      setEditedSemesters((prev) => prev.filter((v) => v.id !== id));
    } catch {
      alert("삭제 실패");
    }
  };

  return (
    <div className="min-h-screen p-4 bg-gray-100">
      <AdminHeader />

      {loading ? (
        <p className="text-center text-xl">로딩 중...</p>
      ) : semesters.length === 0 ? (
        <p className="text-center p-10 bg-white border rounded-lg">
          프로그램이 없습니다.
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {editedSemesters.map((item) => (
            <div key={item.id} className="bg-white p-4 rounded-xl shadow space-y-3">
              <h3 className="font-bold text-gray-700">ID: {item.id}</h3>

              <label>제목:</label>
              <input
                className="border p-2 w-full rounded"
                value={item.title}
                onChange={(e) =>
                  setEditedSemesters((prev) =>
                    prev.map((s) =>
                      s.id === item.id ? { ...s, title: e.target.value } : s
                    )
                  )
                }
              />

              <label>내용:</label>
              <textarea
                className="border p-2 w-full rounded h-24 resize-none"
                value={item.content}
                onChange={(e) =>
                  setEditedSemesters((prev) =>
                    prev.map((s) =>
                      s.id === item.id ? { ...s, content: e.target.value } : s
                    )
                  )
                }
              />

              <label>이미지:</label>
              <img
                src={item.imageUrl || ProfileIcon}
                alt="preview"
                className="w-full h-40 object-cover rounded border"
              />

              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleImageUpload(e, item.id)}
              />

              <button
                onClick={() => handleSave(item.id)}
                className="w-full bg-black text-white p-2 rounded"
              >
                수정
              </button>

              <button
                onClick={() => handleDelete(item.id)}
                className="w-full border p-2 rounded"
              >
                삭제
              </button>
            </div>
          ))}
        </div>
      )}

      <button
        onClick={handleAdd}
        className="fixed flex bottom-10 right-10 bg-white p-4 rounded-full shadow-lg text-sm"
      >
        <img src={ProfileIcon} className="w-6 h-6 mr-2" alt="" />
        새 프로그램 추가
      </button>
    </div>
  );
}