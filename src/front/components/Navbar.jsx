import { Link, useNavigate } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer";
 
export const Navbar = () => {
    const navigate = useNavigate();
    const { store, dispatch } = useGlobalReducer();
 
    function handleLogout() {
        dispatch({ type: "logout" });
        navigate("/login");
    }
 
    return (
        <nav style={styles.nav}>
            <Link to="/" style={styles.brand}>🔐 JWT Auth</Link>
 
            <div style={styles.links}>
                {store.token ? (
                    <>
                        <Link to="/private" style={styles.link}>Área privada</Link>
                        <button onClick={handleLogout} style={styles.logoutBtn}>
                            Cerrar sesión
                        </button>
                    </>
                ) : (
                    <>
                        <Link to="/login" style={styles.link}>Iniciar sesión</Link>
                        <Link to="/signup" style={styles.linkBtn}>Registrarse</Link>
                    </>
                )}
            </div>
        </nav>
    );
};
 
const styles = {
    nav: { display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 2rem", height: "60px", background: "#fff", borderBottom: "1px solid #e8e8e0" },
    brand: { fontWeight: 700, fontSize: "1.1rem", color: "#111", textDecoration: "none" },
    links: { display: "flex", alignItems: "center", gap: "1rem" },
    link: { fontSize: "0.9rem", color: "#333", textDecoration: "none", fontWeight: 500 },
    linkBtn: { fontSize: "0.875rem", fontWeight: 600, color: "#fff", background: "#111", padding: "0.4rem 1rem", borderRadius: "8px", textDecoration: "none" },
    logoutBtn: { fontSize: "0.875rem", fontWeight: 600, color: "#333", background: "transparent", border: "1.5px solid #ddd", padding: "0.4rem 1rem", borderRadius: "8px", cursor: "pointer" },
};