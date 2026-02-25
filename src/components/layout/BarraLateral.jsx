import React from 'react';
import { Home, Users, MessageSquare, Calendar, Settings, LogOut } from 'lucide-react';
import '../../features/chat/Chat.css';

const BarraLateral = ({ alCambiarPagina, paginaActiva }) => {
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
                />
                <ItemBarraLateral
                    icon={<Users size={22} />}
                    label="Residentes"
                    active={paginaActiva === 'residentes'}
                    onClick={() => alCambiarPagina('residentes')}
                />
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
                />
            </nav>

            <div className="sidebar-footer">
                <ItemBarraLateral icon={<Settings size={22} />} label="Configuración" />
                <ItemBarraLateral icon={<LogOut size={22} />} label="Cerrar Sesión" />
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
