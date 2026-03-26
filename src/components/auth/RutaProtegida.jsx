import React, { useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';


const RutaProtegida = ({ children, alCambiarPagina, rolRequerido, protegida = true }) => {
    const { usuario, token, cargando } = useAuth();

    useEffect(() => {
        if (cargando) return;

        if (protegida && !token) {
            console.log('Middleware: Acceso restringido. Redirigiendo a login...');
            alCambiarPagina('login');
            return;
        }

        if (rolRequerido && usuario?.rol !== rolRequerido) {
            console.warn(`Middleware: Rol '${rolRequerido}' requerido. Redirigiendo a inicio...`);
            alCambiarPagina('inicio');
            return;
        }

    }, [cargando, token, usuario, rolRequerido, protegida, alCambiarPagina]);

    if (cargando) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#0f172a', color: 'white' }}>
                <p>Cargando sesión...</p>
            </div>
        );
    }

    return <>{children}</>;
};

export default RutaProtegida;
