import { Route, Routes } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { GoogleOAuthProvider } from '@react-oauth/google';
import Home from "../pages/Home/Home";
import LoginPage from "../pages/Login/Login";
import Signup from "../pages/Signup/Signup";
import Navbar from "./components/Navbar";
import NewChargingStation from "../pages/NewChargingStation/NewChargingStation";
import ActivityHistory from "../pages/ActivityHistory/ActivityHistory";
import PersonalArea from "../pages/PersonalArea/PersonalArea";

const App = () => {
  const location = useLocation();
  const hideNavbarRoutes = ["/", "/signup"];

  return (
    <GoogleOAuthProvider clientId="88545962635-uj9vqmfnvkh5fbbd14geirpgvmofd6ah.apps.googleusercontent.com">
      <>
        {!hideNavbarRoutes.includes(location.pathname) && <Navbar />}

        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/home" element={<Home />} />
          <Route path="/newChargingStation" element={<NewChargingStation />} />
          <Route path="/ActivityHistory" element={<ActivityHistory />} />
          <Route path="/PersonalArea" element={<PersonalArea />} />
        </Routes>
      </>
    </GoogleOAuthProvider>
  );
};

export default App;




// import { Route, Routes } from "react-router-dom";
// import { useLocation } from "react-router-dom";
// import Home from "../pages/Home/Home";
// import LoginPage from "../pages/Login/Login";
// import Signup from "../pages/Signup/Signup";
// import Navbar from "./components/Navbar";
// import NewChargingStation from "../pages/NewChargingStation/NewChargingStation";
// import ActivityHistory from "../pages/ActivityHistory/ActivityHistory";
// import PersonalArea from "../pages/PersonalArea/PersonalArea";

// const App = () => {
//   const location = useLocation();

//   const hideNavbarRoutes = ["/", "/signup"];

//   return (
//     <>
//       {!hideNavbarRoutes.includes(location.pathname) && <Navbar />}

//       <Routes>
//         <Route path="/" element={<LoginPage />} />
//         <Route path="/signup" element={<Signup />} />
//         <Route path="/home" element={<Home />} />
//         <Route path="/newChargingStation" element={<NewChargingStation />} />
//         <Route path="/ActivityHistory" element={<ActivityHistory />} />
//         <Route path="/PersonalArea" element={<PersonalArea />} />
//       </Routes>
//     </>
//   );
// };

// export default App;
