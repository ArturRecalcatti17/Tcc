localStorage.setItem('usuarioLogado', false)

export function Home(){
  return (
    <h1>logado com sucesso</h1>
  )
}

console.log(localStorage.getItem('usuarioLogado'));