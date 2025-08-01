//src/layouts/UserLayouts.jsx

import { Route, Routes, Navigate } from "react-router-dom";
import userRoutes from "../routes/userRoutes"
import PaymentPage from "../views/PaymentPage";

const UserLayout = () => {
  
 const getRoutes = (routes) =>
    routes.map((prop, key) =>
      prop.layout === "/user" ? (
        <Route path={prop.path} element={prop.component} key={key} exact />
      ) : null
    );
  return (
    <>
     
          <Routes>
            {getRoutes(userRoutes)}
              <Route path="/payment" element={<PaymentPage />} />
           <Route path="*" element={<Navigate to="/home" replace />} />
         
           

          </Routes>

           
     
    </>
  );
};

export default UserLayout;
