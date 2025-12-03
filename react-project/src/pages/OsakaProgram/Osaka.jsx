import { useState, useEffect, useRef } from "react";
import SidebarToggleButton from "../../components/SidebarToggleButton";
import Sidebar from "../../components/SideBar";
import Copyright from "../../components/Copyright";
import useCustomFetch from "../../hooks/useCustomFetch";
import ProfileIcon from "../../assets/sticky-note.png"; // 포스트잇 아이콘으로 사용
import LogoutButton from "../../components/LogoutButtom";

// --- 1. PostIt 컴포넌트 ---
const PostIt = ({ post, onEdit, onDelete }) => {
  // 랜덤 각도
  const [style] = useState({
    transform: `rotate(${Math.floor(Math.random() * 6) - 3}deg) translate(${Math.floor(Math.random() * 10) - 5}px, ${Math.floor(Math.random() * 10) - 5}px)`,
  });
  
  // 랜덤 배경색
  const colors = ['bg-yellow-200', 'bg-yellow-300', 'bg-yellow-400'];
  const [bgColor] = useState(colors[Math.floor(Math.random() * colors.length)]);

  return (
    <div 
      className={`relative w-60 h-60 p-4 shadow-xl ${bgColor} transition-transform duration-300 hover:shadow-2xl flex flex-col justify-between`}
      style={style} // 랜더링 마다 랜덤 스타일 적용
    >
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2 pb-1 break-words">
          {post.title}
        </h3>
        <p className="text-sm text-gray-700 whitespace-pre-wrap break-words max-h-32 overflow-y-auto">
          {post.content}
        </p>
      </div>

      <div className="flex justify-end space-x-2 mt-4">
        <button
          onClick={() => onEdit(post)}
          className="text-xs text-gray-500 hover:text-gray-400 font-medium"
        >
          수정
        </button>
        <button
          onClick={() => onDelete(post.id)}
          className="text-xs text-gray-400 hover:text-gray-300 font-medium"
        >
          삭제
        </button>
      </div>
    </div>
  );
};


