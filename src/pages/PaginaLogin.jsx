import React, { useState } from 'react';
import usePeticion from '../hooks/usePeticion';
import AlertaResultado from '../components/ui/AlertaResultado';
import BotonCargando from '../components/ui/BotonCargando';
import { Mail, Lock, ArrowLeft, Building2 } from 'lucide-react';
import apiFetch from '../utils/api';
import './PaginaLogin.css';

const PaginaLogin = ({ alCambiarPagina }) => {
    const { ejecutar, cargando, resultado, limpiarEstado } = usePeticion();
    const [form, setForm] = useState({
        correo: '',
        contraseña: ''
    });

    const manejarCambio = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };

    const manejarLogin = async (e) => {
        e.preventDefault();

        const payload = {
            ...form,
            nombre_dispositivo: navigator.userAgent.split(')')[0].split('(')[1] || 'Web Browser'
        };

        const peticion = apiFetch('/inicio-sesion', {
            method: 'POST',
            body: JSON.stringify(payload)
        }).then(async res => {
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || data.error || data.mensaje || 'Error al iniciar sesión');

            localStorage.setItem('token', data.access_token);
            localStorage.setItem('usuario', JSON.stringify(data.usuario));

            setTimeout(() => alCambiarPagina('inicio'), 1000);
            return data.mensaje;
        });

        await ejecutar(peticion);
    };

    return (
        <div className="login-page-container">
            <div className="login-left-panel">
                <div className="login-brand">
                    <Building2 size={32} color="#60a5fa" />
                    Vecind - <span className="text-highlight">App</span>
                </div>
                
                <div className="login-hero-text">
                    <h1>Administración <span className="text-highlight">inteligente</span> para tu comunidad.</h1>
                    <p>Accede a tu cuenta para gestionar pagos, reservas, incidentes, comunicados y chatear con tus vecinos en tiempo real.</p>
                </div>
                
                <div style={{ color: 'rgba(255, 255, 255, 0.5)', fontSize: '0.875rem' }}>
                    © 2026 Vecind-App. Todos los derechos reservados.
                </div>
            </div>

            <div className="login-right-panel">
                <div className="login-form-container">
                    <button
                        onClick={() => alCambiarPagina('inicio')}
                        className="btn-volver"
                    >
                        <ArrowLeft size={16} /> Volver al Inicio
                    </button>

                    <div className="login-header">
                        <h2>Bienvenido de nuevo</h2>
                        <p>Inicia sesión con tu correo electrónico y contraseña.</p>
                    </div>

                    <form onSubmit={manejarLogin}>
                        <div className="input-group">
                            <input
                                required
                                name="correo"
                                type="email"
                                placeholder="Correo Electrónico"
                                value={form.correo}
                                onChange={manejarCambio}
                                className="login-input"
                            />
                            <Mail size={18} className="input-icon" />
                        </div>

                        <div className="input-group">
                            <input
                                required
                                name="contraseña"
                                type="password"
                                placeholder="Contraseña"
                                value={form.contraseña}
                                onChange={manejarCambio}
                                className="login-input"
                            />
                            <Lock size={18} className="input-icon" />
                        </div>

                        <BotonCargando
                            cargando={cargando}
                            tipo="boton-primario"
                            style={{
                                width: '100%', padding: '16px', borderRadius: '12px',
                                background: '#2563eb', border: 'none', color: 'white',
                                fontWeight: 'bold', fontSize: '16px', cursor: 'pointer',
                                boxShadow: '0 4px 14px 0 rgba(37, 99, 235, 0.39)',
                                marginTop: '1rem', transition: 'all 0.3s ease'
                            }}
                        >
                            Iniciar Sesión
                        </BotonCargando>

                        <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
                            <button 
                                type="button"
                                onClick={() => alCambiarPagina('recuperar-contraseña')}
                                style={{ background: 'none', border: 'none', color: '#60a5fa', cursor: 'pointer', fontSize: '0.9rem', fontWeight: 500 }}
                            >
                                ¿Olvidaste tu contraseña?
                            </button>
                        </div>
                    </form>
                </div>
            </div>
            
            <AlertaResultado resultado={resultado} alCerrar={limpiarEstado} />
        </div>
    );
};

export default PaginaLogin;
