


import React, { createContext, useContext, useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import Swal from "sweetalert2";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [role, setRole] = useState("");
  const [loading, setLoading] = useState(true);

  // Flag to know if it's app load or runtime session expiry
  const [initialCheckDone, setInitialCheckDone] = useState(false);

  const logout = (showAlert = false) => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userData");
    localStorage.removeItem("tokenExpiration");
    setIsAuthenticated(false);
    setRole("");
    if (showAlert) {
      Swal.fire({
        icon: "warning",
        title: "Session Expired",
        text: "Please login again.",
        confirmButtonText: "OK"
      });
    }
  };

  const login = (token, user) => {
    const decoded = jwtDecode(token);
    const expirationTime = decoded.exp * 1000;

    localStorage.setItem("authToken", token);
    localStorage.setItem("userData", JSON.stringify(user));
    localStorage.setItem("tokenExpiration", expirationTime);

    setIsAuthenticated(true);
    setRole(user.role);
  };

  // Initial auth check (only at app load)
  useEffect(() => {
    const token = localStorage.getItem("authToken");
    const expiry = localStorage.getItem("tokenExpiration");
    const userData = localStorage.getItem("userData");

    if (token && expiry && Date.now() < Number(expiry)) {
      setIsAuthenticated(true);
      if (userData) setRole(JSON.parse(userData).role);
    } else {
      logout(false); // no alert on initial check
    }
    setLoading(false);
    setInitialCheckDone(true); // now we know initial check is done
  }, []);

  // Auto logout exactly at token expiry (show alert only after initial check)
  useEffect(() => {
    const expiry = localStorage.getItem("tokenExpiration");
    if (!isAuthenticated || !expiry) return;

    const expiryTime = Number(expiry);
    const now = Date.now();

    if (now >= expiryTime) {
      logout(initialCheckDone); // show alert only after initial check
      return;
    }

    const timeout = setTimeout(() => {
      logout(true); // now session expired at runtime, show alert
    }, expiryTime - now);

    return () => clearTimeout(timeout);
  }, [isAuthenticated, initialCheckDone]);

  return (
    <AuthContext.Provider value={{ isAuthenticated, role, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

