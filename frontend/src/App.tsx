import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import Signup from "./pages/Signup";
import Signin from "./pages/Signin";
import Dashboard  from "./pages/UserRoutes/userDashboard";
import BookingPage from "./pages/UserRoutes/userBooking";
import MyBookings from "./pages/UserRoutes/myBooking";
import ManagerDashboard from "./pages/MangerRoutes/managerDashboard";
import ManagerBookings from "./pages/MangerRoutes/managerBooking";
import AddHotel from "./pages/MangerRoutes/addHotel";


function App() {
  return(
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to= "/signup" />}/>
          <Route path="/signup" element={<Signup/>}/>
          <Route path="/signin" element={<Signin/>}/>
          <Route path="/user/dashboard" element={<Dashboard/>}/>
          <Route path="/user/booking/:hotelId" element={<BookingPage/>} />
          <Route path="/user/mybooking" element={<MyBookings/>} />
          <Route path="/manager/dashboard" element={<ManagerDashboard/>} />
          <Route path="/manager/mybooking" element={<ManagerBookings/>} />
          <Route path="/manager/addHotel" element={<AddHotel/>} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App;
