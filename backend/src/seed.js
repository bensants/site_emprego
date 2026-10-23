import mongoose from 'mongoose';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import User from './models/User.js';
import Oportunidade from './models/Oportunidade.js';
import Curriculo from './models/Curriculo.js';
import Contrato from './models/Contrato.js';
import PostComunidade from './models/PostComunidade.js';
import SalaEntrevista from './models/SalaEntrevista.js';
import Candidatura from './models/Candidatura.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const MONGODB_URI =
  process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/obidos-connect';

const seedData = async () => {
  try {
    console.log('Conectando ao MongoDB para inicialização de dados...');
    await mongoose.connect(MONGODB_URI);
    console.log('Conectado. Limpando dados antigos...');

    await Promise.all([
      User.deleteMany({}),
      Oportunidade.deleteMany({}),
      Curriculo.deleteMany({}),
      Contrato.deleteMany({}),
      PostComunidade.deleteMany({}),
      SalaEntrevista.deleteMany({}),
      Candidatura.deleteMany({}),
    ]);

    console.log('Inserindo usuários padrão com endereços regionais...');
    const users = await User.create([
      {
        nome: 'Maria Pauxis',
        email: 'maria.pauxis@obidos.com.br',
        senha: 'obidos123',
        tipo: 'candidato',
        telefone: '(93) 98412-3456',
        endereco: 'Av. Pref. Nelson Souza, 1177',
        bairro: 'Centro',
        cep: '68250-000',
        cidade: 'Óbidos',
        estado: 'PA',
        profissao: 'Engenheira Florestal',
        organizacao: 'Cooperativa Agroextrativista de Óbidos (COOPAO)',
        bio: 'Apaixonada por soluções tecnológicas para cooperativas e negócios do Baixo Amazonas.',
        coordenadas: { lat: -1.9212, lng: -55.5186 },
      },
      {
        nome: 'Cooperativa Agroextrativista de Óbidos (COOPAO)',
        email: 'coopao@obidos.com.br',
        senha: 'obidos123',
        tipo: 'empresa',
        telefone: '(93) 98111-2233',
        endereco: 'Rua Correia Pinto, 88 - Próximo ao Porto Fluvial',
        bairro: 'Centro',
        cep: '68250-000',
        cidade: 'Óbidos',
        estado: 'PA',
        profissao: 'Gestão Cooperativista',
        organizacao: 'COOPAO',
        bio: 'Cooperativa de produtores e extrativistas locais de castanha, cacau e açaí em Óbidos e comunidades ribeirinhas.',
        coordenadas: { lat: -1.9212, lng: -55.5178 },
      },
      {
        nome: 'Administrador Óbidos Conect',
        email: 'admin@obidos.com.br',
        senha: 'obidos123',
        tipo: 'admin',
        telefone: '(93) 98100-0000',
        endereco: 'Praça Barão do Rio Branco, 25',
        bairro: 'Centro Histórico',
        cep: '68250-000',
        cidade: 'Óbidos',
        estado: 'PA',
        profissao: 'Administrador da Plataforma',
        organizacao: 'Óbidos Conect Tech',
        bio: 'Equipe de governança e suporte técnico regional.',
        coordenadas: { lat: -1.9174, lng: -55.5195 },
      },
      {
        nome: 'Navegação Pauxis & Cargas Fluviais Ltda',
        email: 'contato@navegacaopauxis.com.br',
        senha: 'obidos123',
        tipo: 'empresa',
        telefone: '(93) 98122-3344',
        endereco: 'Terminal Hidroviário, Rua Rui Barbosa, 15',
        bairro: 'Porto de Óbidos',
        cep: '68250-000',
        cidade: 'Óbidos',
        estado: 'PA',
        profissao: 'Logística & Transporte Fluvial',
        organizacao: 'Navegação Pauxis',
        bio: 'Transporte de cargas e passageiros em comboios pelo estreito do Rio Amazonas.',
        coordenadas: { lat: -1.9225, lng: -55.5165 },
      },
      {
        nome: 'Carlos Eduardo Marinho',
        email: 'carlos.marinho@obidos.com.br',
        senha: 'obidos123',
        tipo: 'candidato',
        telefone: '(93) 98455-6677',
        endereco: 'Rua Dom Floriano, 430',
        bairro: 'São Francisco',
        cep: '68250-000',
        cidade: 'Óbidos',
        estado: 'PA',
        profissao: 'Eletricista Naval & Mecânico Fluvial',
        organizacao: 'Autônomo',
        bio: 'Manutenção de geradores, sistemas elétricos marítimos e motores diesel de popa e centro.',
        coordenadas: { lat: -1.9135, lng: -55.5220 },
      },
      {
        nome: 'Agência Pauxis Criativa & Turismo',
        email: 'criativa@pauxis.com.br',
        senha: 'obidos123',
        tipo: 'empresa',
        telefone: '(93) 98177-8899',
        endereco: 'Travessa Lauro Sodré, 90',
        bairro: 'Centro Histórico',
        cep: '68250-000',
        cidade: 'Óbidos',
        estado: 'PA',
        profissao: 'Design, Comunicação e Ecoturismo',
        organizacao: 'Agência Pauxis',
        bio: 'Divulgação da cultura obidense, cobertura do Carnapauxis e marketing para produtores locais.',
        coordenadas: { lat: -1.9168, lng: -55.5198 },
      },
      {
        nome: 'Raimunda Nonata dos Santos',
        email: 'raimunda.agro@obidos.com.br',
        senha: 'obidos123',
        tipo: 'candidato',
        telefone: '(93) 98433-2211',
        endereco: 'Rua Raimundo Chaves, 510',
        bairro: 'Santa Terezinha',
        cep: '68250-000',
        cidade: 'Óbidos',
        estado: 'PA',
        profissao: 'Técnica em Agropecuária e Manejo Sustentável',
        organizacao: 'Agricultura Familiar do Baixo Amazonas',
        bio: 'Especialista em cultivo de cacau em várzea, manejo de açaizais nativos e casas de farinha comunitárias.',
        coordenadas: { lat: -1.911, lng: -55.527 },
      },
      {
        nome: 'Madeireira & Carpintaria Naval Rio Amazonas',
        email: 'carpintaria.naval@obidos.com.br',
        senha: 'obidos123',
        tipo: 'empresa',
        telefone: '(93) 98144-5566',
        endereco: 'Avenida Independência, 750',
        bairro: 'Bairro de Fátima',
        cep: '68250-000',
        cidade: 'Óbidos',
        estado: 'PA',
        profissao: 'Construção Naval e Marcenaria Tradicional',
        organizacao: 'Estaleiro & Carpintaria Rio Amazonas',
        bio: 'Construção de bajolas, rabetas e embarcações regionais com madeira manejada certificada.',
        coordenadas: { lat: -1.908, lng: -55.5245 },
      },
      {
        nome: 'João Paulo Bentes',
        email: 'joao.bentes@obidos.com.br',
        senha: 'obidos123',
        tipo: 'candidato',
        telefone: '(93) 98488-9900',
        endereco: 'Travessa Marechal Rondon, 115',
        bairro: 'Cidade Nova',
        cep: '68250-000',
        cidade: 'Óbidos',
        estado: 'PA',
        profissao: 'Mestre Fluvial (Capitão de Cabotagem Fluvial)',
        organizacao: 'Comandante Autônomo',
        bio: 'Mais de 18 anos de experiência comandando empurradores e balsas no Baixo Amazonas e Trombetas.',
        coordenadas: { lat: -1.9195, lng: -55.531 },
      },
    ]);

    console.log('Inserindo oportunidades...');
    const oportunidades = await Oportunidade.insertMany([
      {
        titulo: 'Desenvolvedor(a) Web & Mobile Regional',
        descricao:
          'Desenvolvimento e sustentação de plataforma de rastreabilidade de produtos extrativistas (castanha e cacau) de Óbidos e região ribeirinha.',
        tipo: 'emprego',
        categoria: 'Tecnologia da Informação',
        salario: 'R$ 5.500,00',
        empresa: 'Cooperativa Agroextrativista de Óbidos (COOPAO)',
        localizacao: 'Óbidos, PA',
        modalidade: 'hibrido',
        tipo_contrato: 'CLT',
        requisitos: ['React / React Native', 'Node.js', 'Banco de Dados SQL/NoSQL', 'Residência em Óbidos ou disponibilidade para reuniões presenciais'],
        beneficios: ['Vale Alimentação', 'Plano de Saúde Regional', 'Auxílio Conectividade / Home Office'],
        status: 'aberta',
      },
      {
        titulo: 'Analista de Logística e Transporte Fluvial',
        descricao:
          'Gerenciamento de escalas de frotas de balsas e empurradores na rota Óbidos - Santarém - Manaus no estreito do Rio Amazonas.',
        tipo: 'emprego',
        categoria: 'Logística & Transporte',
        salario: 'R$ 4.800,00',
        empresa: 'Navegação Pauxis & Cargas Ltda',
        localizacao: 'Porto de Óbidos, PA',
        modalidade: 'presencial',
        tipo_contrato: 'CLT',
        requisitos: ['Experiência em logística fluvial', 'Conhecimento em normas da Capitania dos Portos', 'Excel intermediário/avançado'],
        beneficios: ['Seguro de Vida', 'Refeitório no local', 'Plano de Carreira'],
        status: 'aberta',
      },
      {
        titulo: 'Designer Gráfico e Social Media para Carnapauxis 2026',
        descricao:
          'Criação de identidade visual, materiais impressos e peças digitais para blocos e empreendimentos turísticos do Carnaval de Óbidos.',
        tipo: 'freelance',
        categoria: 'Design & Marketing',
        salario: 'R$ 3.200,00 (Projeto)',
        empresa: 'Agência Pauxis Criativa',
        localizacao: 'Centro Histórico, Óbidos, PA',
        modalidade: 'remoto',
        tipo_contrato: 'PJ / MEI',
        requisitos: ['Domínio de Photoshop/Illustrator ou Figma', 'Portfólio com foco em cultura amazônica e eventos', 'Agilidade em entregas'],
        beneficios: ['Pagamento em parcelas fixas', 'Crédito institucional e visibilidade regional'],
        status: 'aberta',
      },
      {
        titulo: 'Técnico(a) em Agropecuária e Manejo Sustentável',
        descricao:
          'Acompanhamento técnico de propriedades de agricultura familiar e pecuária em várzea e terra firme no município de Óbidos.',
        tipo: 'emprego',
        categoria: 'Agronomia & Meio Ambiente',
        salario: 'R$ 3.800,00',
        empresa: 'Instituto de Desenvolvimento Rural do Baixo Amazonas',
        localizacao: 'Zona Rural de Óbidos, PA',
        modalidade: 'presencial',
        tipo_contrato: 'CLT',
        requisitos: ['Curso Técnico em Agropecuária ou Engenharia Agronômica em andamento', 'CNH B ou AB', 'Facilidade com transporte fluvial de pequeno porte'],
        beneficios: ['Ajuda de custo para deslocamento', 'Equipamentos de proteção fornecidos', 'Bônus por metas rurais'],
        status: 'aberta',
      },
      {
        titulo: 'Consultoria para Implementação de E-commerce Regional',
        descricao:
          'Estruturação de loja virtual e integração de meios de pagamento para venda online de doces típicos e artesanato cerâmico de Óbidos.',
        tipo: 'projeto',
        categoria: 'Consultoria Empresarial',
        salario: 'R$ 4.000,00',
        empresa: 'Associação dos Artesãos e Produtores Locais de Óbidos',
        localizacao: 'Óbidos, PA',
        modalidade: 'remoto',
        tipo_contrato: 'Prestação de Serviços',
        requisitos: ['Experiência em plataformas de e-commerce (Shopify, Nuvemshop ou WooCommerce)', 'Integração com Correios e Jadlog Fluvial', 'Treinamento para equipe da associação'],
        beneficios: ['Horários flexíveis', 'Contrato com garantia jurídica'],
        status: 'aberta',
      },
      {
        titulo: 'Eletricista de Manutenção Predial e Comercial',
        descricao:
          'Manutenção preventiva e corretiva de instalações elétricas em estabelecimentos comerciais e pousadas históricas no centro de Óbidos.',
        tipo: 'servico',
        categoria: 'Serviços Gerais & Manutenção',
        salario: 'A combinar por diária / OS',
        empresa: 'Hotel & Pousada Serra da Escama',
        localizacao: 'Centro, Óbidos, PA',
        modalidade: 'presencial',
        tipo_contrato: 'Autônomo / Diarista',
        requisitos: ['Certificação NR-10 válida', 'Experiência comprovada com redes monofásicas e trifásicas', 'Disponibilidade para atendimentos emergenciais'],
        beneficios: ['Alimentação no local de trabalho', 'Pagamento imediato via Pix por OS finalizada'],
        status: 'aberta',
      },
    ]);

    console.log('Inserindo currículos de profissionais...');
    const curriculos = await Curriculo.insertMany([
      {
        titulo: 'Desenvolvedora Full-Stack & Soluções Amazônicas',
        nome_candidato: 'Mayara Albuquerque Pauxis',
        email: 'mayara.albuquerque@email.com',
        telefone: '(93) 98412-3456',
        cidade: 'Óbidos',
        estado: 'PA',
        resumo_profissional:
          'Engenheira de Software com 4 anos de experiência construindo aplicações web e móveis. Atuação forte em tecnologias modernas (React, TypeScript, Node.js) voltadas para o desenvolvimento sustentável e modernização de processos de cooperativas no Baixo Amazonas.',
        habilidades: ['React', 'Node.js', 'TypeScript', 'Tailwind CSS', 'MongoDB', 'Docker', 'Git'],
        experiencias: [
          {
            empresa: 'Tech Tapajós Inovação',
            cargo: 'Desenvolvedora Web Pleno',
            periodo: '2023 - Presente',
            descricao: 'Desenvolvimento de APIs RESTful e interfaces responsivas para clientes do oeste paraense.',
          },
          {
            empresa: 'Inova Óbidos Soluções Digitais',
            cargo: 'Desenvolvedora Front-end Júnior',
            periodo: '2021 - 2023',
            descricao: 'Criação de portais institucionais e sistemas de gestão escolar para municípios do Baixo Amazonas.',
          },
        ],
        formacao: [
          {
            instituicao: 'Universidade Federal do Oeste do Pará (UFOPA)',
            curso: 'Bacharelado em Sistemas de Informação',
            periodo: '2018 - 2022',
          },
        ],
        visibilidade: 'publico',
      },
      {
        titulo: 'Especialista em Gestão de Cooperativas e Agronegócio',
        nome_candidato: 'Carlos Henrique Viana',
        email: 'carlos.viana@email.com',
        telefone: '(93) 99123-8899',
        cidade: 'Óbidos',
        estado: 'PA',
        resumo_profissional:
          'Administrador com pós-graduação em Gestão de Cadeias Produtivas Sustentáveis. Vasta experiência na estruturação financeira de cooperativas de cacau e castanha-do-pará no município de Óbidos e Oriximiná.',
        habilidades: ['Gestão de Custos', 'Cooperativismo', 'Planejamento Estratégico', 'Negociação Comercial', 'Certificação Orgânica'],
        experiencias: [
          {
            empresa: 'Cooperativa de Produtores do Rio Curuá',
            cargo: 'Gerente Financeiro e Operacional',
            periodo: '2020 - 2024',
            descricao: 'Aumento de 42% no faturamento anual por meio de exportação direta de amêndoas de cacau rastreadas.',
          },
        ],
        formacao: [
          {
            instituicao: 'Instituto Federal do Pará (IFPA)',
            curso: 'Tecnologia em Gestão de Agronegócio',
            periodo: '2016 - 2019',
          },
        ],
        visibilidade: 'publico',
      },
      {
        titulo: 'Designer de Identidade Visual e Ilustrador Cultural',
        nome_candidato: 'Gabriel Souza Marinho',
        email: 'gabriel.marinho@design.com',
        telefone: '(93) 98177-6543',
        cidade: 'Óbidos',
        estado: 'PA',
        resumo_profissional:
          'Designer e artista visual com foco na valorização da cultura pauxis e ribeirinha. Criação de identidades visuais marcantes para comércios locais, eventos folclóricos e marcas de produtos regionais.',
        habilidades: ['Figma', 'Adobe Illustrator', 'Adobe Photoshop', 'Branding Regional', 'Ilustração Vetorial'],
        experiencias: [
          {
            empresa: 'Estúdio Raízes do Pará',
            cargo: 'Designer Criativo Líder',
            periodo: '2022 - Atual',
            descricao: 'Elaboração de marcas e embalagens ecológicas para mais de 25 produtores do Baixo Amazonas.',
          },
        ],
        formacao: [
          {
            instituicao: 'Centro Universitário Luterano de Santarém (CEULS/ULBRA)',
            curso: 'Comunicação Social com Habilitação em Publicidade e Propaganda',
            periodo: '2017 - 2021',
          },
        ],
        visibilidade: 'publico',
      },
      {
        titulo: 'Técnico em Logística Fluvial e Operações de Carga',
        nome_candidato: 'Roberto Nazareno Pinheiro',
        email: 'roberto.nazareno@log.com',
        telefone: '(93) 98844-1122',
        cidade: 'Óbidos',
        estado: 'PA',
        resumo_profissional:
          'Profissional com mais de 7 anos no gerenciamento de atracação, manifestos eletrônicos de carga fluvial e conformidade com a Capitania Fluvial de Santarém/Óbidos.',
        habilidades: ['Gestão de Frotas Fluviais', 'MTR e Manifestos', 'NR-35 e NR-11', 'Manuseio de Cargas Perigosas', 'Operações Portuárias'],
        experiencias: [
          {
            empresa: 'Porto Fluvial de Óbidos',
            cargo: 'Supervisor de Embarque e Desembarque',
            periodo: '2019 - 2024',
            descricao: 'Controle de carga e descarga de bauxita e grãos na calha do Rio Amazonas.',
          },
        ],
        formacao: [
          {
            instituicao: 'Escola de Formação de Aquaviários - CIABA / Marinha do Brasil',
            curso: 'Curso de Adaptação para Aquaviários - Módulo Fluvial',
            periodo: '2017',
          },
        ],
        visibilidade: 'publico',
      },
    ]);

    console.log('Inserindo candidaturas de teste...');
    await Candidatura.insertMany([
      {
        oportunidade_id: oportunidades[0]._id,
        candidato_id: users[0]._id,
        candidato_nome: users[0].nome,
        candidato_email: users[0].email,
        candidato_telefone: users[0].telefone,
        candidato_profissao: users[0].profissao,
        curriculo_id: curriculos[0]._id,
        mensagem: 'Olá equipe da COOPAO! Possuo ampla experiência com Node.js e React no Baixo Amazonas e adoraria contribuir com a rastreabilidade da safra de castanha e cacau.',
        status: 'em_analise',
      },
      {
        oportunidade_id: oportunidades[2]._id,
        candidato_id: users[0]._id,
        candidato_nome: 'Gabriel Souza Marinho',
        candidato_email: 'gabriel.marinho@design.com',
        candidato_telefone: '(93) 98177-6543',
        candidato_profissao: 'Designer e Ilustrador Cultural',
        curriculo_id: curriculos[2]._id,
        mensagem: 'Tenho interesse total em criar as artes do Carnapauxis 2026. Já produzi identidades para vários blocos locais!',
        status: 'entrevista',
      },
    ]);

    console.log('Inserindo contratos...');
    await Contrato.insertMany([
      {
        titulo: 'Desenvolvimento do Sistema de Rastreabilidade Agroextrativista',
        contratante_id: 'COOP-OBIDOS-01',
        contratante_nome: 'Cooperativa Agroextrativista de Óbidos (COOPAO)',
        contratado_id: curriculos[0]._id.toString(),
        contratado_nome: 'Mayara Albuquerque Pauxis',
        valor: 18500,
        forma_pagamento: 'Parcelado em 3x via Transferência Bancária',
        data_inicio: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        data_fim: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
        escopo_trabalho:
          'Construção de painel web para registro de lotes de castanha coletados nas comunidades ribeirinhas do Rio Curuá com geração de QR Code de procedência.',
        status: 'em_andamento',
        progresso: 65,
      },
      {
        titulo: 'Identidade Visual Completa para o Carnapauxis 2026',
        contratante_id: 'ASSOC-CARNA-02',
        contratante_nome: 'Liga dos Blocos Carnavalescos de Óbidos',
        contratado_id: curriculos[2]._id.toString(),
        contratado_nome: 'Gabriel Souza Marinho',
        valor: 6000,
        forma_pagamento: '50% na entrada e 50% na aprovação final',
        data_inicio: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
        data_fim: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000),
        escopo_trabalho:
          'Manual de marca, cartaz oficial, camisas dos blocos tradicionais, abadás e peças para divulgação nas redes sociais.',
        status: 'aceito',
        progresso: 30,
      },
      {
        titulo: 'Consultoria para Auditoria e Adequação Fiscal de Cooperativa',
        contratante_id: 'COOP-RIBEIRINHA-03',
        contratante_nome: 'Cooperativa Mista de Pescadores de Óbidos (COPESCA)',
        contratado_id: curriculos[1]._id.toString(),
        contratado_nome: 'Carlos Henrique Viana',
        valor: 12000,
        forma_pagamento: 'Mensal conforme entrega de relatórios',
        data_inicio: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000),
        data_fim: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        escopo_trabalho:
          'Auditoria das contas de 2024, regularização junto à Receita Federal e treinamento dos membros da diretoria sobre governança.',
        status: 'finalizado',
        progresso: 100,
      },
      {
        titulo: 'Manutenção de Infraestrutura de Fibra e Rádio Enlace Óbidos-Várzea',
        contratante_id: 'PROVEDOR-AMAZON-04',
        contratante_nome: 'Amazon Conecta Telecomunicações',
        contratado_id: 'PRESTADOR-TI-05',
        contratado_nome: 'Serviços Técnicos Integrados do Pará',
        valor: 8500,
        forma_pagamento: 'Pagamento único pós vistoria técnica',
        data_inicio: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
        data_fim: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000),
        escopo_trabalho:
          'Revisão dos mastros de comunicação na margem esquerda do Rio Amazonas e substituição de transceptores de longo alcance.',
        status: 'proposta',
        progresso: 0,
      },
    ]);

    console.log('Inserindo publicações na comunidade...');
    await PostComunidade.insertMany([
      {
        titulo: 'Guia Prático da LGPD para Prestadores de Serviço e MEIs de Óbidos',
        conteudo:
          'Com a consolidação da Lei Geral de Proteção de Dados (Lei nº 13.709/2018), mesmo autônomos e pequenos negócios que coletam dados de clientes para orçamentos e notas fiscais precisam tomar cuidados essenciais. Veja como arquivar com segurança e obter o consentimento correto de forma simples.',
        tipo: 'regulamentacao',
        categoria: 'Legislação & Conformidade',
        tags: ['LGPD', 'Privacidade', 'MEI', 'Direito Digital'],
        curtidas: 18,
        status: 'ativo',
        autor_nome: 'Dra. Amanda Teles',
        autor_cargo: 'Advogada Especialista em Direito Digital em Óbidos',
      },
      {
        titulo: 'Como formalizar seu negócio de artesanato e turismo em Óbidos pelo MEI',
        conteudo:
          'Passo a passo para emitir nota fiscal eletrônica pelo portal da Prefeitura Municipal de Óbidos, garantir benefícios previdenciários e participar de compras públicas locais com tratamento diferenciado.',
        tipo: 'dica',
        categoria: 'Empreendedorismo',
        tags: ['MEI', 'Nota Fiscal', 'Prefeitura de Óbidos', 'Economia Criativa'],
        curtidas: 27,
        status: 'ativo',
        autor_nome: 'Carlos Henrique Viana',
        autor_cargo: 'Consultor de Agronegócio e Cooperativismo',
      },
      {
        titulo: 'Encontro Conecta Baixo Amazonas: Inovação e Trabalho Remoto em 2026',
        conteudo:
          'Estão abertas as inscrições para o encontro que reunirá desenvolvedores, designers e profissionais liberais no Centro Cultural de Óbidos. Vamos debater trabalho remoto para empresas de todo o Brasil diretamente da nossa cidade.',
        tipo: 'evento',
        categoria: 'Eventos & Networking',
        tags: ['Networking', 'Trabalho Remoto', 'Tecnologia', 'Óbidos'],
        curtidas: 35,
        status: 'ativo',
        autor_nome: 'Mayara Albuquerque Pauxis',
        autor_cargo: 'Desenvolvedora Full-Stack',
      },
      {
        titulo: 'Governo do Estado anuncia expansão da conectividade escolar e comunitária na região',
        conteudo:
          'Comunidades do interior de Óbidos, incluindo localidades ribeirinhas do Lago Grande e Paraná de Baixo, receberão novos pontos de internet banda larga comunitária até o final do semestre, facilitando o estudo e trabalho online.',
        tipo: 'noticia',
        categoria: 'Infraestrutura & Tecnologia',
        tags: ['Conectividade', 'Educação', 'Baixo Amazonas', 'Internet'],
        curtidas: 42,
        status: 'ativo',
        autor_nome: 'Redação Óbidos Connect',
        autor_cargo: 'Equipe de Notícias Regionais',
      },
      {
        titulo: 'Qual a sua experiência combinando trabalho remoto com os horários e conexões locais?',
        conteudo:
          'Gostaria de abrir essa discussão para quem atua em home office em Óbidos: quais no-breaks e soluções de contingência de energia e internet vocês utilizam para manter estabilidade nas reuniões com clientes de outros estados?',
        tipo: 'discussao',
        categoria: 'Carreira & Home Office',
        tags: ['Home Office', 'Dicas', 'Produtividade', 'Infraestrutura'],
        curtidas: 14,
        status: 'ativo',
        autor_nome: 'Gabriel Souza Marinho',
        autor_cargo: 'Designer e Freelancer',
        
      },
    ]);

    console.log('Inserindo salas de entrevistas...');
    await SalaEntrevista.insertMany([
      {
        titulo: 'Entrevista Técnica: Mayara Albuquerque - Desenvolvedora Web Full Stack',
        candidato_nome: 'Mayara Albuquerque Pauxis',
        empresa_nome: 'Cooperativa Agroextrativista de Óbidos (COOPAO)',
        data_agendada: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000 + 4 * 60 * 60 * 1000),
        duracao_minutos: 60,
        link_reuniao: 'https://meet.jit.si/obidos-connect-entrevista-tech-01',
        status: 'agendada',
        observacoes:
          'Avaliação prática sobre arquitetura da API em Node.js e componentes React para o módulo de rastreio de safra.',
      },
      {
        titulo: 'Alinhamento de Escopo: Gabriel Marinho - Design Carnapauxis',
        candidato_nome: 'Gabriel Souza Marinho',
        empresa_nome: 'Liga dos Blocos Carnavalescos de Óbidos',
        data_agendada: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000),
        duracao_minutos: 45,
        link_reuniao: 'https://meet.jit.si/obidos-connect-alinhamento-design',
        status: 'agendada',
        observacoes:
          'Reunião com a comissão organizadora para aprovar a paleta cromática e símbolos dos Mascarados Fobós.',
      },
      {
        titulo: 'Entrevista Operacional: Roberto Pinheiro - Supervisão Portuária',
        candidato_nome: 'Roberto Nazareno Pinheiro',
        empresa_nome: 'Navegação Pauxis & Cargas Ltda',
        data_agendada: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        duracao_minutos: 40,
        link_reuniao: 'https://meet.jit.si/obidos-connect-entrevista-porto',
        status: 'finalizada',
        observacoes:
          'Candidato aprovado na etapa técnica com excelente pontuação em manobras e segurança aquaviária.',
      },
    ]);

    console.log('✅ Seed executado com sucesso no Óbidos Connect!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Erro durante o seed do banco:', error);
    process.exit(1);
  }
};

seedData();
