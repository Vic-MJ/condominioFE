import React from 'react';
import BarraLateral from './BarraLateral';
import '../../features/chat/Chat.css';

const LayoutPrincipal = ({ children, alCambiarPagina, paginaActiva }) => {
    return (
        <div className="main-layout-container" style={{ display: 'flex', width: '100vw', minHeight: '100vh', backgroundColor: 'var(--bg-dark)' }}>
            <BarraLateral alCambiarPagina={alCambiarPagina} paginaActiva={paginaActiva} />
            <main style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                {children}
            </main>
        </div>
    );
};

export default LayoutPrincipal;
