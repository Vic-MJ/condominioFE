import React, { useState } from 'react';
import PaginaChat from './pages/PaginaChat';
import PaginaResidentes from './pages/PaginaResidentes';
import PaginaInicio from './pages/PaginaInicio';
import PaginaEventos from './pages/PaginaEventos';
import './App.css';
import PaginaRegistro from './pages/PaginaRegistro';
import PaginaConfirmacion from './pages/PaginaConfirmacion';
import PaginaLogin from './pages/PaginaLogin';
import PaginaConfiguracion from './pages/PaginaConfiguracion';
import PaginaRecuperarContraseña from './pages/PaginaRecuperarContraseña';
import PaginaEstablecerContrasenia from './pages/PaginaEstablecerContrasenia';
import PaginaPeticiones from './pages/PaginaPeticiones';
import PaginaPagos from './pages/PaginaPagos';
import RutaProtegida from './components/auth/RutaProtegida';

function App() {
  const [paginaActual, setPaginaActual] = useState(() => {
    console.log("Ruta detectada:", window.location.href);
    if (window.location.href.includes('establecer-contrasenia')) return 'establecer-contrasenia';
    
    if (localStorage.getItem('token')) return 'inicio';
    return 'login';
  });
  console.log("Página actual:", paginaActual);

  return (
    <>
      {paginaActual === 'inicio' && (
        <RutaProtegida alCambiarPagina={setPaginaActual}>
          <PaginaInicio alCambiarPagina={setPaginaActual} />
        </RutaProtegida>
      )}
      
      {paginaActual === 'chat' && (
        <RutaProtegida alCambiarPagina={setPaginaActual}>
          <PaginaChat alCambiarPagina={setPaginaActual} />
        </RutaProtegida>
      )}

      {paginaActual === 'residentes' && (
        <RutaProtegida alCambiarPagina={setPaginaActual} rolRequerido="Administrador">
          <PaginaResidentes alCambiarPagina={setPaginaActual} />
        </RutaProtegida>
      )}

      {paginaActual === 'eventos' && (
        <RutaProtegida alCambiarPagina={setPaginaActual}>
          <PaginaEventos alCambiarPagina={setPaginaActual} />
        </RutaProtegida>
      )}

      {paginaActual === 'peticiones' && (
        <RutaProtegida alCambiarPagina={setPaginaActual}>
          <PaginaPeticiones alCambiarPagina={setPaginaActual} />
        </RutaProtegida>
      )}

      {paginaActual === 'pagos' && (
        <RutaProtegida alCambiarPagina={setPaginaActual}>
          <PaginaPagos alCambiarPagina={setPaginaActual} />
        </RutaProtegida>
      )}

      {paginaActual === 'registro' && (
        <RutaProtegida alCambiarPagina={setPaginaActual} rolRequerido="Administrador">
          <PaginaRegistro alCambiarPagina={setPaginaActual} />
        </RutaProtegida>
      )}

      {paginaActual === 'configuracion' && (
        <RutaProtegida alCambiarPagina={setPaginaActual}>
          <PaginaConfiguracion alCambiarPagina={setPaginaActual} />
        </RutaProtegida>
      )}

      {paginaActual === 'confirmacion' && <PaginaConfirmacion alCambiarPagina={setPaginaActual} />}
      {paginaActual === 'login' && <PaginaLogin alCambiarPagina={setPaginaActual} />}
      {paginaActual === 'recuperar-contraseña' && <PaginaRecuperarContraseña alCambiarPagina={setPaginaActual} />}
      {paginaActual === 'establecer-contrasenia' && <PaginaEstablecerContrasenia alCambiarPagina={setPaginaActual} />}
    </>
  )
}

export default App
