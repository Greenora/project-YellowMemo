import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const useAuthRedirect = () => {
  const navigate = useNavigate();

  useEffect(() => {
    if (typeof window === "undefined") return; // SSR 대응

    const token = localStorage.getItem("jwtToken");
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      // JWT 디코딩
      const payload = JSON.parse(atob(token.split(".")[1]));

      // 만료 시간 체크
      const now = Math.floor(Date.now() / 1000); // 현재 시간 
      if (payload.exp && payload.exp < now) {
        // 토큰 만료
        localStorage.removeItem("jwtToken");
        navigate("/login");
      }
    } catch (err) {
      console.error("토큰 확인 오류:", err);
      localStorage.removeItem("jwtToken");
      navigate("/login");
    }
  }, [navigate]);
};

export default useAuthRedirect;