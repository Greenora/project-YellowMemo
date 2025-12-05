import React, { useState, useEffect, useRef } from 'react';
import JapanProgramDetail from '../../components/JapanProgramDetail';
import Sidebar from "../../components/SideBar";
import SidebarToggleBtn from "../../components/SidebarToggleButton";
import Copyright from '../../components/Copyright';
import useCustomFetch from '../../hooks/useCustomFetch';
import LogoutButton from '../../components/LogoutButtom';

function JapanProgram() {
  const [programs, setPrograms] = useState([]);
  const [showSide, setShowSide] = useState(false);
  const sidebarRef = useRef(null);
  const apiFetch = useCustomFetch();

  // 데이터 로딩
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await apiFetch("/semesters/type/semester_info", { method: "GET" });
        if (!res.ok) throw new Error(res.message || "데이터 로딩 실패");

        // // 제목에 "오사카" 미포함 글 필터링
        // const filtered = res.data.filter((p) => !p.title?.includes("오사카"));
        // setPrograms(filtered);
        setPrograms(res.data)
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
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

  return (
    <div className="relative min-h-screen bg-[#fcfcf8] p-4">
      <LogoutButton />
      {!showSide && <SidebarToggleBtn onClick={() => setShowSide(true)} />}
      {showSide && <div ref={sidebarRef}><Sidebar onClose={() => setShowSide(false)} /></div>}
      
      <h1 className="text-3xl text-semibold mb-8 mt-14 text-gray-900 text-center">
        Study Abroad Program
      </h1>

      <div className="p-4 sm:p-8">
        {programs.length === 0 ? (
          <p className="text-center text-gray-400 text-lg mt-20">
            아직 글이 없습니다.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center">
            {programs.map(program => (
              <JapanProgramDetail 
                key={program.id} 
                data={program} // 읽기 전용 prop
              />
            ))}
          </div>
        )}
      </div>

      <Copyright />
    </div>
  );
}

export default JapanProgram;