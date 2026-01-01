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
        <div style={{ padding: 24 }}>
            <h2>Dashboard</h2>
            <p>Authenticated</p>

            <div style={{ marginTop: 16 }}>
                <button onClick={() => navigate("/tasks")}>
                    Go to Tasks
                </button>
            </div>

            <div style={{ marginTop: 16 }}>
                <button onClick={logout}>Logout</button>
            </div>
        </div>
    );
}
