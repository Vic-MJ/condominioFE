import React, { useState, useEffect } from 'react';
import { Bell, MessageSquare, AlertTriangle, Users, CreditCard } from 'lucide-react';
import servicioSocket from '../../services/servicioSocket';

const BotonNotificaciones = () => {
    const [notificaciones, setNotificaciones] = useState([]);
    const [mostrarLista, setMostrarLista] = useState(false);
    const [noLeidas, setNoLeidas] = useState(0);

    useEffect(() => {
        const socket = servicioSocket.conectar();

        servicioSocket.unirseSala("chat_admin");

        const manejarNuevaNotificacion = (datos) => {
            console.log("Nueva notificación recibida:", datos);
            const nuevaNoti = {
                id: Date.now(),
                ...datos,
                leida: false,
                fecha: new Date().toLocaleTimeString()
            };
            setNotificaciones(prev => [nuevaNoti, ...prev]);
            setNoLeidas(prev => prev + 1);
        };

        servicioSocket.alRecibirNotificacion(manejarNuevaNotificacion);

        return () => {
            servicioSocket.desuscribirNotificacion();
        };
    }, []);

    const toggleLista = () => {
        setMostrarLista(!mostrarLista);
        if (!mostrarLista) {
            setNoLeidas(0);
        }
    };

    const obtenerIcono = (tipo) => {
        switch (tipo) {
            case 'mensaje': return <MessageSquare size={16} color="#3b82f6" />;
            case 'multa': return <AlertTriangle size={16} color="#ef4444" />;
            case 'asamblea': return <Users size={16} color="#8b5cf6" />;
            case 'pago_atrasado': return <CreditCard size={16} color="#f59e0b" />;
            default: return <Bell size={16} color="#94a3b8" />;
        }
    };

    const manejarClickNotificacion = (noti) => {
        console.log("Navegando a detalle de:", noti);
        setMostrarLista(false);
    };

    return (
        <div style={{ position: 'relative' }}>
            <div
                className="notification-bell-container"
                onClick={toggleLista}
                style={{ cursor: 'pointer', position: 'relative', padding: '8px', borderRadius: '50%', transition: 'background 0.2s' }}
            >
                <Bell size={24} color="#f8fafc" />
                {noLeidas > 0 && (
                    <div style={{
                        position: 'absolute',
                        top: '5px',
                        right: '5px',
                        width: '18px',
                        height: '18px',
                        background: '#ef4444',
                        color: 'white',
                        borderRadius: '50%',
                        fontSize: '10px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 'bold',
                        border: '2px solid var(--bg-header)'
                    }}>
                        {noLeidas}
                    </div>
                )}
            </div>

            {mostrarLista && (
                <div className="notificaciones-dropdown" style={{
                    position: 'absolute',
                    top: '50px',
                    right: '0',
                    width: '320px',
                    maxHeight: '400px',
                    background: '#1e293b',
                    borderRadius: '12px',
                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.5), 0 4px 6px -2px rgba(0, 0, 0, 0.5)',
                    zIndex: 1000,
                    overflow: 'hidden',
                    border: '1px solid #334155'
                }}>
                    <div style={{ padding: '12px 16px', borderBottom: '1px solid #334155', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <h3 style={{ margin: 0, fontSize: '14px', color: '#f8fafc' }}>Notificaciones</h3>
                        <span style={{ fontSize: '12px', color: '#94a3b8', cursor: 'pointer' }}>Marcar todo como leído</span>
                    </div>

                    <div style={{ overflowY: 'auto', maxHeight: '340px' }}>
                        {notificaciones.length === 0 ? (
                            <div style={{ padding: '20px', textAlign: 'center', color: '#94a3b8', fontSize: '13px' }}>
                                No hay nuevas notificaciones
                            </div>
                        ) : (
                            notificaciones.map(noti => (
                                <div
                                    key={noti.id}
                                    onClick={() => manejarClickNotificacion(noti)}
                                    style={{
                                        padding: '12px 16px',
                                        borderBottom: '1px solid #334155',
                                        cursor: 'pointer',
                                        transition: 'background 0.2s',
                                        display: 'flex',
                                        gap: '12px',
                                        backgroundColor: noti.leida ? 'transparent' : 'rgba(59, 130, 246, 0.05)'
                                    }}
                                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#334155'}
                                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = noti.leida ? 'transparent' : 'rgba(59, 130, 246, 0.05)'}
                                >
                                    <div style={{
                                        width: '32px',
                                        height: '32px',
                                        borderRadius: '8px',
                                        background: '#0f172a',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        flexShrink: 0
                                    }}>
                                        {obtenerIcono(noti.tipo)}
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ fontSize: '13px', color: '#f8fafc', marginBottom: '2px', lineHeight: '1.4' }}>
                                            {noti.contenido}
                                        </div>
                                        <div style={{ fontSize: '11px', color: '#64748b' }}>
                                            {noti.fecha}
                                        </div>
                                    </div>
                                    {!noti.leida && (
                                        <div style={{ width: '8px', height: '8px', background: '#3b82f6', borderRadius: '50%', marginTop: '6px' }}></div>
                                    )}
                                </div>
                            ))
                        )}
                    </div>

                    <div style={{ padding: '10px', textAlign: 'center', borderTop: '1px solid #334155', background: '#0f172a' }}>
                        <span style={{ fontSize: '12px', color: '#3b82f6', fontWeight: 500, cursor: 'pointer' }}>Ver toda la actividad</span>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BotonNotificaciones;
