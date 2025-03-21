import { Route, Routes } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";
import Home from "../pages/Home/Home";
import LoginPage from "../pages/Login/Login";
import Signup from "../pages/Signup/Signup";
import Navbar from "./components/Navbar";
import NewChargingStation from "../pages/NewChargingStation/NewChargingStation";
import ActivityHistory from "../pages/ActivityHistory/ActivityHistory";
import PersonalArea from "../pages/PersonalArea/PersonalArea";
import Booking from "../pages/Booking/Booking";
import Admin from "../pages/Admin/Admin";
import { AuthProvider } from "../src/api/AuthContext";

const App = () => {
  const location = useLocation();
  const hideNavbarRoutes = ["/", "/signup"];

  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
     <AuthProvider> 
        <>
          {!hideNavbarRoutes.includes(location.pathname) && <Navbar />}

          <Routes>
            <Route path="/" element={<LoginPage />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/home" element={<Home />} />
            <Route path="/newChargingStation" element={<NewChargingStation />} />
            <Route path="/ActivityHistory" element={<ActivityHistory />} />
            <Route path="/PersonalArea" element={<PersonalArea />} />
            <Route path="/Booking" element={<Booking />} />
            <Route path="/Admin" element={<Admin />} />
          </Routes>
        </>
      </AuthProvider>
    </GoogleOAuthProvider>
  );
};

export default App;

