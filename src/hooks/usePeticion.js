import { useState, useCallback } from 'react';


const usePeticion = () => {
    const [cargando, setCargando] = useState(false);
    const [error, setError] = useState(null);
    const [resultado, setResultado] = useState(null);

    const ejecutar = useCallback(async (promesa) => {
        setCargando(true);
        setError(null);
        setResultado(null);

        try {
            const respuesta = await promesa;
            setResultado({ exito: true, datos: respuesta });
            return { exito: true, datos: respuesta };
        } catch (err) {
            const mensajeError = err.message || "error";
            setError(mensajeError);
            setResultado({ exito: false, mensaje: mensajeError });
            return { exito: false, mensaje: mensajeError };
        } finally {
            setCargando(false);
        }
    }, []);

    const limpiarEstado = () => {
        setResultado(null);
        setError(null);
    };

    return { ejecutar, cargando, error, resultado, limpiarEstado };
};

export default usePeticion;
