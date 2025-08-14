import { Navigate, useLocation } from "react-router-dom";
import type { ReactNode } from "react";

type RoleLike = "ADMIN" | "CUSTOMER" | "SALES" | "SELLER";

type Props = {
  children: ReactNode;
  /** Which roles are allowed to view this route */
  allow?: RoleLike[];
};

export default function ProtectedRoute({ children, allow }: Props) {
  const location = useLocation();
  const token = localStorage.getItem("token") || "";
  const role = (localStorage.getItem("role") || "") as RoleLike | "";

  if (!token) {
    return <Navigate to="/" replace state={{ from: location }} />;
  }

  if (allow && allow.length && !allow.includes(role as RoleLike)) {
    // Send logged-in users to their “home” if they lack permission
    if (role === "ADMIN") return <Navigate to="/admin" replace />;
    if (role === "SALES" || role === "SELLER")
      return <Navigate to="/profile/seller" replace />;
    return <Navigate to="/profile/customer" replace />;
  }

  return <>{children}</>;
}
