import { Navigate } from "react-router-dom";
import { useAppSelector } from "../hooks/useAppSelector";
import type { JSX } from "react";

export function PublicRoute({ children }: { children: JSX.Element }) {
  const { accessToken, isAuthReady } = useAppSelector(
    (state) => state.auth
  );

  // Wait for the initial auth bootstrap to complete before deciding what to render
  if (!isAuthReady) {
    return <div style={{ padding: 24 }}>Initializing…</div>;
  }

  // If the user is already authenticated, redirect away from public auth pages
  if (accessToken) {
    return <Navigate to="/" replace />;
  }

  return children;
}
