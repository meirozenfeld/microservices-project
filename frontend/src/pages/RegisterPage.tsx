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
        <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
            <div className="w-full max-w-md rounded-xl bg-surface p-6 shadow-lg">
                <h1 className="text-2xl font-semibold mb-2">Create account</h1>
                <p className="text-sm text-muted mb-6">
                    Start managing your tasks
                </p>

                <form onSubmit={onSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm mb-1">
                            Name <span className="text-muted">(optional)</span>
                        </label>
                        <input
                            className="w-full rounded-md bg-background border border-slate-700 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            autoComplete="name"
                        />
                    </div>

                    <div>
                        <label className="block text-sm mb-1">Email</label>
                        <input
                            className="w-full rounded-md bg-background border border-slate-700 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            autoComplete="email"
                        />
                    </div>

                    <div>
                        <label className="block text-sm mb-1">Password</label>
                        <input
                            type="password"
                            className="w-full rounded-md bg-background border border-slate-700 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            autoComplete="new-password"
                        />
                    </div>

                    {error && (
                        <p className="text-sm text-red-400">{error}</p>
                    )}

                    <button
                        disabled={loading}
                        className="w-full rounded-md bg-primary py-2 text-sm font-medium text-white hover:bg-primaryHover disabled:opacity-50"
                    >
                        {loading ? "Creating account…" : "Create account"}
                    </button>
                </form>

                <p className="mt-6 text-sm text-muted text-center">
                    Already have an account?{" "}
                    <Link to="/login" className="text-primary hover:underline">
                        Login
                    </Link>
                </p>
            </div>
        </div>
    );
}
