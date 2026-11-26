/* =========================================================================
   AUDITORIAS — MODELOS DE CHECKLIST PADRÃO (carga inicial)
   Montados a partir do PG 02 / RG 12 / RG 71, dos requisitos da ISO 9001:2015
   e do que mais apareceu nas auditorias de 2024 (bipagem, etiquetas,
   armazenamento, comprovantes de entrega, treinamentos, fornecedores...).
   Na 1ª vez que o módulo abre, estes modelos são gravados no Firestore
   (auditoria_modelos); depois a qualidade edita tudo pela própria tela.
   Cada item: s = seção, i = item ISO, p = pergunta, d = documento de referência
   ========================================================================= */

const COMUNS = [
  { s: 'Informação documentada', i: '7.5.3', p: 'Os documentos usados no processo estão na revisão vigente (conferir com a Biblioteca de Documentos) e não há cópias obsoletas em uso?', d: 'PG 01' },
  { s: 'Competência', i: '7.2', p: 'Os colaboradores do processo têm os treinamentos exigidos para a função registrados (RG 22 / RG 24)?', d: 'PG 05' },
  { s: 'Conscientização', i: '7.3', p: 'Os colaboradores entrevistados conhecem a política da qualidade, os objetivos do processo e as consequências de não atender aos requisitos?', d: 'Manual da Qualidade' },
  { s: 'Riscos e oportunidades', i: '6.1', p: 'Os riscos e oportunidades do processo estão identificados e as ações definidas estão sendo executadas?', d: 'Manual da Qualidade' },
  { s: 'Monitoramento', i: '9.1', p: 'Os indicadores do processo estão sendo medidos, atualizados e analisados (RG 06)?', d: 'RG 06' },
  { s: 'Ações corretivas', i: '10.2', p: 'As não conformidades anteriores do processo foram tratadas e as ações foram verificadas quanto à eficácia (RG 34/RG 35)?', d: 'PG 04' },
];

