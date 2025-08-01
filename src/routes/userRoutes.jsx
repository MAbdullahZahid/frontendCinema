import AboutUs from "../views/AboutUs";
import Home from "../views/Home";
import CustomerDashboard from "../views/customerDashboard";
import BookingPage from "../views/BookingPage";
import PaymentPage from '../views/PaymentPage';



const userRoutes = [
  {
    path: "/home",
    name: "Home",
    component: <Home />,
    layout: "/user",
  },
 
 {
    path: "/customerDashboard",
    name: "CustomerDashboard",
    component: <CustomerDashboard />,
    layout: "/user",
  },
  
 {
    path: "/movies/book/:movieId",
    name: "BookMovie",
    component: <BookingPage />,
    layout: "/user",
  },
  
//  {
//   path: "/payment/:customerId/:movieId",
//   name: "PaymentPage",
//   component: <PaymentPage />,
//   layout: "/user",
// }
{
    path: "/payment",
    name: "Payment",
    component: <PaymentPage />,
    layout: "/user",
  }


]
export default userRoutes;