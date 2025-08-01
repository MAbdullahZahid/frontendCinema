import { Route, Routes, Navigate } from "react-router-dom";
import authRoutes from "../routes/authRoute";




const AuthLayout = () => {
  const getRoutes = (authRoutes) => {
    return authRoutes.map((prop, key) => {
      if (prop.layout === "/auth") {
        return (
          <Route path={prop.path} element={prop.component} key={key} exact />
        );
      } else {
        return null;
      }
    });
  };
  return (
    <>
    
          <Routes>
            {getRoutes(authRoutes)}
            <Route path="*" element={<Navigate to="/home" replace />} />
            <Route path="*" element={<Navigate to="/forgot-password" replace />} />
          
    
          </Routes>
       
    </>
  );
};

export default AuthLayout;
