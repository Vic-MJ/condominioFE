import React, { useState } from 'react';
import usePeticion from '../hooks/usePeticion';
import AlertaResultado from '../components/ui/AlertaResultado';
import BotonCargando from '../components/ui/BotonCargando';
import { User, Mail, UserCheck, ArrowLeft } from 'lucide-react';
import apiFetch from '../utils/api';

const PaginaRegistro = ({ alCambiarPagina }) => {
    const { ejecutar, cargando, resultado, limpiarEstado } = usePeticion();
    const [form, setForm] = useState({
        nombre: '',
        apellido_paterno: '',
        apellido_materno: '',
        correo: '',
        rol: 'Residente'
    });

    const manejarCambio = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };

    const manejarRegistro = async (e) => {
        e.preventDefault();

        const peticion = apiFetch('/registro', {
            method: 'POST',
            body: JSON.stringify(form)
        }).then(async res => {
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || data.error || data.mensaje || 'Error en el registro');

            setTimeout(() => alCambiarPagina('confirmacion'), 1500);
            return data.mensaje;
        });

        await ejecutar(peticion);
    };

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
                padding: '40px',
                borderRadius: '24px',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
            }}>
                <button
                    onClick={() => alCambiarPagina('inicio')}
                    style={{
                        background: 'none', border: 'none', color: '#94a3b8',
                        display: 'flex', alignItems: 'center', gap: '8px',
                        cursor: 'pointer', marginBottom: '24px', fontSize: '14px'
                    }}
                >
                    <ArrowLeft size={16} /> Volver al inicio
                </button>

                <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                    <h1 style={{ color: '#f8fafc', fontSize: '28px', fontWeight: '700', marginBottom: '8px' }}>Invitar Usuario</h1>
                    <p style={{ color: '#94a3b8', fontSize: '15px' }}>El usuario recibirá un correo para configurar su contraseña</p>
                </div>

                <form onSubmit={manejarRegistro} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <div style={{ position: 'relative' }}>
                        <User size={18} color="#64748b" style={{ position: 'absolute', left: '12px', top: '14px' }} />
                        <input
                            required
                            name="nombre"
                            type="text"
                            placeholder="Nombre"
                            value={form.nombre}
                            onChange={manejarCambio}
                            style={estiloInput}
                        />
                    </div>

                    <div style={{ position: 'relative' }}>
                        <User size={18} color="#64748b" style={{ position: 'absolute', left: '12px', top: '14px' }} />
                        <input
                            required
                            name="apellido_paterno"
                            type="text"
                            placeholder="Apellido Paterno"
                            value={form.apellido_paterno}
                            onChange={manejarCambio}
                            style={estiloInput}
                        />
                    </div>

                    <div style={{ position: 'relative' }}>
                        <User size={18} color="#64748b" style={{ position: 'absolute', left: '12px', top: '14px' }} />
                        <input
                            name="apellido_materno"
                            type="text"
                            placeholder="Apellido Materno"
                            value={form.apellido_materno}
                            onChange={manejarCambio}
                            style={estiloInput}
                        />
                    </div>

                    <div style={{ position: 'relative' }}>
                        <Mail size={18} color="#64748b" style={{ position: 'absolute', left: '12px', top: '14px' }} />
                        <input
                            required
                            name="correo"
                            type="email"
                            placeholder="Correo Electrónico"
                            value={form.correo}
                            onChange={manejarCambio}
                            style={estiloInput}
                        />
                    </div>

                    <div style={{ position: 'relative' }}>
                        <UserCheck size={18} color="#64748b" style={{ position: 'absolute', left: '12px', top: '14px' }} />
                        <select
                            name="rol"
                            value={form.rol}
                            onChange={manejarCambio}
                            style={{ ...estiloInput, appearance: 'none' }}
                        >
                            <option value="Residente">Residente</option>
                            <option value="Administrador">Administrador</option>
                        </select>
                    </div>

                    <BotonCargando
                        cargando={cargando}
                        tipo="boton-primario"
                        style={{
                            padding: '14px', borderRadius: '12px', fontSize: '16px', fontWeight: '600',
                            marginTop: '10px', background: '#2563eb', boxShadow: '0 10px 15px -3px rgba(37, 99, 235, 0.4)'
                        }}
                    >
                        Enviar Invitación
                    </BotonCargando>
                </form>

                <p style={{ textAlign: 'center', color: '#94a3b8', marginTop: '24px', fontSize: '14px' }}>
                    ¿Ya tienes cuenta? <span onClick={() => alCambiarPagina('login')} style={{ color: '#3b82f6', cursor: 'pointer', fontWeight: '500' }}>Inicia sesión</span>
                </p>
            </div>

            <AlertaResultado resultado={resultado} alCerrar={limpiarEstado} />
        </div>
    );
};

const estiloInput = {
    width: '100%',
    padding: '12px 12px 12px 42px',
    borderRadius: '12px',
    background: '#0f172a',
    border: '1px solid #334155',
    color: '#f8fafc',
    fontSize: '15px',
    outline: 'none',
    transition: 'border-color 0.2s'
};

export default PaginaRegistro;
