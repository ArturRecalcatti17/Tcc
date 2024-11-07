import React, { useState, useEffect } from 'react';

export function ConfiguracoesUsuario() {
  const [usuario, setUsuario] = useState({
    nome: '',
    email: '',
    senha: '',
    estado: '',
    cidade: '',
  });
  const [notificacoes, setNotificacoes] = useState({
    emailNotificacoes: false,
    smsNotificacoes: false,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Aqui você pode buscar as informações do usuário de uma API ou do armazenamento local
    const usuarioSalvo = JSON.parse(localStorage.getItem('usuario'));
    if (usuarioSalvo) {
      setUsuario(usuarioSalvo);
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUsuario({ ...usuario, [name]: value });
  };

  const handleNotificacoesChange = (e) => {
    const { name, checked } = e.target;
    setNotificacoes({ ...notificacoes, [name]: checked });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Aqui você pode enviar as informações atualizadas para uma API
    localStorage.setItem('usuario', JSON.stringify(usuario));
    // Simulação de sucesso
    setTimeout(() => {
      setLoading(false);
      alert('Informações atualizadas com sucesso!');
    }, 1000);
  };

  return (
    <div className="configuracoes-usuario">
      <h1>Configurações do Usuário</h1>
      {loading && <div>Carregando...</div>}
      {error && <div>{error}</div>}
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="nome">Nome:</label>
          <input
            type="text"
            name="nome"
            value={usuario.nome}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="email">E-mail:</label>
          <input
            type="email"
            name="email"
            value={usuario.email}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="senha">Senha:</label>
          <input
            type="password"
            name="senha"
            value={usuario.senha}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="estado">Estado:</label>
          <input
            type="text"
            name="estado"
            value={usuario.estado}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="cidade">Cidade:</label>
          <input
            type="text"
            name="cidade"
            value={usuario.cidade}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <h2>Preferências de Notificação</h2>
          <div>
            <label>
              <input
                type="checkbox"
                name="emailNotificacoes"
                checked={notificacoes.emailNotificacoes}
                onChange={handleNotificacoesChange}
              />
              Receber notificações por e-mail
            </label>
          </div>
          <div>
            <label>
              <input
                type="checkbox"
                name="smsNotificacoes"
                checked={notificacoes.smsNotificacoes}
                onChange={handleNotificacoesChange}
              />
              Receber notificações por SMS
            </label>
          </div>
        </div>
        <button type="submit">Salvar Alterações</button>
      </form>
    </div>
  );
}