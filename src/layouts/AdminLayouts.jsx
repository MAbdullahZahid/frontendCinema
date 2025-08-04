  //src/layouts/AdminLayouts.jsx
  import { Route, Routes, Navigate } from "react-router-dom";
  import adminRoutes from "../routes/adminRoute";

  const AdminLayout = () => {
    const getRoutes = (routes) =>
      routes.map((prop, key) =>
        prop.layout === "/admin" ? (
          <Route path={prop.path} element={prop.component} key={key} exact />
        ) : null
      );

    return (
      <Routes>
        {getRoutes(adminRoutes)}
        <Route path="*" element={<Navigate to="/admin/adminDashboard" replace />} />
      </Routes>
    );
  };

  export default AdminLayout;
//in main