import './global.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Navbar } from './components/NavBar';
import { ConjunctionForm } from './components/ConjunctionForm';
import { Dashboard } from './components/Dashboard';
import { BuscaPoliticos } from './components/BuscaPolitico';
import { DetalhesPolitico } from './components/DetalhesPolitico';
import { HistoricoConsultas } from './components/HistoricoConsultas';
import { MonitorarPolitico } from './components/MonitorarPolitico';
import { ConfiguracoesUsuario } from './components/ConfiguracoesUsuario'; // Importando ConfiguracoesUsuario

export function App() {
    return (
        <Router>
            <Navbar /> {}
            <Routes>
                <Route path='/' element={<ConjunctionForm />} />
                <Route path='/dashboard' element={<Dashboard />} />
                <Route path='/buscar-politicos' element={<BuscaPoliticos />} />
                <Route path='/politico/:id' element={<DetalhesPolitico />} />
                <Route path='/historico-consultas' element={<HistoricoConsultas />} />
                <Route path='/monitorar-politico' element={<MonitorarPolitico />} />
                <Route path='/configuracoes-usuario' element={<ConfiguracoesUsuario />} /> {/* Rota para ConfiguracoesUsuario */}
            </Routes>
        </Router>
    );
} 