import Sidebar from "../../components/SideBar";
import SidebarToggleBtn from "../../components/SidebarToggleButton";
import { useState, useEffect, useRef } from "react";
import useCustomFetch from "../../hooks/useCustomFetch";
import { Link, Navigate } from "react-router-dom";
import ProfileIcon from "../../assets/sticky-note.png";
import useAuthRedirect from "../../hooks/useAuthRedirect";


export default function BoardPage() {
  const [showSide, setShowSide] = useState(false);
  const sidebarRef = useRef(null);
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState("");
  const apiFetch = useCustomFetch();

  useAuthRedirect();

  useEffect(() => {
    async function fetchPosts() {
      try {
        const res = await apiFetch("/posts", { method: "GET" });
        setPosts(res.data || []);
      } catch (err) {
        setError(err.message);
      }
    }

    fetchPosts();
  }, []);

  // 사이드바 외부 클릭 핸들러
  useEffect(() => {
    function handleClickOutside(e) {
      if (sidebarRef.current && !sidebarRef.current.contains(e.target)) {
        setShowSide(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function handleLogout() {
    localStorage.removeItem("jwtToken");
    Navigate('/');
  }

  return (
    <div>
      {!showSide && <SidebarToggleBtn onClick={() => setShowSide(true)} />}
      {showSide && (
        <div ref={sidebarRef}>
          <Sidebar onClose={() => setShowSide(false)} />
        </div>
      )}

      <div className="p-10 text-center items-center justify-center mt-10">
        {/* 로그아웃 버튼 */}
      <button onClick={handleLogout} className="fixed top-6 right-8 z-50 text-sm text-yellow-400">Logout</button>

        <h1 className="text-2xl">
          👋 환영합니다! 사이드바에서 새 글을 만들어보세요. 👋
        </h1>
        <p className="text-lg">
          팀원과 현지학기제 소개, 그리고 팀 그리놀라가 실제로 경험한 오사카 연수에 대한 글도 확인할 수 있어요😄
        </p>
      </div>

      <div className="p-10 flex-col">
        <p className="text-2xl font-medium text-center">
          What's new?
        </p>
        {error && <p className="text-center text-red-500">{error}</p>}

        {posts.length === 0 ? (
          <p className="text-center text-gray-600">아직 게시글이 없습니다.</p>
        ) : (
          posts.map((post) => (
            <Link key={post.id} to={`/post/${post.id}`}>
              <div
                className="p-5 w-2/3 mx-auto border-b border-neutral-300 
                          flex justify-between items-center"
              >
                {/* 왼쪽 - 제목 */}
                <p className="text-lg font-medium">{post.title}</p>

                {/* 오른쪽 - 닉네임 + 사진 */}
                <div className="flex items-center text-right">
                  <p className="text-sm text-gray-600 mr-3">{post.user.nickname}</p>
                  <img
                    src={post.user?.image_url || ProfileIcon}
                    alt={`${post.user.nickname}'s profile`}
                    className="w-6 h-6 rounded-full object-cover"
                    onError={(e) => {
                      if (e.target.src !== ProfileIcon) {
                        e.target.src = ProfileIcon; 
                      }
                    }}
                  />
                </div>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  )
}