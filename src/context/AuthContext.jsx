import { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('token'));

  const [usuario, setUsuario] = useState(() => {
    try {
      const storedUser = localStorage.getItem('usuario');
      const parsedUser = storedUser && storedUser !== "undefined" ? JSON.parse(storedUser) : null;
      if (!parsedUser) return null;
      const { rol_id, ...rest } = parsedUser;
      return { ...rest, rol: Number(parsedUser.rol ?? rol_id) };
    } catch (error) {
      console.error("Error al parsear usuario:", error);
      return null;
    }
  });

  const login = ({ token, usuario }) => {
    const { rol_id, ...rest } = usuario;
    const usuarioConRol = { ...rest, rol: Number(usuario.rol ?? rol_id) };
    setToken(token);
    setUsuario(usuarioConRol);
    localStorage.setItem('token', token);
    localStorage.setItem('usuario', JSON.stringify(usuarioConRol));
  };

  const logout = () => {
    setToken(null);
    setUsuario(null);
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
  };

  return (
    <AuthContext.Provider value={{ token, usuario, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
