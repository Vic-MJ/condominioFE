import React, { useState, useEffect, useRef } from 'react';
import { Send } from 'lucide-react';
import servicioSocket from '../../services/servicioSocket';
import './Chat.css';

const VentanaChat = () => {
    const [mensajes, setMensajes] = useState([

    ]);
    const [valorInput, setValorInput] = useState("");
    const finalMensajesRef = useRef(null);

    const desplazarAlFinal = () => {
        finalMensajesRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        desplazarAlFinal();
    }, [mensajes]);

    useEffect(() => {
        const socket = servicioSocket.conectar();
        servicioSocket.unirseSala("chat_admin");

        servicioSocket.alRecibirMensaje((datos) => {
            setMensajes((prev) => [...prev, {
                id: Date.now(),
                texto: datos.contenido,
                nombre: 'Administración'
            }]);
        });

        return () => {
            servicioSocket.desuscribirMensaje();
        };
    }, []);

    const manejarEnvio = () => {
        if (!valorInput.trim()) return;

        const nuevoMensaje = {
            id: Date.now(),
            texto: valorInput,
            remitente: 'yo',
        };

        setMensajes((prev) => [...prev, nuevoMensaje]);
        servicioSocket.enviarMensaje("chat_admin", valorInput);
        setValorInput("");
    };

    return (
        <div className="chat-window">
            <div className="chat-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ width: 48, height: 48, background: '#3b82f6', borderRadius: '50%', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '1.2rem' }}>A</div>
                    <div>
                        <h4 style={{ margin: 0, color: 'white', fontSize: '1.1rem' }}>Administración</h4>
                        <span style={{ color: '#94a3b8', fontSize: '0.9rem' }}>Admin</span>
                    </div>
                </div>
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
