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

    // 토큰 만료 체크
    const isTokenExpired = (t) => {
      if (!t) return true;
      try {
        const payload = JSON.parse(atob(t.split(".")[1]));
        return Date.now() >= payload.exp * 1000;
      } catch {
        return true;
      }
    };

    // 비공개 API인데 토큰없거나 만료 → 즉시 로그아웃 처리
    if (!isPublicEndpoint && isTokenExpired(token)) {
      logout();
      alert("세션이 만료되었습니다. 다시 로그인해주세요.");
      window.location.href = "/login";
      return { ok: false, status: 401, message: "세션 만료", data: null };
    }

    // 헤더 구성
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

      const data = await res.json();

      return {
        ok: res.ok,
        status: res.status,
        message: data.message ?? "",
        data: data.data ?? data,
      };
    } catch (err) {
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