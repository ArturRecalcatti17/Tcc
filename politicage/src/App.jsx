import './global.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { ConjunctionForm } from './components/ConjunctionForm';
import { Dashboard } from './components/Dashboard';
import { BuscaPoliticos } from './components/BuscaPolitico';
import { DetalhesPolitico } from './components/DetalhesPolitico';
import { HistoricoConsultas } from './components/HistoricoConsultas';
import { ConfiguracoesUsuario } from './components/ConfiguracoesUsuario';
import { SobreNos } from './components/sobreNos';
import { Servicos } from './components/Servicos';
import { Navbar } from './components/NavBar';
import { Politicos } from './components/Politicos';


function ProtectedRoute({ children }) {
    const isLoggedIn = localStorage.getItem('usuarioLogado') === 'true';
    return isLoggedIn ? children : <Navigate to="/" />;
}


function LoginProtectedRoute({ children }) {
    const isLoggedIn = localStorage.getItem('usuarioLogado') === 'true';
    return isLoggedIn ? <Navigate to="/dashboard" /> : children;
}


export function App() {
    return (
        <Router>
            <Navbar />
            <Routes>
                <Route path="/" element={
                    <LoginProtectedRoute>
                        <ConjunctionForm />
                    </LoginProtectedRoute>
                } />
                <Route path="/dashboard" element={
                    <ProtectedRoute>
                        <Dashboard />
                    </ProtectedRoute>
                } />
                <Route path="/buscar-politicos" element={
                    <ProtectedRoute>
                        <BuscaPoliticos />
                    </ProtectedRoute>
                } />
                <Route path="/politico/:id" element={
                    <ProtectedRoute>
                        <DetalhesPolitico />
                    </ProtectedRoute>
                } />
                <Route path="/politicosExemplo" element={
                    <ProtectedRoute>
                        <Politicos />
                    </ProtectedRoute>
                } />
                <Route path="/configuracoes-usuario" element={
                    <ProtectedRoute>
                        <ConfiguracoesUsuario />
                    </ProtectedRoute>
                } />
                <Route path="/sobre-nos" element={<SobreNos />} />
                <Route path="/servicos" element={<Servicos />} />
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </Router>
    );
}
