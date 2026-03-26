import React, { useState } from 'react';
import usePeticion from '../hooks/usePeticion';
import AlertaResultado from '../components/ui/AlertaResultado';
import BotonCargando from '../components/ui/BotonCargando';
import { Mail, Lock, Key, ArrowLeft, Building2, CheckCircle2 } from 'lucide-react';
import apiFetch from '../utils/api';
import './PaginaLogin.css';

const PaginaRecuperarContraseña = ({ alCambiarPagina }) => {
    const { ejecutar, cargando, resultado, limpiarEstado } = usePeticion();
    const [paso, setPaso] = useState(1);
    const [form, setForm] = useState({
        correo: '',
        codigo: '',
        nueva_contraseña: '',
        nueva_contraseña_confirmation: ''
    });

    const manejarCambio = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };

    const enviarCodigo = async (e) => {
        e.preventDefault();
        const peticion = apiFetch('/recuperar-contraseña/enviar', {
            method: 'POST',
            body: JSON.stringify({ correo: form.correo })
        }).then(async res => {
            const data = await res.json();
            if (!res.ok) throw new Error(data.mensaje || 'Error al enviar el código');
            setPaso(2);
            return data.mensaje;
        });
        await ejecutar(peticion);
    };

    const verificarCodigo = async (e) => {
        e.preventDefault();
        const peticion = apiFetch('/recuperar-contraseña/verificar', {
            method: 'POST',
            body: JSON.stringify({ correo: form.correo, codigo: form.codigo })
        }).then(async res => {
            const data = await res.json();
            if (!res.ok) throw new Error(data.mensaje || 'Código inválido');
            setPaso(3);
            return data.mensaje;
        });
        await ejecutar(peticion);
    };

    const restablecerContraseña = async (e) => {
        e.preventDefault();
        const peticion = apiFetch('/recuperar-contraseña/restablecer', {
            method: 'POST',
            body: JSON.stringify(form)
        }).then(async res => {
            const data = await res.json();
            if (!res.ok) throw new Error(data.mensaje || 'Error al restablecer la contraseña');
            setPaso(4);
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
                    <h1>Recupera el <span className="text-highlight">acceso</span> a tu cuenta.</h1>
                    <p>Sigue los pasos para restablecer tu contraseña de forma segura y volver a gestionar tu comunidad.</p>
                </div>
                
                <div style={{ color: 'rgba(255, 255, 255, 0.5)', fontSize: '0.875rem' }}>
                    © 2026 Vecind-App. Todos los derechos reservados.
                </div>
            </div>

            <div className="login-right-panel">
                <div className="login-form-container">
                    {paso < 4 && (
                        <button
                            onClick={() => paso === 1 ? alCambiarPagina('login') : setPaso(paso - 1)}
                            className="btn-volver"
                        >
                            <ArrowLeft size={16} /> Volver
                        </button>
                    )}

                    <div className="login-header">
                        <h2>{paso === 1 ? 'Recuperar Contraseña' : paso === 2 ? 'Verificar Código' : paso === 3 ? 'Nueva Contraseña' : '¡Éxito!'}</h2>
                        <p>
                            {paso === 1 && 'Introduce tu correo para recibir un código de recuperación.'}
                            {paso === 2 && `Hemos enviado un código de 6 dígitos a ${form.correo}.`}
                            {paso === 3 && 'Introduce tu nueva contraseña de acceso.'}
                            {paso === 4 && 'Tu contraseña ha sido actualizada correctamente.'}
                        </p>
                    </div>

                    {paso === 1 && (
                        <form onSubmit={enviarCodigo}>
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
                            <BotonCargando cargando={cargando} tipo="boton-primario" style={{ width: '100%', padding: '16px', borderRadius: '12px', background: '#2563eb', marginTop: '1rem' }}>
                                Enviar Código
                            </BotonCargando>
                        </form>
                    )}

                    {paso === 2 && (
                        <form onSubmit={verificarCodigo}>
                            <div className="input-group">
                                <input
                                    required
                                    name="codigo"
                                    type="text"
                                    maxLength="6"
                                    placeholder="Código de 6 dígitos"
                                    value={form.codigo}
                                    onChange={manejarCambio}
                                    className="login-input"
                                    style={{ letterSpacing: '8px', textAlign: 'center', fontSize: '24px' }}
                                />
                                <Key size={18} className="input-icon" />
                            </div>
                            <BotonCargando cargando={cargando} tipo="boton-primario" style={{ width: '100%', padding: '16px', borderRadius: '12px', background: '#2563eb', marginTop: '1rem' }}>
                                Verificar Código
                            </BotonCargando>
                            <p style={{ textAlign: 'center', marginTop: '1rem', color: '#94a3b8', fontSize: '0.9rem' }}>
                                ¿No recibiste el código? <button type="button" onClick={enviarCodigo} style={{ background: 'none', border: 'none', color: '#60a5fa', cursor: 'pointer', padding: 0 }}>Reenviar</button>
                            </p>
                        </form>
                    )}

                    {paso === 3 && (
                        <form onSubmit={restablecerContraseña}>
                            <div className="input-group">
                                <input
                                    required
                                    name="nueva_contraseña"
                                    type="password"
                                    placeholder="Nueva Contraseña"
                                    value={form.nueva_contraseña}
                                    onChange={manejarCambio}
                                    className="login-input"
                                />
                                <Lock size={18} className="input-icon" />
                            </div>
                            <div className="input-group" style={{ marginTop: '1rem' }}>
                                <input
                                    required
                                    name="nueva_contraseña_confirmation"
                                    type="password"
                                    placeholder="Confirmar Nueva Contraseña"
                                    value={form.nueva_contraseña_confirmation}
                                    onChange={manejarCambio}
                                    className="login-input"
                                />
                                <Lock size={18} className="input-icon" />
                            </div>
                            <BotonCargando cargando={cargando} tipo="boton-primario" style={{ width: '100%', padding: '16px', borderRadius: '12px', background: '#2563eb', marginTop: '1.5rem' }}>
                                Restablecer Contraseña
                            </BotonCargando>
                        </form>
                    )}

                    {paso === 4 && (
                        <div style={{ textAlign: 'center', padding: '2rem 0' }}>
                            <CheckCircle2 size={64} color="#10b981" style={{ margin: '0 auto 1.5rem auto' }} />
                            <button
                                onClick={() => alCambiarPagina('login')}
                                className="boton-primario"
                                style={{ width: '100%', padding: '16px', borderRadius: '12px', background: '#2563eb', border: 'none', color: 'white', fontWeight: 'bold', cursor: 'pointer' }}
                            >
                                Ir a Iniciar Sesión
                            </button>
                        </div>
                    )}
                </div>
            </div>
            
            <AlertaResultado resultado={resultado} alCerrar={limpiarEstado} />
        </div>
    );
};

export default PaginaRecuperarContraseña;
