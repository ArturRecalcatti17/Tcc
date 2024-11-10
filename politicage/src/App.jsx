import './global.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
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

export function App() {
    return (
        <Router>
            <Navbar/> {}
            <Routes>
                <Route path='/' element={<ConjunctionForm />} />
                <Route path='/dashboard' element={<Dashboard />} />
                <Route path='/buscar-politicos' element={<BuscaPoliticos />} />
                <Route path='/politico/:id' element={<DetalhesPolitico />} />
                <Route path='/historico-consultas' element={<HistoricoConsultas />} />
                <Route path='/monitorar-politico' element={<MonitorarPolitico />} />
                <Route path='/configuracoes-usuario' element={<ConfiguracoesUsuario />} />
                <Route path='/sobre-nos' element={<SobreNos/>}/>
                <Route path='/projeto/:id' element={<ProjetoLei/>}/>
                <Route path='/servicos' element={<Servicos/>}/>
          </Routes>
        </Router>
    );
} 