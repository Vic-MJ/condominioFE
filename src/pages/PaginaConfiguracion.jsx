import React, { useState, useEffect } from 'react';
import LayoutPrincipal from '../components/layout/LayoutPrincipal';
import BotonNotificaciones from '../features/notificaciones/BotonNotificaciones';
import apiFetch from '../utils/api';
import AlertaResultado from '../components/ui/AlertaResultado';
import { Trash2, Shield, User, AlertTriangle, Lock } from 'lucide-react';

const PaginaConfiguracion = ({ alCambiarPagina }) => {
    const [usuarios, setUsuarios] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [usuarioActual, setUsuarioActual] = useState(null);
    
    const [tipoAlerta, setTipoAlerta] = useState('');
    const [mensajeAlerta, setMensajeAlerta] = useState('');

    const [datosContraseña, setDatosContraseña] = useState({
        contraseña_actual: '',
        nueva_contraseña: '',
        nueva_contraseña_confirmation: ''
    });

    useEffect(() => {
        const usuarioStorage = localStorage.getItem('usuario');
        if (usuarioStorage) {
            setUsuarioActual(JSON.parse(usuarioStorage));
        }

        const cargarUsuarios = async () => {
            try {
                const res = await apiFetch('/usuarios');
                const data = await res.json();
                if (Array.isArray(data)) {
                    setUsuarios(data);
                } else {
                    setUsuarios([]);
                }
            } catch (error) {
                setUsuarios([]);
                console.error("Error al cargar usuarios:", error);
                setTipoAlerta('error');
                setMensajeAlerta('No se pudieron cargar los usuarios. Verifica tu conexión.');
            } finally {
                setCargando(false);
            }
        };

        cargarUsuarios();
    }, []);

    const alCambiarDatosContraseña = (e) => {
        setDatosContraseña({
            ...datosContraseña,
            [e.target.name]: e.target.value
        });
    };

    const actualizarContraseña = async (e) => {
        e.preventDefault();
        
        try {
            setCargando(true);
            const res = await apiFetch('/cambiar-contraseña', {
                method: 'POST',
                body: JSON.stringify(datosContraseña)
            });
            
            const data = await res.json();
            
            if (!res.ok) {
                throw new Error(data.mensaje || data.error || "No se pudo actualizar la contraseña.");
            }

            setTipoAlerta('exito');
            setMensajeAlerta(data.mensaje);
            setDatosContraseña({
                contraseña_actual: '',
                nueva_contraseña: '',
                nueva_contraseña_confirmation: ''
            });

            setTimeout(() => {
                localStorage.removeItem('token');
                localStorage.removeItem('usuario');
                alCambiarPagina('login');
            }, 2500);

        } catch (error) {
            setTipoAlerta('error');
            setMensajeAlerta(error.message);
        } finally {
            setCargando(false);
        }
    };

    const eliminarUsuario = async (id, nombre) => {
        if (!window.confirm(`¿Estás completamente seguro de que deseas ELIMINAR el usuario ${nombre}? Esta acción no se puede deshacer y borrará todo su historial, mensajes y notificaciones.`)) {
            return;
        }

        try {
            setCargando(true);
            const res = await apiFetch(`/usuarios/${id}`, { method: 'DELETE' });
            
            if (!res.ok) {
                const dataError = await res.json();
                throw new Error(dataError.mensaje || dataError.error || "No se pudo eliminar el usuario.");
            }

            setUsuarios(prev => prev.filter(u => u.id !== id));
            setTipoAlerta('exito');
            setMensajeAlerta(`El usuario ${nombre} ha sido eliminado correctamente.`);
            
        } catch (error) {
            setTipoAlerta('error');
            setMensajeAlerta(error.message);
        } finally {
            setCargando(false);
        }
    };

    return (
        <LayoutPrincipal alCambiarPagina={alCambiarPagina} paginaActiva="configuracion">
            <div className="table-page-container" style={{ padding: '2rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                
                <header className="top-header" style={{ marginBottom: '2rem' }}>
                    <h2 className="page-title">Configuración del Sistema</h2>

                    <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
                        <BotonNotificaciones alCambiarPagina={alCambiarPagina} />

                        {usuarioActual && (
                            <div className="user-profile-pill">
                                <span style={{ color: '#f8fafc', fontWeight: 500 }}>{usuarioActual?.nombre || 'Usuario'}</span>
                                <div style={{ width: 40, height: 40, background: '#cbd5e1', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0f172a', fontWeight: 'bold' }}>
                                    {(usuarioActual?.nombre?.substring(0, 2) || "U").toUpperCase()}
                                </div>
                            </div>
                        )}
                    </div>
                </header>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', flex: 1, overflowY: 'auto' }}>
                    <div className="card-modulo" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <div style={{ padding: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                            <h3 style={{ margin: 0, color: 'white', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <Lock color="#60a5fa" /> Seguridad de la Cuenta
                            </h3>
                            <p style={{ margin: '0.5rem 0 0 0', color: '#94a3b8', fontSize: '0.9rem' }}>
                                Cambia tu contraseña periódicamente para mantener tu cuenta segura.
                            </p>
                        </div>

                        <form onSubmit={actualizarContraseña} style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                            <div className="form-group-config">
                                <label style={{ display: 'block', color: '#94a3b8', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Contraseña Actual</label>
                                <input
                                    required
                                    type="password"
                                    name="contraseña_actual"
                                    value={datosContraseña.contraseña_actual}
                                    onChange={alCambiarDatosContraseña}
                                    style={{ width: '100%', padding: '12px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: 'white' }}
                                    placeholder="••••••••"
                                />
                            </div>

                            <div className="form-group-config">
                                <label style={{ display: 'block', color: '#94a3b8', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Nueva Contraseña</label>
                                <input
                                    required
                                    type="password"
                                    name="nueva_contraseña"
                                    value={datosContraseña.nueva_contraseña}
                                    onChange={alCambiarDatosContraseña}
                                    style={{ width: '100%', padding: '12px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: 'white' }}
                                    placeholder="Mínimo 8 caracteres"
                                />
                            </div>

                            <div className="form-group-config">
                                <label style={{ display: 'block', color: '#94a3b8', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Confirmar Nueva Contraseña</label>
                                <input
                                    required
                                    type="password"
                                    name="nueva_contraseña_confirmation"
                                    value={datosContraseña.nueva_contraseña_confirmation}
                                    onChange={alCambiarDatosContraseña}
                                    style={{ width: '100%', padding: '12px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: 'white' }}
                                    placeholder="Repite tu nueva contraseña"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={cargando}
                                style={{
                                    marginTop: '0.5rem',
                                    padding: '12px',
                                    background: '#2563eb',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '8px',
                                    fontWeight: 'bold',
                                    cursor: cargando ? 'not-allowed' : 'pointer',
                                    opacity: cargando ? 0.7 : 1,
                                    boxShadow: '0 4px 10px rgba(37, 99, 235, 0.2)',
                                    transition: 'all 0.2s'
                                }}
                            >
                                {cargando ? 'Actualizando...' : 'Actualizar Contraseña'}
                            </button>
                            
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(245, 158, 11, 0.05)', padding: '12px', borderRadius: '8px', border: '1px solid rgba(245, 158, 11, 0.1)', marginTop: '0.5rem' }}>
                                <AlertTriangle size={20} color="#f59e0b" style={{ flexShrink: 0 }} />
                                <span style={{ fontSize: '0.8rem', color: '#f59e0b' }}>
                                    Importante: Se cerrará la sesión en todos tus dispositivos por seguridad.
                                </span>
                            </div>
                        </form>
                    </div>

                    {usuarioActual?.rol === 'Administrador' && (
                        <div className="card-modulo" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <div style={{ padding: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                <h3 style={{ margin: 0, color: 'white', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <Shield color="#3b82f6" /> Gestión de Usuarios y Accesos
                                </h3>
                                <p style={{ margin: '0.5rem 0 0 0', color: '#94a3b8', fontSize: '0.9rem' }}>
                                    Administra los residentes y administradores dados de alta en el sistema. 
                                </p>
                            </div>

                            <div style={{ flex: 1, padding: '0 1.5rem 1.5rem 1.5rem', overflowY: 'auto' }}>
                                {cargando && !usuarios.length ? (
                                    <div style={{ color: '#94a3b8', textAlign: 'center', padding: '2rem' }}>Generando lista de usuarios...</div>
                                ) : usuarios.length === 0 ? (
                                    <div style={{ color: '#94a3b8', textAlign: 'center', padding: '2rem' }}>No hay usuarios en la base de datos.</div>
                                ) : (
                                    <table style={{ width: '100%', borderCollapse: 'collapse', color: '#cbd5e1' }}>
                                        <thead>
                                            <tr style={{ background: 'rgba(255,255,255,0.02)', textAlign: 'left' }}>
                                                <th style={{ padding: '1rem', borderBottom: '1px solid rgba(255,255,255,0.05)', fontWeight: '600' }}>Usuario</th>
                                                <th style={{ padding: '1rem', borderBottom: '1px solid rgba(255,255,255,0.05)', fontWeight: '600' }}>Rol</th>
                                                <th style={{ padding: '1rem', borderBottom: '1px solid rgba(255,255,255,0.05)', fontWeight: '600', textAlign: 'center' }}>Acciones</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {usuarios.map(u => (
                                                <tr key={u.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.02)' }}>
                                                    <td style={{ padding: '1rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                        <div style={{ width: 35, height: 35, borderRadius: '50%', background: u.color || '#334155', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '0.85rem' }}>
                                                            {u.avatar}
                                                        </div>
                                                        <span style={{ color: '#f8fafc', fontWeight: 500 }}>{u.nombre}</span>
                                                        {u.es_yo && <span style={{ background: 'rgba(59, 130, 246, 0.2)', color: '#60a5fa', padding: '2px 8px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 'bold' }}>Tú</span>}
                                                    </td>
                                                    <td style={{ padding: '1rem' }}>
                                                        <span style={{ 
                                                            display: 'inline-flex', alignItems: 'center', gap: '6px',
                                                            background: u.rol === 'Administrador' ? 'rgba(139, 92, 246, 0.1)' : 'rgba(52, 211, 153, 0.1)',
                                                            color: u.rol === 'Administrador' ? '#a78bfa' : '#34d399',
                                                            padding: '4px 10px', borderRadius: '6px', fontSize: '0.85rem', fontWeight: 500
                                                        }}>
                                                            {u.rol === 'Administrador' ? <Shield size={14} /> : <User size={14} />}
                                                            {u.rol}
                                                        </span>
                                                    </td>
                                                    <td style={{ padding: '1rem', textAlign: 'center' }}>
                                                        <button
                                                            onClick={() => eliminarUsuario(u.id, u.nombre)}
                                                            disabled={u.es_yo}
                                                            style={{
                                                                background: u.es_yo ? 'rgba(255, 255, 255, 0.05)' : 'rgba(239, 68, 68, 0.1)',
                                                                color: u.es_yo ? '#64748b' : '#ef4444',
                                                                border: '1px solid',
                                                                borderColor: u.es_yo ? 'rgba(255, 255, 255, 0.1)' : 'rgba(239, 68, 68, 0.2)',
                                                                padding: '6px 12px',
                                                                borderRadius: '6px',
                                                                cursor: u.es_yo ? 'not-allowed' : 'pointer',
                                                                display: 'inline-flex',
                                                                alignItems: 'center',
                                                                gap: '6px',
                                                                fontSize: '0.85rem',
                                                                fontWeight: 500,
                                                                transition: 'all 0.2s'
                                                            }}
                                                            title={u.es_yo ? "No puedes eliminarte a ti mismo" : "Eliminar usuario permanentemente"}
                                                        >
                                                            <Trash2 size={16} /> Eliminar
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </LayoutPrincipal>
    );
};

export default PaginaConfiguracion;
