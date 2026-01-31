import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Dashboard } from './pages/Dashboard'
import { Profile } from './pages/Profile'
import { Ferramentas } from './pages/Ferramentas';
import Home from './pages/Home';
import Login from './pages/login';
import Cadastro from './pages/cadastro';
import RecuperarSenha from './pages/recuperar-senha';
import CrauaPage from './pages/CrauaPage';

// ✅ IMPORTE COM .tsx EXPLÍCITO
import ETo from './pages/eto.tsx';
import ETCC from './pages/etcc.tsx';  
import Ko from './pages/ko.tsx';

// ✅ IMPORTE A NOVA PÁGINA DE INCÊNDIOS
import Incendios from './pages/Incendios';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/ferramentas" element={<Ferramentas />} />
        <Route path="/login" element={<Login />} />
        <Route path="/cadastro" element={<Cadastro />} />
        <Route path="/recuperar-senha" element={<RecuperarSenha />} />
        <Route path="/home" element={<Home />} />
        <Route path="/craua" element={<CrauaPage />} />

        <Route path="/eto" element={<ETo />} />
        <Route path="/etcc" element={<ETCC />} />
        <Route path="/ko" element={<Ko />} />
        
        {/* ✅ NOVA ROTA PARA MONITORAMENTO DE INCÊNDIOS */}
        <Route path="/incendios" element={<Incendios />} />
      </Routes>
    </Router>
  </StrictMode>,
)