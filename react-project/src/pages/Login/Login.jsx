import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import AuthInputBox from "../../components/AuthInputBox";
import CustomButton from "../../components/CustomButton.jsx";
import Copyright from "../../components/Copyright.jsx";
import useCustomFetch from "../../hooks/useCustomFetch";

export default function Login() {
  const navigate = useNavigate();
  const customFetch = useCustomFetch();

  const [loginId, setLoginId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // 로그인 시도 함수
  const handleLogin = async () => {
    try {
      setError("");

      // 1. 로그인 요청
      const res = await customFetch("/auth/login", {
        method: "POST",
        body: JSON.stringify({ username: loginId, password }),
      });

      if (!res.ok || !res.data.accessToken) {
        setError(res.message || "로그인 실패");
        return;
      }

      const accessToken = res.data.accessToken;
      localStorage.setItem("jwtToken", accessToken);

      await navigate(`/board`)
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

    // 토큰 없을 경우 로그인 페이지로
    if (!token || isTokenExpired(token)) {
      localStorage.removeItem("jwtToken");
      navigate("/login", { replace: true });
      return;
    }

    // 토큰 유효할 경우 보드로
    navigate("/board", { replace: true });
  }, [navigate]);

  // localStorage에 만료된 토큰 존재 → /board로 이동하려고 시도 → 
  // /board에서 API 요청하면 useCustomFetch가 만료된 토큰을 인지 → 로컬스토리지 토큰 삭제 → 다시 로그인으로보냄
  // ^^^ 위와 같은 흐름으로 가면 UX 불편, 위와 같은 토큰만료 검사를 로그인 페이지에서도 하도록 함

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