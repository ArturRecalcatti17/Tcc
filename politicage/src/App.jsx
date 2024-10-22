import './global.css'

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import {UserCadastroForm} from './components/UserCadastroForm'
import { UserLoginForm } from './components/UserLoginForm'
import { ConjunctionForm } from './components/ConjunctionForm'
import { Home } from './components/home';

  

function App() {

  return (
 <>
 <Router>
   <Routes>
     <Route path='/' element={<ConjunctionForm />} />
     <Route path='/home' element={ <Home/>} />
   </Routes>
 </Router>
 </>
  )     
}

export default App
