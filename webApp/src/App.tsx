import { Route, Routes } from "react-router-dom";
import Home from "../pages/Home/Home";
import LoginPage from "../pages/Login/Login";
import Signup from "../pages/Signup/Signup";
import Navbar from "./components/Navbar";

const App = () => {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/home" element={<Home />} />
      </Routes>
    </>
  );
};

export default App;
