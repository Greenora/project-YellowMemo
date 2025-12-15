import { useCallback } from "react";
import { useAuth } from "./useAuthContext";

const useCustomFetch = () => {
  const { token, logout } = useAuth();

  const customFetch = useCallback(
    async (endpoint, options = {}) => {
      const BASE_URL = process.env.REACT_APP_API_URL;

      const publicEndpoints = [
        "/auth/login",
        "/auth/register",
        "/user/signup",
      ];

      const isPublicEndpoint = publicEndpoints.some((p) =>
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

      // 토큰 만료시 즉시 로그아웃 + redirect
      if (!isPublicEndpoint && isTokenExpired(token)) {
        logout();
        alert("세션이 만료되었습니다. 다시 로그인해주세요.");
        window.location.href = "/login";
        return { ok: false, status: 401, message: "세션 만료", data: null };
      }

      // JSON인지 FormData인지 구분
      const isFormData = options.body instanceof FormData;

      // 헤더 구성
      const mergedHeaders = {
        ...(isFormData ? {} : { "Content-Type": "application/json" }),
        ...(options.headers || {}),
        ...(!isPublicEndpoint && token
          ? { Authorization: `Bearer ${token}` }
          : {}),
      };

      try {
        // fetch 호출
        const res = await fetch(`${BASE_URL}${endpoint}`, {
          method: options.method || "GET",
          headers: mergedHeaders,
          body: options.body, // FormData든 JSON이든 그대로 전달
        });

        let data = {};

        // DELETE 204 → 본문 없음
        if (res.status !== 204) {
          try {
            data = await res.json();
          } catch (e) {
            console.warn("[useCustomFetch] JSON 파싱 실패:", e);
          }
        }

        return {
          ok: res.ok,
          status: res.status,
          message: data.message ?? "",
          data: data.data ?? data,
        };
      } catch (err) {
        // fetch 자체 에러
        console.error("[useCustomFetch] 네트워크 또는 Fetch 자체 에러:", err);
        return {
          ok: false,
          status: 500,
          message: err instanceof Error ? err.message : "알 수 없는 에러",
          data: null,
        };
      }
    },
    [token, logout]
  );

  return customFetch;
};

export default useCustomFetch;