import { useForm } from "react-hook-form"
import { db } from "../db/config"
import { userTable } from "../db/schema/schema";
import { eq } from "drizzle-orm";
import bcrypt from 'bcryptjs'; // Certifique-se de instalar esta biblioteca


export function UserLoginForm() {

  const {register, handleSubmit} = useForm()


  async function handleAutLogin(dados) {
    try {
      // Consulta o banco de dados para encontrar o usuário pelo email
      const user = await db.select().from(userTable).where(eq(userTable.email, dados.email)).first();

      if (!user) {
        alert("Usuário não encontrado");
        return;
      }

      // Verifica se a senha está correta
      const senhaCorreta = await bcrypt.compare(dados.loginSenha, user.senha);

      if (!senhaCorreta) {
        alert("Senha incorreta");
        return;
      }

      alert("Login bem-sucedido!");
      // Aqui você pode redirecionar o usuário ou realizar outras ações após o login
    } catch (error) {
      console.error("Erro ao fazer login:", error);
      alert("Erro ao fazer login");
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

