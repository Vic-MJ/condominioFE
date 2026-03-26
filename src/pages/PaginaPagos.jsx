import React, { useState, useEffect } from 'react';
import LayoutPrincipal from '../components/layout/LayoutPrincipal';
import BotonCargando from '../components/ui/BotonCargando';
import AlertaResultado from '../components/ui/AlertaResultado';
import usePeticion from '../hooks/usePeticion';
import BotonNotificaciones from '../features/notificaciones/BotonNotificaciones';
import { CreditCard, History, AlertCircle, Plus, CheckCircle, Clock, Trash2, Search, FileText } from 'lucide-react';
import apiFetch from '../utils/api';

const PaginaPagos = ({ alCambiarPagina }) => {
    const [tabActiva, setTabActiva] = useState('historial'); 
    const [pagos, setPagos] = useState([]);
    const [adeudos, setAdeudos] = useState([]);
    const [catalogos, setCatalogos] = useState({ tipos: [], motivos: [], departamentos: [] });
    const [mostrarModalPago, setMostrarModalPago] = useState(false);
    const [mostrarModalMantenimiento, setMostrarModalMantenimiento] = useState(false);
    const [usuarioActual, setUsuarioActual] = useState(null);
    const [idDptoResidente, setIdDptoResidente] = useState(null);

    const { cargando, ejecutar, resultado, limpiarEstado } = usePeticion();

    const [formPago, setFormPago] = useState({
        id_dpto: '',
        monto: '',
        id_tipo: '',
        id_motivo: '',
        descripcion: '',
        comprobante: ''
    });

    const [formManto, setFormManto] = useState({
        monto: '500', 
        mes: new Date().getMonth() + 1,
        año: new Date().getFullYear()
    });

    useEffect(() => {
        const fetchDatos = async () => {
            const usuario = JSON.parse(localStorage.getItem('usuario'));
            setUsuarioActual(usuario);

            try {
                const [resCat, resPagos, resAdeudos] = await Promise.all([
                    apiFetch('/pagos/catalogos'),
                    apiFetch('/pagos'),
                    apiFetch('/adeudos')
                ]);

                if (resCat.ok) setCatalogos(await resCat.json());
                if (resPagos.ok) setPagos(await resPagos.json());
                if (resAdeudos.ok) setAdeudos(await resAdeudos.json());
            } catch (e) {
                console.error("Error al cargar datos iniciales:", e);
            }

            if (usuario.rol === 'Residente') {
                try {
                    const resRes = await apiFetch('/residentes');
                    const dataRes = await resRes.json();
                    const miPerfil = dataRes.find(r => r.email === usuario.email);
                    if (miPerfil) {
                    }
                } catch (e) { console.error(e); }
            }
            
            cargarPagos();
            cargarAdeudos();
        };
        fetchDatos();
    }, []);

    const cargarPagos = async () => {
        try {
            const res = await apiFetch('/pagos');
            const data = await res.json();
            setPagos(data);
        } catch (e) { console.error(e); }
    };

    const cargarAdeudos = async () => {
        try {
            const res = await apiFetch('/adeudos');
            const data = await res.json();
            setAdeudos(data);
        } catch (e) { console.error(e); }
    };

    const manejarGuardarPago = async (e) => {
        e.preventDefault();
        const peticion = apiFetch('/pagos', {
            method: 'POST',
            body: JSON.stringify(formPago)
        }).then(async res => {
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Error al guardar pago');
            setMostrarModalPago(false);
            cargarPagos();
            cargarAdeudos();
            return 'Pago registrado con éxito.';
        });
        await ejecutar(peticion);
    };

    const manejarGenerarManto = async (e) => {
        e.preventDefault();
        const peticion = apiFetch('/generar-mantenimiento', {
            method: 'POST',
            body: JSON.stringify(formManto)
        }).then(async res => {
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Error al generar cargos');
            setMostrarModalMantenimiento(false);
            cargarAdeudos();
            cargarPagos();
            return 'Cargos de mantenimiento generados.';
        });
        await ejecutar(peticion);
    };

    const manejarVerificar = async (id) => {
        if (window.confirm('¿Verificar este pago como recibido?')) {
            const peticion = apiFetch(`/pagos/${id}/verificar`, {
                method: 'PUT'
            }).then(async res => {
                if (!res.ok) throw new Error('Error al verificar');
                cargarPagos();
                cargarAdeudos();
                return 'Pago verificado correctamente.';
            });
            await ejecutar(peticion);
        }
    };

    return (
        <LayoutPrincipal alCambiarPagina={alCambiarPagina} paginaActiva="pagos">
            <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
                <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <h2 style={{ color: '#f8fafc', margin: 0 }}>Pagos y Adeudos</h2>
                        <p style={{ color: '#94a3b8', fontSize: '14px', marginTop: '4px' }}>Gestiona tus cuotas y revisa tu historial financiero.</p>
                    </div>
                    <div style={{ display: 'flex', gap: '12px' }}>
                        {usuarioActual?.rol === 'Administrador' && (
                            <button 
                                onClick={() => setMostrarModalMantenimiento(true)}
                                style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#334155', color: 'white', border: 'none', padding: '10px 16px', borderRadius: '8px', cursor: 'pointer' }}
                            >
                                <Plus size={18} /> Generar Cuotas
                            </button>
                        )}
                        <button 
                            onClick={() => setMostrarModalPago(true)}
                            style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#2563eb', color: 'white', border: 'none', padding: '10px 16px', borderRadius: '8px', cursor: 'pointer' }}
                        >
                            <CreditCard size={18} /> {usuarioActual?.rol === 'Administrador' ? 'Registrar Pago' : 'Informar Pago'}
                        </button>
                    </div>
                </header>

                <div style={{ display: 'flex', gap: '1px', background: '#334155', padding: '4px', borderRadius: '10px', width: 'fit-content' }}>
                    <button 
                        onClick={() => setTabActiva('historial')}
                        style={{ 
                            padding: '8px 20px', borderRadius: '7px', border: 'none', 
                            background: tabActiva === 'historial' ? '#1e293b' : 'transparent',
                            color: tabActiva === 'historial' ? '#3b82f6' : '#94a3b8',
                            cursor: 'pointer', transition: 'all 0.2s'
                        }}
                    >
                        Historial de Pagos
                    </button>
                    <button 
                        onClick={() => setTabActiva('adeudos')}
                        style={{ 
                            padding: '8px 20px', borderRadius: '7px', border: 'none', 
                            background: tabActiva === 'adeudos' ? '#1e293b' : 'transparent',
                            color: tabActiva === 'adeudos' ? '#3b82f6' : '#94a3b8',
                            cursor: 'pointer', transition: 'all 0.2s'
                        }}
                    >
                        Adeudos Pendientes
                    </button>
                </div>

                <div style={{ background: '#1e293b', borderRadius: '12px', border: '1px solid #334155', overflow: 'hidden' }}>
                    {tabActiva === 'historial' ? (
                        <div style={{ overflowX: 'auto' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse', color: 'white' }}>
                                <thead style={{ background: '#0f172a' }}>
                                    <tr>
                                        <th style={{ padding: '16px', textAlign: 'left' }}>Fecha</th>
                                        <th style={{ padding: '16px', textAlign: 'left' }}>Motivo</th>
                                        <th style={{ padding: '16px', textAlign: 'left' }}>Departamento</th>
                                        <th style={{ padding: '16px', textAlign: 'left' }}>Monto</th>
                                        <th style={{ padding: '16px', textAlign: 'left' }}>Estado</th>
                                        {usuarioActual?.rol === 'Administrador' && <th style={{ padding: '16px', textAlign: 'center' }}>Acciones</th>}
                                    </tr>
                                </thead>
                                <tbody>
                                    {pagos.length === 0 ? (
                                        <tr><td colSpan="6" style={{ padding: '32px', textAlign: 'center', color: '#64748b' }}>No hay registros de pagos.</td></tr>
                                    ) : (
                                        pagos.map(p => (
                                            <tr key={p.id} style={{ borderBottom: '1px solid #334155' }}>
                                                <td style={{ padding: '16px' }}>{new Date(p.fecha).toLocaleDateString()}</td>
                                                <td style={{ padding: '16px' }}>{p.motivo}</td>
                                                <td style={{ padding: '16px' }}>{p.departamento}</td>
                                                <td style={{ padding: '16px', fontWeight: 'bold' }}>${Number(p.monto).toLocaleString()}</td>
                                                <td style={{ padding: '16px' }}>
                                                    <span style={{ 
                                                        display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '4px 10px', borderRadius: '20px', fontSize: '12px',
                                                        background: p.efectuado ? 'rgba(16, 185, 129, 0.1)' : 'rgba(245, 158, 11, 0.1)',
                                                        color: p.efectuado ? '#10b981' : '#f59e0b'
                                                    }}>
                                                        {p.efectuado ? <><CheckCircle size={14} /> Verificado</> : <><Clock size={14} /> Pendiente</>}
                                                    </span>
                                                </td>
                                                {usuarioActual?.rol === 'Administrador' && (
                                                    <td style={{ padding: '16px', textAlign: 'center' }}>
                                                        {!p.efectuado && (
                                                            <button 
                                                                onClick={() => manejarVerificar(p.id)}
                                                                style={{ background: '#059669', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '6px', fontSize: '12px', cursor: 'pointer' }}
                                                            >
                                                                Validar
                                                            </button>
                                                        )}
                                                    </td>
                                                )}
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div style={{ overflowX: 'auto' }}>
                             <table style={{ width: '100%', borderCollapse: 'collapse', color: 'white' }}>
                                <thead style={{ background: '#0f172a' }}>
                                    <tr>
                                        <th style={{ padding: '16px', textAlign: 'left' }}>Mes / Año</th>
                                        <th style={{ padding: '16px', textAlign: 'left' }}>Departamento</th>
                                        <th style={{ padding: '16px', textAlign: 'left' }}>Concepto</th>
                                        <th style={{ padding: '16px', textAlign: 'left' }}>Monto Pendiente</th>
                                        <th style={{ padding: '16px', textAlign: 'left' }}>Estado</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {adeudos.length === 0 ? (
                                        <tr><td colSpan="5" style={{ padding: '32px', textAlign: 'center', color: '#64748b' }}>No hay adeudos pendientes. ¡Todo al día!</td></tr>
                                    ) : (
                                        adeudos.map(a => (
                                            <tr key={a.id} style={{ borderBottom: '1px solid #334155' }}>
                                                <td style={{ padding: '16px' }}>{a.mes}/{a.año}</td>
                                                <td style={{ padding: '16px' }}>{a.apartamento}</td>
                                                <td style={{ padding: '16px' }}>Mantenimiento</td>
                                                <td style={{ padding: '16px', color: '#ef4444', fontWeight: 'bold' }}>${Number(a.monto).toLocaleString()}</td>
                                                <td style={{ padding: '16px' }}>
                                                    <span style={{ 
                                                        padding: '4px 10px', borderRadius: '20px', fontSize: '12px',
                                                        background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444'
                                                    }}>
                                                        Deuda
                                                    </span>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                {mostrarModalPago && (
                    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <div style={{ background: '#1e293b', padding: '24px', borderRadius: '16px', width: '400px', border: '1px solid #334155' }}>
                            <h3 style={{ margin: '0 0 20px 0', color: 'white' }}>{usuarioActual?.rol === 'Administrador' ? 'Registrar Pago' : 'Informar Pago'}</h3>
                            <form onSubmit={manejarGuardarPago} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                <label style={{ color: '#94a3b8', fontSize: '12px' }}>Seleccionar Departamento por ID (Admin) / Mi ID (Residente)</label>
                                <select required value={formPago.id_dpto} onChange={e => setFormPago({...formPago, id_dpto: e.target.value})} style={{ padding: '10px', background: '#0f172a', border: '1px solid #334155', color: 'white', borderRadius: '8px' }}>
                                    <option value="">Seleccionar Departamento...</option>
                                    {catalogos.departamentos.map(d => <option key={d.id} value={d.id}>{d.dpto}</option>)}
                                </select>
                                <input required type="number" placeholder="Monto $" value={formPago.monto} onChange={e => setFormPago({...formPago, monto: e.target.value})} style={{ padding: '10px', borderRadius: '8px', background: '#0f172a', border: '1px solid #334155', color: 'white' }} />
                                
                                <select required value={formPago.id_tipo} onChange={e => setFormPago({...formPago, id_tipo: e.target.value})} style={{ padding: '10px', borderRadius: '8px', background: '#0f172a', border: '1px solid #334155', color: 'white' }}>
                                    <option value="">Forma de pago...</option>
                                    {catalogos.tipos.map(t => <option key={t.id} value={t.id}>{t.tipo}</option>)}
                                </select>

                                <select required value={formPago.id_motivo} onChange={e => setFormPago({...formPago, id_motivo: e.target.value})} style={{ padding: '10px', borderRadius: '8px', background: '#0f172a', border: '1px solid #334155', color: 'white' }}>
                                    <option value="">Motivo del pago...</option>
                                    {catalogos.motivos.map(m => <option key={m.id} value={m.id}>{m.motivo}</option>)}
                                </select>

                                <textarea placeholder="Descripción adicional..." value={formPago.descripcion} onChange={e => setFormPago({...formPago, descripcion: e.target.value})} style={{ padding: '10px', borderRadius: '8px', background: '#0f172a', border: '1px solid #334155', color: 'white', minHeight: '80px' }} />
                                
                                <div style={{ display: 'flex', gap: '12px', marginTop: '12px' }}>
                                    <button type="button" onClick={() => setMostrarModalPago(false)} style={{ flex: 1, padding: '12px', borderRadius: '8px', background: 'transparent', color: '#94a3b8', border: '1px solid #334155', cursor: 'pointer' }}>Cancelar</button>
                                    <BotonCargando cargando={cargando} tipo="boton-primario" style={{ flex: 1, padding: '12px', borderRadius: '8px', background: '#2563eb' }}>
                                        Confirmar
                                    </BotonCargando>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {mostrarModalMantenimiento && (
                    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <div style={{ background: '#1e293b', padding: '24px', borderRadius: '16px', width: '400px', border: '1px solid #334155' }}>
                            <h3 style={{ margin: '0 0 20px 0', color: 'white' }}>Generar Cargos de Mantenimiento</h3>
                            <p style={{ color: '#94a3b8', fontSize: '14px', marginBottom: '16px' }}>Se creará un adeudo para todos los departamentos registrados.</p>
                            <form onSubmit={manejarGenerarManto} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                <input required type="number" placeholder="Monto por depto $" value={formManto.monto} onChange={e => setFormManto({...formManto, monto: e.target.value})} style={{ padding: '10px', borderRadius: '8px', background: '#0f172a', border: '1px solid #334155', color: 'white' }} />
                                <div style={{ display: 'flex', gap: '12px' }}>
                                    <input required type="number" placeholder="Mes (1-12)" value={formManto.mes} onChange={e => setFormManto({...formManto, mes: e.target.value})} style={{ flex: 1, padding: '10px', borderRadius: '8px', background: '#0f172a', border: '1px solid #334155', color: 'white' }} />
                                    <input required type="number" placeholder="Año" value={formManto.año} onChange={e => setFormManto({...formManto, año: e.target.value})} style={{ flex: 1, padding: '10px', borderRadius: '8px', background: '#0f172a', border: '1px solid #334155', color: 'white' }} />
                                </div>
                                <div style={{ display: 'flex', gap: '12px', marginTop: '12px' }}>
                                    <button type="button" onClick={() => setMostrarModalMantenimiento(false)} style={{ flex: 1, padding: '12px', borderRadius: '8px', background: 'transparent', color: '#94a3b8', border: '1px solid #334155', cursor: 'pointer' }}>Cerrar</button>
                                    <BotonCargando cargando={cargando} tipo="boton-primario" style={{ flex: 1, padding: '12px', borderRadius: '8px', background: '#2563eb' }}>
                                        Generar Ahora
                                    </BotonCargando>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                <AlertaResultado resultado={resultado} alCerrar={limpiarEstado} />
            </div>
        </LayoutPrincipal>
    );
};

export default PaginaPagos;
