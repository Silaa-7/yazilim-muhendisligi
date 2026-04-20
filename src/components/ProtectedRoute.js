import { getSession } from "../services/auth";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children, allowedRoles }) {
  const user = getSession();

  if (!user) return <Navigate to="/login" />;

  const roleMap = {
    "admin@test.com": "admin",
    "manager@test.com": "manager",
    "farmer@test.com": "farmer",
  };

  const role = roleMap[user?.email];

  if (!role || !allowedRoles.includes(role)) {
    return <Navigate to="/dashboard" />;
  }

  return children;
}