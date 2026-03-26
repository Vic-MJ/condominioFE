import React, { useState, useEffect } from 'react';
import LayoutPrincipal from '../components/layout/LayoutPrincipal';
import usePeticion from '../hooks/usePeticion';
import AlertaResultado from '../components/ui/AlertaResultado';
import BotonCargando from '../components/ui/BotonCargando';
import { ClipboardList, LayoutGrid, CheckSquare, Plus, Clock, CheckCircle, XCircle, User } from 'lucide-react';
import apiFetch from '../utils/api';

const PaginaPeticiones = ({ alCambiarPagina }) => {
    const { ejecutar, cargando, resultado, limpiarEstado } = usePeticion();
    const [tabActiva, setTabActiva] = useState('cartelera');
    const [peticiones, setPeticiones] = useState([]);
    const [publicaciones, setPublicaciones] = useState([]);
    const [cargandoDatos, setCargandoDatos] = useState(true);
    const [usuarioActual, setUsuarioActual] = useState(null);
    const [mostrarModal, setMostrarModal] = useState(false);
    const [mostrarModalRechazo, setMostrarModalRechazo] = useState(false);
    const [peticionSeleccionada, setPeticionSeleccionada] = useState(null);
    const [motivoRechazo, setMotivoRechazo] = useState('');

    const [form, setForm] = useState({
        area: '',
        descripcion: '',
        fecha_solicitada: ''
    });

    useEffect(() => {
        const usuario = JSON.parse(localStorage.getItem('usuario'));
        setUsuarioActual(usuario);
        cargarDatos();
    }, []);

    const cargarDatos = async () => {
        setCargandoDatos(true);
        try {
            const [resPeticiones, resPublicaciones] = await Promise.all([
                apiFetch('/peticiones'),
                apiFetch('/publicaciones')
            ]);
            setPeticiones(await resPeticiones.json());
            setPublicaciones(await resPublicaciones.json());
        } catch (error) {
            console.error("Error cargando datos:", error);
        } finally {
            setCargandoDatos(false);
        }
    };

    const manejarCrearPeticion = async (e) => {
        e.preventDefault();
        const peticion = apiFetch('/peticiones', {
            method: 'POST',
            body: JSON.stringify(form)
        }).then(async res => {
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || 'Error al enviar petición');
            setMostrarModal(false);
            setForm({ area: '', descripcion: '', fecha_solicitada: '' });
            cargarDatos();
            return data.mensaje;
        });
        await ejecutar(peticion);
    };

    const manejarEstado = async (id, estado, motivo = '') => {
        const peticion = apiFetch(`/peticiones/${id}/estado`, {
            method: 'PUT',
            body: JSON.stringify({ estado, motivo_rechazo: motivo })
        }).then(async res => {
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || 'Error al actualizar estado');
            setMostrarModalRechazo(false);
            setMotivoRechazo('');
            cargarDatos();
            return data.mensaje;
        });
        await ejecutar(peticion);
    };

    const StatusBadge = ({ estado }) => {
        const styles = {
            pendiente: { bg: 'rgba(234, 179, 8, 0.2)', text: '#eab308' },
            aprobado: { bg: 'rgba(16, 185, 129, 0.2)', text: '#10b981' },
            rechazado: { bg: 'rgba(239, 68, 68, 0.2)', text: '#ef4444' }
        };
        const s = styles[estado] || styles.pendiente;
        return (
            <span style={{ 
                padding: '4px 12px', borderRadius: '12px', fontSize: '12px', fontWeight: '600',
                background: s.bg, color: s.text, textTransform: 'capitalize'
            }}>
                {estado}
            </span>
        );
    };

    return (
        <LayoutPrincipal alCambiarPagina={alCambiarPagina} paginaActiva="peticiones">
            <div style={{ padding: '2rem', minHeight: '100vh', background: '#0f172a' }}>
                <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                        <div>
                            <h1 style={{ color: '#f8fafc', fontSize: '2rem', fontWeight: '700', margin: 0 }}>Áreas Públicas</h1>
                            <p style={{ color: '#94a3b8' }}>Solicitudes y anuncios de la comunidad</p>
                        </div>
                        {usuarioActual?.rol === 'Residente' && (
                            <button 
                                onClick={() => setMostrarModal(true)}
                                style={estiloBotonPrimario}
                            >
                                <Plus size={18} /> Nueva Solicitud
                            </button>
                        )}
                    </div>

                    <div style={{ display: 'flex', gap: '1rem', borderBottom: '1px solid #1e293b', marginBottom: '2rem' }}>
                        <button onClick={() => setTabActiva('cartelera')} style={tabActiva === 'cartelera' ? estiloTabActivo : estiloTab}>
                            <LayoutGrid size={18} /> Cartelera
                        </button>
                        <button onClick={() => setTabActiva('mis-solicitudes')} style={tabActiva === 'mis-solicitudes' ? estiloTabActivo : estiloTab}>
                            <ClipboardList size={18} /> {usuarioActual?.rol === 'Administrador' ? 'Todas las Solicitudes' : 'Mis Solicitudes'}
                        </button>
                    </div>

                    {cargandoDatos ? (
                        <div style={{ textAlign: 'center', padding: '3rem', color: '#64748b' }}>Cargando información...</div>
                    ) : (
                        <div>
                            {tabActiva === 'cartelera' && (
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
                                    {publicaciones.length === 0 ? (
                                        <p style={{ color: '#64748b', gridColumn: '1/-1', textAlign: 'center' }}>No hay anuncios públicos en este momento.</p>
                                    ) : (
                                        publicaciones.map(p => (
                                            <div key={p.id} style={estiloCardPublicacion}>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                                                    <span style={estiloTagArea}>{p.area}</span>
                                                    <span style={{ color: '#64748b', fontSize: '12px' }}>{new Date(p.fecha).toLocaleDateString()}</span>
                                                </div>
                                                <h3 style={{ color: '#f8fafc', margin: '0 0 0.5rem 0' }}>{p.area}</h3>
                                                <p style={{ color: '#94a3b8', fontSize: '14px', lineHeight: '1.6', flex: 1 }}>{p.descripcion}</p>
                                                <div style={{ marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid #334155', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                    <div style={estiloMiniAvatar}>{p.solicitante.substring(0, 1)}</div>
                                                    <span style={{ color: '#cbd5e1', fontSize: '13px' }}>{p.solicitante}</span>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            )}

                            {tabActiva === 'mis-solicitudes' && (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                    {peticiones.length === 0 ? (
                                        <p style={{ color: '#64748b', textAlign: 'center' }}>No hay solicitudes registradas.</p>
                                    ) : (
                                        peticiones.map(p => (
                                            <div key={p.id} style={estiloCardSolicitud}>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                                                    <div>
                                                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
                                                            <h4 style={{ color: '#f8fafc', margin: 0 }}>{p.area}</h4>
                                                            <StatusBadge estado={p.estado} />
                                                        </div>
                                                        <p style={{ color: '#94a3b8', margin: '0 0 10px 0', fontSize: '13px' }}>{p.descripcion}</p>
                                                        <div style={{ display: 'flex', gap: '1rem', color: '#64748b', fontSize: '12px' }}>
                                                            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Clock size={14}/> Solicitado para: {new Date(p.fecha_solicitada).toLocaleDateString()}</span>
                                                            {usuarioActual?.rol === 'Administrador' && (
                                                                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><User size={14}/> Por: {p.usuario?.name}</span>
                                                            )}
                                                        </div>
                                                        {p.estado === 'rechazado' && p.motivo_rechazo && (
                                                            <div style={{ marginTop: '10px', padding: '8px', background: 'rgba(239, 68, 68, 0.1)', borderLeft: '3px solid #ef4444', borderRadius: '4px' }}>
                                                                <p style={{ color: '#ef4444', fontSize: '12px', margin: 0 }}><strong>Motivo:</strong> {p.motivo_rechazo}</p>
                                                            </div>
                                                        )}
                                                    </div>
                                                    {usuarioActual?.rol === 'Administrador' && p.estado === 'pendiente' && (
                                                        <div style={{ display: 'flex', gap: '8px' }}>
                                                            <button 
                                                                onClick={() => manejarEstado(p.id, 'aprobado')}
                                                                style={{ background: '#10b981', border: 'none', borderRadius: '6px', color: 'white', padding: '6px 12px', cursor: 'pointer', display: 'flex', gap: '4px' }}
                                                            >
                                                                <CheckCircle size={16} /> Aprobar
                                                            </button>
                                                            <button 
                                                                onClick={() => { setPeticionSeleccionada(p); setMostrarModalRechazo(true); }}
                                                                style={{ background: '#ef4444', border: 'none', borderRadius: '6px', color: 'white', padding: '6px 12px', cursor: 'pointer', display: 'flex', gap: '4px' }}
                                                            >
                                                                <XCircle size={16} /> Rechazar
                                                            </button>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {mostrarModal && (
                    <div style={estiloOverlayModal}>
                        <div style={estiloModal}>
                            <h2 style={{ color: '#f8fafc', marginBottom: '20px' }}>Nueva Solicitud</h2>
                            <form onSubmit={manejarCrearPeticion} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                <label style={estiloLabel}>Área Común</label>
                                <input 
                                    required 
                                    name="area" 
                                    placeholder="Ej: Salón de Eventos, Cancha de Tenis..." 
                                    value={form.area} 
                                    onChange={(e) => setForm({...form, area: e.target.value})} 
                                    style={estiloInput} 
                                />
                                <label style={estiloLabel}>Fecha Solicitada</label>
                                <input 
                                    required 
                                    type="date" 
                                    value={form.fecha_solicitada} 
                                    onChange={(e) => setForm({...form, fecha_solicitada: e.target.value})} 
                                    style={estiloInput} 
                                />
                                <label style={estiloLabel}>Descripción / Propósito</label>
                                <textarea 
                                    required 
                                    rows="4" 
                                    placeholder="Explica qué harás en el área..." 
                                    value={form.descripcion} 
                                    onChange={(e) => setForm({...form, descripcion: e.target.value})} 
                                    style={{ ...estiloInput, resize: 'none' }} 
                                />
                                <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                                    <button type="button" onClick={() => setMostrarModal(false)} style={estiloBotonSecundario}>Cancelar</button>
                                    <BotonCargando cargando={cargando} tipo="boton-primario" style={{ flex: 1 }}>Enviar Solicitud</BotonCargando>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {mostrarModalRechazo && (
                    <div style={estiloOverlayModal}>
                        <div style={estiloModal}>
                            <h2 style={{ color: '#f8fafc', marginBottom: '20px' }}>Rechazar Solicitud</h2>
                            <p style={{ color: '#94a3b8', marginBottom: '1rem' }}>Indica el motivo por el cual rechazas esta solicitud para el área {peticionSeleccionada?.area}.</p>
                            <textarea 
                                required 
                                rows="4" 
                                placeholder="Escribe el motivo aquí..." 
                                value={motivoRechazo} 
                                onChange={(e) => setMotivoRechazo(e.target.value)} 
                                style={{ ...estiloInput, resize: 'none' }} 
                            />
                            <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                                <button onClick={() => setMostrarModalRechazo(false)} style={estiloBotonSecundario}>Cancelar</button>
                                <button 
                                    onClick={() => manejarEstado(peticionSeleccionada?.id, 'rechazado', motivoRechazo)}
                                    style={{ ...estiloBotonPrimario, background: '#ef4444', flex: 1 }}
                                >
                                    Confirmar Rechazo
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                <AlertaResultado resultado={resultado} alCerrar={limpiarEstado} />
            </div>
        </LayoutPrincipal>
    );
};

const estiloBotonPrimario = { background: '#2563eb', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '10px', cursor: 'pointer', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '8px' };
const estiloBotonSecundario = { background: '#1e293b', color: '#cbd5e1', border: '1px solid #334155', padding: '10px 20px', borderRadius: '10px', cursor: 'pointer', fontWeight: '600' };
const estiloTab = { background: 'none', border: 'none', color: '#64748b', padding: '12px 20px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '2px solid transparent' };
const estiloTabActivo = { ...estiloTab, color: '#2563eb', borderBottomColor: '#2563eb' };
const estiloCardPublicacion = { background: '#1e293b', border: '1px solid #334155', borderRadius: '16px', padding: '1.5rem', display: 'flex', flexDirection: 'column', transition: 'transform 0.2s', cursor: 'default' };
const estiloCardSolicitud = { background: '#1e293b', border: '1px solid #334155', borderRadius: '12px', padding: '1.2rem' };
const estiloTagArea = { background: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6', fontSize: '11px', fontWeight: '700', padding: '2px 8px', borderRadius: '6px', textTransform: 'uppercase' };
const estiloMiniAvatar = { width: '28px', height: '28px', background: '#334155', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#f8fafc', fontSize: '12px', fontWeight: '700' };
const estiloOverlayModal = { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(2, 6, 23, 0.8)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 };
const estiloModal = { background: '#111827', width: '100%', maxWidth: '500px', padding: '2rem', borderRadius: '24px', border: '1px solid #1e293b', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)' };
const estiloLabel = { color: '#94a3b8', fontSize: '14px', marginBottom: '4px' };
const estiloInput = { padding: '12px', borderRadius: '12px', background: '#0f172a', border: '1px solid #334155', color: 'white', outline: 'none' };

export default PaginaPeticiones;
