import { useState, useEffect, useRef } from "react";
import SidebarToggleButton from "../../components/SidebarToggleButton";
import Sidebar from "../../components/SideBar";
import JapanProgramDetail from "../../components/JapanProgramDetail";
import Copyright from "../../components/Copyright";
import useCustomFetch from "../../hooks/useCustomFetch";

export default function OsakaPage() {
  const [posts, setPosts] = useState([]);
  const [showSide, setShowSide] = useState(false);
  const sidebarRef = useRef(null);
  const apiFetch = useCustomFetch();

  // 데이터 로딩
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await apiFetch("/semesters", { method: "GET" });
        if (!res.ok) throw new Error(res.message || "데이터 로딩 실패");

        // 제목에 "오사카" 포함 글 필터링
        const filtered = res.data.filter((p) => p.title?.includes("오사카"));
        setPosts(filtered);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, []);

  // 사이드바 외부 클릭
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (sidebarRef.current && !sidebarRef.current.contains(e.target)) {
        setShowSide(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative min-h-screen bg-[#fcfcf8] p-4">
      {!showSide && <SidebarToggleButton onClick={() => setShowSide(true)} />}
      {showSide && (
        <div ref={sidebarRef}>
          <Sidebar onClose={() => setShowSide(false)} />
        </div>
      )}

      <h1 className="text-3xl font-semibold mt-14 text-gray-900 text-center mb-1">
        Global Talent Development Overseas Training Program in Osaka
      </h1>
      <p className="text-md text-center mb-8 text-gray-500">
        2025년 8월 4일 ~ 8월 29일, 오사카
      </p>

      <div className="p-4 sm:p-8">
        {posts.length === 0 ? (
          <p className="text-center text-gray-400 text-lg mt-20">
            아직 글이 없습니다.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center">
            {posts.map((post) => (
              <JapanProgramDetail
                key={post.id}
                data={post} // 읽기 전용 컴포넌트용 prop
              />
            ))}
          </div>
        )}
      </div>

      <Copyright />
    </div>
  );
}