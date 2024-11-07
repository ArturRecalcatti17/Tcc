import { Link } from 'react-router-dom';
import '../styles/navbar.css';
import logo from '../assets/logo.svg';

export function Navbar() {
    return (
        <nav className="navbar">
            <div className="navbar-container">
                <div className="navbar-left">
                    <Link to="/" className="navbar-logo">
                        <img src={logo} alt="PoliticAge" className="logo-img" />
                    </Link>
                </div>
                
                <div className="navbar-center">
                    <ul className="navbar-menu">
                        <li><Link to="/sobre">Sobre Nós</Link></li>
                        <li><Link to="/servicos">Serviços</Link></li>
                    </ul>
                </div>
                
                <div className="navbar-right">
                    <ul className="navbar-menu">
                        <li><Link to="/">Login</Link></li>
                    </ul>
                </div>
            </div>
        </nav>
    );
}