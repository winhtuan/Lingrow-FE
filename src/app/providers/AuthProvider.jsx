// src/app/providers/AuthProvider.js
import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext(null);

const API_BASE =
  process.env.REACT_APP_API_BASE_URL || "http://localhost:5189/api";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Ưu tiên idToken vì có đầy đủ thông tin (email, name, sub)
    const token =
      localStorage.getItem("idToken") || localStorage.getItem("access_token");

    if (!token) {
      setLoading(false);
      return;
    }

    fetch(`${API_BASE}/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => {
        if (!r.ok) {
          if (r.status === 401) {
            // Token invalid, clear storage
            localStorage.clear();
          }
          throw new Error("Failed to fetch current user");
        }
        return r.json();
      })
      .then((data) => {
        setUser(data); // data: DTO từ BE
      })
      .catch((err) => {
        console.error("auth/me error:", err);
        setUser(null);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
