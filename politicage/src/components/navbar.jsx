import styles from './Navbar.module.css'
import logo from '../assets/logo.svg'
import underNavBarLine from  '../assets/underNavBarLine.svg'

export function Navbar(props){

  return(
    <header>
      <nav>
          <div>
            <img src={logo} />
          </div>
          <div>
              <ul>
                  <li>Sobre Nós</li>
                  <li>Serviços</li>
                  <li>Pesquisar</li>
              </ul>
          </div>
          <div>
          </div>
      </nav>
            <img src={underNavBarLine} />
    </header>
  )
}