import React, { useState } from 'react';
import PaginaChat from './pages/PaginaChat';
import PaginaResidentes from './pages/PaginaResidentes';
import './App.css';

function App() {
  const [paginaActual, setPaginaActual] = useState('chat');

  return (
    <>
      {paginaActual === 'chat' ? (
        <PaginaChat alCambiarPagina={setPaginaActual} />
      ) : (
        <PaginaResidentes alCambiarPagina={setPaginaActual} />
      )}
    </>
  )
}

export default App
