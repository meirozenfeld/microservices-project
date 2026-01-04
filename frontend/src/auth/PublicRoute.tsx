import { Navigate } from "react-router-dom";
import { useAppSelector } from "../hooks/useAppSelector";
import type { JSX } from "react";

export function PublicRoute({ children }: { children: JSX.Element }) {
  const { accessToken, isAuthReady } = useAppSelector(
    (state) => state.auth
  );

  // מחכים ל-bootstrap
  if (!isAuthReady) {
    return <div style={{ padding: 24 }}>Initializing…</div>;
  }

  // אם כבר מחובר – אין מה לחפש ב-login/register
  if (accessToken) {
    return <Navigate to="/" replace />;
  }

  return children;
}
