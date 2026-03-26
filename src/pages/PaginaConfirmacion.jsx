import React from 'react';
import { Mail, ArrowLeft, ExternalLink } from 'lucide-react';

const PaginaConfirmacion = ({ alCambiarPagina }) => {
    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
            padding: '20px'
        }}>
            <div style={{
                width: '100%',
                maxWidth: '450px',
                background: 'rgba(30, 41, 59, 0.7)',
                backdropFilter: 'blur(10px)',
                padding: '48px 40px',
                borderRadius: '24px',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
                textAlign: 'center'
            }}>
                <div style={{
                    width: '80px',
                    height: '80px',
                    background: 'rgba(37, 99, 235, 0.2)',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 32px'
                }}>
                    <Mail size={40} color="#3b82f6" />
                </div>

                <h1 style={{ color: '#f8fafc', fontSize: '28px', fontWeight: '700', marginBottom: '16px' }}>
                    ¡Invitación Enviada!
                </h1>

                <p style={{ color: '#94a3b8', fontSize: '16px', lineHeight: '1.6', marginBottom: '32px' }}>
                    Se ha enviado un correo electrónico al nuevo usuario con las instrucciones para configurar su cuenta y contraseña.
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <a
                        href="https://mail.google.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
                            padding: '14px', borderRadius: '12px', background: '#2563eb',
                            color: 'white', fontWeight: '600', textDecoration: 'none',
                            boxShadow: '0 10px 15px -3px rgba(37, 99, 235, 0.4)'
                        }}
                    >
                        Abrir Gmail <ExternalLink size={18} />
                    </a>

                    <button
                        onClick={() => alCambiarPagina('inicio')}
                        style={{
                            background: 'transparent', border: '1px solid #334155', color: '#f8fafc',
                            padding: '14px', borderRadius: '12px', fontWeight: '600', cursor: 'pointer',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'
                        }}
                    >
                        <ArrowLeft size={18} /> Volver al Inicio
                    </button>
                </div>

                <p style={{ color: '#64748b', fontSize: '13px', marginTop: '40px' }}>
                    ¿No recibiste el correo? Revisa tu carpeta de spam o intenta registrarte de nuevo.
                </p>
            </div>
        </div>
    );
};

export default PaginaConfirmacion;
