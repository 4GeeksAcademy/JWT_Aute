import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer";
 
export const Private = () => {
    const navigate = useNavigate();
    const { store, dispatch } = useGlobalReducer();
    const [validating, setValidating] = useState(true);
    const [validUser, setValidUser] = useState(null);
 
    useEffect(() => {
        const token = sessionStorage.getItem("token");
 
        if (!token) {
            navigate("/login");
            return;
        }
 
        fetch(`${import.meta.env.VITE_BACKEND_URL}/api/validate-token`, {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then((res) => {
                if (!res.ok) throw new Error("Token inválido");
                return res.json();
            })
            .then((data) => {
                setValidUser(data.user);
                setValidating(false);
            })
            .catch(() => {
                dispatch({ type: "logout" });
                navigate("/login");
            });
    }, []);
 
    function handleLogout() {
        dispatch({ type: "logout" });
        navigate("/login");
    }
 
    if (validating) {
        return (
            <div style={styles.centered}>
                <p style={{ color: "#666" }}>Verificando sesión...</p>
            </div>
        );
    }
 
    return (
        <div style={styles.page}>
            <div style={styles.main}>
                <div style={styles.welcomeCard}>
                    <div style={styles.avatar}>
                        {validUser?.email?.[0]?.toUpperCase() ?? "U"}
                    </div>
                    <h1 style={styles.title}>¡Hola, {validUser?.email}!</h1>
                    <p style={styles.subtitle}>Has accedido correctamente al área privada.</p>
                    <button onClick={handleLogout} style={styles.logoutBtn}>
                        Cerrar sesión
                    </button>
                </div>
 
                
                </div>
            </div>
    );
};
 
const styles = {
    page: { minHeight: "80vh", background: "#f5f5f0" },
    centered: { minHeight: "80vh", display: "flex", alignItems: "center", justifyContent: "center" },
    main: { maxWidth: "800px", margin: "0 auto", padding: "3rem 1.5rem" },
    welcomeCard: { background: "#fff", borderRadius: "12px", border: "1px solid #e8e8e0", padding: "2.5rem", textAlign: "center", marginBottom: "1.5rem" },
    avatar: { width: "72px", height: "72px", borderRadius: "50%", background: "#111", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "2rem", fontWeight: 700, margin: "0 auto 1.25rem" },
    title: { margin: "0 0 0.5rem", fontSize: "1.6rem", fontWeight: 700, color: "#111" },
    subtitle: { margin: "0 0 1.5rem", color: "#666", fontSize: "1rem" },
    logoutBtn: { padding: "0.6rem 1.5rem", borderRadius: "8px", background: "#111", color: "#fff", fontSize: "0.95rem", fontWeight: 600, border: "none", cursor: "pointer" },
    infoGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "1rem" },
    infoCard: { background: "#fff", borderRadius: "12px", border: "1px solid #e8e8e0", padding: "1.5rem" },
    infoTitle: { margin: "0 0 0.5rem", fontSize: "1rem", fontWeight: 700, color: "#111" },
    infoText: { margin: 0, fontSize: "0.9rem", color: "#666", lineHeight: 1.6 },
};