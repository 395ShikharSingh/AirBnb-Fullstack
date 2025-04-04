import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import Signup from "./pages/Signup";
import Signin from "./pages/Signin";
import Dashboard  from "./pages/userDashboard";
import BookingPage from "./pages/userBooking";
import MyBookings from "./pages/myBooking";

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
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App;
