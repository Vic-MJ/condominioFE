import React, { useState, useEffect, useRef } from 'react';
import { Send } from 'lucide-react';
import servicioSocket from '../../services/servicioSocket';
import apiFetch from '../../utils/api';
import './Chat.css';
import { Trash2 } from 'lucide-react';

const VentanaChat = ({ contacto }) => {
    const [mensajes, setMensajes] = useState([]);
    const [valorInput, setValorInput] = useState("");
    const finalMensajesRef = useRef(null);
    const [miId, setMiId] = useState(null);

    useEffect(() => {
        const usuarioData = localStorage.getItem('usuario');
        if (usuarioData) {
            setMiId(JSON.parse(usuarioData).id);
        }
    }, []);

    const cargarHistorial = async () => {
        if (!contacto) return;
        try {
            const res = await apiFetch(`/chat/${contacto.id}`);
            const data = await res.json();
            setMensajes(data);
        } catch (error) {
            console.error('Error cargando historial del chat', error);
        }
    };

    const desplazarAlFinal = () => {
        finalMensajesRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        desplazarAlFinal();
    }, [mensajes]);

    useEffect(() => {
        if (!contacto || !miId) return;

        cargarHistorial();

        const socket = servicioSocket.conectar();
        
        const salaPrivada = `room_${Math.min(miId, contacto.id)}_${Math.max(miId, contacto.id)}`;
        
        servicioSocket.unirseSala(salaPrivada);

        servicioSocket.alRecibirMensaje((datos) => {
            if (datos.sala === salaPrivada) {
                setMensajes((prev) => [...prev, {
                    id: Date.now(),
                    texto: datos.contenido,
                    remitente: 'ellos'
                }]);
            }
        });

        return () => {
            servicioSocket.desuscribirMensaje();
        };
    }, [contacto, miId]);

    const manejarEnvio = async () => {
        if (!valorInput.trim() || !contacto || !miId) return;

        const salaPrivada = `room_${Math.min(miId, contacto.id)}_${Math.max(miId, contacto.id)}`;
        const textoAEnviar = valorInput;
        setValorInput("");

        try {
            const res = await apiFetch(`/chat/${contacto.id}`, {
                method: 'POST',
                body: JSON.stringify({ texto: textoAEnviar })
            });
            
            if (!res.ok) {
                const errData = await res.json();
                console.error("Fallo al guardar mensaje", errData);
                return;
            }
            
            const data = await res.json();

            setMensajes((prev) => [...prev, data.mensaje]);
            
            servicioSocket.enviarMensaje(salaPrivada, textoAEnviar);
            
            servicioSocket.socket?.emit("notificacion", {
                sala: `perfil_${contacto.id}`,
                tipo: 'mensaje',
                contenido: textoAEnviar
            });
        } catch (error) {
            console.error("Error guardando mensaje", error);
        }
    };

    const limpiarHistorial = async () => {
        if (!contacto) return;
        if (!window.confirm(`¿Seguro que deseas borrar el historial de chat con ${contacto.nombre}?`)) return;

        try {
            await apiFetch(`/chat/${contacto.id}`, { method: 'DELETE' });
            setMensajes([]);
        } catch (error) {
            console.error('Error borrando historial', error);
        }
    };

    if (!contacto) {
        return <div className="chat-window" style={{display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8'}}>Selecciona un contacto para iniciar a chatear.</div>;
    }

    return (
        <div className="chat-window">
            <div className="chat-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ width: 48, height: 48, background: contacto.color || '#3b82f6', borderRadius: '50%', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '1.2rem' }}>
                        {contacto.avatar}
                    </div>
                    <div>
                        <h4 style={{ margin: 0, color: 'white', fontSize: '1.1rem' }}>{contacto.nombre}</h4>
                        <span style={{ color: '#94a3b8', fontSize: '0.9rem' }}>{contacto.rol}</span>
                    </div>
                </div>
                <button 
                    onClick={limpiarHistorial}
                    style={{ background: 'transparent', border: 'none', color: '#64748b', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
                    title="Borrar historial"
                >
                    <Trash2 size={20} />
                </button>
            </div>

            <div className="messages-container">
                {mensajes.map((msj) => (
                    <div
                        key={msj.id}
                        style={{
                            display: 'flex',
                            justifyContent: msj.remitente === 'yo' ? 'flex-end' : 'flex-start'
                        }}
                    >
                        <div className={`chat-bubble ${msj.remitente === 'yo' ? 'bubble-me' : 'bubble-them'}`}>
                            <p style={{ margin: 0, marginBottom: '0.25rem' }}>{msj.texto}</p>
                            <span style={{ fontSize: '0.75rem', opacity: 0.8, display: 'block', textAlign: 'right' }}>

                            </span>
                        </div>
                    </div>
                ))}
                <div ref={finalMensajesRef} />
            </div>

            <div className="chat-input-area">
                <input
                    type="text"
                    placeholder="Escribe un mensaje..."
                    className="main-input"
                    value={valorInput}
                    onChange={(e) => setValorInput(e.target.value)}
                />
                <button className="send-btn" onClick={manejarEnvio}>
                    <Send size={20} color="#fff" />
                </button>
            </div>
        </div>
    );
};

export default VentanaChat;
