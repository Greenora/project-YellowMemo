import { useCallback } from "react";
import { useAuth } from "./useAuthContext";

const useCustomFetch = () => {
  const { token, logout } = useAuth();

  const customFetch = useCallback(async (endpoint, options = {}) => {
    const BASE_URL = process.env.REACT_APP_API_URL;

    const publicEndpoints = [
      "/auth/login",
      "/auth/register",
      "/user/signup",
    ];

    const isPublicEndpoint = publicEndpoints.some(p =>
      endpoint.startsWith(p)
    );

    // 토큰 만료 체크 (기존 로직 유지)
    const isTokenExpired = (t) => {
      if (!t) return true;
      try {
        const payload = JSON.parse(atob(t.split(".")[1]));
        return Date.now() >= payload.exp * 1000;
      } catch {
        return true;
      }
    };

    // 비공개 API인데 토큰없거나 만료 → 즉시 로그아웃 처리 (기존 로직 유지)
    if (!isPublicEndpoint && isTokenExpired(token)) {
      logout();
      alert("세션이 만료되었습니다. 다시 로그인해주세요.");
      window.location.href = "/login";
      return { ok: false, status: 401, message: "세션 만료", data: null };
    }

    // 헤더 구성 (기존 로직 유지)
    const mergedHeaders = {
      "Content-Type": "application/json",
      ...(options.headers || {}),
      ...(!isPublicEndpoint && token ? { Authorization: `Bearer ${token}` } : {}),
    };

    try {
      const res = await fetch(`${BASE_URL}${endpoint}`, {
        ...options,
        headers: mergedHeaders,
      });

      let data = {};
      
      // 204는 DELETE 요청의 표준 성공 응답이며, 본문이 X
      if (res.status !== 204) {
        try {
          // 응답 본문이 있으면 JSON 파싱 시도
          data = await res.json();
        } catch (e) {
          // 본문이 있지만 JSON 형식이 아닐 경우 (예: HTML 에러 페이지)
          console.warn("[useCustomFetch] JSON 파싱 실패:", e);
          // 이 경우 data는 빈 객체 {}를 유지합니다.
        }
      }

      // 204 성공 시 res.ok는 true, status는 204, data는 {} 또는 null이 됨.
      return {
        ok: res.ok,
        status: res.status,
        message: data.message ?? "",
        data: data.data ?? data,
      };

    } catch (err) {
      // 이 catch는 네트워크 오류나 fetch 자체의 문제만 잡도록 유지
      console.error("[useCustomFetch] 네트워크 또는 Fetch 자체 에러:", err);
      return {
        ok: false,
        status: 500,
        message: err instanceof Error ? err.message : "알 수 없는 에러",
        data: null,
      };
    }
  }, [token, logout]);

  return customFetch;
};

export default useCustomFetch;