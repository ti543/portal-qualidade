// ============================================================================
// PAINEL DE ALERTAS — pendências de cada módulo que o usuário logado tem liberado
//
// Cada módulo tem uma função que lê os dados e devolve alertas no formato:
//   { modulo, nivel: 'critico' | 'atencao', titulo, detalhe, dias }
// Só roda a função do módulo se a pessoa tem o módulo liberado (e o Firestore
// também só entrega o que as regras deixam — ex.: filial vê só a própria unidade).
// Um módulo com erro não derruba os outros: o erro vira um aviso discreto.
//
// Para mudar os prazos dos alertas, edite PRAZOS abaixo.
// ============================================================================
import { collection, doc, getDoc, getDocs, query, where } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

export const PRAZOS = {
  licencaAvisarAntesDias: 30,   // RG10: amarelo quando faltar até X dias para vencer
  ocorrenciaAbertaDias: 15,     // RG21 / RG29: ocorrência aberta há mais de X dias
  ocorrenciaCriticaDias: 30,    //   ...e vermelha a partir de X dias
  ncAbertaDias: 30,             // RG34/35: ação aberta / em andamento há mais de X dias
  ncCriticaDias: 60,            //   ...e vermelha a partir de X dias
  eficaciaAvisarAntesDias: 30,  // RG22: avaliação de eficácia (90 dias) vence em até X dias
};

// --------------------------------------------------------------- datas
function hoje() { const h = new Date(); return new Date(h.getFullYear(), h.getMonth(), h.getDate()); }
function parseISO(s) {
  if (typeof s !== 'string' || !/^\d{4}-\d{2}-\d{2}/.test(s)) return null;
  const [a, m, d] = s.slice(0, 10).split('-').map(Number);
  const dt = new Date(a, m - 1, d);
  return isNaN(dt.getTime()) ? null : dt;
}
function diasEntre(dt) { return Math.round((dt.getTime() - hoje().getTime()) / 86400000); } // >0 futuro, <0 passado
function fmt(dt) { return dt ? dt.toLocaleDateString('pt-BR') : '—'; }

