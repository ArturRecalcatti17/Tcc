import { useForm } from "react-hook-form";
import { db } from "../db/config";
import { userTable } from "../db/schema/schema";
import { and, eq } from "drizzle-orm";
import { useNavigate } from 'react-router-dom';

export function UserLoginForm() {
    const { register, handleSubmit } = useForm();
    const navigate = useNavigate();

    async function handleAutLogin(dados) {
        try {
            const usuario = await db.select().from(userTable).where(
                and(
                    eq(userTable.cpf, dados.cpf),
                    eq(userTable.senha, dados.senha)
                )
            ).limit(1);

            if (usuario && usuario.length > 0) {
                localStorage.setItem('usuarioLogado', 'true');
                localStorage.setItem('usuarioId', usuario[0].id);
                localStorage.setItem('usuarioNome', usuario[0].nome);
                navigate('/dashboard');
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
            <div className="input-icon cpf-icon">
                <input 
                    type="text" 
                    {...register('cpf', { required: "CPF é obrigatório" })} 
                    placeholder="Digite seu CPF"
                />
            </div>
            <div className="input-icon password-icon">
                <input 
                    type="password" 
                    {...register('senha', { required: "Senha é obrigatória" })} 
                    placeholder="Digite sua senha" 
                />
            </div>
            <button type="submit">Entrar</button>
        </form>
    );
}