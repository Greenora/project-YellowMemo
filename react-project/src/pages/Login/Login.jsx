import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import AuthInputBox from "../../components/AuthInputBox";
import CustomButton from "../../components/CustomButton.jsx";
import Copyright from "../../components/Copyright.jsx";
import useCustomFetch from "../../hooks/useCustomFetch";
import { useAuth } from "../../hooks/useAuthContext"; // 추가

export default function Login() {
  const navigate = useNavigate();
  const customFetch = useCustomFetch();
  const { login } = useAuth(); // AuthProvider에서 login 가져오기

  const [loginId, setLoginId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // 로그인 시도 함수
  const handleLogin = async () => {
    try {
      setError("");

      const res = await customFetch("/auth/login", {
        method: "POST",
        body: JSON.stringify({ username: loginId, password }),
      });

      if (!res.ok || !res.data.accessToken) {
        setError(res.message || "로그인 실패");
        return;
      }

      const accessToken = res.data.accessToken;

      // 1️⃣ Auth 상태 업데이트
      login(accessToken);

      // 2️⃣ 상태가 반영된 후 navigate
      setTimeout(() => {
        navigate("/board", { replace: true });
      }, 0);

    } catch (err) {
      setError("로그인 중 오류 발생");
      console.error(err);
    }
  };

  // 토큰 만료 확인 함수
  const isTokenExpired = (token) => {
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      return Date.now() >= payload.exp * 1000;
    } catch {
      return true;
    }
  };

  // 로그인 상태면 보드로 자동 리다이렉트
  const redirectIfLoggedIn = useCallback(() => {
    const token = localStorage.getItem("jwtToken");

    if (!token || isTokenExpired(token)) {
      localStorage.removeItem("jwtToken");
      navigate("/login", { replace: true });
      return;
    }

    navigate("/board", { replace: true });
  }, [navigate]);

  useEffect(() => {
    redirectIfLoggedIn();
  }, [redirectIfLoggedIn]);

  return (
    <div className="min-h-screen bg-[#fcfcf8] px-16 pt-20">
      <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-2 text-gray-900">.Yellowmemo</h1>
      <p className="text-lg sm:text-lg md:text-xl lg:text-2xl text-gray-700 font-normal">
        Think, memo, create your own idea board by just One-click
      </p>
    
      <div className="flex flex-col items-center w-full mt-24">  
        <div className="flex flex-col items-center w-full max-w-[700px]">
          <AuthInputBox
            value={loginId}
            onChange={(e) => setLoginId(e.target.value)}
            placeholder="ID"
            hasError={!!error}
          />
          <AuthInputBox
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="PW"
            type="password"
            hasError={!!error}
          />
        </div>

        {error && (
          <p className="text-[#ff0000] text-base mb-1 w-[400px] text-center">
            Please check your ID/PASSWORD
          </p>
        )}

        <CustomButton 
          onClick={handleLogin}
          className="w-[180px] h-14 bg-white text-black rounded-full shadow-[0_2px_8px_0_rgba(0,0,0,0.08)] font-normal text-lg mt-5 mb-10"
        >
          Login
        </CustomButton>

        <span className="flex flex-col gap-2 items-center w-[400px]">
          <p className="text-base text-black">
            I don’t have{" "}
            <a href="/register" className="text-[#3b82f6] underline">
              account
            </a>
          </p>
          <p className="text-base text-black">
            I forgot my{" "}
            <a href="/reset-password" className="text-[#3b82f6] underline">
              password
            </a>
          </p>
        </span>

        <Copyright />
      </div>
    </div>
  );
}