export const MODELOS_PADRAO = [
  {
    id: 'direcao', nome: 'Direção', processo: 'Direção', tipo: 'sistema',
    itens: [
      { s: 'Contexto', i: '4.1 / 4.2', p: 'As questões internas e externas e as partes interessadas foram analisadas e estão atualizadas?', d: 'Manual da Qualidade' },
      { s: 'Liderança', i: '5.1', p: 'A direção demonstra liderança e comprometimento com o SGI (recursos, comunicação, participação nas análises críticas)?', d: 'Manual da Qualidade' },
      { s: 'Política', i: '5.2', p: 'A política da qualidade está documentada, comunicada (murais, integração) e entendida?', d: 'Manual da Qualidade' },
      { s: 'Objetivos', i: '6.2', p: 'Os objetivos da qualidade são mensuráveis, têm responsável e prazo, e estão sendo acompanhados?', d: 'RG 06' },
      { s: 'Comunicação', i: '7.4', p: 'Os murais e quadros de indicadores estão atualizados conforme a frequência definida no Manual da Qualidade?', d: 'Manual da Qualidade' },
      { s: 'Análise crítica', i: '9.3', p: 'A análise crítica pela direção foi realizada com todas as entradas exigidas e as saídas (decisões e ações) estão registradas?', d: 'Manual da Qualidade' },
      { s: 'Mudanças', i: '6.3', p: 'As mudanças no SGI foram planejadas e controladas?', d: 'PG 04' },
      ...COMUNS.slice(3),
    ],
  },
  {
    id: 'qualidade', nome: 'Qualidade (SGI)', processo: 'Qualidade', tipo: 'sistema',
    itens: [
      { s: 'Informação documentada', i: '7.5', p: 'A Lista Mestra / Biblioteca está atualizada e os documentos foram aprovados antes da emissão?', d: 'PG 01' },
      { s: 'Distribuição', i: '7.5.3', p: 'A distribuição dos documentos às unidades está registrada (RG 09)?', d: 'RG 09' },
      { s: 'Auditorias internas', i: '9.2', p: 'O programa anual de auditorias (RG 11) foi elaborado, aprovado e está sendo cumprido?', d: 'PG 02 / RG 11' },
      { s: 'Auditorias internas', i: '9.2', p: 'Os auditores são qualificados e independentes da área auditada (registro de formação de auditor)?', d: 'PG 02' },
      { s: 'Auditorias internas', i: '9.2', p: 'Os relatórios (RG 12) e a ata de encerramento (RG 13) do último ciclo estão arquivados?', d: 'RG 12 / RG 13' },
      { s: 'Não conformidades', i: '8.7 / 10.2', p: 'As ocorrências (RG 21 / RG 29) estão sendo registradas, analisadas e tratadas no prazo?', d: 'PG 03' },
      { s: 'Ações corretivas', i: '10.2', p: 'As ações (RG 34/RG 35) têm análise de causa, plano de ação e verificação de eficácia registrados?', d: 'PG 04' },
      { s: 'Requisitos legais', i: '6.1.3', p: 'Os requisitos legais aplicáveis (RG 10) estão levantados e as licenças/documentos estão dentro da validade?', d: 'RG 10' },
      { s: 'Satisfação do cliente', i: '9.1.2', p: 'A satisfação do cliente é monitorada e os resultados são analisados?', d: 'PG 06' },
      { s: 'Melhoria', i: '10.3', p: 'Há evidências de melhoria contínua (projetos, ações de melhoria implementadas)?', d: 'Manual da Qualidade' },
    ],
  },
  {
    id: 'comercial', nome: 'Comercial', processo: 'Comercial', tipo: 'sistema',
    itens: [
      { s: 'Requisitos do cliente', i: '8.2.2', p: 'Os requisitos do cliente (prazos, restrições, produtos, agendamento) são levantados antes de aceitar o serviço?', d: 'PG 06' },
      { s: 'Análise crítica', i: '8.2.3', p: 'As cotações/propostas são analisadas antes do envio (tabela vigente, capacidade de atendimento)?', d: 'IT 01' },
      { s: 'Cotações', i: '8.2.3', p: 'As cotações estão registradas no SSW (opção 002) com o retorno ao cliente?', d: 'IT 01' },
      { s: 'Mudanças', i: '8.2.4', p: 'Alterações acordadas com o cliente são comunicadas às áreas envolvidas?', d: 'PG 06' },
      { s: 'Comunicação com o cliente', i: '8.2.1', p: 'As reclamações recebidas são registradas e encaminhadas (RG 29)?', d: 'PG 03' },
      { s: 'Satisfação', i: '9.1.2', p: 'A pesquisa de satisfação foi aplicada no período e os resultados foram analisados?', d: 'PG 06' },
      { s: 'Tabelas de frete', i: '8.2', p: 'As tabelas de frete no SSW estão atualizadas e com reajustes aprovados?', d: 'PG 06' },
      ...COMUNS.slice(0, 2),
      COMUNS[5],
    ],
  },
  {
    id: 'operacao', nome: 'Operação (depósito / expedição)', processo: 'Operação', tipo: 'sistema',
    itens: [
      { s: 'Recebimento', i: '8.5.2 / 8.5.3', p: 'As mercadorias recebem a etiqueta logo após o descarregamento e são bipadas na porta do veículo?', d: 'IT 02 / IT 05' },
      { s: 'Recebimento', i: '8.5.3 / 8.7', p: 'Avarias, faltas e sobras são identificadas na chegada e registradas (RG 29)?', d: 'IT 05 / PG 03' },
      { s: 'Armazenamento', i: '8.5.4', p: 'As caixas estão armazenadas conforme a orientação do cliente (setas, empilhamento máximo, maiores embaixo)?', d: 'IT 05 / IT 16' },
      { s: 'Armazenamento', i: '8.5.4', p: 'O depósito está dividido em praças/áreas identificadas, incluindo área de agendamento e área de produto não conforme?', d: 'IT 16' },
      { s: 'Produto não conforme', i: '8.7', p: 'Produtos avariados/em quarentena estão segregados e identificados, sem mistura com produtos conformes?', d: 'PG 03' },
      { s: 'Rastreabilidade', i: '8.5.2', p: 'As etiquetas não foram unitizadas/substituídas perdendo o histórico de bipagens?', d: 'IT 02' },
      { s: 'Carregamento', i: '8.5.4', p: 'O carregamento segue a sequência de entrega e as mercadorias estão acondicionadas sem risco de tombamento?', d: 'IT 04' },
      { s: 'Veículos', i: '8.5.4', p: 'Os veículos estão em condições de preservar a carga (baú sem furos, lona, limpeza)?', d: 'IT 04' },
      { s: 'Expedição', i: '8.5.2', p: 'Os romaneios/manifestos estão corretos e sem documentos encerrados indevidamente?', d: 'IT 06' },
      { s: 'Entrega', i: '8.5.4 / 8.6', p: 'Os comprovantes de entrega estão no SSW com foto legível, enquadrada e com assinatura?', d: 'IT 03' },
      { s: 'Prazo', i: '8.6', p: 'As entregas estão sendo feitas no prazo do CT-e (conferir uma amostra de CT-es)?', d: 'IT 03' },
      { s: 'Arquivo', i: '7.5.3', p: 'Os CT-es e relatórios são enviados ao arquivo com a capa correta?', d: 'IT 07 / IT 13' },
      { s: 'Segurança', i: '7.1.4', p: 'Os colaboradores usam os EPIs exigidos e a empilhadeira é operada por pessoa habilitada?', d: 'IT 20' },
      { s: '5S', i: '7.1.4', p: 'O ambiente está organizado, limpo e com corredores livres?', d: 'IT 16' },
      ...COMUNS.slice(0, 2),
    ],
  },
  {
    id: 'rh', nome: 'RH (SESMT)', processo: 'RH', tipo: 'sistema',
    itens: [
      { s: 'Competência', i: '7.2', p: 'As descrições de função definem escolaridade, experiência e treinamentos exigidos?', d: 'PG 05' },
      { s: 'Competência', i: '7.2', p: 'Os colaboradores (inclusive das filiais) receberam os treinamentos exigidos pela função (amostra no RG 22)?', d: 'PG 05 / RG 22' },
      { s: 'Treinamento', i: '7.2', p: 'Os registros de treinamento (RG 24) estão assinados e arquivados?', d: 'RG 24' },
      { s: 'Treinamento', i: '7.2', p: 'A eficácia dos treinamentos é avaliada?', d: 'PG 05' },
      { s: 'Integração', i: '7.3', p: 'Os novos colaboradores passam por integração (política, manual do colaborador)?', d: 'Manual do colaborador' },
      { s: 'Terceiros', i: '7.2', p: 'Motoristas e ajudantes terceirizados têm qualificação registrada?', d: 'PG 05' },
      { s: 'Saúde e segurança', i: '7.1.4', p: 'ASO, entrega de EPI e treinamentos de segurança estão em dia?', d: 'IT 20' },
      COMUNS[0], COMUNS[5],
    ],
  },
  {
    id: 'compras', nome: 'Compras', processo: 'Compras', tipo: 'sistema',
    itens: [
      { s: 'Fornecedores', i: '8.4.1', p: 'Existem critérios definidos para seleção, avaliação e reavaliação de fornecedores?', d: 'PG 07' },
      { s: 'Fornecedores', i: '8.4.1', p: 'A avaliação dos fornecedores críticos foi feita no período e está registrada?', d: 'PG 07' },
      { s: 'Fornecedores', i: '8.4.3', p: 'Os fornecedores foram informados do resultado da sua avaliação?', d: 'PG 07' },
      { s: 'Pedidos', i: '8.4.3', p: 'Os pedidos de compra descrevem claramente o que está sendo comprado e são aprovados?', d: 'PG 07' },
      { s: 'Recebimento', i: '8.4.2', p: 'Os itens comprados são conferidos no recebimento?', d: 'PG 07' },
      { s: 'Prestadores', i: '8.4', p: 'Agregados/terceiros de transporte estão cadastrados e com documentação válida?', d: 'PG 07' },
      COMUNS[0], COMUNS[5],
    ],
  },
  {
    id: 'frota', nome: 'Gestão de frota', processo: 'Gestão de frota', tipo: 'sistema',
    itens: [
      { s: 'Manutenção', i: '7.1.3', p: 'As manutenções preventivas estão programadas e sendo cumpridas (SSW)?', d: 'PG 12' },
      { s: 'Manutenção', i: '7.1.3', p: 'As ordens de serviço e NF-e de manutenção estão registradas?', d: 'IT 18' },
      { s: 'Pneus', i: '8.5.2', p: 'Os pneus instalados nos veículos correspondem ao cadastro do SSW (conferir uma amostra de placas)?', d: 'IT 17' },
      { s: 'Rastreamento', i: '8.5.1', p: 'Os veículos estão com rastreamento ativo e as ocorrências são tratadas?', d: 'IT 12' },
      { s: 'Abastecimento', i: '8.5.1', p: 'Os abastecimentos são analisados e baixados no SSW (sem registros pendentes antigos)?', d: 'PG 12' },
      { s: 'Documentação', i: '6.1.3', p: 'CRLV, tacógrafo, AET e demais documentos dos veículos estão válidos?', d: 'RG 10' },
      { s: 'Checklist', i: '8.5.1', p: 'O checklist de saída/retorno dos veículos é feito e registrado?', d: 'PG 12' },
      COMUNS[1], COMUNS[5],
    ],
  },
  {
    id: 'financeiro', nome: 'Administrativo / financeiro', processo: 'Administrativo/financeiro', tipo: 'sistema',
    itens: [
      { s: 'Faturamento', i: '8.5.1', p: 'O faturamento é feito conforme a IT 08 e conferido antes do envio?', d: 'IT 08' },
      { s: 'Cobrança', i: '8.5.1', p: 'Os fretes à vista são cobrados e baixados conforme a IT 09?', d: 'IT 09' },
      { s: 'Crédito', i: '8.2.3', p: 'A análise de crédito (critério Serasa) é feita para clientes novos?', d: 'IT 11' },
      { s: 'Retenção de CT-es', i: '8.5.1', p: 'Retenções e liberações de CT-es seguem a IT 10?', d: 'IT 10' },
      { s: 'Arquivo', i: '7.5.3', p: 'As unidades enviam os relatórios com capa para o arquivo corretamente?', d: 'IT 07 / IT 13' },
      { s: 'DRE', i: '9.1.3', p: 'O DRE e o balanço são emitidos e analisados mensalmente?', d: 'IT 22' },
      COMUNS[0], COMUNS[5],
    ],
  },
  {
    id: 'ti', nome: 'TI', processo: 'TI', tipo: 'sistema',
    itens: [
      { s: 'Backup', i: '7.5.3', p: 'Os backups são feitos na frequência definida e há teste de restauração?', d: 'PG 14' },
      { s: 'Acessos', i: '7.5.3', p: 'Os acessos aos sistemas (SSW, e-mail, portal) são concedidos/removidos conforme a função?', d: 'PG 14' },
      { s: 'Equipamentos', i: '7.1.3', p: 'Os equipamentos entregues aos colaboradores estão controlados (etiqueta de patrimônio / termo)?', d: 'PG 14' },
      { s: 'Infraestrutura', i: '7.1.3', p: 'Servidores, rede e antivírus estão monitorados e atualizados?', d: 'PG 14' },
      { s: 'Incidentes', i: '10.2', p: 'Falhas e incidentes de TI são registrados e tratados?', d: 'PG 14' },
      COMUNS[0], COMUNS[5],
    ],
  },
  {
    id: 'torre', nome: 'Torre de controle', processo: 'Torre de controle', tipo: 'sistema',
    itens: [
      { s: 'Monitoramento', i: '8.5.1', p: 'Os veículos em trânsito são acompanhados e os desvios de rota/prazo são tratados?', d: 'PG 11' },
      { s: 'Monitoramento', i: '8.6', p: 'Os atrasos de entrega são comunicados ao cliente e às unidades?', d: 'PG 11' },
      { s: 'Ocorrências', i: '8.7', p: 'As ocorrências de transporte (sinistro, avaria, roubo) são registradas e tratadas?', d: 'PG 03' },
      COMUNS[1], COMUNS[4], COMUNS[5],
    ],
  },
  {
    id: 'relampago-deposito', nome: 'Relâmpago — Depósito', processo: 'Operação', tipo: 'relampago',
    itens: [
      { s: 'Etiquetagem', i: '8.5.2', p: 'Mercadorias recebidas estão etiquetadas e bipadas?', d: 'IT 02' },
      { s: 'Armazenamento', i: '8.5.4', p: 'Caixas armazenadas conforme orientação do cliente e sem risco de tombamento?', d: 'IT 05' },
      { s: 'Não conforme', i: '8.7', p: 'Avariados segregados e identificados na área de produto não conforme?', d: 'PG 03' },
      { s: 'Agendamentos', i: '8.5.4', p: 'Mercadorias com agendamento estão na área de agendamento?', d: 'IT 16' },
      { s: 'Carregamento', i: '8.5.4', p: 'Bipagem feita na porta do veículo no carregamento?', d: 'IT 04' },
      { s: 'EPI', i: '7.1.4', p: 'Todos usando os EPIs exigidos?', d: 'IT 20' },
      { s: '5S', i: '7.1.4', p: 'Ambiente limpo, organizado e corredores livres?', d: 'IT 16' },
    ],
  },
  {
    id: 'relampago-entregas', nome: 'Relâmpago — Comprovantes de entrega', processo: 'Operação', tipo: 'relampago',
    itens: [
      { s: 'Comprovante', i: '8.5.4', p: 'Foto do comprovante legível (CT-e e assinatura visíveis)?', d: 'IT 03' },
      { s: 'Comprovante', i: '8.5.4', p: 'Foto enquadrada/orientada corretamente no SSW?', d: 'IT 03' },
      { s: 'Prazo', i: '8.6', p: 'Entrega realizada dentro do prazo do CT-e?', d: 'IT 03' },
      { s: 'Baixa', i: '8.5.2', p: 'Baixa da entrega feita no SSW no mesmo dia?', d: 'IT 03' },
    ],
  },
];
