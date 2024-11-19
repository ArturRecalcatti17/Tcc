import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/configuracoesUsuario.css';

export function ConfiguracoesUsuario() {
  const navigate = useNavigate();
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

    try {
      localStorage.setItem('usuario', JSON.stringify(usuario));
      localStorage.setItem('usuarioNome', usuario.nome);
      setTimeout(() => {
        setLoading(false);
        alert('Informações atualizadas com sucesso!');
      }, 1000);
    } catch (error) {
      setError('Erro ao atualizar informações');
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('usuarioLogado');
    localStorage.removeItem('usuarioId');
    localStorage.removeItem('usuarioNome');
    localStorage.removeItem('authToken');
    localStorage.removeItem('usuario');
    navigate('/');
  };

  const handleDelete = () => {
    const confirmar = window.confirm('Tem certeza que deseja deletar sua conta?');
    if (confirmar) {
      localStorage.clear();
      navigate('/');
    }
  };

  return (
    <div className="configuracoes-usuario">
      <h1>{usuario.nome}</h1>
      {loading && <div className="loading">Carregando...</div>}
      {error && <div className="error">{error}</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="email">E-mail:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={usuario.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="senha">Senha:</label>
          <input
            type="password"
            id="senha"
            name="senha"
            value={usuario.senha}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="estado">Estado:</label>
          <input
            type="text"
            id="estado"
            name="estado"
            value={usuario.estado}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="cidade">Cidade:</label>
          <input
            type="text"
            id="cidade"
            name="cidade"
            value={usuario.cidade}
            onChange={handleChange}
            required
          />
        </div>

        <div className="notificacoes-section">
          <h2>Preferências de Notificação</h2>
          <div className="checkbox-group">
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
          <div className="checkbox-group">
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

        <div className="botoes-container">
          <button type="submit" className="btn-alterar">
            Alterar
          </button>
          <button 
            type="button" 
            className="btn-deletar"
            onClick={handleDelete}
          >
            Deletar
          </button>
          <button 
            type="button" 
            className="btn-sair"
            onClick={handleLogout}
          >
            Sair
          </button>
        </div>
      </form>
    </div>
  );
}