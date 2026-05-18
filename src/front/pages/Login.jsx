import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer";
 
export const Login = () => {
    const navigate = useNavigate();
    const { dispatch } = useGlobalReducer();
    const [form, setForm] = useState({ email: "", password: "" });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
 
    function handleChange(e) {
        setForm({ ...form, [e.target.name]: e.target.value });
        setError("");
    }
 
    async function handleSubmit(e) {
        e.preventDefault();
        setLoading(true);
        setError("");
 
        try {
            const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });
            const data = await res.json();
 
            if (!res.ok) {
                setError(data.msg || "Credenciales inválidas");
                return;
            }
 
            dispatch({ type: "login", payload: { token: data.token, user: data.user } });
            navigate("/private");
        } catch {
            setError("Error de conexión con el servidor");
        } finally {
            setLoading(false);
        }
    }
 
    return (
        <div style={styles.page}>
            <div style={styles.card}>
                <h1 style={styles.title}>Bienvenido de nuevo</h1>
                <p style={styles.subtitle}>Ingresa tus credenciales para continuar</p>
 
                {error && <div style={styles.errorBox}>{error}</div>}
 
                <form onSubmit={handleSubmit} style={styles.form}>
                    <label style={styles.label}>Correo electrónico</label>
                    <input
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        placeholder="tu@correo.com"
                        required
                        style={styles.input}
                    />
 
                    <label style={styles.label}>Contraseña</label>
                    <input
                        type="password"
                        name="password"
                        value={form.password}
                        onChange={handleChange}
                        placeholder="Tu contraseña"
                        required
                        style={styles.input}
                    />
 
                    <button type="submit" disabled={loading} style={styles.button}>
                        {loading ? "Verificando..." : "Iniciar sesión"}
                    </button>
                </form>
 
                <p style={styles.footer}>
                    ¿No tienes cuenta?{" "}
                    <Link to="/signup" style={styles.link}>Regístrate</Link>
                </p>
            </div>
        </div>
    );
};
 
const styles = {
    page: { minHeight: "80vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem" },
    card: { background: "#fff", borderRadius: "12px", border: "1px solid #e8e8e0", padding: "2.5rem", width: "100%", maxWidth: "420px" },
    title: { margin: "0 0 0.25rem", fontSize: "1.6rem", fontWeight: 700, color: "#111" },
    subtitle: { margin: "0 0 1.75rem", color: "#888", fontSize: "0.95rem" },
    form: { display: "flex", flexDirection: "column", gap: "0.75rem" },
    label: { fontSize: "0.875rem", fontWeight: 600, color: "#333" },
    input: { padding: "0.65rem 0.875rem", borderRadius: "8px", border: "1.5px solid #ddd", fontSize: "1rem" },
    button: { marginTop: "0.5rem", padding: "0.75rem", borderRadius: "8px", background: "#111", color: "#fff", fontSize: "1rem", fontWeight: 600, border: "none", cursor: "pointer" },
    errorBox: { background: "#fff0f0", border: "1px solid #f5c6c6", color: "#c0392b", borderRadius: "8px", padding: "0.65rem 1rem", fontSize: "0.9rem", marginBottom: "1rem" },
    footer: { marginTop: "1.25rem", textAlign: "center", fontSize: "0.9rem", color: "#666" },
    link: { color: "#111", fontWeight: 600, textDecoration: "underline" },
};