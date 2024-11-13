import { UserLoginForm } from "./UserLoginForm";
import { UserCadastroForm } from "./UserCadastroForm";
import '../styles/logincadastro.css'

export function ConjunctionForm() {
    return (
        <div className="container">

            <div className="left-panel">
                <UserLoginForm />
            </div>
            
            <div className="right-panel">
                <UserCadastroForm />
            </div>
        </div>
    );
}