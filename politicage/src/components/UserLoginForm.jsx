import { useForm } from "react-hook-form"
import { useState } from "react"
import axios from "axios"

export function UserLoginForm() {
  const { register, handleSubmit, formState: { errors } } = useForm()
  const [error, setError] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  async function handleAutLogin(dados) {
    setIsLoading(true)
    setError(null)

    try {
      const response = await axios.post('http://localhost:3333', {
        email: dados.loginEmail,
        senha: dados.loginSenha
      })

      const { token, usuario } = response.data

      // Salvar o token no localStorage
      localStorage.setItem('authToken', token)

      // Salvar informações do usuário no localStorage ou em um estado global
      localStorage.setItem('usuario', JSON.stringify(usuario))

      console.log('Login bem-sucedido')
      // Aqui você pode redirecionar o usuário ou atualizar o estado da aplicação
      // Por exemplo: history.push('/dashboard')
    } catch (erro) {
      if (erro.response) {
        // O servidor respondeu com um status de erro
        setError(erro.response.data.mensagem || "Falha na autenticação. Verifique seu email e senha.")
      } else if (erro.request) {
        // A requisição foi feita mas não houve resposta
        setError("Não foi possível conectar ao servidor. Tente novamente mais tarde.")
      } else {
        // Algo aconteceu na configuração da requisição que causou o erro
        setError("Ocorreu um erro ao tentar fazer login. Tente novamente.")
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div>
      <form onSubmit={handleSubmit(handleAutLogin)}>
        <input 
          type="email" 
          {...register('loginEmail', { 
            required: "Email é obrigatório",
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: "Endereço de email inválido"
            }
          })} 
          placeholder="Digite seu email"
        />
        {errors.loginEmail && <span>{errors.loginEmail.message}</span>}

        <input 
          type="password" 
          {...register('loginSenha', { 
            required: "Senha é obrigatória",
            minLength: {
              value: 5,
              message: "A senha deve ter pelo menos 6 caracteres"
            }
          })} 
          placeholder="Digite sua senha" 
        />
        {errors.loginSenha && <span>{errors.loginSenha.message}</span>}

        <button type="submit" disabled={isLoading}>
          {isLoading ? "Entrando..." : "Entrar"}
        </button>
      </form>
      {error && <p className="error-message">{error}</p>}
    </div>
  )
}