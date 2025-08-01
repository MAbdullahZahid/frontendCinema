import Signup from "../views/Signup";
import Login from "../views/Login";
import Home from "../views/Home";
import ForgotPassword from '../views/ForgotPassword'



const authRoutes = [
    {
    path: "/home",
    name: "Home",
    component: <Home />,
    layout: "/auth",
  },
  {
    path: "/login",
    name: "Login",
    component: <Login />,
    layout: "/auth",
  },
  {
    path: "/signup",
    name: "Signup",
    component: <Signup />,
    layout: "/auth",
  },
  {
    path: "/forgot-password",
    name: "ForgotPassword",
    component: <ForgotPassword />,
    layout: "/auth",
  },
  

  

]
export default authRoutes;