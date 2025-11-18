'use client';

const useCustomFetch = () => {
  const customFetch = async (endpoint, options, retry = true) => {
    // 엔드포인트, 옵션, 리트라이 = 기본값 트루

    const BASE_URL = process.env.NEXT_PUBLIC_API_URL;
    const publicEndpoints = ["/auth/login", "/user/signup", "/auth/refresh"];
    const isPublicEndpoint = publicEndpoints.includes(endpoint);

    // 클라이언트에서만 token 가져오기
    if (typeof window === "undefined") {
      return { ok: false, status: 500, message: "SSR에서는 사용 불가", data: null };
    }

    // 1. 로컬 스토리지에서 JWT와 Refresh Token 가져오기
    let token = localStorage.getItem("jwtToken");
    let refreshToken = localStorage.getItem("refreshToken");

    // accessToken 만료 몇 분 전 체크 함수
    // t: JWT 토큰 문자열 (accessToken)
    const isTokenExpiring = (t, minutesBefore = 5) => {
      try {
        const payload = JSON.parse(atob(t.split(".")[1])); // payload 부분 디코딩
        return payload.exp * 1000 - Date.now() < minutesBefore * 60 * 1000; // 설정한 minutesBefore보다 남은 시간이 적으면 true
      } catch {
        return true; // 토큰이 만료 되었으면 true
      }
    };

    // 2. accessToken 없거나 만료 5분 전이면 refresh 토큰으로 갱신 시도
    const tryRefresh = async () => {
      if (!refreshToken) return false;

      try {
        const res = await fetch(`${BASE_URL}/auth/refresh`, {
          method: "POST",
          headers: { 
            "Content-Type": "application/json",
            "refresh-token": refreshToken,
          },
        });

        if (!res.ok) return false;

        const data = await res.json();
        const newAccessToken = data.accessToken;
        const newRefreshToken = res.headers.get("refresh-token");

        if (!newAccessToken) return false;

        // refresh 성공 → 새 accessToken 및 refreshToken 저장
        localStorage.setItem("jwtToken", newAccessToken);
        token = newAccessToken;

        if (newRefreshToken) {
          localStorage.setItem("refreshToken", newRefreshToken);
          refreshToken = newRefreshToken;
        }

        return true;
      } catch {
        return false;
      }
    };

    // accessToken 없거나 만료 시 refresh 시도
    if (!token || isTokenExpiring(token, 5)) {
      const refreshed = await tryRefresh();
      if (!refreshed && !isPublicEndpoint) {
        localStorage.removeItem("jwtToken");
        localStorage.removeItem("refreshToken");
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

      // 4. 401 응답 시 retry 플래그 확인 후 refresh 토큰으로 재시도
      if (res.status === 401 && retry && !isPublicEndpoint) {
        // retry가 true일 때만 한 번 재시도
        const refreshed = await tryRefresh();
        if (refreshed) {
          return customFetch(endpoint, options, false); // refresh 재 시도 시, retry를 false 로 호출 해 재귀호출 무한루프 X
        } else {
          localStorage.removeItem("jwtToken");
          localStorage.removeItem("refreshToken");
          alert("세션이 만료되었습니다. 다시 로그인해주세요.");
          window.location.href = "/login";
          return { ok: false, status: 401, message: "세션 만료", data: null };
        }
      }

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
// 2. accessToken 없거나 만료 5분 전이면 refresh 토큰으로 갱신 시도
//    - refresh 성공 → 새 accessToken 및 refreshToken 저장
//    - refresh 실패 → 로그아웃 처리 + /login으로 이동 + alert 표시
// 3. API 요청 시 Authorization 헤더에 accessToken 추가
// 4. 401 응답 시 retry 플래그 확인 후 refresh 토큰으로 재시도 - false로 설정하면 재시도하지 않음 → 무한 루프 방지
// 5. 최종 결과를 {ok, status, message, data} 형태로 리턴