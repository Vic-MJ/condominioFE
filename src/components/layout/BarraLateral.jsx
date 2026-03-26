import React, { useEffect, useState } from 'react';
import { Home, Users, MessageSquare, Calendar, Settings, LogOut, UserPlus, ClipboardList, CreditCard } from 'lucide-react';
import '../../features/chat/Chat.css';

const BarraLateral = ({ alCambiarPagina, paginaActiva }) => {
    const [esAdmin, setEsAdmin] = useState(false);

    useEffect(() => {
        const strUsuario = localStorage.getItem('usuario');
        if (strUsuario) {
            try {
                const usuarioData = JSON.parse(strUsuario);
                if (usuarioData?.rol === 'Administrador') {
                    setEsAdmin(true);
                }
            } catch (e) {
                console.error(e);
            }
        }
    }, []);

    return (
        <aside className="sidebar">
            <div className="sidebar-header">
                <h2 className="logo-text">Vecind-App</h2>
            </div>

            <nav className="sidebar-nav">
                <ItemBarraLateral
                    icon={<Home size={22} />}
                    label="Inicio"
                    active={paginaActiva === 'inicio'}
                    onClick={() => alCambiarPagina('inicio')}
                />
                {esAdmin && (
                    <ItemBarraLateral
                        icon={<Users size={22} />}
                        label="Residentes"
                        active={paginaActiva === 'residentes'}
                        onClick={() => alCambiarPagina('residentes')}
                    />
                )}
                <ItemBarraLateral
                    icon={<MessageSquare size={22} />}
                    label="Chat"
                    active={paginaActiva === 'chat'}
                    onClick={() => alCambiarPagina('chat')}
                />
                <ItemBarraLateral
                    icon={<Calendar size={22} />}
                    label="Eventos"
                    active={paginaActiva === 'eventos'}
                    onClick={() => alCambiarPagina('eventos')}
                />
                <ItemBarraLateral
                    icon={<ClipboardList size={22} />}
                    label="Áreas Públicas"
                    active={paginaActiva === 'peticiones'}
                    onClick={() => alCambiarPagina('peticiones')}
                />
                <ItemBarraLateral
                    icon={<CreditCard size={22} />}
                    label="Pagos y Adeudos"
                    active={paginaActiva === 'pagos'}
                    onClick={() => alCambiarPagina('pagos')}
                />
            </nav>

            <div className="sidebar-footer">
                {esAdmin && (
                    <ItemBarraLateral
                        icon={<UserPlus size={22} />}
                        label="Crear Cuenta"
                        active={paginaActiva === 'registro'}
                        onClick={() => alCambiarPagina('registro')}
                    />
                )}
                <ItemBarraLateral 
                    icon={<Settings size={22} />} 
                    label="Configuración" 
                    active={paginaActiva === 'configuracion'}
                    onClick={() => alCambiarPagina('configuracion')}
                />
                <ItemBarraLateral 
                    icon={<LogOut size={22} />} 
                    label="Cerrar Sesión" 
                    onClick={() => {
                        localStorage.removeItem('token');
                        localStorage.removeItem('usuario');
                        alCambiarPagina('login');
                    }}
                />
            </div>
        </aside>
    );
};

const ItemBarraLateral = ({ icon, label, active, onClick }) => {
    return (
        <div className={`nav-item ${active ? 'active' : ''}`} onClick={onClick} style={{ cursor: 'pointer' }}>
            <span className="nav-icon">{icon}</span>
            <span className="nav-label">{label}</span>
        </div>
    );
};

export default BarraLateral;
