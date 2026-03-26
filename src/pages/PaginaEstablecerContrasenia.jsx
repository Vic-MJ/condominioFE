import React, { useState, useEffect } from 'react';
import usePeticion from '../hooks/usePeticion';
import AlertaResultado from '../components/ui/AlertaResultado';
import BotonCargando from '../components/ui/BotonCargando';
import { Lock, CheckCircle2, ArrowRight, Mail } from 'lucide-react';
import apiFetch from '../utils/api';

const PaginaEstablecerContrasenia = ({ alCambiarPagina }) => {
    const { ejecutar, cargando, resultado, limpiarEstado } = usePeticion();
    const [token, setToken] = useState('');
    const [email, setEmail] = useState('');
    const [form, setForm] = useState({
        password: '',
        password_confirmation: ''
    });
    const [exito, setExito] = useState(false);

    useEffect(() => {
        let params = new URLSearchParams(window.location.search);
        let t = params.get('token');
        let e = params.get('email');
        if (!t || !e) {
            const hash = window.location.hash;
            if (hash.includes('?')) {
                const hashParams = new URLSearchParams(hash.split('?')[1]);
                t = t || hashParams.get('token');
                e = e || hashParams.get('email');
            }
        }

        setToken(t || '');
        setEmail(e || '');
    }, []);

    const manejarCambio = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const manejarEnvio = async (e) => {
        e.preventDefault();
        
        const peticion = apiFetch('/establecer-contrasenia', {
            method: 'POST',
            body: JSON.stringify({
                ...form,
                token,
                email
            })
        }).then(async res => {
            const data = await res.json();
            if (!res.ok) throw new Error(data.mensaje || 'Error al establecer contraseña');
            setExito(true);
            return data.mensaje;
        });

        await ejecutar(peticion);
    };

    if (exito) {
        return (
            <div style={estiloContenedor}>
                <div style={estiloCard}>
                    <div style={{ textAlign: 'center' }}>
                        <CheckCircle2 size={64} color="#10b981" style={{ marginBottom: '24px' }} />
                        <h1 style={estiloTitulo}>¡Todo listo!</h1>
                        <p style={estiloSubtitulo}>Tu contraseña ha sido establecida correctamente. Ya puedes acceder al sistema.</p>
                        <button 
                            onClick={() => alCambiarPagina('login')}
                            style={estiloBotonExito}
                        >
                            Ir al Inicio de Sesión <ArrowRight size={18} />
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div style={estiloContenedor}>
            <div style={estiloCard}>
                <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                    <h1 style={estiloTitulo}>Configura tu Cuenta</h1>
                    <p style={estiloSubtitulo}>Hola, bienvenido a tu nuevo hogar. Por favor, elige una contraseña para tu cuenta.</p>
                </div>

                <form onSubmit={manejarEnvio} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <div style={{ position: 'relative' }}>
                        <Mail size={18} color="#64748b" style={{ position: 'absolute', left: '12px', top: '14px' }} />
                        <input
                            readOnly
                            type="email"
                            placeholder="Tu Correo"
                            value={email}
                            style={{ ...estiloInput, background: 'rgba(15, 23, 42, 0.5)', cursor: 'not-allowed' }}
                        />
                    </div>

                    <div style={{ position: 'relative' }}>
                        <Lock size={18} color="#64748b" style={{ position: 'absolute', left: '12px', top: '14px' }} />
                        <input
                            required
                            name="password"
                            type="password"
                            placeholder="Nueva Contraseña"
                            value={form.password}
                            onChange={manejarCambio}
                            style={estiloInput}
                        />
                    </div>

                    <div style={{ position: 'relative' }}>
                        <Lock size={18} color="#64748b" style={{ position: 'absolute', left: '12px', top: '14px' }} />
                        <input
                            required
                            name="password_confirmation"
                            type="password"
                            placeholder="Confirmar Contraseña"
                            value={form.password_confirmation}
                            onChange={manejarCambio}
                            style={estiloInput}
                        />
                    </div>

                    <BotonCargando
                        cargando={cargando}
                        tipo="boton-primario"
                        style={{
                            padding: '14px', borderRadius: '12px', fontSize: '16px', fontWeight: '600',
                            marginTop: '10px', background: '#2563eb'
                        }}
                    >
                        Guardar Contraseña
                    </BotonCargando>
                </form>
            </div>
            <AlertaResultado resultado={resultado} alCerrar={limpiarEstado} />
        </div>
    );
};

const estiloContenedor = {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
    padding: '20px'
};

const estiloCard = {
    width: '100%',
    maxWidth: '450px',
    background: 'rgba(30, 41, 59, 0.7)',
    backdropFilter: 'blur(10px)',
    padding: '40px',
    borderRadius: '24px',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
};

const estiloTitulo = { color: '#f8fafc', fontSize: '28px', fontWeight: '700', marginBottom: '8px' };
const estiloSubtitulo = { color: '#94a3b8', fontSize: '15px', lineHeight: '1.5' };

const estiloInput = {
    width: '100%',
    padding: '12px 12px 12px 42px',
    borderRadius: '12px',
    background: '#0f172a',
    border: '1px solid #334155',
    color: '#f8fafc',
    fontSize: '15px',
    outline: 'none'
};

const estiloBotonExito = {
    marginTop: '32px',
    width: '100%',
    padding: '14px',
    background: '#10b981',
    color: 'white',
    border: 'none',
    borderRadius: '12px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '10px',
    transition: 'transform 0.2s'
};

export default PaginaEstablecerContrasenia;
