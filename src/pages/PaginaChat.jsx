import React from 'react';
import LayoutPrincipal from '../components/layout/LayoutPrincipal';
import ListaContactos from '../features/chat/ListaContactos';
import VentanaChat from '../features/chat/VentanaChat';
import BotonNotificaciones from '../features/notificaciones/BotonNotificaciones';
import { User } from 'lucide-react';
import '../features/chat/Chat.css';

const PaginaChat = ({ alCambiarPagina }) => {
    return (
        <LayoutPrincipal alCambiarPagina={alCambiarPagina} paginaActiva="chat">
            <div className="chat-page-container" style={{ flexDirection: 'column', height: '100vh' }}>
                <header className="top-header">
                    <h2 className="page-title">Chat</h2>

                    <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
                        <BotonNotificaciones />

                        <div className="user-profile-pill">
                            <span style={{ color: '#f8fafc', fontWeight: 500 }}>Victor Montaño</span>
                            <div style={{ width: 40, height: 40, background: '#cbd5e1', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <User size={24} color="#0f172a" />
                            </div>
                        </div>
                    </div>
                </header>

                <div className="chat-content-grid">
                    <ListaContactos />
                    <VentanaChat />
                </div>
            </div>
        </LayoutPrincipal>
    );
};

export default PaginaChat;
