import { useState, useEffect } from 'react';
export const useAuth = () => {
    const [usuario, setUsuario] = useState(null);
    const [token, setToken] = useState(null);
    const [cargando, setCargando] = useState(true);

    useEffect(() => {
        const cargarSesion = () => {
            const tokenGuardado = localStorage.getItem('token');
            const usuarioGuardado = localStorage.getItem('usuario');

            if (tokenGuardado && usuarioGuardado) {
                try {
                    setToken(tokenGuardado);
                    setUsuario(JSON.parse(usuarioGuardado));
                } catch (error) {
                    console.error('Error al parsear el usuario:', error);
                    localStorage.removeItem('token');
                    localStorage.removeItem('usuario');
                }
            }
            setCargando(false);
        };

        cargarSesion();
    }, []);

    const cerrarSesion = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('usuario');
        setToken(null);
        setUsuario(null);
    };

    const esAdmin = usuario?.rol === 'Administrador';

    return { usuario, token, cargando, cerrarSesion, esAdmin };
};
