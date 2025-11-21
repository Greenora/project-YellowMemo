const useCustomFetch = () => {
  const customFetch = async (endpoint, options = {}) => {
    // 엔드포인트, 옵션, 리트라이 = 기본값 트루

    const BASE_URL = process.env.REACT_APP_API_URL;
    console.log(BASE_URL)
    const publicEndpoints = ["/auth/login", "/user/signup"];
    const isPublicEndpoint = publicEndpoints.some(p => endpoint.startsWith(p));

    // 클라이언트에서만 token 가져오기
    if (typeof window === "undefined") {
      return { ok: false, status: 500, message: "SSR에서는 사용 불가", data: null };
    }

    // 1. 로컬 스토리지에서 JWT와 Refresh Token 가져오기
    let token = localStorage.getItem("jwtToken");

    // accessToken 만료 몇 분 전 체크 함수
    // t: JWT 토큰 문자열 (accessToken)
    const isTokenExpired = (t) => {
    try {
      const payload = JSON.parse(atob(t.split(".")[1]));
      return Date.now() >= payload.exp * 1000; // true면 만료
    } catch {
      return true;
    }
  };


    if (!token || isTokenExpired(token)) {
      if (!isPublicEndpoint) {
        localStorage.removeItem("jwtToken");
        alert("세션이 만료되었습니다. 다시 로그인해주세요.");
        window.location.href = "/login";
        return { ok: false, status: 401, message: "세션 만료", data: null };
      }
    }

    // 3. API 요청 시 Authorization 헤더에 accessToken 추가(isPublicEndpoint 경로가 아닐 경우에)
    const mergedHeaders = {
      "Content-Type": "application/json",
      ...(options.headers || {}),
      ...(!isPublicEndpoint && token ? { Authorization: `Bearer ${token}` } : {}),
    };
    const mergedOptions = { ...options, headers: mergedHeaders };

    try {
      const res = await fetch(`${BASE_URL}${endpoint}`, mergedOptions);
      const data = await res.json();

      // 5. 최종 결과를 {ok, status, message, data} 형태로 리턴
      return { 
        ok: res.ok, 
        status: res.status, 
        message: data.message || "", data: data.data || data };
    } catch (err) {
      return { 
        ok: false, 
        status: 500, 
        message: err instanceof Error ? err.message : "알 수 없는 에러", 
        data: null };
    }
  };

  return customFetch;
};

export default useCustomFetch;

// 전체 흐름 정리
// 1. 로컬 스토리지에서 JWT와 Refresh Token 가져오기
// 2. API 요청 시 Authorization 헤더에 accessToken 추가
// 3. 401 응답 시 retry 플래그 확인 후 refresh 토큰으로 재시도 - false로 설정하면 재시도하지 않음 → 무한 루프 방지
// 4. 최종 결과를 {ok, status, message, data} 형태로 리턴