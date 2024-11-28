import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../styles/navbar.css';
import logo from '../assets/logo.svg';


export function Navbar() {
    const [isLoggedIn, setIsLoggedIn] = useState(localStorage.getItem('usuarioLogado') === 'true');
    const [usuarioNome, setUsuarioNome] = useState(localStorage.getItem('usuarioNome'));


    useEffect(() => {
        const checkLoginStatus = () => {
            setIsLoggedIn(localStorage.getItem('usuarioLogado') === 'true');
            setUsuarioNome(localStorage.getItem('usuarioNome'));
        };


        window.addEventListener('storage', checkLoginStatus);
        window.addEventListener('loginStatusChanged', checkLoginStatus);


        return () => {
            window.removeEventListener('storage', checkLoginStatus);
            window.removeEventListener('loginStatusChanged', checkLoginStatus);
        };
    }, []);
   
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
                        <li><Link to="/sobre_nos">Sobre Nós</Link></li>
                        <li><Link to="/servicos">Serviços</Link></li>
                        <li><Link to="/buscar-politicos">Pesquisar</Link></li>
                    </ul>
                </div>


                <div className="navbar-right">
                    <ul className="navbar-menu">
                        {isLoggedIn ? (
                            <li className="user-welcome">
                                <span className='spoon'>Bem-Vindo </span>
                                <span className="user-name">{usuarioNome}</span>
                            </li>
                        ) : null}
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
