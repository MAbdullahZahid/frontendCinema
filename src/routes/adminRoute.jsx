//src/routes/adminRoute.jsx

import AdminDashboard from "../views/adminDashboard";
import Home from "../views/Home";

const adminRoutes = [
  {
    path: "/adminDashboard",
    name: "AdminDashboard",
    component: <AdminDashboard />,
    layout: "/admin",
  },
  {
    path: "/home",
    name: "Home",
    component: <Home />,
    layout: "/admin",
  },
  
   
];

export default adminRoutes;
