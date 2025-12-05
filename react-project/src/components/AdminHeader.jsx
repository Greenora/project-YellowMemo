import { Link, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import useCustomFetch from "../hooks/useCustomFetch";

export default function AdminHeader() {
  const navigate = useNavigate();
  const apiFetch = useCustomFetch();

  useEffect(() => {
    async function checkAdmin() {
      try {
        // apiFetch는 json 데이터를 바로 반환한다는 가정
        const user = await apiFetch("/users/me", {
          credentials: "include",
        });

        // 관리자 조건 검사
        if (user.data.role !== "admin") {
          alert("관리자만 접근할 수 있습니다.");
          navigate("/board");
        }
      } catch (err) {
        alert("관리자만 접근할 수 있습니다.");
        navigate("/board");
      }
    }

    checkAdmin();
  }, [navigate]);

  return (
    <header className="w-full h-10 items-center flex m-2 mb-6">
      <Link className="p-2 mx-2 bg-white rounded-md shadow-sm" to="/admin">
        관리자 메인 페이지
      </Link>
      <Link className="p-2 mx-2 bg-white rounded-md shadow-sm" to="/admin/semester">
        현지학기제 글 관리
      </Link>
      <Link className="p-2 mx-2 bg-white rounded-md shadow-sm" to="/admin/member">
        멤버 소개 글 관리
      </Link>
      <Link className="p-2 mx-2 bg-white rounded-md shadow-sm" to="/board">
        메인 보드로 이동
      </Link>
    </header>
  );
}