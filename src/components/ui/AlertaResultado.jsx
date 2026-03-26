import React, { useEffect, useState } from 'react';
import { CheckCircle, XCircle, X } from 'lucide-react';
import '../../assets/Transiciones.css';

const AlertaResultado = ({ resultado, alCerrar, tiempoAutoCierre = 4000 }) => {
    const [mostrando, setMostrando] = useState(false);

    useEffect(() => {
        if (resultado) {
            setMostrando(true);
            const timer = setTimeout(() => {
                cerrarConAnimacion();
            }, tiempoAutoCierre);
            return () => clearTimeout(timer);
        }
    }, [resultado, tiempoAutoCierre]);

    const cerrarConAnimacion = () => {
        setMostrando(false);
        setTimeout(() => {
            alCerrar();
        }, 300);
    };

    if (!resultado) return null;

    const esExito = resultado.exito;

    return (
        <div className={`alerta-contenedor ${esExito ? 'alerta-exito' : 'alerta-error'} ${mostrando ? 'animacion-aparecer' : 'animacion-desaparecer'}`}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1 }}>
                {esExito ? <CheckCircle size={20} /> : <XCircle size={20} />}
                <span style={{ fontSize: '14px', fontWeight: 500 }}>
                    {esExito ? (resultado.datos || 'Operación completada con éxito') : (resultado.mensaje || 'Error al procesar la solicitud')}
                </span>
            </div>
            <button
                onClick={cerrarConAnimacion}
                style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', padding: '4px', display: 'flex' }}
            >
                <X size={16} />
            </button>
        </div>
    );
};

export default AlertaResultado;
