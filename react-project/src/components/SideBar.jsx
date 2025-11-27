import React, { useEffect, useRef, useState } from "react";
import CustomButton from "./CustomButton";
import PencilIcon from "../assets/sidebar_pencil.svg";
import ProfileIcon from "../assets/sticky-note.png";
import useCustomFetch from "../hooks/useCustomFetch";

function Sidebar() {
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [myPosts, setMyPosts] = useState([]);
  const [filter, setFilter] = useState("all");
  const [userId, setUserId] = useState("");
  const fileInputRef = useRef();

  const apiFetch = useCustomFetch();

  // 로그인된 유저 정보
  useEffect(() => {
    const loadUserData = async () => {
      try {
        const res = await apiFetch("/users/me", { method: "GET" });
        setUser(res.data);
        setUserId(res.data.id)
      } catch (error) {
        console.log("유저 정보 불러오기 오류:", error);
      }
    };

    loadUserData();
  }, [userId]);

  useEffect(() => {
    if (!userId) return;

    const fetchData = async () => {
      try {
        // 1) 내 정보 가져오기
        const me = await apiFetch("/users/me", { method: "GET" });
        setUser(me.data);

        // 2) 모든 포스트 가져오기
        const postsRes = await apiFetch("/posts", { method: "GET" });
        console.log(postsRes)

        const postArray = Array.isArray(postsRes.data) ? postsRes.data : [];
        setPosts(postArray);

        // 3) 내 포스트 필터링
        setMyPosts(postArray.filter(p => p.user?.id == userId));

      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, [userId]);

  const handleImgError = (e) => {
    if (e.target.src !== ProfileIcon) {
      e.target.src = ProfileIcon;      
    }
  };

  // // 로그인 안 된 경우 UI 차단
  // if (!userId) {
  //   return (
  //     <aside className="fixed top-0 left-0 h-full w-[260px] bg-white/95 border-r border-gray-100 flex flex-col items-center justify-center z-50 shadow">
  //       <div className="text-center">
  //         <div className="text-lg text-gray-700 mb-4">Log in to unlock the magic!</div>
  //         <CustomButton
  //           onClick={() => window.location.assign("/login")}
  //           className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-900 transition"
  //         >
  //           Continue to Login
  //         </CustomButton>
  //       </div>
  //     </aside>
  //   );
  // }

  // 프로필 사진 업데이트
  // const handleProfileChange = async (e) => {
  //   const file = e.target.files[0];
  //   if (!file) return;

  //   const reader = new FileReader();
  //   reader.onloadend = async () => {
  //     try {
  //       const base64 = reader.result;

  //       const res = await apiFetch(`/user/${userId}`, {
  //         method: "PATCH",
  //         body: JSON.stringify({ profile: base64 }),
  //       });

  //       setUser(res.data);
  //     } catch (error) {
  //       console.log("프로필 업데이트 오류:", error);
  //     }
  //   };

  //   reader.readAsDataURL(file);
  // };

  // 게시글 제목 가져오기

  const goTo = (url) => window.location.assign(url);

  if (!user) return null;

  const postList = filter === "all" ? posts : myPosts;

  return (
    <aside className="fixed top-0 left-0 h-full w-[260px] bg-white/95 border-r border-gray-100 flex flex-col items-center z-50 shadow">
      
      {/* ---------- 프로필 영역 ---------- */}
      <div className="mt-10 mb-4 flex flex-col items-center">
        <div className="relative">
          <img
            src={user?.image_url && user.image_url.trim() !== "" ? user.image_url : ProfileIcon}
            alt="profile"
            className="w-24 h-24 rounded-full object-cover border-2 border-gray-200 bg-gray-100"
            onError={handleImgError}
          />
          <button
            onClick={() => fileInputRef.current.click()}
            className="absolute top-1 right-1 bg-white border border-gray-300 rounded-full p-1 hover:bg-gray-100 transition"
          >
            <img src={PencilIcon} alt="edit" className="w-5 h-5" />
          </button>
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            style={{ display: "none" }}
            // onChange={handleProfileChange}
          />
        </div>
        <div className="mt-5 mb-1 text-2xl">{user.nickname}'s space</div>
      </div>

      {/* ---------- Navigation Buttons ---------- */}
      <CustomButton onClick={() => goTo("/post/create")} className="w-[90%] bg-black text-white rounded-xl py-3 mt-2 mb-1">
        New Post
      </CustomButton>

      <CustomButton onClick={() => goTo("/our-team")} className="w-[90%] bg-white rounded-xl py-3 mb-1 hover:bg-slate-100">
        Our Team
      </CustomButton>

      <CustomButton onClick={() => goTo("/osaka-introduce")} className="w-[90%] bg-white rounded-xl py-3 mb-1 hover:bg-slate-100">
        Our experience Osaka
      </CustomButton>

      <CustomButton onClick={() => goTo("/program-introduce")} className="w-[90%] bg-white rounded-xl py-3 mb-8 hover:bg-slate-100">
        About Study Abroad Program
      </CustomButton>

      {/* ---------- Filter 버튼 ---------- */}
      <div className="w-[90%] flex items-center gap-2 mb-7">
        <span className="text-gray-500 text-sm ml-1 mr-2">Filter</span>

        <CustomButton
          onClick={() => setFilter("all")}
          className={`px-4 rounded-lg border ${filter === "all" ? "bg-gray-200 text-black" : "bg-white text-gray-600"}`}
        >
          All
        </CustomButton>

        <CustomButton
          onClick={() => setFilter("mine")}
          className={`px-4 rounded-lg border ${filter === "mine" ? "bg-gray-200 text-black" : "bg-white text-gray-600"}`}
        >
          Mine
        </CustomButton>
      </div>

      {/* ---------- Post 목록 ---------- */}
      <div className="w-[90%] flex-1 overflow-y-auto pb-6">
        {postList.map(post => (
          <div key={post.id} className="overflow-hidden rounded-xl mb-2">
            <CustomButton
              onClick={() => goTo(`/post/${post.id}`)}
              className="w-full bg-gray-100 rounded-xl py-3 text-gray-800 hover:bg-gray-200 px-4 text-left hover:scale-105 transition-transform"
            >
              {post.title || "Untitled Post"}
            </CustomButton>
          </div>
        ))}
      </div>
    </aside>
  );
}

export default Sidebar;