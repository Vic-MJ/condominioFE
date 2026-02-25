import React, { useState } from 'react';
import LayoutPrincipal from '../components/layout/LayoutPrincipal';
import BotonCargando from '../components/ui/BotonCargando';
import AlertaResultado from '../components/ui/AlertaResultado';
import usePeticion from '../hooks/usePeticion';
import BotonNotificaciones from '../features/notificaciones/BotonNotificaciones';
import { UserPlus, Search, Edit2, Trash2, User } from 'lucide-react';

const PaginaResidentes = ({ alCambiarPagina }) => {
    const { ejecutar, cargando, resultado, limpiarEstado } = usePeticion();
    const [busqueda, setBusqueda] = useState("");

    const residentesIniciales = [
        { id: 1, nombre: "Claudia Sheimbaun", apartamento: "301", email: "clau.chein@gmail.com", telefono: "33 22658741", estado: "Activo" },
        { id: 2, nombre: "María González", apartamento: "502", email: "maria.gonzalez@gmail.com", telefono: "3326987451", estado: "Activo" },
        { id: 3, nombre: "Carlos López", apartamento: "104", email: "carlos.lopez@gmail.com", telefono: "33 6598 7854", estado: "Inactivo" },
    ];

    const [residentes, setResidentes] = useState(residentesIniciales);

    const manejarNuevoResidente = async () => {
        const promesa = new Promise((resolve) => {
            setTimeout(() => {
                resolve("Formulario de registro abierto correctamente.");
            }, 1000);
        });
        await ejecutar(promesa);
    };

    const manejarBorrar = async (id) => {
        const promesa = new Promise((resolve) => {
            setTimeout(() => {
                setResidentes(prev => prev.filter(r => r.id !== id));
                resolve("Residente eliminado con éxito.");
            }, 1500);
        });
        await ejecutar(promesa);
    };

    const residentesFiltrados = residentes.filter(r =>
        r.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
        r.apartamento.includes(busqueda) ||
        r.email.toLowerCase().includes(busqueda.toLowerCase())
    );

    return (
        <LayoutPrincipal alCambiarPagina={alCambiarPagina} paginaActiva="residentes">
            <div className="chat-page-container" style={{ flexDirection: 'column', height: '100vh' }}>
                <header className="top-header">
                    <h2 className="page-title">Residentes</h2>

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

                <div style={{ padding: '2rem', flex: 1, overflowY: 'auto' }}>
                    <div className="gestion-container" style={{
                        background: '#1e293b',
                        borderRadius: '12px',
                        border: '1px solid #334155',
                        padding: '1.5rem',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                            <h3 style={{ fontSize: '1.1rem', color: '#f8fafc', margin: 0 }}>Gestión de Residentes</h3>
                            <BotonCargando
                                alClick={manejarNuevoResidente}
                                cargando={cargando && resultado === null}
                                tipo="boton-primario"
                                style={{ backgroundColor: '#2563eb', padding: '8px 16px' }}
                            >
                                <UserPlus size={18} />
                                <span>Nuevo Residente</span>
                            </BotonCargando>
                        </div>

                        <div style={{ position: 'relative', marginBottom: '1.5rem' }}>
                            <Search size={18} color="#64748b" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                            <input
                                type="text"
                                placeholder="Buscar por nombre, apartamento o email..."
                                value={busqueda}
                                onChange={(e) => setBusqueda(e.target.value)}
                                style={{
                                    width: '100%',
                                    padding: '10px 10px 10px 40px',
                                    background: '#0f172a',
                                    border: '1px solid #334155',
                                    borderRadius: '8px',
                                    color: '#f8fafc',
                                    fontSize: '14px'
                                }}
                            />
                        </div>

                        <div style={{ overflowX: 'auto' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse', color: '#f8fafc', fontSize: '14px' }}>
                                <thead>
                                    <tr style={{ borderBottom: '1px solid #334155', textAlign: 'left' }}>
                                        <th style={{ padding: '12px', color: '#94a3b8', fontWeight: 500 }}>Nombre</th>
                                        <th style={{ padding: '12px', color: '#94a3b8', fontWeight: 500 }}>Apartamento</th>
                                        <th style={{ padding: '12px', color: '#94a3b8', fontWeight: 500 }}>Email</th>
                                        <th style={{ padding: '12px', color: '#94a3b8', fontWeight: 500 }}>Teléfono</th>
                                        <th style={{ padding: '12px', color: '#94a3b8', fontWeight: 500 }}>Estado</th>
                                        <th style={{ padding: '12px', color: '#94a3b8', fontWeight: 500, textAlign: 'center' }}>Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {residentesFiltrados.map(r => (
                                        <tr key={r.id} style={{ borderBottom: '1px solid #334155' }}>
                                            <td style={{ padding: '16px 12px', fontWeight: 500 }}>{r.nombre}</td>
                                            <td style={{ padding: '16px 12px', color: '#94a3b8' }}>{r.apartamento}</td>
                                            <td style={{ padding: '16px 12px', color: '#94a3b8' }}>{r.email}</td>
                                            <td style={{ padding: '16px 12px', color: '#94a3b8' }}>{r.telefono}</td>
                                            <td style={{ padding: '16px 12px' }}>
                                                <span style={{
                                                    padding: '2px 10px',
                                                    borderRadius: '12px',
                                                    fontSize: '11px',
                                                    fontWeight: 600,
                                                    background: r.estado === 'Activo' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(71, 85, 105, 0.4)',
                                                    color: r.estado === 'Activo' ? '#10b981' : '#94a3b8'
                                                }}>
                                                    {r.estado}
                                                </span>
                                            </td>
                                            <td style={{ padding: '16px 12px', textAlign: 'center' }}>
                                                <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
                                                    <Edit2 size={16} color="#94a3b8" style={{ cursor: 'pointer' }} />
                                                    <Trash2
                                                        size={16}
                                                        color="#ef4444"
                                                        style={{ cursor: 'pointer', opacity: cargando ? 0.5 : 1 }}
                                                        onClick={() => manejarBorrar(r.id)}
                                                    />
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                <AlertaResultado
                    resultado={resultado}
                    alCerrar={limpiarEstado}
                />
            </div>
        </LayoutPrincipal>
    );
};

export default PaginaResidentes;
