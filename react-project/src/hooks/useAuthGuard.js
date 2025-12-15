import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./useAuthContext";

const useAuthGuard = () => {
  const { token } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const isTokenExpired = (t) => {
      if (!t) return true;
      try {
        const payload = JSON.parse(atob(t.split(".")[1]));
        return Date.now() >= payload.exp * 1000;
      } catch {
        return true;
      }
    };

    if (!token || isTokenExpired(token)) {
      navigate("/login");
    }
  }, [token, navigate]);
};

export default useAuthGuard;