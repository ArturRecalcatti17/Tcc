import React, { useState, useEffect } from 'react';
import { db } from '../db/config';
import { politicosTable } from '../db/schema/schema';
import { eq, desc } from 'drizzle-orm';
import '../styles/politicos.css';


export function Politicos() {
  const [politicos, setPoliticos] = useState([]);
  const [editandoPolitico, setEditandoPolitico] = useState(null);
  const [nomePolitico, setNomePolitico] = useState('');
  const [error, setError] = useState(null);


  const carregarPoliticos = async () => {
    try {
      const politicosData = await db
        .select()
        .from(politicosTable)
        .orderBy(desc(politicosTable.nome));
      setPoliticos(politicosData);
      setError(null);
    } catch (err) {
      console.error('Erro ao carregar políticos:', err);
      setError('Erro ao carregar políticos.');
    }
  };


  useEffect(() => {
    carregarPoliticos();
  }, []);


  const handleEditPolitico = (politico) => {
    setEditandoPolitico(politico.id);
    setNomePolitico(politico.nome);
  };


  const handleUpdatePolitico = async (e) => {
    e.preventDefault();
    try {
      await db
        .update(politicosTable)
        .set({ nome: nomePolitico })
        .where(eq(politicosTable.id, editandoPolitico))
        .returning();
      setEditandoPolitico(null);
      setNomePolitico('');
      await carregarPoliticos();
    } catch (error) {
      console.error('Erro ao atualizar político:', error);
      setError('Erro ao atualizar político.');
    }
  };


  const handleDeletePolitico = async (id) => {
    try {
      await db.delete(politicosTable).where(eq(politicosTable.id, id));
      await carregarPoliticos();
    } catch (error) {
      console.error('Erro ao excluir político:', error);
      setError('Erro ao excluir político.');
    }
  };


  return (
    <div>
      {error && <div className="error-message">{error}</div>}
      <h1 className='tituloPoli'>Lista de Políticos</h1>
      <ul className='ulDosPoli'>
      {politicos.slice(0, 10).map((politico) => (
          <li className='liDosPoli' key={politico.id}>
            {editandoPolitico === politico.id ? (
              <form className='formDosPoli' onSubmit={handleUpdatePolitico}>
                <input
                  type="text"
                  className='inputEdic'
                  value={nomePolitico}
                  onChange={(e) => setNomePolitico(e.target.value)}
                  required
                />
                <button className='atualizar' type="submit">Atualizar</button>
                <button className='cancelar' type="button" onClick={() => setEditandoPolitico(null)}>Cancelar</button>
              </form>
            ) : (
              <>
                <span className='spanNome'>{politico.nome}</span>
                <button className='editarButtonp' onClick={() => handleEditPolitico(politico)}>Editar</button>
                <button className='excluirButtonp' onClick={() => handleDeletePolitico(politico.id)}>Excluir</button>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}


