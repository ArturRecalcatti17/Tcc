import { useForm } from "react-hook-form";
import { db } from "../db/config";
import { userTable } from "../db/schema/schema";
import { and, eq } from "drizzle-orm";
import { useNavigate } from 'react-router-dom';
import '../styles/userLogin.css'

export function UserLoginForm() {
    const { register, handleSubmit } = useForm();
    const navigate = useNavigate();

    function formatarCPF(value) {
        value = value.replace(/\D/g, '');
        
        value = value.slice(0, 11);
        
        value = value.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
        
        return value;
    }

    const handleCPFChange = (event) => {
        const { value } = event.target;
        const formattedValue = formatarCPF(value);
        event.target.value = formattedValue;
    };

    async function handleAutLogin(dados) {
        try {
            const usuario = await db.select().from(userTable).where(
                and(
                    eq(userTable.cpf, dados.cpf),
                    eq(userTable.senha, dados.senha)
                )
            ).limit(1);

            if (usuario && usuario.length > 0) {
                const token = Math.random().toString(36).substring(2);
                localStorage.setItem('usuarioLogado', 'true');
                localStorage.setItem('usuarioId', usuario[0].id);
                localStorage.setItem('usuarioNome', usuario[0].nome);
                localStorage.setItem('authToken', token);
                navigate('/dashboard');
                window.dispatchEvent(new Event('loginStatusChanged'));
                console.log('Usuário logado com sucesso');
            } else {
                alert('CPF ou senha inválidos');
            }
        } catch (error) {
            console.error('Erro ao fazer login:', error);
            alert('Erro ao fazer login. Tente novamente.');
        }
    }

    return (
        <form onSubmit={handleSubmit(handleAutLogin)} className="login-form">
            
            <div>   
            <h2>BEM-VINDO DE VOLTA!</h2>
            </div>
            

            <div className="elemento">

            <hr />
            <h1>OU</h1>
            <hr />
            </div>

            <div className="campos">
            <input 
                    type="text" 
                    {...register('cpf', { required: true })} 
                    placeholder="CPF*"
                    maxLength="14"
                    onChange={handleCPFChange}
                />

            <input 
                    type="password" 
                    {...register('senha', { required: "Senha é obrigatória" })} 
                    placeholder="Digite sua senha" 
                />
                    <div className="legenda">
                    <p>Esqueceu sua senha? Clique aqui.</p>
                </div>
            </div>

            <button className="btnLogar"  type="submit">Entrar</button>
        </form>
    );
}