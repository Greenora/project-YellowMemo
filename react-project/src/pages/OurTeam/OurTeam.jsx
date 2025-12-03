import React, { useState, useEffect, useRef } from 'react';
import Sidebar from "../../components/SideBar";
import SidebarToggleBtn from "../../components/SidebarToggleButton";
import Copyright from '../../components/Copyright';
import useCustomFetch from "../../hooks/useCustomFetch";

const TeamProfileDisplay = ({ member }) => {
  const { name, introduction, imageUrl } = member;
  const descriptionTextareaRef = useRef(null);

  useEffect(() => {
    if (descriptionTextareaRef.current) {
      const textarea = descriptionTextareaRef.current;
      textarea.style.height = 'auto';
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  }, [introduction]);

  return (
    <div className="flex flex-col items-center p-4 w-74 mx-auto border rounded-lg shadow-sm min-h-[380px]">

      <div
        className={`relative w-40 h-40 rounded-full overflow-hidden bg-gray-200 mb-4 flex items-center justify-center shadow-md`}
      >
        {imageUrl ? (
          <img src={imageUrl} alt={name} className="w-full h-full object-cover" />
        ) : (
          <span className="text-gray-500">사진 없음</span>
        )}
      </div>

      <input
        type="text"
        name="name"
        value={name}
        placeholder="이름"
        className="text-xl font-bold text-center w-full bg-transparent border-none outline-none focus:ring-0 mb-1"
        readOnly 
      />

      <textarea
        ref={descriptionTextareaRef}
        name="introduction"
        value={introduction}
        placeholder="내용"
        className="text-base text-center text-gray-700 w-full bg-transparent border-none outline-none focus:ring-0 resize-none overflow-hidden leading-snug"
        rows={1}
        readOnly 
      />
    </div>
  );
};


function OurTeam() {
  const [team, setTeam] = useState([]);
  const [showSide, setShowSide] = useState(false);
  const [loading, setLoading] = useState(true); 
  const sidebarRef = useRef(null);
  
  const apiFetch = useCustomFetch();

  // --- 1. 데이터 로드 ---
  useEffect(() => {
    const fetchTeamData = async () => {
      setLoading(true);
      try {
        const res = await apiFetch("/members", { method: "GET" });
        
        if (res.ok && Array.isArray(res.data)) {
          // member의 필드: {id, name, introduction, imageUrl}
          setTeam(res.data);
        } else {
          console.warn("팀 데이터를 불러오는 데 실패했습니다:", res);
          setTeam([]);
        }
      } catch (error) {
        console.error('Error fetching team data:', error);
        setTeam([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTeamData();
  }, [apiFetch]); 

  // --- 2. 사이드바 외부 클릭 시 닫음  ---
  useEffect(() => {
    function handleClickOutside(e) {
      if (sidebarRef.current && !sidebarRef.current.contains(e.target)) {
        setShowSide(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative min-h-screen bg-[#fcfcf8] p-4">
      {/* 사이드바 및 토글 버튼 */}
      {!showSide && <SidebarToggleBtn onClick={() => setShowSide(true)} />}
      {showSide && <div ref={sidebarRef}><Sidebar onClose={() => setShowSide(false)} /></div>}
      
      <h1 className="text-4xl font-semibold mb-8 mt-14 text-gray-900 text-center">
        Team Greenora
      </h1>

      <div className="p-4 sm:p-8">
        {loading ? (
          <p className="text-center justify-center items-center text-xl text-gray-500">팀 정보 로딩 중...</p>
        ) : (
          <div className="grid grid-cols-1 mx-auto w-[1000px] sm:grid-cols-2 lg:grid-cols-3 justify-items-center">
            {team.map(member => (
              <TeamProfileDisplay 
                key={member.id} 
                member={member} // member 객체 전체를 prop으로 전달
              />
            ))}
          </div>
        )}
      </div>
      <Copyright />
    </div>
  );
}

export default OurTeam;