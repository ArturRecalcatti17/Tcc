import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/sobreNos.css'; // Importando o CSS

export function SobreNos() {
  return (
    <div className="sobre-nos">
      <h1>Sobre Nós</h1>
      <p>
        O Politicagem é um trabalho de conclusão de curso criado pelos alunos Artur Bordignon e Davi Steiner. A nossa ideia é criar um site onde qualquer pessoa possa acessar e ter acesso aos dados e informações de deputados de forma livre e gratuita.
      </p>
      <Link to="/" className="btn-voltar">Voltar ao site</Link>
    </div>
  );
}