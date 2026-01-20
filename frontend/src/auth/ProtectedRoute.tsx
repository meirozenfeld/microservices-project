import { Navigate } from "react-router-dom";
import { useAppSelector } from "../hooks/useAppSelector";
import type { JSX } from "react";

export function ProtectedRoute({ children }: { children: JSX.Element }) {
    const { accessToken, isAuthReady } = useAppSelector(
        (state) => state.auth
    );

    // Wait for auth bootstrap to finish before making routing decisions
    if (!isAuthReady) {
        return <div style={{ padding: 24 }}>Checking authentication…</div>;
    }

    // If the user is not authenticated, redirect to the login page
    if (!accessToken) {
        return <Navigate to="/login" replace />;
    }

    // Authenticated – render the protected content
    return children;
}
