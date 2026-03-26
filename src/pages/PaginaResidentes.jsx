import React, { useState, useEffect } from 'react';
import LayoutPrincipal from '../components/layout/LayoutPrincipal';
import BotonCargando from '../components/ui/BotonCargando';
import AlertaResultado from '../components/ui/AlertaResultado';
import usePeticion from '../hooks/usePeticion';
import BotonNotificaciones from '../features/notificaciones/BotonNotificaciones';
import { UserPlus, Search, Edit2, Trash2, User, X, Power } from 'lucide-react';
import apiFetch from '../utils/api';

const PaginaResidentes = ({ alCambiarPagina }) => {
    const { ejecutar, cargando, resultado, limpiarEstado } = usePeticion();
    const [busqueda, setBusqueda] = useState("");
    const [residentes, setResidentes] = useState([]);
    const [cargandoLista, setCargandoLista] = useState(true);
    const [mostrarModal, setMostrarModal] = useState(false);
    const [usuarioActual, setUsuarioActual] = useState(null);

    const [form, setForm] = useState({
        id: null,
        nombres: '',
        app: '',
        apm: '',
        tel: '',
        email: '',
        dpto: '',
        activo: true
    });
    const [editando, setEditando] = useState(false);

    const cargarResidentes = async () => {
        setCargandoLista(true);
        try {
            const res = await apiFetch('/residentes');
            const data = await res.json();
            if (Array.isArray(data)) {
                setResidentes(data);
            } else {
                setResidentes([]);
            }
        } catch (error) {
            setResidentes([]);
            console.error("Error cargando residentes:", error);
        } finally {
            setCargandoLista(false);
        }
    };

    useEffect(() => {
        cargarResidentes();
        const usuarioStorage = localStorage.getItem('usuario');
        if (usuarioStorage) {
            setUsuarioActual(JSON.parse(usuarioStorage));
        }
    }, []);

    const manejarCambioForm = (e) => {
        const { name, value, type, checked } = e.target;
        setForm({
            ...form,
            [name]: type === 'checkbox' ? checked : value
        });
    };

    const manejarGuardarResidente = async (e) => {
        e.preventDefault();

        const url = editando ? `/residentes/${form.id}` : '/residentes';
        const method = editando ? 'PUT' : 'POST';

        const peticion = apiFetch(url, {
            method,
            body: JSON.stringify(form)
        }).then(async res => {
            const data = await res.json();
            if (!res.ok) throw new Error(data.detalle || data.error || 'Error al guardar');

            cargarResidentes();
            setMostrarModal(false);
            setEditando(false);
            setForm({ id: null, nombres: '', app: '', apm: '', tel: '', email: '', dpto: '', activo: true });
            return data.mensaje;
        });

        await ejecutar(peticion);
    };

    const abrirEdicion = (r) => {
        setForm({
            id: r.id,
            nombres: r.nombres || '',
            app: r.app || '',
            apm: r.apm || '',
            tel: r.tel || '',
            email: r.email || '',
            dpto: r.apartamento,
            activo: r.activo === true || r.activo === 1
        });
        setEditando(true);
        setMostrarModal(true);
    };

    const manejarInactivar = async (residente) => {
        const nuevoEstado = !residente.activo;
        const accion = nuevoEstado ? 'activar' : 'inactivar';
        
        if (window.confirm(`¿Seguro que deseas ${accion} a este residente?`)) {
            const peticion = apiFetch(`/residentes/${residente.id}`, {
                method: 'PUT',
                body: JSON.stringify({ activo: nuevoEstado })
            }).then(async res => {
                if (!res.ok) throw new Error('Error al cambiar de estado');
                cargarResidentes();
                return `Residente ${nuevoEstado ? 'activado' : 'inactivado'} correctamente.`;
            });
            await ejecutar(peticion);
        }
    };

    const manejarBorrar = async (id) => {
        if (window.confirm('¿ELIMINAR PERMANENTEMENTE? Esta acción borrará la cuenta de usuario vinculada.')) {
            const peticion = apiFetch(`/residentes/${id}`, {
                method: 'DELETE'
            }).then(async res => {
                const data = await res.json();
                if (!res.ok) throw new Error(data.error || 'Error al eliminar');
                cargarResidentes();
                return data.mensaje;
            });
            await ejecutar(peticion);
        }
    };

    const residentesFiltrados = residentes.filter(r =>
        (r.nombre?.toLowerCase() || "").includes(busqueda.toLowerCase()) ||
        (r.apartamento?.toString() || "").includes(busqueda)
    );

    return (
        <LayoutPrincipal alCambiarPagina={alCambiarPagina} paginaActiva="residentes">
            <div className="chat-page-container" style={{ flexDirection: 'column', height: '100vh', position: 'relative' }}>
                <header className="top-header">
                    <h2 className="page-title">Residentes {cargandoLista && <span style={{ fontSize: '0.8rem', color: '#64748b' }}>(Cargando...)</span>}</h2>

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

                <div style={{ padding: '2rem', flex: 1, overflowY: 'auto' }}>
                    <div className="gestion-container" style={{
                        background: '#1e293b',
                        borderRadius: '12px',
                        border: '1px solid #334155',
                        padding: '1.5rem',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                            <h3 style={{ fontSize: '1.1rem', color: '#f8fafc', margin: 0 }}>Listado de Residentes</h3>
                            {usuarioActual?.rol === 'Administrador' && (
                                <button
                                    onClick={() => { setEditando(false); setMostrarModal(true); setForm({ nombres:'', app:'', apm:'', tel:'', email:'', dpto:'', activo:true }); }}
                                    style={{
                                        backgroundColor: '#2563eb', padding: '8px 16px', display: 'flex', alignItems: 'center', gap: '8px',
                                        color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 500
                                    }}
                                >
                                    <UserPlus size={18} />
                                    <span>Nuevo Residente</span>
                                </button>
                            )}
                        </div>

                        <div style={{ position: 'relative', marginBottom: '1.5rem' }}>
                            <Search size={18} color="#64748b" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                            <input
                                type="text"
                                placeholder="Buscar por nombre o apartamento..."
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
                                        <th style={{ padding: '12px', color: '#94a3b8', fontWeight: 500 }}>Nombre Completo</th>
                                        <th style={{ padding: '12px', color: '#94a3b8', fontWeight: 500 }}>Apartamento</th>
                                        <th style={{ padding: '12px', color: '#94a3b8', fontWeight: 500 }}>Teléfono</th>
                                        <th style={{ padding: '12px', color: '#94a3b8', fontWeight: 500 }}>Correo</th>
                                        <th style={{ padding: '12px', color: '#94a3b8', fontWeight: 500 }}>Estado</th>
                                        {usuarioActual?.rol === 'Administrador' && (
                                            <th style={{ padding: '12px', color: '#94a3b8', fontWeight: 500, textAlign: 'center' }}>Acciones</th>
                                        )}
                                    </tr>
                                </thead>
                                <tbody>
                                    {residentesFiltrados.length === 0 ? (
                                        <tr>
                                            <td colSpan={usuarioActual?.rol === 'Administrador' ? "6" : "5"} style={{ padding: '16px', textAlign: 'center', color: '#64748b' }}>No hay residentes registrados.</td>
                                        </tr>
                                    ) : (
                                        residentesFiltrados.map(r => (
                                            <tr key={r.id} style={{ borderBottom: '1px solid #334155' }}>
                                                <td style={{ padding: '16px 12px', fontWeight: 500 }}>{r.nombre || (`${r.nombres} ${r.app}`)}</td>
                                                <td style={{ padding: '16px 12px', color: '#94a3b8' }}>{r.apartamento}</td>
                                                <td style={{ padding: '16px 12px', color: '#94a3b8' }}>{r.tel || r.telefono || 'N/A'}</td>
                                                <td style={{ padding: '16px 12px', color: '#94a3b8' }}>{r.email || 'Sin cuenta'}</td>
                                                <td style={{ padding: '16px 12px' }}>
                                                    {r.email && !r.email_verified_at ? (
                                                        <span style={{
                                                            padding: '2px 10px', borderRadius: '12px', fontSize: '11px', fontWeight: 600,
                                                            background: 'rgba(59, 130, 246, 0.2)', color: '#3b82f6'
                                                        }}>
                                                            Por confirmar
                                                        </span>
                                                    ) : (
                                                        <span style={{
                                                            padding: '2px 10px',
                                                            borderRadius: '12px',
                                                            fontSize: '11px',
                                                            fontWeight: 600,
                                                            background: (r.activo || r.estado === 'Activo') ? 'rgba(16, 185, 129, 0.2)' : 'rgba(71, 85, 105, 0.4)',
                                                            color: (r.activo || r.estado === 'Activo') ? '#10b981' : '#94a3b8'
                                                        }}>
                                                            {(r.activo || r.estado === 'Activo') ? 'Activo' : 'Inactivo'}
                                                        </span>
                                                    )}
                                                </td>
                                                {usuarioActual?.rol === 'Administrador' && (
                                                    <td style={{ padding: '16px 12px', textAlign: 'center' }}>
                                                        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', alignItems: 'center' }}>
                                                            <Edit2 
                                                                size={16} 
                                                                color="#3b82f6" 
                                                                style={{ cursor: 'pointer' }} 
                                                                title="Editar"
                                                                onClick={() => abrirEdicion(r)} 
                                                            />
                                                            <Power 
                                                                size={16} 
                                                                color={r.activo ? "#f59e0b" : "#10b981"} 
                                                                style={{ cursor: 'pointer' }} 
                                                                title={r.activo ? "Inactivar" : "Activar"}
                                                                onClick={() => manejarInactivar(r)} 
                                                            />
                                                            <Trash2
                                                                size={16}
                                                                color="#ef4444"
                                                                style={{ cursor: 'pointer' }}
                                                                title="Eliminar Permanente"
                                                                onClick={() => manejarBorrar(r.id)}
                                                            />
                                                        </div>
                                                    </td>
                                                )}
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {mostrarModal && (
                    <div style={{
                        position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                        background: 'rgba(15, 23, 42, 0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50
                    }}>
                        <div style={{ background: '#1e293b', padding: '24px', borderRadius: '12px', width: '400px', border: '1px solid #334155' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                                <h3 style={{ margin: 0, color: '#f8fafc' }}>{editando ? 'Editar' : 'Añadir'} Residente</h3>
                                <X size={20} color="#64748b" style={{ cursor: 'pointer' }} onClick={() => setMostrarModal(false)} />
                            </div>

                            <form onSubmit={manejarGuardarResidente} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                <input required type="text" name="nombres" value={form.nombres} onChange={manejarCambioForm} placeholder="Nombre(s)" style={{ padding: '10px', borderRadius: '6px', background: '#0f172a', border: '1px solid #334155', color: 'white' }} />
                                <input required type="text" name="app" value={form.app} onChange={manejarCambioForm} placeholder="Apellido Paterno" style={{ padding: '10px', borderRadius: '6px', background: '#0f172a', border: '1px solid #334155', color: 'white' }} />
                                <input type="text" name="apm" value={form.apm} onChange={manejarCambioForm} placeholder="Apellido Materno" style={{ padding: '10px', borderRadius: '6px', background: '#0f172a', border: '1px solid #334155', color: 'white' }} />
                                <input required type="tel" name="tel" value={form.tel} onChange={manejarCambioForm} placeholder="Teléfono" style={{ padding: '10px', borderRadius: '6px', background: '#0f172a', border: '1px solid #334155', color: 'white' }} />
                                
                                <input 
                                    required={!editando} 
                                    readOnly={!!form.email && editando}
                                    type="email" 
                                    name="email" 
                                    value={form.email || ''} 
                                    onChange={manejarCambioForm} 
                                    placeholder={editando ? (form.email ? "Correo vinculado" : "Añadir correo para invitar") : "Correo Electrónico (para invitación)"} 
                                    style={{ 
                                        padding: '10px', 
                                        borderRadius: '6px', 
                                        background: editando && form.email ? '#1e293b' : '#0f172a', 
                                        border: '1px solid #334155', 
                                        color: editando && form.email ? '#94a3b8' : 'white',
                                        cursor: editando && form.email ? 'not-allowed' : 'text'
                                    }} 
                                />

                                <input required type="text" name="dpto" value={form.dpto} onChange={manejarCambioForm} placeholder="Departamento (Ej: A-101)" style={{ padding: '10px', borderRadius: '6px', background: '#0f172a', border: '1px solid #334155', color: 'white' }} />

                                <label style={{ color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <input type="checkbox" name="activo" checked={form.activo} onChange={manejarCambioForm} />
                                    Residente Activo
                                </label>

                                <BotonCargando cargando={cargando} tipo="boton-primario" style={{ marginTop: '10px', width: '100%', padding: '12px', background: '#2563eb' }}>
                                    {editando ? 'Guardar Cambios' : 'Guardar y Enviar Invitación'}
                                </BotonCargando>
                            </form>
                        </div>
                    </div>
                )}

                <AlertaResultado
                    resultado={resultado}
                    alCerrar={limpiarEstado}
                />
            </div>
        </LayoutPrincipal>
    );
};

export default PaginaResidentes;