// --------------------------------------------------------------- módulos
const FONTES = {
  // RG10 — Requisitos legais / licenças (só Master lê, pelas regras)
  rg10: async (db) => {
    const snap = await getDocs(collection(db, 'rg10_requisitos_legais'));
    const out = [];
    snap.forEach(d => {
      const r = d.data();
      const prazo = parseISO(r.prazoAtualizacao);
      if (!prazo) return;
      const dias = diasEntre(prazo);
      const nome = [r.tipoLegislacao, r.numero].filter(Boolean).join(' ') || r.titulo || 'Requisito';
      const det = `${r.titulo || ''}${r.responsavel ? ' · Resp.: ' + r.responsavel : ''}`;
      if (dias < 0) out.push({ nivel: 'critico', titulo: `${nome} — vencido há ${-dias} dia(s)`, detalhe: det, dias: -dias });
      else if (dias <= PRAZOS.licencaAvisarAntesDias) out.push({ nivel: 'atencao', titulo: `${nome} — vence em ${dias} dia(s) (${fmt(prazo)})`, detalhe: det, dias: -dias });
    });
    return out;
  },

  // RG22 — Competências: treinamentos pendentes (por unidade) e eficácia vencida
  competencias: async (db) => {
    const snap = await getDoc(doc(db, 'rg22_competencias', 'dados'));
    if (!snap.exists()) return [];
    const b = snap.data();
    const norm = s => (s || '').toString().trim().toLowerCase();
    const cargos = b.cargos || [], treinos = b.treinos || {}, procs = b.processos || [];
    const out = [], porUnidade = {};
    (b.funcionarios || []).forEach(f => {
      if (f.status !== 'Ativo') return;
      const cargo = cargos.find(c => norm(c.nome) === norm(f.funcao));
      if (!cargo) return;
      (cargo.req || []).forEach(p => {
        const t = treinos[f.id + '_' + p];
        if (!t || !parseISO(t.data)) {
          const u = f.unidade || 'Sem unidade';
          (porUnidade[u] = porUnidade[u] || { qtd: 0, pessoas: new Set(), procs: {} });
          porUnidade[u].qtd++; porUnidade[u].pessoas.add(f.nome);
          porUnidade[u].procs[procs[p] || p] = (porUnidade[u].procs[procs[p] || p] || 0) + 1;
        }
      });
    });
    Object.entries(porUnidade).forEach(([u, v]) => {
      const top = Object.entries(v.procs).sort((a, b) => b[1] - a[1]).slice(0, 3).map(([n, q]) => `${n} (${q})`).join(', ');
      out.push({ nivel: 'atencao', titulo: `${u}: ${v.qtd} treinamento(s) pendente(s) — ${v.pessoas.size} pessoa(s)`, detalhe: `Mais pendentes: ${top}`, dias: v.qtd });
    });
    (b.atestados || []).forEach(a => {
      const base = parseISO(a.dataBase);
      if (!base) return;
      const limite = new Date(base); limite.setDate(limite.getDate() + 90);
      const dias = diasEntre(limite);
      const f = (b.funcionarios || []).find(x => x.id === a.funcId || (a.funcCod && x.cod === a.funcCod));
      const quem = f ? f.nome : (a.funcao || 'Colaborador');
      const det = [a.unidade, (a.funcao || '') + (a.funcaoProposta ? ' → ' + a.funcaoProposta : '')].filter(Boolean).join(' · ');
      if (dias < 0) out.push({ nivel: 'critico', titulo: `Avaliação de eficácia vencida há ${-dias} dia(s): ${quem}`, detalhe: det, dias: 1000 - dias });
      else if (dias <= PRAZOS.eficaciaAvisarAntesDias) out.push({ nivel: 'atencao', titulo: `Avaliação de eficácia vence em ${dias} dia(s): ${quem}`, detalhe: det, dias: -dias });
    });
    return out;
  },

  // RG34/35 — Ações corretivas / NC sem finalizar (só Master lê)
  acoes: async (db) => {
    const snap = await getDocs(collection(db, 'acoes_qualidade'));
    const out = [];
    snap.forEach(d => {
      const a = d.data();
      const st = a.status_acao || 'Aberto';
      if (st.includes('Eficaz') && !st.includes('Ineficaz')) return;           // encerrada
      const abertura = parseISO(a.data_abertura);
      const idade = abertura ? -diasEntre(abertura) : null;
      const atrasadas = (a.plano_acao || []).filter(p => !p.feito && parseISO(p.quando) && diasEntre(parseISO(p.quando)) < 0);
      const num = a.num_registro ? '#' + a.num_registro : 'Ação';
      const desc = (a.descricao_problema || '').slice(0, 110);
      let nivel = null, motivo = '';
      if (st.includes('Ineficaz')) { nivel = 'critico'; motivo = 'marcada como Ineficaz'; }
      if (idade !== null && idade >= PRAZOS.ncCriticaDias) { nivel = 'critico'; motivo = motivo || `aberta há ${idade} dias`; }
      else if (idade !== null && idade >= PRAZOS.ncAbertaDias) { nivel = nivel || 'atencao'; motivo = motivo || `aberta há ${idade} dias`; }
      if (atrasadas.length) { nivel = 'critico'; motivo += (motivo ? ' · ' : '') + `${atrasadas.length} ação(ões) do plano atrasada(s)`; }
      if (!nivel) return;
      out.push({ nivel, titulo: `${num} (${st}) — ${motivo}`, detalhe: `${a.processo || ''}${desc ? ' · ' + desc : ''}${a.responsavel_geral ? ' · Resp.: ' + a.responsavel_geral : ''}`, dias: idade || 0 });
    });
    return out;
  },

  // RG21 — Avarias e reclamações abertas há muito tempo
  rg21: (db, perfil, vejoTudo) => ocorrenciasAbertas(db, perfil, vejoTudo, 'rg21_ocorrencias', 'Avaria/Reclamação'),
  // RG29 — Ocorrências abertas há muito tempo
  rg29: (db, perfil, vejoTudo) => ocorrenciasAbertas(db, perfil, vejoTudo, 'rg29_ocorrencias', 'Ocorrência'),

  // Auditorias (PG 02): programadas (RG 11) que passaram do mês, auditorias
  // abertas há muito tempo e não conformidades sem ação (RAM) definida
  auditorias: async (db) => {
    const out = [];
    const ano = new Date().getFullYear(), mes = new Date().getMonth() + 1;
    const prog = await getDoc(doc(db, 'auditoria_programa', String(ano)));
    (prog.exists() ? prog.data().linhas || [] : []).forEach(l => {
      if (l.auditoriaId || Number(l.mes) >= mes) return;
      out.push({ nivel: mes - Number(l.mes) >= 2 ? 'critico' : 'atencao', titulo: `Auditoria programada atrasada: ${l.processo}${l.unidade ? ' ' + l.unidade : ''}`,
        detalhe: `Prevista para ${['jan','fev','mar','abr','mai','jun','jul','ago','set','out','nov','dez'][Number(l.mes) - 1]}/${ano}${l.auditor ? ' · Auditor: ' + l.auditor : ''}`, dias: mes - Number(l.mes) });
    });
    const snap = await getDocs(collection(db, 'auditorias'));
    snap.forEach(d => {
      const a = d.data();
      const dt = parseISO(a.data);
      if (a.status !== 'concluida' && dt && -diasEntre(dt) > PRAZOS.ocorrenciaAbertaDias) {
        out.push({ nivel: 'atencao', titulo: `Auditoria ${a.numero || ''} (${a.processo || ''}) aberta há ${-diasEntre(dt)} dias`, detalhe: 'Conclua para gerar o relatório', dias: -diasEntre(dt) });
      }
      const semAcao = (a.itens || []).filter(i => i.resultado === 'NC' && !i.ram).length;
      if (a.status === 'concluida' && semAcao) {
        out.push({ nivel: 'critico', titulo: `${semAcao} NC sem ação (RAM) — auditoria ${a.numero || ''}`, detalhe: `${a.processo || ''}${a.unidade ? ' · ' + a.unidade : ''} · ${a.data ? fmt(parseISO(a.data)) : ''}`, dias: semAcao });
      }
    });
    return out;
  },
};

