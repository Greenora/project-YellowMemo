import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import AuthInputBox from "../../components/AuthInputBox";
import CustomButton from "../../components/CustomButton";
import Copyright from "../../components/Copyright";
import useCustomFetch from "../../hooks/useCustomFetch";

export default function Register() {
  const navigate = useNavigate();
  const customFetch = useCustomFetch();

  const [loginId, setLoginId] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [nickname, setNickname] = useState("");
  const [error, setError] = useState("");

  // 회원가입 함수
  const handleRegister = async () => {
    setError("");

    // 간단한 입력 검증
    if (!loginId || !password || !confirmPw || !nickname) {
      setError("모든 항목을 입력해주세요.");
      return;
    }

    if (password !== confirmPw) {
      setError("비밀번호와 확인 비밀번호가 일치하지 않습니다.");
      return;
    }

    try {
      const res = await customFetch("/auth/register", {
        method: "POST",
        body: JSON.stringify({
          username: loginId,
          password: password,
          nickname: nickname,
        }),
      });

      if (!res.ok) {
        setError(res.message || "회원가입 실패");
        return;
      }

      // 회원가입 성공 시 로그인 페이지로 이동
      navigate("/login");
    } catch (err) {
      console.error(err);
      setError("회원가입 중 오류가 발생했습니다.");
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

        if (token && !isTokenExpired(token)) {
          // 토큰이 있고 유효하면 보드로 이동
          navigate("/board", { replace: true });
        }
        // 토큰이 없거나 만료되면 아무 것도 하지 않음 → 회원가입/로그인 페이지 유지
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
          <AuthInputBox
            value={confirmPw}
            onChange={(e) => setConfirmPw(e.target.value)}
            placeholder="Confirm PW"
            type="password"
            hasError={!!error}
          />
          <AuthInputBox
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            placeholder="Nickname"
            hasError={!!error}
          />
        </div>

        {error && (
          <p className="text-[#ff0000] text-base mb-4 w-[400px] text-center">
            {error}
          </p>
        )}

        <CustomButton
          type="submit"
          onClick={handleRegister}
          className="w-[180px] h-14 bg-white text-black rounded-full shadow-[0_2px_8px_0_rgba(0,0,0,0.08)] font-normal text-lg mt-4 mb-6"
        >
          Create account
        </CustomButton>

        <span className="text-base text-black">
          I already have{" "}
          <a href="/login" className="text-[#3b82f6] no-underline hover:underline">
            account
          </a>
        </span>

        <Copyright />
      </div>
    </div>
  );
}