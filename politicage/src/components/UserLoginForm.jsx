import { useForm } from "react-hook-form"
import { db } from "../db/config"
import { userTable } from "../db/schema/schema";
import { and, eq } from "drizzle-orm";


export function UserLoginForm() {

  const {register, handleSubmit} = useForm()


  async function handleAutLogin(dados) {

    

    const usuario = await db.select().from(userTable).where(
      and(
        eq(userTable.email, dados.email),
        eq(userTable.senha, dados.senha)
      )

    ).limit(1);
    
    if (usuario){

    window.location.href = '/home';

    localStorage.setItem('usuarioLogado', 'true');
    
    localStorage.setItem('usuarioId', usuario[0].id);
    localStorage.setItem('usuarioNome', usuario[0].nome);
    
    console.log('Usuário logado com sucesso');
    }
  }
  return (
    <div>
      <form onSubmit={handleSubmit(handleAutLogin)}>
        <input 
          type="email" 
          {...register('email', { 
            required: "Email é obrigatório",
          })} 
          placeholder="Digite seu email"
        />
        <input 
          type="password" 
          {...register('loginSenha', { 
            required: "Senha é obrigatória",
          })} 
          placeholder="Digite sua senha" 
        />
        <button type="submit">Entrar
        </button>
      </form>
    </div>
  )
}

