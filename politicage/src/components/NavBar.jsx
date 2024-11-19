import { Link, useLocation } from 'react-router-dom';
import '../styles/navbar.css';
import logo from '../assets/logo.svg';

export function Navbar() {
    const usuarioNome = localStorage.getItem('usuarioNome');
    const isLoggedIn = localStorage.getItem('usuarioLogado') === 'true';

    return (
        <nav className="navbar">
            <div className="navbar-container">
                <div className="navbar-left">
                    <Link to={isLoggedIn ? "/dashboard" : "/"} className="navbar-logo">
                        <img src={logo} alt="Politicage" className="logo-img" />
                    </Link>
                </div>
                
                <div className="navbar-center">
                    <ul className="navbar-menu">
                        <li><Link to="/sobre-nos">Sobre Nós</Link></li>
                        <li><Link to="/servicos">Serviços</Link></li>
                        <li><Link to="/buscar-politicos">Pesquisar</Link></li>
                    </ul>
                </div>
                
                <div className="navbar-right">
                    <ul className="navbar-menu">
                        {isLoggedIn && (
                            <li className="user-welcome">
                                <span>Bem-Vindo</span>
                                <span className="user-name">{usuarioNome}</span>
                            </li>
                        )}
                    </ul>
                </div>
            </div>
            <div className="underdots">
                <div className='dot'></div>
                <hr />
                <div className='dot'></div>                
            </div>
        </nav>
    );
}