async function ocorrenciasAbertas(db, perfil, vejoTudo, colecao, rotulo) {
  const ref = collection(db, colecao);
  // filial: a regra só deixa ler a própria unidade, então a consulta precisa pedir só ela
  const snap = await getDocs(vejoTudo ? ref : query(ref, where('unidadeRegistrou', '==', perfil.unidade)));
  const out = [];
  snap.forEach(d => {
    const o = d.data();
    if (o.status === 'fechada' || o.dataSolucao) return;       // finalizada (tem data de solução)
    const dt = parseISO(o.data);
    if (!dt) return;
    const idade = -diasEntre(dt);
    if (idade < PRAZOS.ocorrenciaAbertaDias) return;
    out.push({
      nivel: idade >= PRAZOS.ocorrenciaCriticaDias ? 'critico' : 'atencao',
      titulo: `${rotulo} ${o.numero ? 'nº ' + o.numero : ''} aberta há ${idade} dias${o.cte ? ' · CT-e ' + o.cte : ''}`,
      detalhe: `${o.unidadeRegistrou ? 'Registrada por ' + o.unidadeRegistrou : ''}${o.unidadeCausadora ? ' · Causadora: ' + o.unidadeCausadora : ''}${o.responsavel ? ' · Resp.: ' + o.responsavel : ''}`,
      dias: idade,
    });
  });
  return out;
}

