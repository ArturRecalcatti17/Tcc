import React, { useEffect, useState } from 'react';
import { useForm } from "react-hook-form";
import { db } from '../db/config';
import { userTable } from '../db/schema/schema';


export function UserCadastroForm() {
  
  const { register, handleSubmit, watch } = useForm();
	const [estados, setEstados] = useState([]);
	const [cidades, setCidades] = useState([]);
	const estadoSelecionado = watch('estado');
  
  useEffect(() => {
    fetch('https://servicodados.ibge.gov.br/api/v1/localidades/estados')
      .then(response => response.json())
      .then(data => setEstados(data));
  }, []);

	useEffect(() => {
		if (estadoSelecionado) {
			fetch(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${estadoSelecionado}/municipios`)
				.then(response => response.json())
				.then(data => setCidades(data));
		}
	}, [estadoSelecionado]);

	// Adicione esta função auxiliar no início do componente
	function formatarCPF(cpf) {
		cpf = cpf.replace(/\D/g, ''); // Remove caracteres não numéricos
		return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
	}

	async function handleFormSubmit(dados) {
		try {
			const dataNascimento = new Date(
				parseInt(dados.diaNascimento),
				parseInt(dados.mesNascimento) - 1, 
				parseInt(dados.anoNascimento),
				
			);

			if (isNaN(dataNascimento.getTime())) {
				throw new Error("Data de nascimento inválida");
			}

			const estadoSelecionado = estados.find(estado => estado.id === parseInt(dados.estado));
			const cidadeSelecionada = cidades.find(cidade => cidade.id === parseInt(dados.cidade));
			
			await db.insert(userTable).values({
				nome: dados.nome,
				email: dados.email,
				senha: dados.senha,
				cpf: formatarCPF(dados.cpf),
				uf: estadoSelecionado ? estadoSelecionado.sigla : '',
				cidade: cidadeSelecionada ? cidadeSelecionada.nome : '',
				data_nasc: dataNascimento
			});
			console.log("Usuário cadastrado com sucesso:", dados);
		} catch (error) {
			console.error("Erro ao cadastrar usuário:", error);
		}
	}

	return (
		<main>
			<div>
				<form onSubmit={handleSubmit(handleFormSubmit)}>
					<input type="text" {...register('nome')} placeholder="Digite seu nome Completo" />
					<input type="email" {...register('email')} placeholder="Digite seu e-mail" />
					<input type="text" {...register('cpf')} placeholder="Digite seu CPF" />
					<input type="password" {...register('senha')} placeholder="Digite sua senha" />
					
					<select {...register('estado')}>
						<option value="">Selecione um estado</option>
						{(estados).map(estado => (
							<option key={estado.id} value={estado.id}>{estado.nome}</option>
						))}
					</select>
					
					<select {...register('cidade')}>
						<option value="">Selecione uma cidade</option>
						{(cidades).map(cidade => (
							<option key={cidade.id} value={cidade.id}>{cidade.nome}</option>
						))}
					</select>
					<div>
						<label htmlFor="dataNascimento">Data de Nascimento:</label>
						<input type="number" {...register('diaNascimento')} placeholder="Dia" min="1" max="31" />
						<input type="number" {...register('mesNascimento')} placeholder="Mês" min="1" max="12" />
						<input type="number" {...register('anoNascimento')} placeholder="Ano" min="1900" max={new Date().getFullYear()} />
					</div>


					<button type="submit">Cadastrar</button>
				</form>
			</div>
		</main>
	);
}

export default UserCadastroForm;
