//이 파일은 로그인 화면을 만드는 코드입니다.

//다른 파일에서 만들어놓은 컴포넌트와 React 기능을 불러옵니다
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AuthInputBox from "../../components/AuthInputBox"; //아이디 비번 입력 박스
import CustomButton from "../../components/CustomButton.jsx"; //로그인 버튼
import useLogin from "./useLogin.js"; //로그인 동작을 처리하는 훅을 가져옴
import Copyright from "../../components/Copyright.jsx";
import useCustomFetch from "../../hooks/useCustomFetch";
import { useAuth } from "../../hooks/useAuthContext";


//밑의 함수는 실제로 화면에 보여지는 로그인 컴포넌트
export default function Login() {
  //여기서 useLogin이라는 함수를 실행해서 필요한 값과 기능들을 가져옴
  const {
    loginId,            // 사용자가 입력한 아이디값
    password,           // 사용자가 입력한 비밀번호 값
    setLoginId,         // 아이디를 바꿔주는 함수
    setPassword,        // 비밀번호를 바꿔주는 함수
    error,              // 에러 메세지( 틀렸을때 뜨는 말 )
    handleLogin,        // 로그인 버튼을 눌렀을 때 실행되는 함수
    redirectIfLoggedIn, // 로그인된 유저가 로그인 페이지에 접근했을 때 강제로 게시글 화면으로 튕겨냄
  } = useLogin();        // useLogin 훅을 호출하면 위에 값들을 사용할 수 있다


  // 페이지가 처음 열릴 때 로그인 상태인 경우, 로그인 페이지에 머무르지 못하게 하고
  // 자동으로 해당 유저의 최근 글 또는 글쓰기 페이지로 이동시키는 처리
  const navigate = useNavigate();
  const customFetch = useCustomFetch();
  const { login } = useAuth();

  const [loginId, setLoginId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // 토큰 만료 확인 함수 (재사용)
  const isTokenExpired = (token) => {
    if (!token) return true;
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      return Date.now() >= payload.exp * 1000;
    } catch {
      return true;
    }
  };

  const handleLogin = async (e) => {
    if (e) e.preventDefault(); 
    
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

      // Auth 상태 업데이트
      login(accessToken);

      // 상태가 반영된 후 /board로 이동
      setTimeout(() => {
        navigate("/board", { replace: true });
      }, 0);

    } catch (err) {
      setError("로그인 중 오류 발생");
      console.error(err);
    }
  };

  // 로그인 상태면 /board로 자동 리다이렉트 (로그아웃 충돌 해결)
  const redirectIfLoggedIn = useCallback(() => {
    const token = localStorage.getItem("jwtToken");

    if (!token || isTokenExpired(token)) {
      localStorage.removeItem("jwtToken");
      // 토큰이 없으면 /login에 머무름
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
    
      <form onSubmit={handleLogin} className="flex flex-col items-center justify-center w-full mt-24">
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

        {/* 에러 메시지 보여주기 (에러가 있을 때만 보여짐) */}
        {error && (
          <p className="text-[#ff0000] text-base mb-1 w-[400px] text-center">
            Please check your ID/PASSWORD
          </p>
        )}

        {/* 로그인 버튼 누르면 handleLogin 함수 실행 */}
        <CustomButton 
          className="w-[180px] h-14 bg-white text-black rounded-full shadow-[0_2px_8px_0_rgba(0,0,0,0.08)] font-normal text-lg mt-5 mb-10"
        >
          Login
        </CustomButton>
      </form>
      <div className="text-center mt-4 text-gray-700 text-base">
        Don't you have an account?{" "}
        <span
          onClick={() => navigate("/register")}
          className="text-blue-600 underline cursor-pointer"
        >
          account
        </span>
      </div>
    </div>
  );
}