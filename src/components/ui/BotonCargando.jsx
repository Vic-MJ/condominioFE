import React from 'react';
import { Loader2 } from 'lucide-react';
import '../../assets/Transiciones.css';

const BotonCargando = ({
    alClick,
    cargando,
    children,
    className = "",
    tipo = "boton-primario",
    deshabilitado = false,
    textoCargando = "Cargando..."
}) => {
    return (
        <button
            className={`boton-base ${tipo} ${className}`}
            onClick={alClick}
            disabled={cargando || deshabilitado}
        >
            {cargando ? (
                <>
                    <Loader2 size={18} className="spinner" />
                    <span>{textoCargando}</span>
                </>
            ) : (
                children
            )}
        </button>
    );
};

export default BotonCargando;
