import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { authApi } from "../api/authApi";
import { useAppDispatch } from "../hooks/useAppDispatch";
import { setAccessToken } from "../store/authSlice";

export default function RegisterPage() {
    const dispatch = useAppDispatch();
    const nav = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    async function onSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            const res = await authApi.register({
                email,
                password,
                name: name || undefined,
            });

            dispatch(setAccessToken(res.data.accessToken));
            nav("/", { replace: true });
        } catch (err: any) {
            const msg =
                err?.response?.data?.error ||
                err?.response?.data?.message ||
                "Registration failed";
            setError(msg);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div style={{ padding: 24, maxWidth: 420 }}>
            <h2>Register</h2>

            <form onSubmit={onSubmit}>
                <div style={{ marginTop: 12 }}>
                    <label>Name (optional)</label>
                    <input
                        style={{ width: "100%" }}
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        autoComplete="name"
                    />
                </div>

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
                        autoComplete="new-password"
                    />
                </div>

                {error && (
                    <p style={{ color: "crimson", marginTop: 12 }}>{error}</p>
                )}

                <button disabled={loading} style={{ marginTop: 16 }}>
                    {loading ? "..." : "Create account"}
                </button>
            </form>

            <p style={{ marginTop: 12 }}>
                Already have an account? <Link to="/login">Login</Link>
            </p>
        </div>
    );
}
