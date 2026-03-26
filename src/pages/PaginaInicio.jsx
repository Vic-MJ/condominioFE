import React, { useState, useEffect } from 'react';
import LayoutPrincipal from '../components/layout/LayoutPrincipal';
import BotonNotificaciones from '../features/notificaciones/BotonNotificaciones';
import { User, Users, Megaphone, Wrench, DollarSign } from 'lucide-react';
import '../features/chat/Chat.css';
import './PaginaInicio.css';
import apiFetch from '../utils/api';

const PaginaInicio = ({ alCambiarPagina }) => {
    const [estadisticas, setEstadisticas] = useState({
        residentes: 0,
        anuncios: 0,
        mantenimientos: 0,
        pagos: 0,
        actividad: []
    });
    const [cargando, setCargando] = useState(true);
    const [usuarioActual, setUsuarioActual] = useState(null);

    useEffect(() => {
        const usuarioStorage = localStorage.getItem('usuario');
        if (usuarioStorage) {
            setUsuarioActual(JSON.parse(usuarioStorage));
        }

        const fetchEstadisticas = async () => {
            try {
                const response = await apiFetch('/estadisticas-inicio');
                const data = await response.json();
                setEstadisticas(data);
            } catch (error) {
                console.error('Error al obtener estadísticas:', error);
                if (error.message.includes('No autorizado') || error.message.includes('Unauthenticated')) {
                    alCambiarPagina('login');
                }
            } finally {
                setCargando(false);
            }
        };

        fetchEstadisticas();
    }, []);

    return (
        <LayoutPrincipal alCambiarPagina={alCambiarPagina} paginaActiva="inicio">
            <div className="inicio-page-container">
                <header className="top-header">
                    <h2 className="page-title">INICIO {cargando && <span style={{ fontSize: '0.8rem', color: '#64748b' }}>(Cargando...)</span>}</h2>

                    <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                        {!usuarioActual ? (
                            <>
                                <button
                                    onClick={() => alCambiarPagina('login')}
                                    style={{
                                        background: 'transparent', color: '#f8fafc', border: '1px solid #334155',
                                        padding: '8px 16px', borderRadius: '8px', cursor: 'pointer',
                                        fontWeight: '500', fontSize: '14px'
                                    }}
                                >
                                    Iniciar Sesión
                                </button>
                                <button
                                    onClick={() => alCambiarPagina('registro')}
                                    style={{
                                        background: '#2563eb', color: 'white', border: 'none',
                                        padding: '8px 16px', borderRadius: '8px', cursor: 'pointer',
                                        fontWeight: '600', fontSize: '14px'
                                    }}
                                >
                                    Registrarse
                                </button>
                            </>
                        ) : (
                            <>
                                <button
                                    onClick={() => {
                                        localStorage.removeItem('token');
                                        localStorage.removeItem('usuario');
                                        setUsuarioActual(null);
                                        alCambiarPagina('login');
                                    }}
                                    style={{
                                        background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', border: '1px solid rgba(239, 68, 68, 0.2)',
                                        padding: '8px 16px', borderRadius: '8px', cursor: 'pointer',
                                        fontWeight: '500', fontSize: '14px'
                                    }}
                                >
                                    Cerrar Sesión
                                </button>
                                <BotonNotificaciones alCambiarPagina={alCambiarPagina} />
                                <div className="user-profile-pill">
                                    <span style={{ color: '#f8fafc', fontWeight: 500 }}>{usuarioActual?.nombre || 'Usuario'}</span>
                                    <div style={{ width: 40, height: 40, background: '#cbd5e1', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0f172a', fontWeight: 'bold' }}>
                                        {(usuarioActual?.nombre?.substring(0, 2) || "U").toUpperCase()}
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </header>

                <div className="inicio-content">
                    <div className="tarjetas-grid">
                        <div className="tarjeta-estadistica">
                            <div className="tarjeta-header">
                                <span className="tarjeta-titulo">Total Residentes</span>
                                <div className="tarjeta-icono-contenedor icono-azul">
                                    <Users size={18} />
                                </div>
                            </div>
                            <span className="tarjeta-valor">{estadisticas.residentes}</span>
                        </div>

                        <div className="tarjeta-estadistica">
                            <div className="tarjeta-header">
                                <span className="tarjeta-titulo">Anuncios Activos</span>
                                <div className="tarjeta-icono-contenedor icono-verde">
                                    <Megaphone size={18} />
                                </div>
                            </div>
                            <span className="tarjeta-valor">{estadisticas.anuncios}</span>
                        </div>

                        <div className="tarjeta-estadistica">
                            <div className="tarjeta-header">
                                <span className="tarjeta-titulo">Mantenimientos</span>
                                <div className="tarjeta-icono-contenedor icono-naranja">
                                    <Wrench size={18} />
                                </div>
                            </div>
                            <span className="tarjeta-valor">{estadisticas.mantenimientos}</span>
                        </div>

                        <div className="tarjeta-estadistica">
                            <div className="tarjeta-header">
                                <span className="tarjeta-titulo">Pagos Pendientes</span>
                                <div className="tarjeta-icono-contenedor icono-rojo">
                                    <DollarSign size={18} />
                                </div>
                            </div>
                            <span className="tarjeta-valor">${Number(estadisticas.pagos || 0).toLocaleString()}</span>
                        </div>
                    </div>

                    <div className="actividad-reciente-contenedor">
                        <h3 className="actividad-titulo">Actividad Reciente</h3>

                        <div className="lista-actividad">
                            {estadisticas.actividad.length > 0 ? (
                                estadisticas.actividad.map((act, idx) => (
                                    <div className="item-actividad" key={idx}>
                                        <div className="punto-indicador"></div>
                                        <div className="detalles-actividad">
                                            <span className="titulo-actividad">{act.titulo}</span>
                                            <span className="descripcion-actividad">{act.descripcion}</span>
                                        </div>
                                        <span className="tiempo-actividad">{act.tiempo}</span>
                                    </div>
                                ))
                            ) : (
                                <p style={{ color: '#64748b', fontSize: '0.875rem' }}>No hay actividad reciente.</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </LayoutPrincipal>
    );
};

export default PaginaInicio;