// --- 2. PostEditor 컴포넌트 ---
const PostEditor = ({ post, onClose, onSave }) => {
  const [title, setTitle] = useState(post ? post.title : "");
  const [content, setContent] = useState(post ? post.content : "");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      alert("제목과 내용을 모두 입력해주세요.");
      return;
    }

    const newPost = {
      ...post, // 수정 시 기존 ID와 데이터 포함
      title: title.trim(),
      content: content.trim(),
      // 새 글 작성 시 type을 강제로 "osaka_review"로 설정
      type: post ? post.type : "osaka_review", 
      imageUrl: post ? post.imageUrl : null, 
    };
    onSave(newPost);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white p-6 rounded-lg shadow-2xl w-full max-w-lg">
        <h2 className="text-2xl font-bold mb-4">{post ? "글 수정하기" : "새 글 작성하기"}</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="제목"
            value={title}
            maxLength={20}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border p-3 rounded mb-4 text-lg focus:ring-yellow-300 focus:border-yellow-300"
            required
          />
          <textarea
            placeholder="내용을 입력하세요..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows="6"
            maxLength={200}
            className="w-full border p-3 rounded mb-4 resize-none focus:ring-yellow-300 focus:border-yellow-300"
            required
          />
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 transition"
            >
              취소
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-black text-white rounded-md hover:bg-gray-600 transition"
            >
              {post ? "수정 완료" : "작성하기"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// --- 3. OsakaPage (메인 컴포넌트) ---
export default function OsakaPage() {
  const [posts, setPosts] = useState([]);
  const [showSide, setShowSide] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false); // 모달 상태
  const [editingPost, setEditingPost] = useState(null); // 수정할 글 데이터 (null이면 새 글 작성)
  const sidebarRef = useRef(null);
  const apiFetch = useCustomFetch();

  // 1. READ: 데이터 로딩
  const fetchData = async () => {
    try {
      const res = await apiFetch("/semesters/osaka_review", { method: "GET" });
      if (!res.ok) throw new Error(res.message || "데이터 로딩 실패");
      setPosts(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // 2. CREATE / UPDATE: 글 저장 처리
  const handleSave = async (newPost) => {
    const isUpdate = !!newPost.id;
    const method = isUpdate ? "PATCH" : "POST";
    const endpoint = isUpdate ? `/semesters/${newPost.id}` : "/semesters";

    try {
      const res = await apiFetch(endpoint, {
        method: method,
        body: JSON.stringify(newPost),
      });

      if (!res.ok || !res.data) throw new Error("저장 실패");

      if (isUpdate) {
        setPosts(prev => prev.map(p => (p.id === res.data.id ? res.data : p)));
        alert("수정되었습니다.");
      } else {
        setPosts(prev => [...prev, res.data]);
        alert("글이 작성되었습니다.");
      }
      setIsModalOpen(false); // 모달 닫기
      setEditingPost(null);
    } catch (error) {
      console.error("저장 중 오류:", error);
      alert(isUpdate ? "수정 실패" : "작성 실패");
    }
  };

  // 3. DELETE: 글 삭제 처리
  const handleDelete = async (id) => {
    if (!window.confirm("정말로 이 글을 삭제하시겠습니까?")) return;

    try {
      const res = await apiFetch(`/semesters/${id}`, { method: "DELETE" });

      if (res.status !== 200 && res.status !== 204) {
        throw new Error("삭제 실패");
      }

      setPosts(prev => prev.filter(p => p.id !== id));
      alert("삭제되었습니다.");
    } catch (error) {
      console.error("삭제 중 오류:", error);
      alert("삭제 실패");
    }
  };
  
  // 모달 열기 핸들러 (새 글 작성)
  const handleCreateClick = () => {
    setEditingPost(null);
    setIsModalOpen(true);
  };
  
  // 수정 모달 열기 핸들러
  const handleEditClick = (post) => {
    setEditingPost(post);
    setIsModalOpen(true);
  };

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
      <LogoutButton />
      {/* 사이드바 */}
      {!showSide && <SidebarToggleButton onClick={() => setShowSide(true)} />}
      {showSide && (
        <div ref={sidebarRef}>
          <Sidebar onClose={() => setShowSide(false)} />
        </div>
      )}

      {/* 헤더 */}
      <h1 className="text-3xl font-semibold mt-14 text-gray-900 text-center mb-1">
        Global Talent Development Overseas Training Program in Osaka
      </h1>
      <p className="text-md text-center mb-8 text-gray-500">
        2025년 8월 4일 ~ 8월 29일, 오사카
      </p>

      {/* 포스트잇 그리드 */}
      <div className="p-4 sm:p-8">
        {posts.length === 0 ? (
          <p className="text-center text-gray-400 text-lg mt-20">
            아직 글이 없습니다. 새로운 글을 작성해보세요!
          </p>
        ) : (
          // Flexbox와 gap으로 카드들이 겹치지 않게 배치
          <div className="flex flex-wrap justify-center gap-12 p-4">
            {posts.map((post) => (
              <PostIt 
                key={post.id} 
                post={post}
                onEdit={handleEditClick}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </div>

      {/* 글 작성 버튼*/}
      <button
        onClick={handleCreateClick}
        className="fixed bottom-10 right-10 bg-white p-4 rounded-full shadow-lg hover:bg-gray-200 transition z-40 flex items-center justify-center text-sm font-bold"
        aria-label="글 작성하기"
        title="새 글 작성하기"
      >
        <img src={ProfileIcon} alt="Write" className="w-6 h-6 mr-2" />
        글 작성하기
      </button>

      {/* 모달 렌더링 */}
      {isModalOpen && (
        <PostEditor
          post={editingPost}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSave}
        />
      )}

      <Copyright />
    </div>
  );
}