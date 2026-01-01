import { Navigate } from "react-router-dom";
import { useAppSelector } from "../hooks/useAppSelector";
import type { JSX } from "react";

export function ProtectedRoute({ children }: { children: JSX.Element }) {
    const { accessToken, isAuthReady } = useAppSelector(
        (state) => state.auth
    );

    // ⏳ מחכים לסיום bootstrapAuth
    if (!isAuthReady) {
        return <div style={{ padding: 24 }}>Checking authentication…</div>;
    }

    // ❌ רק אחרי ש-auth מוכן מחליטים
    if (!accessToken) {
        return <Navigate to="/login" replace />;
    }

    // ✅ מחובר
    return children;
}
