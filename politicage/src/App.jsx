import './global.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { ConjunctionForm } from './components/ConjunctionForm';
import { Dashboard } from './components/Dashboard';
import { BuscaPoliticos } from './components/BuscaPolitico';
import { DetalhesPolitico } from './components/DetalhesPolitico';
import { HistoricoConsultas } from './components/HistoricoConsultas';
import { MonitorarPolitico } from './components/MonitorarPolitico';
import { ConfiguracoesUsuario } from './components/ConfiguracoesUsuario'; // Importando ConfiguracoesUsuario
import {SobreNos} from './components/sobreNos';
import {ProjetoLei} from './components/Projetolei'
import {Servicos} from './components/Servicos'
import {Navbar} from './components/NavBar'

// Componente de proteção de rota
function ProtectedRoute({ children }) {
    const isLoggedIn = localStorage.getItem('usuarioLogado') === 'true';
    return isLoggedIn ? children : <Navigate to="/" />; // Redireciona para a página inicial se não estiver logado
}

export function App() {
    return (
        <Router>
            <Navbar/> {}
            <Routes>
                <Route path='/' element={
                        <ConjunctionForm />
                } />
                <Route path='/dashboard' element={
                    <ProtectedRoute>
                        <Dashboard />
                    </ProtectedRoute>
                } />
                <Route path='/buscar-politicos' element={
                    <ProtectedRoute>
                        <BuscaPoliticos />
                    </ProtectedRoute>
                } />
                <Route path='/politico/:id' element={
                    <ProtectedRoute>
                        <DetalhesPolitico />
                    </ProtectedRoute>
                } />
                <Route path='/historico-consultas' element={
                    <ProtectedRoute>
                        <HistoricoConsultas />
                    </ProtectedRoute>
                } />
                <Route path='/monitorar-politico' element={
                    <ProtectedRoute>
                        <MonitorarPolitico />
                    </ProtectedRoute>
                } />
                <Route path='/configuracoes-usuario' element={
                    <ProtectedRoute>
                        <ConfiguracoesUsuario />
                    </ProtectedRoute>
                } />
                <Route path='/sobre-nos' element={
                        <SobreNos/>
                } />
                <Route path='/projeto/:id' element={
                    <ProtectedRoute>
                        <ProjetoLei/>
                    </ProtectedRoute>
                } />
                <Route path='/servicos' element={
                        <Servicos/>
                } />
            </Routes>
        </Router>
    );
} 