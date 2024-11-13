import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { db } from '../db/config'; // Ajuste o caminho conforme necessário
import { userTable } from '../db/schema/schema'; // Ajuste o caminho conforme necessário
import { useNavigate } from 'react-router-dom';
import '../styles/userCadastro.css'

export function UserCadastroForm() {
    const navigate = useNavigate();
    const { register, handleSubmit, watch, reset } = useForm();
    const [estados, setEstados] = useState([]);
    const [cidades, setCidades] = useState([]);
    const [estadoSelecionado, setEstadoSelecionado] = useState('');

    useEffect(() => {
        fetch('https://servicodados.ibge.gov.br/api/v1/localidades/estados')
            .then(response => response.json())
            .then(data => {
                const estadosOrdenados = data.sort((a, b) => a.nome.localeCompare(b.nome));
                setEstados(estadosOrdenados);
            });
    }, []);

    // Atualizar cidades quando o estado mudar
    const handleEstadoChange = (event) => {
        const estadoId = event.target.value;
        setEstadoSelecionado(estadoId);
        
        if (estadoId) {
            fetch(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${estadoId}/municipios`)
                .then(response => response.json())
                .then(data => {
                    const cidadesOrdenadas = data.sort((a, b) => a.nome.localeCompare(b.nome));
                    setCidades(cidadesOrdenadas);
                });
        } else {
            setCidades([]);
        }
    };

    function formatarCPF(value) {
        value = value.replace(/\D/g, '');
        
        value = value.slice(0, 11);
        
        value = value.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
        
        return value;
    }

    const handleCPFChange = (event) => {
        const { value } = event.target;
        const formattedValue = formatarCPF(value);
        event.target.value = formattedValue;
    };

    async function handleFormSubmit(dados) {
        try {
            // Validação dos campos da data
            const dia = parseInt(dados.diaNascimento);
            const mes = parseInt(dados.mesNascimento);
            const ano = parseInt(dados.anoNascimento);

            // Validação básica dos valores
            if (dia < 1 || dia > 31 || mes < 1 || mes > 12 || ano < 1900 || ano > 2024) {
                alert("Data de nascimento inválida");
                return;
            }

            // Validação de meses com 30 dias
            if ([4, 6, 9, 11].includes(mes) && dia > 30) {
                alert("Data inválida: este mês tem apenas 30 dias");
                return;
            }

            // Validação especial para fevereiro
            if (mes === 2) {
                const ehBissexto = (ano % 4 === 0 && ano % 100 !== 0) || (ano % 400 === 0);
                if ((ehBissexto && dia > 29) || (!ehBissexto && dia > 28)) {
                    alert("Data inválida: fevereiro tem apenas 29 dias em anos bissextos");
                    return;
                }
            }

            const dataNascimento = new Date(
                parseInt(dados.anoNascimento),
                parseInt(dados.mesNascimento) - 1,  
                parseInt(dados.diaNascimento)  
            );

            if (isNaN(dataNascimento.getTime())) {
                alert("Data de nascimento inválida");
                return;
            }

            // Verificar idade mínima (por exemplo, 16 anos)
            const hoje = new Date();
            const idade = hoje.getFullYear() - dataNascimento.getFullYear();
            if (idade < 16) {
                alert("Você precisa ter pelo menos 16 anos para se cadastrar");
                return;
            }

            // Encontrar o estado e cidade selecionados
            const estado = estados.find(e => e.id.toString() === dados.estado);
            const cidade = cidades.find(c => c.id.toString() === dados.cidade);

            await db.insert(userTable).values({
                nome: dados.nome,
                email: dados.email,
                senha: dados.senha,
                cpf: dados.cpf,
                uf: estado?.sigla || '', // Salvando a sigla do estado
                cidade: cidade?.nome || '', // Salvando o nome da cidade
                data_nasc: dataNascimento
            });

            alert("Cadastro realizado com sucesso!");
            reset();
            navigate('/');
            
        } catch (error) {
            console.error("Erro ao cadastrar usuário:", error);
            alert("Erro ao realizar cadastro. Por favor, tente novamente.");
        }
    }

    return (
        <form onSubmit={handleSubmit(handleFormSubmit)} className="cadastro-form">
            <h2 className='cadastre-seaqui'>CADATRE-SE AQUI</h2>
            <div className="input-icon user-icon">
                <input 
                    type="text" 
                    {...register('nome', { required: true })} 
                    placeholder="Nome completo*" 
                />
            </div>

            <div className="input-icon email-icon">
                <input 
                    type="email" 
                    {...register('email', { required: true })} 
                    placeholder="E-mail*" 
                />
            </div>

            <div className="input-icon cpf-icon">
                <input 
                    type="text" 
                    {...register('cpf', { required: true })} 
                    placeholder="CPF*"
                    maxLength="14"
                    onChange={handleCPFChange}
                />
            </div>

            <div className="input-icon password-icon">
                <input 
                    type="password" 
                    {...register('senha', { required: true })} 
                    placeholder="Senha*" 
                />
            </div>

            <div className="local_inputs">
                <select 
                    {...register('estado', { required: true })} 
                    onChange={handleEstadoChange}
                >
                    <option value="">UF*</option>
                    {estados.map(estado => (
                        <option key={estado.id} value={estado.id}>
                            {estado.nome} - {estado.sigla}
                        </option>
                    ))}
                </select>

                <select className='cidade'
                    {...register('cidade', { required: true })}
                    disabled={!estadoSelecionado}
                >
                    <option value="">Cidade*</option>
                    {cidades.map(cidade => (
                        <option key={cidade.id} value={cidade.id}>
                            {cidade.nome}
                        </option>
                    ))}
                </select>
            </div>

            <p className='legenda'>Data de Nascimento:*</p>
            <div className="date-inputs">
                <input 
                    type="number" 
                    {...register('diaNascimento', { required: true })} 
                    placeholder="Dia*"
                    min="1"
                    max="31"
                />

                <input 
                    type="number" 
                    {...register('mesNascimento', { required: true })} 
                    placeholder="Mês*"
                    min="1"
                    max="12"
                />

                <input 
                    type="number" 
                    {...register('anoNascimento', { required: true })} 
                    placeholder="Ano*"
                    min="1900"
                    max={new Date().getFullYear()}
                />
            </div>

            <div className="termos">
                <p>As pessoas que usam nosso serviço podem ter carregado suas informações de contato no <br />Medium. <span>Saiba mais. </span></p>
                <p>Ao clicar em Cadastre-se, você concorda com nossos <span> Termos</span>, <span>Política de Privacidade</span> e <span>Política  <br /> de Cookies</span>. Você poderá receber notificações por SMS e cancelar isso quando quiser.</p>
            </div>


            <button className='btnCadastrar' type="submit">CADASTRE-SE</button>
        </form>
);
}