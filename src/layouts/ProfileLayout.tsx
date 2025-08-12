import { useEffect, useState, type ReactNode } from "react";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);
  const [ok, setOk] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setOk(!!token);
    setReady(true);
  }, []);

  if (!ready) return null;
  if (!ok) return <Navigate to="/" replace />;
  return <>{children}</>;
}
