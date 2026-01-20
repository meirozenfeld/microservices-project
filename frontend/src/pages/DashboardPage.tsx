import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../hooks/useAppDispatch";
import { clearAuth } from "../store/authSlice";
import { authApi } from "../api/authApi";

export default function DashboardPage() {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    async function logout() {
        try {
            await authApi.logout();
        } finally {
            dispatch(clearAuth());
        }
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-semibold">Dashboard</h1>
                <p className="text-sm text-muted mt-1">
                    You are authenticated and ready to work.
                </p>
            </div>

            <div className="flex gap-3">
                <button
                    onClick={() => navigate("/tasks")}
                    className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primaryHover"
                >
                    Go to Tasks
                </button>

                <button
                    onClick={logout}
                    className="rounded-md border border-slate-700 px-4 py-2 text-sm text-muted hover:text-text"
                >
                    Logout
                </button>
            </div>
        </div>
    );
}
