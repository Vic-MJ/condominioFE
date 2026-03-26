import React, { useState, useEffect } from 'react';
import LayoutPrincipal from '../components/layout/LayoutPrincipal';
import BotonCargando from '../components/ui/BotonCargando';
import AlertaResultado from '../components/ui/AlertaResultado';
import usePeticion from '../hooks/usePeticion';
import BotonNotificaciones from '../features/notificaciones/BotonNotificaciones';
import { User, Plus, Calendar, Edit, Trash2, X } from 'lucide-react';
import apiFetch from '../utils/api';
import '../features/chat/Chat.css';
import './PaginaEventos.css';

const PaginaEventos = ({ alCambiarPagina }) => {
    const { ejecutar, cargando, resultado, limpiarEstado } = usePeticion();
    const [eventos, setEventos] = useState([]);
    const [cargandoLista, setCargandoLista] = useState(true);
    const [mostrarModal, setMostrarModal] = useState(false);
    const [usuarioActual, setUsuarioActual] = useState(null);

    const [form, setForm] = useState({
        fecha: '',
        descripcion: ''
    });

    const cargarEventos = async () => {
        setCargandoLista(true);
        try {
            const res = await apiFetch('/eventos');
            const data = await res.json();
            setEventos(data);
        } catch (error) {
            console.error(error);
            if (error.message === 'No autorizado') {
                alert('Inicia sesión para ver los eventos');
                alCambiarPagina('login');
            }
        } finally {
            setCargandoLista(false);
        }
    };

    useEffect(() => {
        cargarEventos();
        const usuarioStorage = localStorage.getItem('usuario');
        if (usuarioStorage) {
            setUsuarioActual(JSON.parse(usuarioStorage));
        }
    }, []);

    const manejarCambioForm = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };

    const manejarGuardarEvento = async (e) => {
        e.preventDefault();

        const peticion = apiFetch('/eventos', {
            method: 'POST',
            body: JSON.stringify(form)
        }).then(async res => {
            const data = await res.json();
            if (!res.ok) throw new Error(data.detalle || data.error || 'Error al guardar');

            cargarEventos();
            setMostrarModal(false);
            setForm({ fecha: '', descripcion: '' });
            return data.mensaje;
        });

        await ejecutar(peticion);
    };

    return (
        <LayoutPrincipal alCambiarPagina={alCambiarPagina} paginaActiva="eventos">
            <div className="eventos-page-container" style={{ position: 'relative' }}>
                <header className="top-header">
                    <h2 className="page-title">Eventos {cargandoLista && <span style={{ fontSize: '0.8rem', color: '#64748b' }}>(Cargando...)</span>}</h2>

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

                <div className="eventos-content">
                    <div className="header-reservas">
                        <h3 className="titulo-reservas">Calendario de Eventos y Reservas</h3>
                        <button className="btn-nueva-reserva" onClick={() => setMostrarModal(true)}>
                            <Plus size={18} /> Nuevo Evento
                        </button>
                    </div>

                    <div className="tarjetas-reservas-lista">
                        {eventos.length === 0 ? (
                            <p style={{ color: '#64748b', fontSize: '1rem', width: '100%', textAlign: 'center', marginTop: '2rem' }}>
                                Aún no hay eventos registrados.
                            </p>
                        ) : (
                            eventos.map(ev => (
                                <div className="tarjeta-reserva" key={ev.id}>
                                    <div className="tarjeta-reserva-header" style={{ marginBottom: '10px' }}>
                                        <div className="etiquetas-contenedor">
                                            <span className="etiqueta bg-azul">Registrado</span>
                                        </div>
                                        <div className="acciones-reserva">
                                            <Edit size={18} className="icono-accion" />
                                            <Trash2 size={18} className="icono-accion icono-borrar" />
                                        </div>
                                    </div>

                                    <h4 className="tarjeta-reserva-titulo">{ev.descripcion}</h4>

                                    <div className="detalles-fecha-hora" style={{ marginTop: '10px' }}>
                                        <div className="detalle-item">
                                            <Calendar size={16} /> {new Date(ev.fecha).toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' })}
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {mostrarModal && (
                    <div style={{
                        position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                        background: 'rgba(15, 23, 42, 0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50
                    }}>
                        <div style={{ background: '#1e293b', padding: '24px', borderRadius: '12px', width: '400px', border: '1px solid #334155' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                                <h3 style={{ margin: 0, color: '#f8fafc' }}>Añadir Evento</h3>
                                <X size={20} color="#64748b" style={{ cursor: 'pointer' }} onClick={() => setMostrarModal(false)} />
                            </div>

                            <form onSubmit={manejarGuardarEvento} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                <input required type="date" name="fecha" value={form.fecha} onChange={manejarCambioForm} style={{ padding: '10px', borderRadius: '6px', background: '#0f172a', border: '1px solid #334155', color: 'white' }} />
                                <textarea required name="descripcion" value={form.descripcion} onChange={manejarCambioForm} placeholder="Descripción del evento..." rows={4} style={{ padding: '10px', borderRadius: '6px', background: '#0f172a', border: '1px solid #334155', color: 'white', resize: 'none' }}></textarea>

                                <BotonCargando cargando={cargando} tipo="boton-primario" style={{ marginTop: '10px', width: '100%', padding: '12px', background: '#2563eb' }}>
                                    Guardar Evento
                                </BotonCargando>
                            </form>
                        </div>
                    </div>
                )}

                <AlertaResultado resultado={resultado} alCerrar={limpiarEstado} />
            </div>
        </LayoutPrincipal>
    );
};

export default PaginaEventos;
