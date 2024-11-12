import { UserLoginForm } from "./UserLoginForm";
import { UserCadastroForm } from "./UserCadastroForm";

export function ConjunctionForm() {
    return (
        <div className="container">
            <div className="left-panel">
                <h2 className="bem-vindo">BEM-VINDO DE VOLTA!</h2>
                <UserLoginForm />
                <div className="forgot-password">
                    <p>Esqueceu sua senha?</p>
                    <a href="#">Clique aqui.</a>
                </div>
            </div>
            
            <div className="right-panel">
                <h2 className="criar-conta">CADASTRE-SE AQUI</h2>
                <UserCadastroForm />
            </div>
        </div>
    );
}