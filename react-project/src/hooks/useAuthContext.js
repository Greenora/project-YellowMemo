import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem("jwtToken"));

  // 로그인
  const login = (jwt) => {
    localStorage.setItem("jwtToken", jwt);
    setToken(jwt);
  };

  // 로그아웃
  const logout = () => {
    localStorage.removeItem("jwtToken");
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);