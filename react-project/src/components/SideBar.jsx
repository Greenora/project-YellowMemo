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
  const [editingName, setEditingName] = useState(false);
  const [newNickname, setNewNickname] = useState("");

  const fileInputRef = useRef();
  const apiFetch = useCustomFetch();

  const refreshUserData = async () => {
    try {
      const res = await apiFetch("/users/me", { method: "GET" });
      setUser(res.data);
      return res.data;
    } catch (error) {
      console.log("유저 정보 불러오기 오류:", error);
      return null;
    }
  };

  useEffect(() => {
    const loadUserData = async () => {
      const userData = await refreshUserData();
      if (userData) setUserId(userData.id);
    };
    loadUserData();
  }, []);

  useEffect(() => {
    if (!userId) return;

    const fetchData = async () => {
      try {
        const postsRes = await apiFetch("/posts", { method: "GET" });
        const postArray = Array.isArray(postsRes.data)
          ? postsRes.data
          : [];

        setPosts(postArray);
        setMyPosts(postArray.filter((p) => p.user?.id == userId));
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, [userId]);

  // 프로필 사진 변경 핸들러 (파일 업로드 방식)
  const handleProfileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("이미지 파일만 업로드할 수 있습니다.");
      return;
    }

    try {
      // FormData 생성 - 파일 업로드용 데이터 형식
      const formData = new FormData();
      formData.append('file', file); // 'file' 필드에 파일 추가

      const uploadResponse = await fetch(`${process.env.REACT_APP_API_URL}/uploads`, {
        method: 'POST',
        body: formData, // JSON이 아닌 FormData로 전송
      });

      if (!uploadResponse.ok) {
        throw new Error('파일 업로드 실패');
      }

      const uploadData = await uploadResponse.json();
      const imageUrl = `${process.env.REACT_APP_API_URL}${uploadData.url}`; // 전체 URL 생성

      const patchRes = await apiFetch("/users/me", {
        method: "PATCH",
        body: JSON.stringify({ image_url: imageUrl }),
        headers: { "Content-Type": "application/json" },
      });

      if (patchRes.ok) {
        await new Promise((r) => setTimeout(r, 500));
        await refreshUserData();
      } else {
        console.error("프로필 업데이트 실패:", patchRes);
        alert("프로필 사진 업데이트에 실패했습니다.");
      }
    } catch (error) {
      console.log("프로필 업데이트 오류:", error);
      alert("프로필 사진 업로드에 실패했습니다.");
    }

    // 파일 input 초기화 (같은 파일 재선택 가능하게)
    e.target.value = "";
  };

  const handleNicknameSave = async () => {
    if (!newNickname.trim()) return;

    try {
      const res = await apiFetch("/users/me", {
        method: "PATCH",
        body: JSON.stringify({ nickname: newNickname }),
        headers: { "Content-Type": "application/json" },
      });

      if (res.ok) {
        await refreshUserData();
        setEditingName(false);
      } else {
        console.error("닉네임 변경 실패:", res);
      }
    } catch (err) {
      console.log("닉네임 변경 오류:", err);
    }
  };

  const handleImgError = (e) => {
    if (e.target.src !== ProfileIcon) {
      e.target.src = ProfileIcon;
    }
  };

  const goTo = (url) => window.location.assign(url);

  if (!user) return null;

  const postList = filter === "all" ? posts : myPosts;

  const displayImageUrl =
    user?.image_url && user.image_url.trim() !== ""
      ? user.image_url
      : ProfileIcon;

  return (
    <aside className="fixed top-0 left-0 h-full w-[260px] bg-white/95 border-r border-gray-100 flex flex-col items-center z-50 shadow">
      <div className="mt-10 mb-4 flex flex-col items-center">
        <div className="relative">
          <img
            src={displayImageUrl}
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
            onChange={handleProfileChange}
          />
        </div>

        {editingName ? (
          <div className="flex flex-col items-center mt-4">
            <input
              value={newNickname}
              onChange={(e) => setNewNickname(e.target.value)}
              className="border px-2 py-1 rounded text-center"
            />
            <button
              onClick={handleNicknameSave}
              className="mt-2 px-3 py-1 bg-black text-white rounded text-sm"
            >
              저장
            </button>
          </div>
        ) : (
          <div
            className="mt-5 mb-1 text-2xl cursor-pointer"
            onClick={() => {
              setEditingName(true);
              setNewNickname(user.nickname);
            }}
          >
            {user.nickname}'s space
          </div>
        )}
      </div>

      <CustomButton
        onClick={() => goTo("/post/create")}
        className="w-[90%] bg-black text-white rounded-xl py-3 mt-2 mb-1"
      >
        New Post
      </CustomButton>

      <CustomButton
        onClick={() => goTo("/our-team")}
        className="w-[90%] bg-white rounded-xl py-3 mb-1 hover:bg-slate-100"
      >
        Our Team
      </CustomButton>

      <CustomButton
        onClick={() => goTo("/osaka-introduce")}
        className="w-[90%] bg-white rounded-xl py-3 mb-1 hover:bg-slate-100"
      >
        Our experience Osaka
      </CustomButton>

      <CustomButton
        onClick={() => goTo("/program-introduce")}
        className="w-[90%] bg-white rounded-xl py-3 mb-8 hover:bg-slate-100"
      >
        About Study Abroad Program
      </CustomButton>

      <div className="w-[90%] flex items-center gap-2 mb-7">
        <span className="text-gray-500 text-sm ml-1 mr-2">Filter</span>

        <CustomButton
          onClick={() => setFilter("all")}
          className={`px-4 rounded-lg border ${
            filter === "all" ? "bg-gray-200 text-black" : "bg-white text-gray-600"
          }`}
        >
          All
        </CustomButton>

        <CustomButton
          onClick={() => setFilter("mine")}
          className={`px-4 rounded-lg border ${
            filter === "mine"
              ? "bg-gray-200 text-black"
              : "bg-white text-gray-600"
          }`}
        >
          Mine
        </CustomButton>
      </div>

      <div className="w-[90%] flex-1 overflow-y-auto pb-6">
        {postList.map((post) => (
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