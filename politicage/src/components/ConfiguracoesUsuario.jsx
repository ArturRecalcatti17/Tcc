import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { db } from '../db/config';
import { userTable, avaliacao, comentario } from '../db/schema/schema';
import { eq } from 'drizzle-orm';
import '../styles/configuracoesUsuario.css';

export function ConfiguracoesUsuario() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    senha: '',
    estado: '',
    cidade: ''
  });

  const [ufs, setUfs] = useState([]);
  const [cidades, setCidades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userId = localStorage.getItem('usuarioId');
        
        if (!userId) {
          throw new Error('Usuário não encontrado');
        }

        const userData = await db.select({
          nome: userTable.nome,
          email: userTable.email,
          senha: userTable.senha,
          uf: userTable.uf,
          cidade: userTable.cidade
        })
        .from(userTable)
        .where(eq(userTable.id, userId))
        .limit(1);

        if (userData && userData[0]) {
          setFormData({
            nome: userData[0].nome || '',
            email: userData[0].email || '',
            senha: userData[0].senha || '',
            estado: userData[0].uf || '',
            cidade: userData[0].cidade || ''
          });
        }
        setLoading(false);
      } catch (err) {
        setError('Erro ao carregar dados do usuário');
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  useEffect(() => {
    fetch('https://servicodados.ibge.gov.br/api/v1/localidades/estados?orderBy=nome')
      .then(response => response.json())
      .then(data => {
        setUfs(data);
        setLoading(false);
      })
      .catch(error => {
        setError('Erro ao carregar estados');
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (formData.estado) {
      setLoading(true);
      setCidades([]); // Limpar cidades anteriores
      fetch(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${formData.estado}/municipios`)
        .then(response => response.json())
        .then(data => {
          setCidades(data);
          setLoading(false);
        })
        .catch(error => {
          setError('Erro ao carregar cidades');
          setLoading(false);
        });
    } else {
      setCidades([]);
    }
  }, [formData.estado]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
      ...(name === 'estado' ? { cidade: '' } : {})
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const userId = localStorage.getItem('usuarioId');
      
      if (!userId) {
        throw new Error('Usuário não encontrado');
      }

      // Atualizar dados no banco
      await db.update(userTable)
        .set({
          nome: formData.nome,
          email: formData.email,
          senha: formData.senha,
          uf: formData.estado,
          cidade: formData.cidade
        })
        .where(eq(userTable.id, userId));

      setLoading(false);
      alert('Alterações salvas com sucesso!');
    } catch (err) {
      setError('Erro ao salvar alterações. Por favor, tente novamente.');
      setLoading(false);
      console.error('Erro ao atualizar:', err);
    }
  };

  const handleDelete = async () => {
    const confirmar = window.confirm('Tem certeza que deseja deletar sua conta? Esta ação não pode ser desfeita.');
    
    if (confirmar) {
      try {
        setLoading(true);
        const userId = localStorage.getItem('usuarioId');
        
        if (!userId) {
          throw new Error('Usuário não encontrado');
        }

        // Primeiro, deletar registros relacionados (avaliações e comentários)
        await db.delete(avaliacao)
          .where(eq(avaliacao.id_usuario, userId));

        await db.delete(comentario)
          .where(eq(comentario.id_usuario, userId));

        // Por fim, deletar o usuário
        await db.delete(userTable)
          .where(eq(userTable.id, userId));

        // Limpar localStorage e redirecionar
        localStorage.clear();
        navigate('/');
        
      } catch (error) {
        setError('Erro ao deletar conta. Por favor, tente novamente.');
        console.error('Erro ao deletar conta:', error);
        setLoading(false);
      }
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  if (loading) {
    return <div className="loading">Carregando...</div>;
  }

  return (
    <section className="configuracoes-section">
      <div className="configuracoes-container">
        <h1>Configurações da Conta</h1>
        
        {error && <div className="error-message">{error}</div>}
        
        <form onSubmit={handleSubmit} className="configuracoes-form">
          <div className="form-group">
            <input
              type="text"
              id="nome"
              name="nome"
              value={formData.nome}
              onChange={handleChange}
              required
              placeholder="Nome"
            />
          </div>

          <div className="form-group">
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="Email"
            />
          </div>

          <div className="form-group">
            <input
              type="password"
              id="senha"
              name="senha"
              value={formData.senha}
              onChange={handleChange}
              required
              placeholder="Senha"
            />
          </div>

          <div className="localizacao-group">
            <div className="form-group">
              <select
                id="estado"
                name="estado"
                value={formData.estado}
                onChange={handleChange}
                required
                style={{ zIndex: 2 }}
              >
                <option value="">Selecione um estado</option>
                {ufs.map(uf => (
                  <option key={uf.id} value={uf.sigla}>
                    {uf.nome} - {uf.sigla}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <select
                id="cidade"
                name="cidade"
                value={formData.cidade}
                onChange={handleChange}
                required
                style={{ zIndex: 2, pointerEvents: 'auto' }}
              >
                <option value="">Selecione uma cidade</option>
                {cidades.map(cidade => (
                  <option key={cidade.id} value={cidade.nome}>
                    {cidade.nome}
                  </option>
                ))}
              </select>
            </div>  
          </div>

          <div className="botoes-container">
            <button type="submit" className="btn-confirmar">
              Alterar
            </button>
            <button 
              type="button" 
              className="btn-deletar"
              onClick={handleDelete}
              disabled={loading}
            >
              {loading ? 'Deletando...' : 'Deletar Conta'}
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
    </section>
  );
}
