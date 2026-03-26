import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import apiFetch from '../../utils/api';
import servicioSocket from '../../services/servicioSocket';
import './Chat.css';

const ListaContactos = ({ onSeleccionar, contactoActivo }) => {
    const [contactos, setContactos] = useState([]);
    const [busqueda, setBusqueda] = useState('');
    const [miId, setMiId] = useState(null);

    useEffect(() => {
        const usuarioData = localStorage.getItem('usuario');
        if (usuarioData) {
            setMiId(JSON.parse(usuarioData).id);
        }
    }, []);

    useEffect(() => {
        const cargarUsuarios = async () => {
            try {
                const res = await apiFetch('/usuarios');
                const data = await res.json();
                
                const otrosUsuarios = data.filter(u => !u.es_yo).map(u => ({ ...u, unread: false }));
                setContactos(otrosUsuarios);
                
                const contactoParaAbrir = localStorage.getItem('chat_contacto_abrir');
                if (contactoParaAbrir) {
                    const usuarioEncontrado = otrosUsuarios.find(u => u.id === parseInt(contactoParaAbrir));
                    if (usuarioEncontrado) {
                        onSeleccionar(usuarioEncontrado);
                        localStorage.removeItem('chat_contacto_abrir');
                    }
                }
                
            } catch (error) {
                console.error('Error cargando usuarios para el chat', error);
            }
        };
        cargarUsuarios();
    }, []);

    useEffect(() => {
        if (!miId || contactos.length === 0) return;

        const socket = servicioSocket.conectar();
        
        contactos.forEach(contacto => {
            const salaPrivada = `room_${Math.min(miId, contacto.id)}_${Math.max(miId, contacto.id)}`;
            servicioSocket.unirseSala(salaPrivada);
        });

        const handlerNotificacion = (datos) => {
            setContactos(prev => prev.map(c => {
                const salaDeEsteContacto = `room_${Math.min(miId, c.id)}_${Math.max(miId, c.id)}`;
                
                if (datos.sala === salaDeEsteContacto) {
                    if (!contactoActivo || contactoActivo.id !== c.id) {
                        return { ...c, unread: true };
                    }
                }
                return c;
            }));
        };

        socket.on("mensaje", handlerNotificacion);

        return () => {
            socket.off("mensaje", handlerNotificacion);
        };
    }, [miId, contactos.length, contactoActivo]);

    const manejarSeleccion = (contacto) => {
        setContactos(prev => prev.map(c => c.id === contacto.id ? { ...c, unread: false } : c));
        onSeleccionar(contacto);
    };

    const contactosFiltrados = contactos.filter(c => 
        c.nombre.toLowerCase().includes(busqueda.toLowerCase())
    );

    return (
        <div className="contacts-panel">
            <h3 style={{ color: 'white', marginBottom: '1.5rem', fontSize: '1.25rem' }}>Mensajes</h3>

            <div className="search-wrapper">
                <Search size={18} color="#94a3b8" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
                <input
                    type="text"
                    placeholder="Buscar contactos..."
                    className="search-input"
                    value={busqueda}
                    onChange={(e) => setBusqueda(e.target.value)}
                />
            </div>

            <div style={{ overflowY: 'auto', flex: 1 }}>
                {contactosFiltrados.map((contacto) => (
                    <div
                        key={contacto.id}
                        className={`contact-item ${contactoActivo?.id === contacto.id ? 'active' : ''}`}
                        onClick={() => manejarSeleccion(contacto)}
                    >
                        <div style={{
                            width: 45, height: 45, borderRadius: '50%',
                            background: contacto.color, display: 'flex', justifyContent: 'center', alignItems: 'center',
                            color: 'white', fontWeight: 'bold', marginRight: '1rem', position: 'relative', flexShrink: 0
                        }}>
                            {contacto.avatar}
                            {contacto.unread && (
                                <div style={{
                                    position: 'absolute', top: -2, right: -2,
                                    width: 14, height: 14, background: '#ef4444', borderRadius: '50%', border: '2px solid var(--card-bg)'
                                }}></div>
                            )}
                        </div>

                        <div style={{ overflow: 'hidden' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span style={{ color: '#f8fafc', fontWeight: contacto.unread ? 800 : 600, fontSize: '0.95rem' }}>{contacto.nombre}</span>
                            </div>
                            <p style={{
                                color: contactoActivo?.id === contacto.id ? '#cbd5e1' : '#64748b',
                                fontSize: '0.85rem', margin: '2px 0 0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'
                            }}>
                                {contacto.rol}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ListaContactos;