// --------------------------------------------------------------- carregar
/**
 * @returns {Promise<Array<{slug, nome, alertas: Array, erro?: string}>>}
 */
export async function carregarAlertas({ db, perfil, modulos }) {
  const master = perfil && perfil.papel === 'qualidade';
  const vejoTudo = master || (perfil && perfil.unidade === 'MTZ');
  const liberados = (modulos || []).filter(m => FONTES[m.slug] && (master || (perfil.modulosPermitidos || []).includes(m.slug)));
  const grupos = await Promise.all(liberados.map(async m => {
    try {
      const alertas = await FONTES[m.slug](db, perfil, vejoTudo);
      alertas.sort((a, b) => (a.nivel === b.nivel ? b.dias - a.dias : (a.nivel === 'critico' ? -1 : 1)));
      return { slug: m.slug, nome: m.nome, alertas };
    } catch (e) {
      console.warn('Alertas', m.slug, e);
      // sem permissão de leitura (ex.: módulo liberado mas regra exclusiva da qualidade) = sem alertas
      if (e && e.code === 'permission-denied') return { slug: m.slug, nome: m.nome, alertas: [] };
      return { slug: m.slug, nome: m.nome, alertas: [], erro: 'não consegui verificar este módulo agora' };
    }
  }));
  return grupos;
}

// --------------------------------------------------------------- desenhar
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const MAX_ITENS = 5;

export function renderizarPainelAlertas(container, grupos) {
  const comAlerta = grupos.filter(g => g.alertas.length || g.erro);
  const totCrit = grupos.reduce((s, g) => s + g.alertas.filter(a => a.nivel === 'critico').length, 0);
  const totAt = grupos.reduce((s, g) => s + g.alertas.filter(a => a.nivel === 'atencao').length, 0);

  if (!comAlerta.length) {
    container.innerHTML = `<div class="qc-alertas-ok"><i class="bi bi-check-circle-fill"></i> Nenhuma pendência nos seus módulos. Tudo em dia!</div>`;
    return;
  }

  container.innerHTML = `
    <div class="qc-alertas-topo">
      <h2><i class="bi bi-bell-fill"></i> Pendências dos seus módulos</h2>
      <div class="qc-alertas-totais">
        ${totCrit ? `<span class="qc-alerta-pill critico">${totCrit} crítica(s)</span>` : ''}
        ${totAt ? `<span class="qc-alerta-pill atencao">${totAt} em atenção</span>` : ''}
      </div>
    </div>
    <div class="qc-alertas-grid">
      ${comAlerta.map(g => {
        const crit = g.alertas.filter(a => a.nivel === 'critico').length;
        const resto = g.alertas.length - MAX_ITENS;
        return `
        <div class="qc-alerta-card ${crit ? 'critico' : 'atencao'}">
          <div class="qc-alerta-card-topo">
            <h3 title="${esc(g.nome)}">${esc(g.nome)}</h3>
            <span class="qc-alerta-num">${g.alertas.length}</span>
          </div>
          ${g.erro ? `<p class="qc-alerta-erro">${esc(g.erro)}</p>` : ''}
          <ul>
            ${g.alertas.slice(0, MAX_ITENS).map(a => `
              <li class="${a.nivel}">
                <span class="qc-alerta-tit">${esc(a.titulo)}</span>
                ${a.detalhe ? `<span class="qc-alerta-det">${esc(a.detalhe)}</span>` : ''}
              </li>`).join('')}
          </ul>
          <a class="qc-alerta-ir" href="modulos/${esc(g.slug)}.html">${resto > 0 ? `Ver todas (+${resto})` : 'Abrir módulo'} &rarr;</a>
        </div>`;
      }).join('')}
    </div>`;
}

/** número de pendências por slug (para o selo nos cards de módulo) */
export function contagemPorModulo(grupos) {
  const c = {};
  grupos.forEach(g => { c[g.slug] = { total: g.alertas.length, critico: g.alertas.some(a => a.nivel === 'critico') }; });
  return c;
}
