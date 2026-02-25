import React, { useState } from 'react';
import { Search } from 'lucide-react';
import './Chat.css';

const datosContactos = [
    { id: 1, nombre: 'Administración', rol: 'Admin', notificacion: true, avatar: 'A', online: true, color: '#3b82f6' },
    { id: 2, nombre: 'María González', rol: 'Apto 502', notificacion: true, avatar: 'MG', online: true, color: '#8b5cf6' },
    { id: 3, nombre: 'Claudia Sheimbaun', rol: 'Apto 301', notificacion: false, avatar: 'CS', online: false, color: '#ec4899' },

];

const ListaContactos = () => {
    const [idActivo, setIdActivo] = useState(1);

    return (
        <div className="contacts-panel">
            <h3 style={{ color: 'white', marginBottom: '1.5rem', fontSize: '1.25rem' }}>Mensajes</h3>

            <div className="search-wrapper">
                <Search size={18} color="#94a3b8" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
                <input
                    type="text"
                    placeholder="Buscar contactos..."
                    className="search-input"
                />
            </div>

            <div style={{ overflowY: 'auto', flex: 1 }}>
                {datosContactos.map((contacto) => (
                    <div
                        key={contacto.id}
                        className={`contact-item ${idActivo === contacto.id ? 'active' : ''}`}
                        onClick={() => setIdActivo(contacto.id)}
                    >
                        <div style={{
                            width: 45, height: 45, borderRadius: '50%',
                            background: contacto.color, display: 'flex', justifyContent: 'center', alignItems: 'center',
                            color: 'white', fontWeight: 'bold', marginRight: '1rem', position: 'relative', flexShrink: 0
                        }}>
                            {contacto.avatar}
                            {contacto.online && (
                                <div style={{
                                    position: 'absolute', bottom: 1, right: 1,
                                    width: 10, height: 10, background: '#22c55e', borderRadius: '50%', border: '2px solid var(--card-bg)'
                                }}></div>
                            )}
                        </div>

                        <div style={{ overflow: 'hidden' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span style={{ color: '#f8fafc', fontWeight: 600, fontSize: '0.95rem' }}>{contacto.nombre}</span>
                            </div>
                            <p style={{
                                color: idActivo === contacto.id ? '#cbd5e1' : '#64748b',
                                fontSize: '0.85rem', margin: '2px 0 0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'
                            }}>
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ListaContactos;
