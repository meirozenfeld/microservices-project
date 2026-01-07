import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { authApi } from "../api/authApi";
import { useAppDispatch } from "../hooks/useAppDispatch";
import { setAccessToken } from "../store/authSlice";

export default function LoginPage() {
    const dispatch = useAppDispatch();
    const nav = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    async function onSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            console.log("LOGIN CLICK", email, password);
            console.log("BASE URL", import.meta.env.VITE_API_BASE_URL);
            const res = await authApi.login({ email, password });
            dispatch(setAccessToken(res.data.accessToken));
            nav("/", { replace: true });
        } catch (err: any) {
            const msg =
                err?.response?.data?.error ||
                err?.response?.data?.message ||
                "Login failed";
            setError(msg);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div style={{ padding: 24, maxWidth: 420 }}>
            <h2>Login</h2>

            <form onSubmit={onSubmit}>
                <div style={{ marginTop: 12 }}>
                    <label>Email</label>
                    <input
                        style={{ width: "100%" }}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        autoComplete="email"
                    />
                </div>

                <div style={{ marginTop: 12 }}>
                    <label>Password</label>
                    <input
                        style={{ width: "100%" }}
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        autoComplete="current-password"
                    />
                </div>

                {error && (
                    <p style={{ color: "crimson", marginTop: 12 }}>{error}</p>
                )}

                <button disabled={loading} style={{ marginTop: 16 }}>
                    {loading ? "..." : "Login"}
                </button>
            </form>

            <p style={{ marginTop: 12 }}>
                No account? <Link to="/register">Register</Link>
            </p>
        </div>
    );
}
