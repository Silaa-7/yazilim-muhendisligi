import { BrowserRouter, Routes, Route } from "react-router-dom";
import { UserProvider } from "./context/UserContext";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Greenhouse from "./pages/Greenhouse";
import Activities from "./pages/Activities";
import Calendar from "./pages/Calendar";
import Irrigation from "./pages/Irrigation";
import Reports from "./pages/Reports";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";

function App() {
  return (
    <UserProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          {/* CORE SYSTEM */}
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/greenhouse" element={<Greenhouse />} />
          <Route path="/activities" element={<Activities />} />

          {/* AGRICULTURE MODULES */}
          <Route path="/calendar" element={<Calendar />} />
          <Route path="/irrigation" element={<Irrigation />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} /> 
          <Route path="/login" element={<Login />} />
        </Routes>
      </BrowserRouter>
    </UserProvider>
  );
}

export default App;