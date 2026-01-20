import { useEffect, useRef } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAppDispatch } from "./hooks/useAppDispatch";
import { useAppSelector } from "./hooks/useAppSelector";
import { bootstrapAuth } from "./store/authSlice";

import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import DashboardPage from "./pages/DashboardPage";
import TasksPage from "./pages/tasks/TasksPage";
import NewTaskPage from "./pages/tasks/NewTaskPage";
import { ProtectedRoute } from "./auth/ProtectedRoute";
import { PublicRoute } from "./auth/PublicRoute";

export default function App() {
  const dispatch = useAppDispatch();
  const isAuthReady = useAppSelector(
    (state) => (state as any).auth?.isAuthReady
  );

  const didBootstrap = useRef(false);

  useEffect(() => {
    if (didBootstrap.current) return;
    didBootstrap.current = true;

    dispatch(bootstrapAuth());
  }, [dispatch]);

  if (!isAuthReady) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-text">
        <div className="text-sm text-muted">Initializing application…</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-text">
      <main className="mx-auto max-w-5xl px-4 py-8">
        <Routes>
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/login"
            element={
              <PublicRoute>
                <LoginPage />
              </PublicRoute>
            }
          />

          <Route
            path="/register"
            element={
              <PublicRoute>
                <RegisterPage />
              </PublicRoute>
            }
          />

          <Route
            path="/tasks"
            element={
              <ProtectedRoute>
                <TasksPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/tasks/new"
            element={
              <ProtectedRoute>
                <NewTaskPage />
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
}
