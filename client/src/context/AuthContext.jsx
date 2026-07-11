import React, { createContext, useContext, useState, useCallback } from "react";
import { api } from "../lib/api.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem("smashkart_admin_token"));

  const login = useCallback(async (password) => {
    const { token } = await api.login(password);
    localStorage.setItem("smashkart_admin_token", token);
    setToken(token);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("smashkart_admin_token");
    setToken(null);
  }, []);

  return (
    <AuthContext.Provider value={{ token, isAdmin: Boolean(token), login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
