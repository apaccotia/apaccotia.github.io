'use strict';
/* APAC Cotia: telas do app (versão 0.2). Os dados vêm de data.js (servidor Supabase ou demonstração). */

var SITE = 'https://apaccotia.ong.br';
var VERSAO = '0.3.4';

/* ---------- Utilidades ---------- */
function esc(v) { return String(v == null ? '' : v).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
var BRL = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });
function reais(v) { return BRL.format(Number(v) || 0); }
function dataBR(iso) { if (!iso) { return ''; } var s = String(iso).slice(0, 10).split('-'); return s[2] + '/' + s[1] + '/' + s[0]; }
function diaMes(iso) { var s = String(iso).slice(0, 10).split('-'); return s[2] + '/' + s[1]; }
function quando(ts) { return ts ? dataBR(new Date(new Date(ts).getTime() - 3 * 3600e3).toISOString()) : ''; }
function diasAte(iso) { return Math.round((new Date(iso + 'T12:00:00Z') - new Date(D.hoje() + 'T12:00:00Z')) / 864e5); }
function digitos(s) { return String(s || '').replace(/\D/g, ''); }
function whats(numero, texto) {
  var n = digitos(numero);
  if (n && n.length <= 11) { n = '55' + n; }
  return 'https://wa.me/' + n + (texto ? '?text=' + encodeURIComponent(texto) : '');
}
function whatsAPAC(texto) { return whats(D.config().whatsapp || '5511984240236', texto); }
function plural(n, um, varios) { return n + ' ' + (n === 1 ? um : varios); }

var ICONS = {
  home: '<path d="M4 11l8-7 8 7v9h-5v-6H9v6H4z"/>',
  paw: '<circle cx="5.5" cy="11" r="1.8"/><circle cx="9.5" cy="6" r="1.8"/><circle cx="14.5" cy="6" r="1.8"/><circle cx="18.5" cy="11" r="1.8"/><path d="M12 12c-3 0-5.5 3-5.5 5.4 0 1.6 1.2 2.6 2.7 2.6 1 0 1.9-.5 2.8-.5s1.8.5 2.8.5c1.5 0 2.7-1 2.7-2.6C17.5 15 15 12 12 12z"/>',
  help: '<circle cx="12" cy="12" r="9"/><path d="M9.5 9.3a2.6 2.6 0 1 1 3.7 2.4c-.8.4-1.2 1-1.2 1.8"/><path d="M12 17h.01"/>',
  heart: '<path d="M12 20s-7.5-4.6-7.5-10.2A4.3 4.3 0 0 1 12 7.2a4.3 4.3 0 0 1 7.5 2.6C19.5 15.4 12 20 12 20z"/>',
  user: '<circle cx="12" cy="8" r="4"/><path d="M4.5 20.5c1-4 4-6 7.5-6s6.5 2 7.5 6"/>',
  bell: '<path d="M6 10a6 6 0 0 1 12 0c0 6 2.5 7 2.5 7h-17S6 16 6 10z"/><path d="M10 20.5a2.2 2.2 0 0 0 4 0"/>',
  alert: '<path d="M12 3l9.5 17h-19z"/><path d="M12 10v4.5"/><path d="M12 17.5h.01"/>',
  right: '<path d="M9 6l6 6-6 6"/>', left: '<path d="M15 5l-7 7 7 7"/>',
  out: '<path d="M8 16L18 6"/><path d="M9 6h9v9"/>',
  check: '<path d="M5 12.5l4.5 4.5L19 7"/>', plus: '<path d="M12 5v14"/><path d="M5 12h14"/>', x: '<path d="M6 6l12 12"/><path d="M18 6L6 18"/>',
  cal: '<rect x="4" y="5" width="16" height="15" rx="2"/><path d="M4 10h16"/><path d="M9 3v4"/><path d="M15 3v4"/>',
  pin: '<path d="M12 21s7-6.2 7-11.5A7 7 0 0 0 5 9.5C5 14.8 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.5"/>',
  chat: '<path d="M4 20l1.3-4A8 8 0 1 1 8.5 19z"/>', phone: '<path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a1 1 0 0 1-1 1A16 16 0 0 1 4 5a1 1 0 0 1 1-1z"/>',
  filter: '<path d="M4 6h16"/><path d="M7 12h10"/><path d="M10 18h4"/>',
  camera: '<path d="M4 8h3l2-3h6l2 3h3v11H4z"/><circle cx="12" cy="13" r="3.2"/>',
  people: '<circle cx="9" cy="8" r="3.5"/><path d="M3 20c.6-3.5 3-5.5 6-5.5s5.4 2 6 5.5"/><path d="M16 5.5a3.5 3.5 0 0 1 0 6"/><path d="M18 15c1.7.8 2.7 2.5 3 5"/>',
  box: '<path d="M4 8l8-4 8 4v9l-8 4-8-4z"/><path d="M4 8l8 4 8-4"/><path d="M12 12v9"/>',
  doc: '<path d="M6 3h9l4 4v14H6z"/><path d="M15 3v4h4"/><path d="M9 12h7"/><path d="M9 16h7"/>',
  gift: '<rect x="4" y="9" width="16" height="11" rx="1"/><path d="M12 9v11"/><path d="M3 9h18"/><path d="M12 9c-2-4-6-4-6-1.5S10 9 12 9c2 0 6 0 6-1.5S14 5 12 9z"/>',
  megafone: '<path d="M4 10v4h3l7 4V6l-7 4z"/><path d="M17 9a4 4 0 0 1 0 6"/>',
  coin: '<circle cx="12" cy="12" r="8.5"/><path d="M14.5 9.5c-.5-1-1.5-1.5-2.5-1.5-1.5 0-2.5.8-2.5 2s1 1.7 2.5 2 2.5.8 2.5 2-1 2-2.5 2c-1 0-2-.5-2.5-1.5"/><path d="M12 6.5v11"/>',
  chart: '<path d="M4 20V10"/><path d="M10 20V4"/><path d="M16 20v-7"/><path d="M3 20h18"/>',
  gear: '<circle cx="12" cy="12" r="3"/><path d="M12 2.5v3M12 18.5v3M2.5 12h3M18.5 12h3M5.3 5.3l2.1 2.1M16.6 16.6l2.1 2.1M5.3 18.7l2.1-2.1M16.6 7.4l2.1-2.1"/>',
  img: '<rect x="3.5" y="5" width="17" height="14" rx="2"/><circle cx="9" cy="10" r="1.8"/><path d="M20.5 16l-5-5-8.5 8"/>',
  trash: '<path d="M5 7h14"/><path d="M9 7V4h6v3"/><path d="M7 7l1 13h8l1-13"/>',
  shield: '<path d="M12 3l8 3v6c0 4.5-3.4 8-8 9-4.6-1-8-4.5-8-9V6z"/>'
};
function I(nome, tam, traco) { return '<svg width="' + (tam || 22) + '" height="' + (tam || 22) + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="' + (traco || 2) + '" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + ICONS[nome] + '</svg>'; }
function pata(tam) { return '<svg width="' + tam + '" height="' + tam + '" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><circle cx="5.5" cy="11" r="2.2"/><circle cx="9.5" cy="6" r="2.2"/><circle cx="14.5" cy="6" r="2.2"/><circle cx="18.5" cy="11" r="2.2"/><path d="M12 12c-3 0-5.5 3-5.5 5.4 0 1.6 1.2 2.6 2.7 2.6 1 0 1.9-.5 2.8-.5s1.8.5 2.8.5c1.5 0 2.7-1 2.7-2.6C17.5 15 15 12 12 12z"/></svg>'; }

var toastTimer;
function toast(msg) {
  var t = document.getElementById('toast');
  t.textContent = msg; t.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(function () { t.classList.remove('show'); }, 3600);
}

/* ---------- Estado das telas ---------- */
var S = {
  adotar: { especie: 'todos', origem: 'todos', busca: '', filtros: false, sexo: '', idade: '', porte: '' },
  campanhas: { filtro: 'todas' },
  denuncia: null, pedido: {}, form: null, doar: null, pag: {}, admin: { pagStatus: 'pendente', denStatus: 'abertas', animais: 'apac', busca: '', atualizacao: null },
  galeria: {}, comoCliente: false
};
function novaDenuncia() { return { tipo: 'Agressão', local: '', descricao: '', fotos: [] }; }

/* ---------- Peças ---------- */
function tabbar(ativa) {
  var abas = [['inicio', 'Início', 'home'], ['adotar', 'Adotar', 'paw'], ['ajuda', 'Ajuda', 'help'], ['colaborar', 'Colaborar', 'heart'], ['perfil', 'Perfil', 'user']];
  return '<nav class="tabbar" aria-label="Navegação principal">' + abas.map(function (a) {
    var on = a[0] === ativa;
    return '<a class="tab' + (on ? ' on' : '') + '" href="#/' + a[0] + '"' + (on ? ' aria-current="page"' : '') + '><span>' + I(a[2]) + '</span>' + a[1] + '</a>';
  }).join('') + '</nav>';
}
function topbar(titulo, voltar, extra) {
  return '<header class="topbar"><button type="button" class="iconbtn" aria-label="Voltar" data-act="voltar" data-para="' + esc(voltar) + '">' + I('left', 22, 2.2) + '</button>' +
    (titulo ? '<h1 class="h1 sm" style="flex:1;min-width:0">' + esc(titulo) + '</h1>' : '<span style="flex:1"></span>') + (extra || '') + '</header>';
}
function tela(corpo, aba, opts) {
  opts = opts || {};
  return '<div class="screen">' + (opts.topo || '') + '<main class="scroll' + (opts.cls ? ' ' + opts.cls : '') + '">' + corpo + '</main>' + (opts.rodape || '') + (aba ? tabbar(aba) : '') + '</div>';
}
function chip(rotulo, on, attrs, classe) { return '<button type="button" class="' + (classe || 'chip') + (on ? ' on' : '') + '" aria-pressed="' + (on ? 'true' : 'false') + '" ' + attrs + '>' + esc(rotulo) + '</button>'; }
function setBtn(caminho, valor, rotulo, atual, classe) { return chip(rotulo, String(atual) === String(valor), 'data-set="' + caminho + '" data-val="' + esc(valor) + '"', classe); }
function campo(id, rotulo, bind, valor, extra, ajuda) {
  return '<div class="field"><label for="' + id + '">' + esc(rotulo) + '</label><input class="input" id="' + id + '" ' + (bind ? 'data-bind="' + bind + '" ' : '') + 'value="' + esc(valor == null ? '' : valor) + '" ' + (extra || 'type="text"') + '>' + (ajuda ? '<span class="help">' + esc(ajuda) + '</span>' : '') + '</div>';
}
function area(id, rotulo, bind, valor, ph) { return '<div class="field"><label for="' + id + '">' + esc(rotulo) + '</label><textarea class="input" id="' + id + '" rows="3" ' + (bind ? 'data-bind="' + bind + '" ' : '') + 'placeholder="' + esc(ph || '') + '">' + esc(valor || '') + '</textarea></div>'; }
function lista(itens) { return '<div class="list">' + itens.join('') + '</div>'; }
function linha(rotulo, href, lado, sub) {
  return '<a class="row" href="' + href + '"><span class="main"><span>' + esc(rotulo) + '</span>' + (sub ? '<span class="sub">' + esc(sub) + '</span>' : '') + '</span><span class="side">' + esc(lado == null ? '' : lado) + I('right', 18, 2.2) + '</span></a>';
}
function vazio(t) { return '<p class="card empty">' + esc(t) + '</p>'; }
function img(id, alt, mini, classe) { return id ? '<img class="' + (classe || '') + '" data-foto="' + esc(id) + '"' + (mini ? ' data-mini="1"' : '') + ' alt="' + esc(alt || '') + '" hidden>' : ''; }
function avisoDemo() {
  return D.modo === 'demo' ? '<p class="note"><strong>Modo demonstração.</strong> O app ainda não está ligado ao servidor: tudo fica salvo só neste celular e nada chega à APAC.</p>' : '';
}
function barra(arrecadado, meta) {
  var p = Math.max(0, Math.min(100, Math.round(Number(arrecadado) / Number(meta) * 100)));
  return '<div class="barra" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="' + p + '" aria-label="' + p + '% da meta"><i style="width:' + p + '%"></i></div>';
}
function concluido(titulo, texto, botoes) {
  return tela('<div class="done"><span class="mark">' + I('check', 36, 2.4) + '</span><h1 class="h1">' + esc(titulo) + '</h1><p class="lead">' + texto + '</p><div class="stack" style="width:100%">' + botoes + '</div></div>');
}
var STATUS = {
  aguardando_pagamento: ['Aguardando pagamento', 'gold'], publicado: ['Publicado', 'ok'], adotado: ['Adotado', 'dark'], removido: ['Retirado', ''],
  aberta: ['Aberta', 'alert'], em_apuracao: ['Em apuração', 'gold'], encerrada: ['Encerrada', ''],
  novo: ['Novo', 'alert'], em_analise: ['Em análise', 'gold'], aprovado: ['Aprovado', 'ok'], recusado: ['Recusado', ''],
  pendente: ['Aguardando confirmação', 'gold'], confirmado: ['Confirmado', 'ok'], ativo: ['Ativo', 'ok'], encerrado: ['Encerrado', ''], vencido: ['Vencido', 'alert']
};
function selo(st) { var s = STATUS[st] || [st, '']; return '<span class="tag ' + s[1] + '">' + esc(s[0]) + '</span>'; }
var TIPO_PAG = { denuncia: 'Taxa de denúncia', anuncio: 'Anúncio de adoção', apadrinhamento: 'Apadrinhamento', apoio_mensal: 'Apoio mensal', doacao: 'Doação', meta: 'Doação para meta' };

/* ---------- Animais ---------- */
function visivel(a) { return a.status === 'publicado' && (a.origem === 'apac' || (a.publicado_ate && a.publicado_ate >= D.hoje())); }
function animaisPublicos() {
  return D.listar('animais', { eq: { status: 'publicado' }, or: [{ eq: { origem: 'apac' } }, { gte: { publicado_ate: D.hoje() } }], order: ['criado_em', false] });
}
function infoAnimal(a) { return (a.especie === 'gato' ? (a.sexo === 'Fêmea' ? 'Gata' : 'Gato') : (a.sexo === 'Fêmea' ? 'Cadela' : 'Cão')) + ' · ' + a.idade + ' · ' + a.porte; }
function petCard(a, href) {
  return '<a class="pet" href="' + (href || '#/animal/' + a.id) + '"><span class="foto">' + pata(30) + 'Sem foto' + img(a.fotos && a.fotos[0], 'Foto de ' + a.nome, true) + '</span>' +
    '<span class="selo">' + (a.origem === 'apac' ? '<span class="tag gold">APAC</span>' : '<span class="tag">Particular</span>') + '</span>' +
    '<span class="info"><span class="nome">' + esc(a.nome) + '</span><span class="meta-l">' + esc(infoAnimal(a)) + '</span>' + (a.cidade ? '<span class="meta-l">' + esc(a.cidade) + '</span>' : '') + '</span></a>';
}
function hidratar() {
  var els = document.querySelectorAll('img[data-foto]'), mini = [], full = [];
  Array.prototype.forEach.call(els, function (e) { (e.getAttribute('data-mini') ? mini : full).push(e.getAttribute('data-foto')); });
  function aplica(mapa, isMini) {
    Array.prototype.forEach.call(document.querySelectorAll('img[data-foto]' + (isMini ? '[data-mini]' : ':not([data-mini])')), function (e) {
      var src = mapa[e.getAttribute('data-foto')];
      if (src) { e.src = src; e.hidden = false; }
    });
  }
  if (mini.length) { D.fotos(mini, true).then(function (m) { aplica(m, true); }); }
  if (full.length) { D.fotos(full, false).then(function (m) { aplica(m, false); }); }
}

/* ======================================================================
 * Telas
 * ====================================================================== */
var T = {};

/* ---------- Início ---------- */
T.inicio = async function () {
  if (D.ehAdmin() && !S.comoCliente) { return painelAdmin(); }
  var res = await Promise.all([
    animaisPublicos(), D.listar('metas', { eq: { ativa: true }, order: ['criado_em', false] }),
    D.listar('campanhas', { eq: { ativa: true }, order: ['data', true] }), D.listar('avisos', { order: ['criado_em', false], limit: 1 })
  ]);
  var animais = res[0].filter(function (a) { return a.origem === 'apac'; }).slice(0, 2), metas = res[1].slice(0, 2), camp = res[2][0], aviso = res[3][0];
  if (!animais.length) { animais = res[0].slice(0, 2); }
  var naoLidos = avisosNaoLidos(res[3]);
  return '<div class="screen"><main class="scroll flush">' +
    '<header class="hero"><div class="between"><div class="marca"><img src="img/gato.jpg" alt=""><div class="stack none" style="min-width:0"><h1 class="nome" style="margin:0">APAC</h1><span class="faixa">Associação Protetora dos Animais de Cotia</span></div></div>' +
    '<a class="iconbtn bell" href="#/notificacoes" aria-label="Avisos' + (naoLidos ? ' (' + naoLidos + ' novo)' : '') + '">' + I('bell') + (naoLidos ? '<span class="badge">' + naoLidos + '</span>' : '') + '</a></div>' +
    '<span class="lema">Preservando Vidas</span></header>' +
    '<nav class="shortcuts" aria-label="Atalhos">' +
    '<a class="shortcut" href="#/adotar">' + I('paw', 26) + 'Adotar</a>' +
    '<a class="shortcut danger" href="#/denuncia">' + I('alert', 26) + 'Denunciar</a>' +
    '<a class="shortcut gold" href="#/doar">' + I('heart', 26) + 'Doar</a></nav>' +
    '<div class="pad">' + avisoDemo() + bannerInstalar() +
    (D.ehAdmin() ? '<button type="button" class="btn outline sm" data-act="como-cliente">' + I('chart', 20) + 'Voltar ao painel da equipe</button>' : '') +
    (aviso ? '<a class="card gold stack none" href="#/notificacoes" style="text-decoration:none;color:inherit"><span class="xs" style="font-weight:800;color:var(--gold-ink)">AVISO DA APAC · ' + quando(aviso.criado_em) + '</span><span class="h3">' + esc(aviso.titulo) + '</span>' + (aviso.texto ? '<span class="small">' + esc(aviso.texto.slice(0, 140)) + (aviso.texto.length > 140 ? '…' : '') + '</span>' : '') + '</a>' : '') +
    (metas.length ? '<section class="stack"><div class="between"><h2 class="h2">Ajude a bater a meta</h2><a class="linkbtn" href="#/colaborar" style="font-size:14px">Ver todas</a></div>' + metas.map(metaCard).join('') + '</section>' : '') +
    (camp ? '<section class="stack"><h2 class="h2">Próxima campanha</h2><a class="promo" href="#/campanhas">' + caixaData(camp.data) + '<span class="grow"><span class="h3">' + esc(camp.titulo) + '</span><span class="small">' + esc([camp.local, camp.horario].filter(Boolean).join(' · ') || 'Local e horário a definir') + '</span></span>' + I('right', 20, 2.2) + '</a></section>' : '') +
    '<section class="stack"><div class="between"><h2 class="h2">Procurando um lar</h2><a class="linkbtn" href="#/adotar" style="font-size:14px">Ver todos</a></div>' +
    (animais.length ? '<div class="grid2">' + animais.map(function (a) { return petCard(a); }).join('') + '</div>' : vazio('Nenhum animal disponível no momento.')) + '</section>' +
    '</div></main>' + tabbar('inicio') + '</div>';
};
function caixaData(iso) {
  if (!iso) { return '<span class="datebox">Data a definir</span>'; }
  var m = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'][Number(iso.slice(5, 7)) - 1];
  return '<span class="datebox"><b>' + iso.slice(8, 10) + '</b>' + m + '</span>';
}
function metaCard(m) {
  return '<div class="card meta"><div class="between" style="align-items:flex-start"><span class="h3">' + esc(m.titulo) + '</span>' + (m.prazo ? '<span class="xs muted" style="flex:none">até ' + diaMes(m.prazo) + '</span>' : '') + '</div>' +
    (m.descricao ? '<p class="small muted">' + esc(m.descricao) + '</p>' : '') + barra(m.arrecadado, m.valor_meta) +
    '<div class="between small"><span><strong>' + reais(m.arrecadado) + '</strong> de ' + reais(m.valor_meta) + '</span><a class="btn xs auto gold" href="#/doar?meta=' + m.id + '">Doar</a></div></div>';
}
function avisosNaoLidos(ultimos) {
  var visto = ''; try { visto = localStorage.getItem('apac.avisos.visto') || ''; } catch (e) { /* sem armazenamento */ }
  return ultimos.filter(function (a) { return a.criado_em > visto; }).length;
}

/* ---------- Adotar ---------- */
function filtraAnimais(l) {
  var f = S.adotar, q = f.busca.trim().toLowerCase();
  return l.filter(function (a) {
    return (f.especie === 'todos' || a.especie === f.especie) && (f.origem === 'todos' || a.origem === f.origem) && (!q || a.nome.toLowerCase().indexOf(q) >= 0) &&
      (!f.sexo || a.sexo === f.sexo) && (!f.idade || a.idade === f.idade) && (!f.porte || a.porte === f.porte);
  });
}
function gradeAnimais(l) {
  var r = filtraAnimais(l);
  return r.length ? r.map(function (a) { return petCard(a); }).join('') : '<p class="empty" style="grid-column:1/-1">Nenhum animal encontrado com esses filtros.</p>';
}
T.adotar = async function () {
  var todos = await animaisPublicos(), f = S.adotar;
  S.cacheAdotar = todos;
  function grupo(c, titulo, ops) { return '<fieldset><legend>' + titulo + '</legend><div class="chips">' + setBtn('adotar.' + c, '', 'Todos', f[c]) + ops.map(function (o) { return setBtn('adotar.' + c, o, o, f[c]); }).join('') + '</div></fieldset>'; }
  var ativos = (f.sexo ? 1 : 0) + (f.idade ? 1 : 0) + (f.porte ? 1 : 0) + (f.origem !== 'todos' ? 1 : 0);
  return tela('<div class="between"><h1 class="h1">Adotar</h1><a class="chip" href="#/campanhas?tipo=feira">' + I('cal', 18) + 'Feiras</a></div>' +
    '<a class="promo" href="#/anunciar">' + I('megafone', 28) + '<span class="grow"><span class="h3">Anunciar um animal para adoção</span><span class="small">' + reais(D.num('valor_anuncio', 20)) + ' por ' + D.num('meses_anuncio', 2) + ' meses de divulgação</span></span>' + I('right', 20, 2.2) + '</a>' +
    '<div class="field"><label for="busca" class="xs" style="font-weight:700;color:var(--muted)">Buscar por nome</label><input class="input" id="busca" type="search" placeholder="Ex.: Thor" value="' + esc(f.busca) + '" data-bind="adotar.busca" data-relista="1"></div>' +
    '<div class="chips" role="group" aria-label="Filtrar por espécie">' + setBtn('adotar.especie', 'todos', 'Todos', f.especie) + setBtn('adotar.especie', 'cao', 'Cães', f.especie) + setBtn('adotar.especie', 'gato', 'Gatos', f.especie) +
    '<button type="button" class="chip ghost" data-act="filtros" aria-expanded="' + f.filtros + '">' + I('filter', 16, 2.2) + 'Filtros' + (ativos ? ' (' + ativos + ')' : '') + '</button></div>' +
    (f.filtros ? '<div class="card stack lg"><fieldset><legend>Quem anunciou</legend><div class="chips">' + setBtn('adotar.origem', 'todos', 'Todos', f.origem) + setBtn('adotar.origem', 'apac', 'APAC', f.origem) + setBtn('adotar.origem', 'particular', 'Particulares', f.origem) + '</div></fieldset>' +
      grupo('sexo', 'Sexo', ['Macho', 'Fêmea']) + grupo('idade', 'Idade', ['Filhote', 'Adulto', 'Idoso']) + grupo('porte', 'Porte', ['Pequeno', 'Médio', 'Grande']) + '</div>' : '') +
    '<div class="grid2" id="lista-animais">' + gradeAnimais(todos) + '</div>', 'adotar');
};

T.animal = async function (id) {
  var a = await D.um('animais', id);
  if (!a) { return tela('<p class="empty">Este animal não está mais disponível.</p><a class="btn" href="#/adotar">Ver outros animais</a>', 'adotar', { topo: topbar('', '/adotar') }); }
  var u = D.usuario(), meu = u && a.dono === u.id, fotos = a.fotos || [], atual = S.galeria[id] || fotos[0];
  var saude = [['vacinado', a.sexo === 'Fêmea' ? 'Vacinada' : 'Vacinado'], ['castrado', a.sexo === 'Fêmea' ? 'Castrada' : 'Castrado'], ['vermifugado', a.sexo === 'Fêmea' ? 'Vermifugada' : 'Vermifugado']].filter(function (s) { return a[s[0]]; });
  var acoes;
  if (a.origem === 'apac') {
    acoes = '<a class="btn" href="#/pedido/' + a.id + '">Quero adotar ' + (a.sexo === 'Macho' ? 'o ' : 'a ') + esc(a.nome) + '</a>' +
      (a.aceita_padrinho ? '<a class="btn gold sm" href="#/apadrinhar/' + a.id + '">' + I('heart', 20) + 'Apadrinhar ' + esc(a.nome) + '</a>' : '');
  } else if (meu) {
    acoes = '<a class="btn outline" href="#/meus-anuncios">Gerenciar meu anúncio</a>';
  } else {
    acoes = a.contato ? '<a class="btn" href="' + whats(a.contato, 'Olá! Vi o anúncio de ' + a.nome + ' no app da APAC Cotia e tenho interesse em adotar.') + '">' + I('chat', 20) + 'Falar com o responsável</a>' : '';
  }
  return '<div class="screen"><main class="scroll flush">' +
    '<div class="galeria">' + pata(56) + 'Sem foto' + img(atual, 'Foto de ' + a.nome, false, 'principal') +
    '<button type="button" class="iconbtn l" aria-label="Voltar" data-act="voltar" data-para="/adotar">' + I('left', 22, 2.2) + '</button></div>' +
    (fotos.length > 1 ? '<div class="miniaturas" role="group" aria-label="Fotos">' + fotos.map(function (f, i) { return '<button type="button" class="' + (f === atual ? 'on' : '') + '" data-act="galeria" data-id="' + a.id + '" data-foto-id="' + f + '" aria-label="Foto ' + (i + 1) + '">' + img(f, '', true) + '</button>'; }).join('') + '</div>' : '') +
    '<div class="pad"><div class="stack none"><div class="rowc"><h1 class="h1" style="font-size:34px;line-height:42px">' + esc(a.nome) + '</h1>' + (a.origem === 'apac' ? '<span class="tag gold">APAC</span>' : '<span class="tag">Particular</span>') + '</div>' +
    '<p class="muted" style="font-size:15px">' + esc(a.sexo + ' · ' + a.idade + ' · Porte ' + a.porte.toLowerCase() + (a.cidade ? ' · ' + a.cidade : '')) + '</p></div>' +
    (meu ? '<p class="note">' + (a.status === 'publicado' ? 'Seu anúncio está publicado até ' + dataBR(a.publicado_ate) + '.' : 'Status do seu anúncio: ' + esc((STATUS[a.status] || [a.status])[0]) + '.') + '</p>' : '') +
    (a.origem === 'particular' && !meu ? '<p class="note flat">Anúncio de particular. Converse com o responsável e combine uma visita antes de adotar. A APAC não intermedia esta adoção.</p>' : '') +
    (a.historia ? '<section class="stack none"><h2 class="h2" style="font-size:18px">História</h2><p style="font-size:15px;line-height:22px;white-space:pre-line">' + esc(a.historia) + '</p></section>' : '') +
    (a.temperamento ? '<section class="stack"><h2 class="h2" style="font-size:18px">Temperamento</h2><div class="chips">' + a.temperamento.split(',').map(function (t) { return t.trim() ? '<span class="tag">' + esc(t.trim()) + '</span>' : ''; }).join('') + '</div></section>' : '') +
    '<section class="stack"><h2 class="h2" style="font-size:18px">Saúde</h2>' + (saude.length ? '<div class="chips" style="gap:8px 14px">' + saude.map(function (s) { return '<span class="ok">' + I('check', 18, 2.6) + s[1] + '</span>'; }).join('') + '</div>' : '<p class="small muted">Sem informações de vacina, castração ou vermífugo.</p>') + '</section>' +
    '</div></main>' + (acoes ? '<div class="footer">' + acoes + '</div>' : '') + '</div>';
};

T.pedido = async function (id) {
  var a = await D.um('animais', id), u = D.usuario();
  if (!a || a.origem !== 'apac') { return T.adotar(); }
  if (!S.pedido[id]) { S.pedido[id] = { etapa: 1, nome: u.nome, celular: u.celular || '', cidade: '', moradia: 'Casa', telas: 'Sim', moradores: '', outros: '', rotina: '', confirma: false }; }
  var p = S.pedido[id], b = 'pedido.' + id + '.', corpo = '', titulos = ['Seus dados', 'Seu lar', 'Revisão'];
  if (p.etapa === 1) {
    corpo = campo('p-nome', 'Nome completo', b + 'nome', p.nome, 'type="text" autocomplete="name"') +
      campo('p-cel', 'Celular com WhatsApp', b + 'celular', p.celular, 'type="tel" autocomplete="tel" placeholder="(11) 90000-0000"') +
      campo('p-cid', 'Cidade e bairro', b + 'cidade', p.cidade, 'type="text"');
  } else if (p.etapa === 2) {
    corpo = '<fieldset><legend>Onde você mora?</legend><div class="grid2" style="gap:8px">' + ['Casa', 'Apartamento'].map(function (o) { return setBtn(b + 'moradia', o, o, p.moradia, 'opt'); }).join('') + '</div></fieldset>' +
      '<fieldset><legend>Janelas e sacadas têm tela?</legend><div class="grid3">' + ['Sim', 'Parcial', 'Não'].map(function (o) { return setBtn(b + 'telas', o, o, p.telas, 'opt'); }).join('') + '</div></fieldset>' +
      campo('p-mor', 'Quem mora com você?', b + 'moradores', p.moradores, 'type="text" placeholder="Ex.: dois adultos e uma criança"') +
      campo('p-out', 'Você tem outros animais?', b + 'outros', p.outros, 'type="text" placeholder="Quais, e se são vacinados e castrados"') +
      area('p-rot', 'Como é a sua rotina?', b + 'rotina', p.rotina, 'Quanto tempo o animal ficaria sozinho por dia?');
  } else {
    corpo = '<div class="card stack"><p class="h3">Pedido para adotar ' + esc(a.nome) + '</p><p class="small"><strong>Interessado:</strong> ' + esc(p.nome) + ' · ' + esc(p.celular) + '</p><p class="small"><strong>Local:</strong> ' + esc(p.cidade) + '</p><p class="small"><strong>Moradia:</strong> ' + esc(p.moradia) + ', telas: ' + esc(p.telas.toLowerCase()) + '</p><p class="small"><strong>Moradores:</strong> ' + esc(p.moradores) + '</p>' + (p.outros ? '<p class="small"><strong>Outros animais:</strong> ' + esc(p.outros) + '</p>' : '') + '<p class="small"><strong>Rotina:</strong> ' + esc(p.rotina) + '</p></div>' +
      '<label class="check"><input type="checkbox" data-bind="' + b + 'confirma"' + (p.confirma ? ' checked' : '') + '><span>Confirmo que as informações são verdadeiras.</span></label>';
  }
  return tela('<div class="stack"><div class="between small" style="font-weight:700"><span>Etapa ' + p.etapa + ' de 3: ' + titulos[p.etapa - 1].toLowerCase() + '</span><span>' + esc(a.nome) + '</span></div><div class="progress" aria-hidden="true"><span class="on"></span><span class="' + (p.etapa > 1 ? 'on' : '') + '"></span><span class="' + (p.etapa > 2 ? 'on' : '') + '"></span></div></div>' +
    corpo + '<p class="error" id="erro" role="alert"></p>', null, {
    cls: 'tight', topo: topbar('Pedido de adoção', '/animal/' + id),
    rodape: '<div class="footer two"><button type="button" class="btn outline" data-act="pedido-voltar" data-id="' + id + '">Voltar</button><button type="button" class="btn" data-act="pedido-avancar" data-id="' + id + '">' + (p.etapa === 3 ? 'Enviar pedido' : 'Continuar') + '</button></div>'
  });
};
T['pedido-enviado'] = function () {
  return concluido('Pedido enviado', 'A equipe da APAC vai analisar seu pedido e falar com você pelo WhatsApp. Você acompanha o andamento no seu Perfil.',
    '<a class="btn" href="#/atividades/pedidos">Ver meus pedidos</a><a class="btn outline" href="#/adotar">Voltar para Adotar</a>');
};

/* ---------- Formulários genéricos (anúncio e painel da equipe) ---------- */
var OP = {
  especie: [['cao', 'Cão'], ['gato', 'Gato']], sexo: [['Macho', 'Macho'], ['Fêmea', 'Fêmea']], idade: [['Filhote', 'Filhote'], ['Adulto', 'Adulto'], ['Idoso', 'Idoso']],
  porte: [['Pequeno', 'Pequeno'], ['Médio', 'Médio'], ['Grande', 'Grande']]
};
var CAMPOS_ANIMAL = [
  { k: 'fotos', l: 'Fotos (até 5)', t: 'fotos' },
  { k: 'nome', l: 'Nome do animal', req: 1 },
  { k: 'especie', l: 'Espécie', t: 'opts', op: OP.especie, req: 1 }, { k: 'sexo', l: 'Sexo', t: 'opts', op: OP.sexo, req: 1 },
  { k: 'idade', l: 'Idade aproximada', t: 'opts', op: OP.idade, req: 1 }, { k: 'porte', l: 'Porte', t: 'opts', op: OP.porte, req: 1 },
  { k: 'temperamento', l: 'Temperamento', ajuda: 'Separe por vírgulas. Ex.: dócil, brincalhão, gosta de crianças' },
  { k: 'vacinado', l: 'Vacinado', t: 'check' }, { k: 'castrado', l: 'Castrado', t: 'check' }, { k: 'vermifugado', l: 'Vermifugado', t: 'check' },
  { k: 'historia', l: 'História', t: 'area', ph: 'Como ele foi resgatado, como é o dia a dia, que tipo de lar combina com ele' },
  { k: 'cidade', l: 'Cidade e bairro' }
];
var ENT = {
  anuncio: { titulo: 'Anunciar animal', tabela: 'animais', campos: CAMPOS_ANIMAL.concat([{ k: 'contato', l: 'WhatsApp para contato', t: 'tel', req: 1, ajuda: 'Os interessados vão falar com você por este número.' }]) },
  animais: {
    titulo: 'Animal', tabela: 'animais',
    campos: CAMPOS_ANIMAL.concat([
      { k: 'contato', l: 'WhatsApp do responsável (anúncios de particular)', t: 'tel' },
      { k: 'origem', l: 'Quem anuncia', t: 'select', op: [['apac', 'APAC'], ['particular', 'Particular']], padrao: 'apac' },
      { k: 'status', l: 'Situação', t: 'select', op: [['publicado', 'Publicado'], ['aguardando_pagamento', 'Aguardando pagamento'], ['adotado', 'Adotado'], ['removido', 'Retirado']], padrao: 'publicado' },
      { k: 'publicado_ate', l: 'Anúncio publicado até (só particulares)', t: 'date' },
      { k: 'aceita_padrinho', l: 'Aceita padrinhos (só animais da APAC)', t: 'check' }
    ])
  },
  campanhas: {
    titulo: 'Campanha', plural: 'Campanhas', tabela: 'campanhas', ordem: ['data', true],
    campos: [{ k: 'titulo', l: 'Título', req: 1 }, { k: 'tipo', l: 'Tipo', t: 'select', op: [['castracao', 'Castração'], ['vacinacao', 'Vacinação'], ['feira', 'Feira de adoção'], ['outro', 'Outro']], padrao: 'castracao' },
      { k: 'data', l: 'Data', t: 'date' }, { k: 'horario', l: 'Horário' }, { k: 'local', l: 'Local' }, { k: 'vagas', l: 'Vagas', t: 'int' },
      { k: 'requisitos', l: 'O que levar e requisitos', t: 'area' }, { k: 'ativa', l: 'Visível no app', t: 'check', padrao: true }],
    linha: function (c) { return [c.titulo, (c.data ? dataBR(c.data) : 'Data a definir') + (c.ativa ? '' : ' · oculta')]; }
  },
  metas: {
    titulo: 'Meta', plural: 'Metas de arrecadação', tabela: 'metas', ordem: ['criado_em', false],
    campos: [{ k: 'titulo', l: 'Título', req: 1, ph: 'Ex.: Ração para o inverno' }, { k: 'descricao', l: 'Descrição', t: 'area' },
      { k: 'valor_meta', l: 'Valor da meta (R$)', t: 'dinheiro', req: 1 }, { k: 'arrecadado', l: 'Já arrecadado (R$)', t: 'dinheiro', padrao: 0, ajuda: 'Soma automaticamente quando você confirma uma doação para esta meta. Ajuste aqui doações recebidas fora do app.' },
      { k: 'prazo', l: 'Prazo', t: 'date' }, { k: 'ativa', l: 'Visível no app', t: 'check', padrao: true }],
    linha: function (m) { return [m.titulo, reais(m.arrecadado) + ' de ' + reais(m.valor_meta) + (m.ativa ? '' : ' · oculta')]; }
  },
  itens_doacao: {
    titulo: 'Item', plural: 'Itens para doação', tabela: 'itens_doacao', ordem: ['ordem', true],
    campos: [{ k: 'nome', l: 'Item', req: 1 }, { k: 'detalhe', l: 'Detalhe' }, { k: 'urgente', l: 'Urgente', t: 'check' }, { k: 'ordem', l: 'Ordem na lista', t: 'int', padrao: 0 }, { k: 'ativo', l: 'Visível no app', t: 'check', padrao: true }],
    linha: function (i) { return [i.nome, (i.urgente ? 'Urgente · ' : '') + (i.ativo ? 'Visível' : 'Oculto')]; }
  },
  locais_atendimento: {
    titulo: 'Local', plural: 'Atendimento veterinário', tabela: 'locais_atendimento', ordem: ['ordem', true],
    campos: [{ k: 'nome', l: 'Nome', req: 1 }, { k: 'cidade', l: 'Cidade' }, { k: 'gratuito', l: 'Atendimento gratuito', t: 'check' }, { k: 'servicos', l: 'Serviços', t: 'area' },
      { k: 'requisitos', l: 'Quem tem direito e requisitos', t: 'area' }, { k: 'endereco', l: 'Endereço', t: 'area' }, { k: 'whatsapp', l: 'WhatsApp', t: 'tel' }, { k: 'telefone', l: 'Telefone', t: 'tel' },
      { k: 'site', l: 'Site', t: 'url' }, { k: 'ordem', l: 'Ordem na lista', t: 'int', padrao: 0 }, { k: 'ativo', l: 'Visível no app', t: 'check', padrao: true }],
    linha: function (l) { return [l.nome, (l.cidade || '') + (l.ativo ? '' : ' · oculto')]; }
  },
  avisos: {
    titulo: 'Aviso', plural: 'Avisos', tabela: 'avisos', ordem: ['criado_em', false],
    campos: [{ k: 'titulo', l: 'Título', req: 1 }, { k: 'texto', l: 'Mensagem', t: 'area' }],
    linha: function (a) { return [a.titulo, quando(a.criado_em)]; }
  }
};
function iniciarForm(ent, id, registro) {
  var def = ENT[ent], v = {};
  def.campos.forEach(function (c) { v[c.k] = registro ? registro[c.k] : (c.padrao !== undefined ? c.padrao : (c.t === 'check' ? false : (c.t === 'fotos' ? [] : ''))); if (v[c.k] == null) { v[c.k] = c.t === 'fotos' ? [] : ''; } });
  S.form = { ent: ent, id: id, vals: v, enviando: 0 };
}
function renderCampos(ent) {
  var def = ENT[ent], v = S.form.vals;
  return def.campos.map(function (c) {
    var id = 'f-' + c.k, val = v[c.k], bind = 'data-fk="' + c.k + '"';
    if (c.t === 'fotos') {
      return '<div class="field"><span class="flabel">' + esc(c.l) + '</span><div class="thumbs">' + val.map(function (f) {
        return '<span class="thumb">' + img(f, 'Foto', true) + '<button type="button" data-act="tirar-foto" data-id="' + f + '" aria-label="Remover foto">' + I('x', 16, 2.4) + '</button></span>';
      }).join('') + (val.length < 5 ? '<label class="upload thumb" style="min-height:76px;border-style:dashed" aria-label="Adicionar foto">' + (S.form.enviando ? '<span class="spin" style="width:24px;height:24px;border-width:3px"></span>' : I('camera', 26)) + '<input class="visually-hidden" type="file" accept="image/*" multiple data-act-change="form-fotos"></label>' : '') + '</div></div>';
    }
    if (c.t === 'opts') {
      return '<fieldset><legend>' + esc(c.l) + '</legend><div class="chips">' + c.op.map(function (o) { return chip(o[1], val === o[0], 'data-fset="' + c.k + '" data-val="' + esc(o[0]) + '"'); }).join('') + '</div></fieldset>';
    }
    if (c.t === 'check') { return '<label class="check"><input type="checkbox" ' + bind + (val ? ' checked' : '') + '><span>' + esc(c.l) + '</span></label>'; }
    if (c.t === 'select') {
      return '<div class="field"><label for="' + id + '">' + esc(c.l) + '</label><select class="input" id="' + id + '" ' + bind + '>' + c.op.map(function (o) { return '<option value="' + esc(o[0]) + '"' + (val === o[0] ? ' selected' : '') + '>' + esc(o[1]) + '</option>'; }).join('') + '</select></div>';
    }
    if (c.t === 'area') { return '<div class="field"><label for="' + id + '">' + esc(c.l) + '</label><textarea class="input" id="' + id + '" rows="4" ' + bind + ' placeholder="' + esc(c.ph || '') + '">' + esc(val) + '</textarea>' + (c.ajuda ? '<span class="help">' + esc(c.ajuda) + '</span>' : '') + '</div>'; }
    var tipo = { date: 'type="date"', int: 'type="number" inputmode="numeric" step="1"', dinheiro: 'type="number" inputmode="decimal" step="0.01" min="0"', tel: 'type="tel" placeholder="(11) 90000-0000"', url: 'type="url" placeholder="https://"' }[c.t] || 'type="text"';
    return '<div class="field"><label for="' + id + '">' + esc(c.l) + '</label><input class="input" id="' + id + '" ' + bind + ' ' + tipo + ' value="' + esc(val) + '"' + (c.ph ? ' placeholder="' + esc(c.ph) + '"' : '') + '>' + (c.ajuda ? '<span class="help">' + esc(c.ajuda) + '</span>' : '') + '</div>';
  }).join('');
}
function valoresForm(ent) {
  var def = ENT[ent], v = S.form.vals, out = {}, erroMsg = null;
  def.campos.forEach(function (c) {
    var x = v[c.k];
    if (c.t === 'int') { x = x === '' || x == null ? null : parseInt(x, 10); }
    else if (c.t === 'dinheiro') { x = x === '' || x == null ? null : Number(String(x).replace(',', '.')); }
    else if (c.t === 'date') { x = x || null; }
    else if (c.t === 'check') { x = !!x; }
    else if (c.t !== 'fotos') { x = String(x == null ? '' : x).trim(); }
    if (c.req && !erroMsg && (x === '' || x == null)) { erroMsg = 'Preencha: ' + c.l + '.'; }
    out[c.k] = x;
  });
  if (out.valor_meta != null && !(out.valor_meta > 0) && !erroMsg) { erroMsg = 'O valor da meta precisa ser maior que zero.'; }
  if (ent === 'anuncio' && digitos(out.contato).length < 10 && !erroMsg) { erroMsg = 'Informe o WhatsApp com DDD.'; }
  return { vals: out, erro: erroMsg };
}

/* ---------- Anunciar ---------- */
T.anunciar = function () {
  if (!S.form || S.form.ent !== 'anuncio') { iniciarForm('anuncio', null); S.form.vals.contato = (D.usuario() || {}).celular || ''; }
  var preco = reais(D.num('valor_anuncio', 20)), meses = D.num('meses_anuncio', 2);
  return tela('<div class="card gold stack"><h2 class="h2">Como funciona</h2><ul class="stack small">' +
    '<li class="ok" style="align-items:flex-start;font-weight:600">' + I('check', 18, 2.6) + '<span>O anúncio fica ' + meses + ' meses no app por uma taxa simbólica de <strong>' + preco + '</strong>, que ajuda a manter o trabalho da APAC.</span></li>' +
    '<li class="ok" style="align-items:flex-start;font-weight:600">' + I('check', 18, 2.6) + '<span>Ele é publicado quando a equipe confirmar o Pix. Para continuar no ar depois do prazo, renove por mais ' + preco + '.</span></li>' +
    '<li class="ok" style="align-items:flex-start;font-weight:600">' + I('check', 18, 2.6) + '<span>A taxa é pela divulgação. A adoção em si deve ser gratuita e responsável.</span></li></ul></div>' +
    renderCampos('anuncio') + '<p class="error" id="erro" role="alert"></p>', null, {
    cls: 'tight', topo: topbar('Anunciar para adoção', '/adotar'),
    rodape: '<div class="footer"><button type="button" class="btn" data-act="salvar-anuncio">Continuar para o pagamento de ' + preco + '</button></div>'
  });
};
T['meus-anuncios'] = async function () {
  var u = D.usuario(), meus = await D.listar('animais', { eq: { dono: u.id, origem: 'particular' }, order: ['criado_em', false] }, true), h = D.hoje();
  return tela('<a class="btn sm" href="#/anunciar">' + I('plus', 20, 2.4) + 'Novo anúncio</a>' + (meus.length ? meus.map(function (a) {
    var vencido = a.status === 'publicado' && a.publicado_ate < h, st = vencido ? 'vencido' : a.status, dias = a.publicado_ate ? diasAte(a.publicado_ate) : 0;
    var botoes = '';
    if (a.status === 'aguardando_pagamento') { botoes = '<button type="button" class="btn xs gold" data-act="pagar-anuncio" data-id="' + a.id + '">Pagar ' + reais(D.num('valor_anuncio', 20)) + '</button>'; }
    else if (a.status === 'publicado') { botoes = '<button type="button" class="btn xs gold" data-act="pagar-anuncio" data-id="' + a.id + '">Renovar por ' + D.num('meses_anuncio', 2) + ' meses</button><button type="button" class="btn xs outline" data-act="anuncio-status" data-val="adotado" data-id="' + a.id + '" data-dupla="Toque de novo para confirmar">Foi adotado</button>'; }
    return '<article class="card stack"><div class="rowc"><span class="tint" style="flex:none;width:56px;height:56px;border-radius:12px;overflow:hidden;background:var(--soft);display:flex;align-items:center;justify-content:center;position:relative">' + pata(26) + img(a.fotos[0], '', true, '" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover') + '</span>' +
      '<div class="stack none" style="flex:1;min-width:0"><a class="h3" href="#/animal/' + a.id + '" style="text-decoration:none">' + esc(a.nome) + '</a><span>' + selo(st) + '</span>' +
      (a.status === 'publicado' ? '<span class="xs muted">' + (vencido ? 'Venceu em ' : 'No ar até ') + dataBR(a.publicado_ate) + (vencido ? '' : ' (' + plural(dias, 'dia', 'dias') + ')') + '</span>' : '') + '</div></div>' +
      (botoes ? '<div class="grid2" style="gap:8px">' + botoes + '</div>' : '') + '</article>';
  }).join('') : vazio('Você ainda não anunciou nenhum animal.')), null, { cls: 'tight', topo: topbar('Meus anúncios', '/perfil') });
};

/* ---------- Pagamento via Pix ---------- */
T.pagar = async function (id) {
  var p = S.pag[id] || await D.um('pagamentos', id);
  await D.carregarConfig(true).catch(function () {});
  if (!p) { return tela('<p class="empty">Pagamento não encontrado.</p>', null, { topo: topbar('Pagamento', '/perfil') }); }
  var c = D.config(), codigo = Pix.codigo({ chave: c.pix_chave || '17393867000157', nome: c.pix_nome || 'APAC COTIA', cidade: c.pix_cidade || 'COTIA', valor: p.valor, txid: p.codigo });
  var chave = c.pix_chave || '', chaveVis = /^\d{14}$/.test(chave) ? chave.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, '$1.$2.$3/$4-$5') : chave;
  var desc = p.descricao || TIPO_PAG[p.tipo];
  var msg = 'Olá! Fiz um Pix de ' + reais(p.valor) + ' para a APAC (' + TIPO_PAG[p.tipo] + '). Código ' + p.codigo + (p.protocolo ? ', protocolo ' + p.protocolo : '') + '. Segue o comprovante.';
  var depois = { denuncia: 'A denúncia é encaminhada à equipe assim que o pagamento for confirmado.', anuncio: 'O anúncio é publicado assim que a equipe confirmar o pagamento.', apadrinhamento: 'O apadrinhamento começa quando a equipe confirmar o pagamento. A partir daí você recebe as atualizações no seu Perfil.', apoio_mensal: 'Seu apoio mensal começa quando a equipe confirmar o pagamento.', doacao: 'Obrigado! A equipe confirma o recebimento em breve.', meta: 'Obrigado! O valor entra na meta quando a equipe confirmar o pagamento.' }[p.tipo];
  var fim = { denuncia: '#/ajuda', anuncio: '#/meus-anuncios', apadrinhamento: '#/perfil', apoio_mensal: '#/perfil', doacao: '#/colaborar', meta: '#/colaborar' }[p.tipo];
  return tela(
    (p.protocolo ? '<div class="note ok"><strong>Denúncia registrada.</strong> Protocolo <strong>' + esc(p.protocolo) + '</strong>. Guarde este número.</div>' : '') +
    '<div class="card center stack" style="text-align:center"><span class="small muted" style="font-weight:700">' + esc(desc) + '</span><span class="h1" style="font-size:36px;line-height:44px">' + reais(p.valor) + '</span>' +
    '<div class="qr" role="img" aria-label="QR Code do Pix">' + Pix.qrSvg(codigo) + '</div><span class="small">Abra o app do seu banco, escolha Pix e leia o QR Code.</span></div>' +
    '<div class="stack"><span class="flabel">Ou use o Pix copia e cola</span><div class="key"><span class="codigo">' + esc(codigo) + '</span></div><button type="button" class="btn sm" data-act="copiar" data-texto="' + esc(codigo) + '" data-ok="Código Pix copiado">Copiar código Pix</button></div>' +
    '<div class="stack"><span class="flabel">Chave Pix (CNPJ)</span><div class="key"><span>' + esc(chaveVis) + '</span><button type="button" class="btn xs auto" data-act="copiar" data-texto="' + esc(chave) + '" data-ok="Chave copiada">Copiar</button></div>' +
    '<p class="small" style="color:var(--muted)">Confira se o recebedor é a Associação Protetora dos Animais de Cotia. Se usar a chave, informe o valor de ' + reais(p.valor) + ' e o código <strong>' + esc(p.codigo) + '</strong> na mensagem.</p></div>' +
    '<p class="note flat">' + esc(depois) + ' A APAC verá o nome de quem fez o Pix.</p>' + avisoDemo(), null, {
    cls: 'tight', topo: topbar('Pagamento via Pix', fim.slice(1)),
    rodape: '<div class="footer"><a class="btn gold" href="' + whatsAPAC(msg) + '">' + I('chat', 20) + 'Enviar comprovante no WhatsApp</a><a class="btn outline sm" href="' + fim + '">Concluir</a></div>'
  });
};
async function irParaPagamento(tipo, ref, valor, extra) {
  var p = await D.criarPagamento(tipo, ref, valor);
  for (var k in extra || {}) { p[k] = extra[k]; }
  S.pag[p.id] = p;
  trocar('/pagar/' + p.id);
}
async function pendenteOuNovo(tipo, ref, valor) {
  var u = D.usuario();
  var ex = u ? await D.listar('pagamentos', { eq: { usuario: u.id, ref: ref, status: 'pendente', tipo: tipo } }, true) : [];
  if (ex.length) { S.pag[ex[0].id] = ex[0]; ir('/pagar/' + ex[0].id); return; }
  var p = await D.criarPagamento(tipo, ref, valor);
  S.pag[p.id] = p; ir('/pagar/' + p.id);
}

/* ---------- Ajuda, denúncia, guias, atendimento, campanhas ---------- */
var GUIAS = {
  atropelado: { titulo: 'Encontrei um animal atropelado', passos: [
    ['Proteja-se primeiro', 'Sinalize o local e só se aproxime quando o trânsito permitir.'],
    ['Aproxime-se com calma', 'Um animal com dor pode morder ou arranhar. Fale baixo, evite movimentos bruscos e use uma manta para pegá-lo.'],
    ['Leve ao veterinário', 'Quanto antes, melhor. Veja a lista de atendimento veterinário: os hospitais gratuitos pedem comprovante de endereço da cidade.'],
    ['O cuidado passa a ser seu', 'Quem acolhe o animal fica responsável por ele: paga o veterinário, leva para casa e cuida dele. As ONGs da região estão sem vagas e os lares temporários são pagos.'],
    ['Se não puder ficar com ele, anuncie', 'Tire boas fotos e informe idade aproximada, sexo, vacinas e se é castrado. Anuncie no app e divulgue no Instagram, WhatsApp, TikTok, Kwai e YouTube. Em geral aparece um adotante em 1 a 2 meses.'] ] },
  abandonado: { titulo: 'Vi um animal abandonado na rua', passos: [
    ['Viu o abandono acontecer?', 'Abandonar um animal é crime de maus-tratos. Anote o local, o horário e, se puder, a placa do veículo, e faça uma denúncia.'],
    ['Avalie se pode ajudar', 'Quem recolhe um animal da rua passa a ser responsável por ele e pelas despesas. As ONGs da região estão sem vagas e os lares temporários são pagos.'],
    ['Leve ao veterinário', 'Peça uma avaliação geral e orientação sobre vacinas e vermífugo. Veja a lista de atendimento veterinário.'],
    ['Procure um lar', 'Se não puder ficar com ele, anuncie no app com fotos, idade aproximada, sexo, vacinas e castração, e divulgue nas redes sociais.'] ] },
  resgatei: { titulo: 'Resgatei um animal, e agora?', passos: [
    ['Separe dos seus animais', 'Mantenha-o em um espaço próprio até passar por um veterinário.'],
    ['Leve ao veterinário', 'Faça uma avaliação, vacinas e vermífugo. Há opções gratuitas e de preço popular na lista de atendimento.'],
    ['Procure o tutor', 'Divulgue fotos na região, porque ele pode ter se perdido de casa.'],
    ['Você é o responsável agora', 'Enquanto ele estiver com você, os cuidados e as despesas são seus. As ONGs da região estão sem vagas.'],
    ['Anuncie para adoção', 'Anuncie no app e nas redes sociais com fotos, idade aproximada, sexo, vacinas e castração. Em geral aparece um adotante em 1 a 2 meses.'] ] },
  mudanca: { titulo: 'Vou me mudar e não posso levá-lo', passos: [
    ['Reveja as opções', 'Veja as regras de transporte e de moradia do novo endereço: pode haver solução.'],
    ['Comece com antecedência', 'Quanto antes você procurar, maior a chance de uma boa adoção.'],
    ['Procure um novo lar', 'Comece por amigos e familiares de confiança e anuncie no app e nas redes sociais.'],
    ['Nunca abandone', 'Abandonar um animal é crime de maus-tratos. As ONGs da região estão sem vagas para receber animais.'] ] }
};
T.ajuda = function () {
  return tela('<h1 class="h1">Como podemos ajudar?</h1>' +
    '<a class="promo danger" href="#/denuncia">' + I('alert', 34) + '<span class="grow"><span class="h2">Denunciar maus-tratos</span><span class="small">Com fotos e local, taxa simbólica de ' + reais(D.num('valor_denuncia', 5)) + '</span></span>' + I('right', 20, 2.2) + '</a>' +
    '<section class="stack"><h2 class="h2">O que fazer agora</h2>' + lista(Object.keys(GUIAS).map(function (k) { return linha(GUIAS[k].titulo, '#/guia/' + k); })) + '</section>' +
    '<section class="stack"><h2 class="h2">Serviços</h2><div class="grid2"><a class="tile soft" href="#/atendimento">' + I('pin', 24) + 'Atendimento veterinário</a><a class="tile soft" href="#/campanhas">' + I('cal', 24) + 'Campanhas e feiras</a></div></section>' +
    '<a class="btn outline sm" href="' + whatsAPAC() + '">' + I('chat', 20) + 'Falar com a APAC no WhatsApp</a>', 'ajuda');
};
T.denuncia = function () {
  if (!S.denuncia) { S.denuncia = novaDenuncia(); }
  var d = S.denuncia, taxa = reais(D.num('valor_denuncia', 5));
  return tela('<a class="note alert" href="tel:190" style="display:flex;align-items:center;gap:10px;text-decoration:none">' + I('phone', 22) + '<span><strong>Animal em risco agora? Ligue 190.</strong> O atendimento da polícia é gratuito.</span></a>' +
    '<fieldset><legend>O que está acontecendo?</legend><div class="chips">' + ['Agressão', 'Abandono', 'Negligência', 'Envenenamento', 'Outro'].map(function (o) { return setBtn('denuncia.tipo', o, o, d.tipo); }).join('') + '</div></fieldset>' +
    '<div class="field"><label for="d-local">Onde?</label><input class="input" id="d-local" data-bind="denuncia.local" value="' + esc(d.local) + '" placeholder="Rua, número, bairro ou referência">' +
    '<button type="button" class="linkbtn" data-act="localizacao" style="font-size:14px">' + I('pin', 18) + 'Usar minha localização</button></div>' +
    area('d-desc', 'Descreva o que você viu', 'denuncia.descricao', d.descricao, 'Quando aconteceu, quantos animais, estado deles') +
    '<div class="field"><span class="flabel">Fotos ou vídeos curtos (opcional)</span><div class="thumbs">' + d.fotos.map(function (f) { return '<span class="thumb">' + img(f, 'Foto', true) + '<button type="button" data-act="tirar-foto-den" data-id="' + f + '" aria-label="Remover foto">' + I('x', 16, 2.4) + '</button></span>'; }).join('') +
    (d.fotos.length < 5 ? '<label class="upload thumb" style="min-height:76px" aria-label="Adicionar foto">' + (d.enviando ? '<span class="spin" style="width:24px;height:24px;border-width:3px"></span>' : I('camera', 26)) + '<input class="visually-hidden" type="file" accept="image/*" multiple data-act-change="den-fotos"></label>' : '') + '</div><span class="help">Só a equipe da APAC vê as fotos.</span></div>' +
    '<section class="card gold stack"><h2 class="h2">Taxa simbólica de ' + taxa + '</h2><p class="small">A APAC não recebe verba de governos, prefeituras ou empresas. Esta taxa ajuda a:</p><ul class="stack small">' +
    ['evitar denúncias falsas, que tiram a equipe de casos reais;', 'ajudar o animal da denúncia, com orientação, encaminhamento e cuidados sempre que possível;', 'cobrir gastos com os animais resgatados, como ração, remédios e veterinário.'].map(function (t) { return '<li class="ok" style="align-items:flex-start;font-weight:600">' + I('check', 18, 2.6) + '<span>' + t + '</span></li>'; }).join('') +
    '</ul><p class="xs" style="color:var(--gold-ink)">Não pedimos seus dados pessoais. A APAC verá apenas o nome de quem fizer o Pix.</p></section>' +
    '<p class="error" id="erro" role="alert"></p>', null, {
    cls: 'tight', topo: topbar('Denunciar maus-tratos', '/ajuda'),
    rodape: '<div class="footer"><button type="button" class="btn danger" data-act="enviar-denuncia">Registrar denúncia e pagar ' + taxa + '</button></div>'
  });
};
T.guia = function (id) {
  var g = GUIAS[id];
  if (!g) { return T.ajuda(); }
  return tela('<h2 class="h1">' + esc(g.titulo) + '</h2><ol class="stack">' +
    g.passos.map(function (p, i) { return '<li class="card step"><span class="num">' + (i + 1) + '</span><div class="stack none"><h2 class="h3">' + esc(p[0]) + '</h2><p style="font-size:15px;line-height:21px">' + esc(p[1]) + '</p></div></li>'; }).join('') + '</ol>', null, {
    cls: 'tight', topo: topbar('Guia rápido', '/ajuda'),
    rodape: '<div class="footer"><a class="btn" href="#/atendimento">Ver atendimento veterinário</a><div class="grid2" style="gap:8px"><a class="btn outline xs" href="#/anunciar">Anunciar para adoção</a><a class="btn outline xs" href="' + whatsAPAC() + '">Falar com a APAC</a></div></div>'
  });
};
T.atendimento = async function () {
  var l = await D.listar('locais_atendimento', { eq: { ativo: true }, order: ['ordem', true] });
  return tela('<p class="lead">Locais com atendimento gratuito ou a preço popular na região. Confirme horários e documentos antes de ir.</p>' +
    (l.length ? l.map(function (x) {
      var b = [];
      if (x.whatsapp) { b.push('<a class="btn xs" href="' + whats(x.whatsapp, 'Olá! Vi o contato de vocês no app da APAC Cotia.') + '">' + I('chat', 18) + 'WhatsApp</a>'); }
      if (x.telefone) { b.push('<a class="btn xs outline" href="tel:' + digitos(x.telefone) + '">' + I('phone', 18) + 'Ligar</a>'); }
      if (x.site) { b.push('<a class="btn xs outline" href="' + esc(x.site) + '">' + I('out', 18) + 'Site</a>'); }
      return '<article class="card stack"><div class="stack none"><div class="between" style="align-items:flex-start"><h2 class="h3">' + esc(x.nome) + '</h2>' + (x.gratuito ? '<span class="tag ok" style="flex:none">Gratuito</span>' : '<span class="tag gold" style="flex:none">Preço popular</span>') + '</div>' +
        (x.cidade ? '<span class="small muted">' + esc(x.cidade) + '</span>' : '') + '</div>' + (x.servicos ? '<p class="small">' + esc(x.servicos) + '</p>' : '') +
        (x.requisitos ? '<p class="small"><strong>Quem tem direito:</strong> ' + esc(x.requisitos) + '</p>' : '') + (x.endereco ? '<p class="small"><strong>Endereço:</strong> ' + esc(x.endereco) + '</p>' : '') +
        (b.length ? '<div class="grid' + Math.min(b.length, 3) + '" style="gap:8px">' + b.join('') + '</div>' : '') + '</article>';
    }).join('') : vazio('Nenhum local cadastrado ainda.')), null, { cls: 'tight', topo: topbar('Atendimento veterinário', '/ajuda') });
};
T.campanhas = async function (_, q) {
  if (q.tipo && !S.campanhas.fixo) { S.campanhas.filtro = q.tipo; S.campanhas.fixo = 1; }
  var f = S.campanhas.filtro, u = D.usuario();
  var res = await Promise.all([D.listar('campanhas', { eq: { ativa: true }, order: ['data', true] }), u ? D.listar('inscricoes', { eq: { usuario: u.id } }) : Promise.resolve([])]);
  var itens = res[0].filter(function (c) { return f === 'todas' || c.tipo === f; }), minhas = res[1];
  var nomes = { castracao: 'Castração', vacinacao: 'Vacinação', feira: 'Feira de adoção', outro: 'Campanha' };
  return tela('<div class="seg" role="group" aria-label="Filtrar campanhas">' + setBtn('campanhas.filtro', 'todas', 'Todas', f) + setBtn('campanhas.filtro', 'castracao', 'Castração', f) + setBtn('campanhas.filtro', 'vacinacao', 'Vacinação', f) + setBtn('campanhas.filtro', 'feira', 'Feiras', f) + '</div>' +
    (itens.length ? itens.map(function (c) {
      var feita = minhas.filter(function (x) { return x.campanha === c.id; })[0];
      return '<article class="card stack"><div class="rowc">' + caixaData(c.data) + '<div class="stack none" style="min-width:0"><span class="xs muted" style="font-weight:800">' + esc(nomes[c.tipo] || '').toUpperCase() + '</span><h2 class="h3" style="font-size:17px">' + esc(c.titulo) + '</h2><p class="small muted">' + esc([c.local, c.horario, c.vagas ? c.vagas + ' vagas' : ''].filter(Boolean).join(' · ') || 'Local e horário a definir') + '</p></div></div>' +
        (c.requisitos ? '<p class="small"><strong>O que levar:</strong> ' + esc(c.requisitos) + '</p>' : '') +
        (c.tipo !== 'feira' ? '<button type="button" class="btn sm' + (feita ? ' outline' : '') + '" data-act="inscrever" data-id="' + c.id + '" data-insc="' + (feita ? feita.id : '') + '">' + (feita ? 'Cancelar inscrição' : 'Inscrever meu animal') + '</button>' : '') + '</article>';
    }).join('') : vazio('Nenhuma campanha programada no momento.')), 'ajuda', { cls: 'tight', topo: topbar('Campanhas e feiras', '/ajuda') });
};

/* ---------- Colaborar, doar, apadrinhar, itens ---------- */
T.colaborar = async function () {
  var res = await Promise.all([D.listar('metas', { eq: { ativa: true }, order: ['criado_em', false] }), animaisPublicos()]);
  var metas = res[0], afilhados = res[1].filter(function (a) { return a.origem === 'apac' && a.aceita_padrinho; });
  return tela('<div class="stack none"><h1 class="h1">Colaborar</h1><p class="lead">Sua ajuda mantém a fiscalização de maus-tratos e as campanhas de castração e vacinação.</p></div>' +
    '<a class="promo gold" href="#/doar"><span class="grow"><span class="h1" style="font-size:24px;line-height:30px">Doar agora</span><span style="font-size:15px;font-weight:600">Pix de qualquer valor, na hora</span></span>' + I('right', 24, 2.4) + '</a>' +
    '<a class="promo dark" href="#/doar?mensal=1">' + I('heart', 26) + '<span class="grow"><span class="h3">Apoio mensal à APAC</span><span class="small" style="color:#E6E6E6">Contribua todo mês e ajude a planejar os resgates</span></span>' + I('right', 20, 2.2) + '</a>' +
    (metas.length ? '<section class="stack"><h2 class="h2">Metas de arrecadação</h2>' + metas.map(metaCard).join('') + '</section>' : '') +
    '<section class="stack"><div class="between"><h2 class="h2">Apadrinhe um animal</h2>' + (afilhados.length > 2 ? '<a class="linkbtn" href="#/apadrinhar" style="font-size:14px">Ver todos</a>' : '') + '</div>' +
    '<p class="small">Contribua todo mês com um animal da APAC e receba fotos e notícias dele no app.</p>' +
    (afilhados.length ? '<div class="grid2">' + afilhados.slice(0, 2).map(function (a) { return petCard(a, '#/apadrinhar/' + a.id); }).join('') + '</div>' : vazio('Nenhum animal esperando padrinho agora.')) + '</section>' +
    '<section class="stack"><h2 class="h2">Outras formas de ajudar</h2><div class="grid2">' +
    '<a class="tile" href="#/itens">' + I('box', 24) + 'Doar ração e itens</a>' +
    '<a class="tile" href="#/anunciar">' + I('megafone', 24) + 'Anunciar um animal</a>' +
    '<a class="tile" href="' + SITE + '/voluntarios/">' + I('people', 24) + 'Ser voluntário</a>' +
    '<a class="tile" href="' + SITE + '/testamento-solidario/">' + I('doc', 24) + 'Testamento solidário</a>' +
    '</div><p class="xs muted">Voluntariado e testamento solidário abrem o site da APAC.</p></section>', 'colaborar');
};
T.doar = async function (_, q) {
  var meta = q.meta ? await D.um('metas', q.meta) : null;
  var chave = (q.meta || '') + '|' + (q.mensal || '');
  if (!S.doar || S.doar.chave !== chave) { S.doar = { chave: chave, mensal: !!q.mensal && !meta, valor: '50', outro: '' }; }
  var d = S.doar, u = D.usuario();
  var corpo = (meta ? metaCard(meta).replace(/<a class="btn xs auto gold"[^>]*>Doar<\/a>/, '') : '<p class="lead">Toda doação vai para o cuidado dos animais: ração, remédios, veterinário e deslocamento das equipes.</p>') +
    (meta ? '' : '<div class="grid2" role="group" aria-label="Tipo de doação" style="gap:8px">' + chip('Doação única', !d.mensal, 'data-set="doar.mensal" data-val=""', 'opt') + chip('Todo mês', d.mensal, 'data-set="doar.mensal" data-val="1"', 'opt') + '</div>') +
    '<fieldset><legend>' + (d.mensal ? 'Quanto por mês?' : 'Quanto você quer doar?') + '</legend><div class="grid4">' + ['20', '50', '100', 'outro'].map(function (v) { return setBtn('doar.valor', v, v === 'outro' ? 'Outro' : 'R$ ' + v, d.valor, 'opt'); }).join('') + '</div></fieldset>' +
    (d.valor === 'outro' ? campo('dv-outro', 'Valor em reais', 'doar.outro', d.outro, 'type="number" inputmode="decimal" min="' + (d.mensal ? 5 : 1) + '" step="0.01"') : '') +
    (d.mensal ? '<p class="note flat">Todo mês o app lembra você e gera um novo Pix. Você pode encerrar o apoio quando quiser, no seu Perfil.' + (u ? '' : ' Para o apoio mensal é preciso ter uma conta.') + '</p>' : '') +
    '<p class="error" id="erro" role="alert"></p>';
  return tela(corpo, null, { cls: 'tight', topo: topbar(meta ? 'Doar para a meta' : 'Doar', '/colaborar'), rodape: '<div class="footer"><button type="button" class="btn gold" data-act="doar" data-meta="' + (meta ? meta.id : '') + '">' + (d.mensal && !u ? 'Criar conta para apoiar todo mês' : 'Gerar Pix') + '</button></div>' });
};
T.apadrinhar = async function (id) {
  if (!id) {
    var l = (await animaisPublicos()).filter(function (a) { return a.origem === 'apac' && a.aceita_padrinho; });
    return tela('<p class="lead">Escolha um animal da APAC para apoiar todo mês. Você recebe fotos e notícias dele no app.</p>' + (l.length ? '<div class="grid2">' + l.map(function (a) { return petCard(a, '#/apadrinhar/' + a.id); }).join('') + '</div>' : vazio('Nenhum animal esperando padrinho agora.')), 'colaborar', { cls: 'tight', topo: topbar('Apadrinhar', '/colaborar') });
  }
  var a = await D.um('animais', id), u = D.usuario();
  if (!a || !a.aceita_padrinho) { return T.apadrinhar(); }
  if (!S.doar || S.doar.chave !== 'pad|' + id) { S.doar = { chave: 'pad|' + id, mensal: true, valor: '30', outro: '' }; }
  var d = S.doar;
  return tela('<div class="rowc"><span style="flex:none;width:84px;height:84px;border-radius:16px;overflow:hidden;background:var(--soft);display:flex;align-items:center;justify-content:center;position:relative">' + pata(36) + img(a.fotos[0], '', true, '" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover') + '</span>' +
    '<div class="stack none"><h1 class="h1" style="font-size:28px;line-height:34px">' + esc(a.nome) + '</h1><span class="small muted">' + esc(infoAnimal(a)) + '</span></div></div>' +
    '<div class="card gold stack"><h2 class="h2">Como funciona o apadrinhamento</h2><ul class="stack small">' +
    ['Você contribui todo mês com o valor que escolher.', 'O dinheiro ajuda na alimentação, nos remédios e nas consultas de ' + a.nome + '.', 'A equipe manda fotos e notícias, que aparecem no seu Perfil.', 'Você pode encerrar quando quiser.'].map(function (t) { return '<li class="ok" style="align-items:flex-start;font-weight:600">' + I('check', 18, 2.6) + '<span>' + esc(t) + '</span></li>'; }).join('') + '</ul></div>' +
    '<p class="fala" style="padding:0 4px">"Seu apoio vai me ajudar a comer bem, tomar minhas vacinas e esperar um lar com saúde."</p>' +
    '<fieldset><legend>Quanto por mês?</legend><div class="grid4">' + ['20', '30', '50', 'outro'].map(function (v) { return setBtn('doar.valor', v, v === 'outro' ? 'Outro' : 'R$ ' + v, d.valor, 'opt'); }).join('') + '</div></fieldset>' +
    (d.valor === 'outro' ? campo('dv-outro', 'Valor por mês em reais', 'doar.outro', d.outro, 'type="number" inputmode="decimal" min="5" step="0.01"') : '') +
    '<p class="error" id="erro" role="alert"></p>', null, {
    cls: 'tight', topo: topbar('Apadrinhar', '/animal/' + id),
    rodape: '<div class="footer"><button type="button" class="btn gold" data-act="apadrinhar" data-id="' + id + '">' + (u ? 'Apadrinhar ' + esc(a.nome) : 'Criar conta para apadrinhar') + '</button></div>'
  });
};
T.itens = async function () {
  var l = await D.listar('itens_doacao', { eq: { ativo: true }, order: ['ordem', true] }), c = await D.carregarConfig(true).catch(D.config);
  return tela('<p class="lead">Doações de itens também fazem muita diferença. Veja o que a APAC mais precisa agora.</p>' +
    (l.length ? lista(l.map(function (i) {
      return '<a class="row" href="' + whatsAPAC('Olá! Quero doar para a APAC: ' + i.nome + '. Como faço a entrega?') + '"><span class="main"><span>' + esc(i.nome) + (i.urgente ? ' <span class="tag alert">Urgente</span>' : '') + '</span>' + (i.detalhe ? '<span class="sub">' + esc(i.detalhe) + '</span>' : '') + '</span><span class="side">Quero doar' + I('right', 18, 2.2) + '</span></a>';
    })) : vazio('A lista de itens ainda não foi preenchida.')) +
    '<section class="card stack"><h2 class="h2">Entrega</h2>' + (c.entrega_endereco ? '<p class="small"><strong>Onde:</strong> ' + esc(c.entrega_endereco) + '</p>' : '') + (c.entrega_horario ? '<p class="small"><strong>Quando:</strong> ' + esc(c.entrega_horario) + '</p>' : '') +
    (!c.entrega_endereco && !c.entrega_horario ? '<p class="small">Combine o local e o horário da entrega com a equipe pelo WhatsApp.</p>' : '') + '</section>', null, {
    cls: 'tight', topo: topbar('Doar ração e itens', '/colaborar'),
    rodape: '<div class="footer"><a class="btn" href="' + whatsAPAC('Olá! Quero doar itens para a APAC. Como faço a entrega?') + '">' + I('chat', 20) + 'Combinar entrega no WhatsApp</a></div>'
  });
};

/* ---------- Perfil ---------- */
T.perfil = async function () {
  var u = D.usuario();
  if (!u) { return perfilVisitante(); }
  var res = await Promise.all([
    D.listar('pets', { eq: { usuario: u.id }, order: ['criado_em', true] }), D.listar('apoios_mensais', { eq: { usuario: u.id }, order: ['criado_em', false] }),
    D.listar('pedidos_adocao', { eq: { usuario: u.id } }), D.listar('denuncias', { eq: { autor: u.id } }), D.listar('inscricoes', { eq: { usuario: u.id } }),
    D.listar('pagamentos', { eq: { usuario: u.id } }), D.listar('animais', { eq: { dono: u.id, origem: 'particular' } })
  ]);
  var pets = res[0], apoios = res[1].filter(function (a) { return a.status !== 'encerrado'; }), h = D.hoje();
  var idsAnimais = apoios.map(function (a) { return a.animal; }).filter(Boolean);
  var animais = idsAnimais.length ? await D.listar('animais', { in: { id: idsAnimais } }) : [];
  function nomeAnimal(id) { var a = animais.filter(function (x) { return x.id === id; })[0]; return a ? a.nome : 'Animal'; }
  return tela((D.ehAdmin() ? '<a class="promo dark" href="#/inicio" data-act="painel">' + I('chart', 26) + '<span class="grow"><span class="h3">Painel da equipe APAC</span><span class="small" style="color:#E6E6E6">Dashboard, pagamentos e edição do app</span></span>' + I('right', 20, 2.2) + '</a>' : '') +
    '<div class="rowc"><span class="avatar">' + I('user', 30) + '</span><div class="stack none" style="min-width:0"><h1 class="h1" style="font-size:26px;line-height:32px">Olá, ' + esc((u.nome || 'você').split(' ')[0]) + '</h1><span class="small muted" style="overflow-wrap:anywhere">' + esc(u.email) + '</span><a class="linkbtn u" style="font-size:14px" href="#/editar">Editar meus dados</a></div></div>' + avisoDemo() +
    '<section class="stack"><h2 class="h2">Meus apoios e afilhados</h2>' + (apoios.length ? lista(apoios.map(function (a) {
      var st = a.status === 'ativo' && a.pago_ate < h ? 'vencido' : a.status;
      return linha(a.animal ? 'Padrinho de ' + nomeAnimal(a.animal) : 'Apoio mensal à APAC', '#/apoio/' + a.id, reais(a.valor) + '/mês', (STATUS[st] || [st])[0] + (a.status === 'ativo' ? ' · pago até ' + dataBR(a.pago_ate) : ''));
    })) : '<a class="card" href="#/apadrinhar" style="text-decoration:none;color:inherit;display:block"><span class="small">Você ainda não apadrinhou nenhum animal. <strong>Conheça quem precisa de padrinho.</strong></span></a>') + '</section>' +
    '<section class="stack"><div class="between"><h2 class="h2">Meus animais</h2><a class="linkbtn" style="font-size:14px" href="#/novo-pet">' + I('plus', 18, 2.4) + 'Adicionar</a></div>' +
    (pets.length ? lista(pets.map(function (p) {
      return '<div class="row"><span class="main"><span>' + esc(p.nome) + '</span><span class="sub">' + (p.proxima_vacina ? 'Próxima vacina: ' + dataBR(p.proxima_vacina) : 'Sem vacina agendada') + '</span></span><button type="button" class="linkbtn" style="font-size:14px" data-act="remover-pet" data-id="' + p.id + '" data-dupla="Remover?" aria-label="Remover ' + esc(p.nome) + '">Remover</button></div>';
    })) : '<p class="card empty" style="padding:14px">Cadastre seus animais para lembrar das vacinas.</p>') + '</section>' +
    '<section class="stack"><h2 class="h2">Minhas atividades</h2>' + lista([
      linha('Meus anúncios', '#/meus-anuncios', String(res[6].length)),
      linha('Pedidos de adoção', '#/atividades/pedidos', String(res[2].length)),
      linha('Denúncias', '#/atividades/denuncias', String(res[3].length)),
      linha('Inscrições em campanhas', '#/atividades/inscricoes', String(res[4].length)),
      linha('Pagamentos e doações', '#/atividades/pagamentos', String(res[5].length))
    ]) + '</section>' +
    '<section class="stack">' + lista((Instalar.instalado() ? [] : [linha('Instalar o app no celular', '#/instalar')]).concat([linha('Avisos da APAC', '#/notificacoes'), linha('Termos e privacidade', '#/termos'), '<a class="row" href="' + SITE + '/institucional/"><span class="main"><span>Sobre a APAC</span></span><span class="side">' + I('out', 18, 2.2) + '</span></a>'])) + '</section>' +
    '<button type="button" class="btn outline sm" data-act="sair">Sair da conta</button>' +
    '<a class="linkbtn u" style="align-self:center;font-size:14px;color:var(--alert)" href="#/excluir-conta">Excluir minha conta</a>' +
    '<p class="xs muted" style="text-align:center">APAC Cotia · Preservando Vidas · versão ' + VERSAO + '</p>', 'perfil');
};
function perfilVisitante() {
  function it(icone, t) { return '<li class="ok" style="font-size:15px;font-weight:600;gap:8px">' + I(icone, 18, icone === 'check' ? 2.6 : 2) + t + '</li>'; }
  return tela('<div class="center stack" style="text-align:center"><img src="img/logo.jpg" alt="APAC Associação Protetora dos Animais de Cotia, Preservando Vidas" style="width:180px;height:auto"></div>' +
    '<div class="stack none"><h1 class="h1">Você está como visitante</h1><p class="lead">Crie uma conta quando quiser. Ela não é necessária para navegar pelo app.</p></div>' + avisoDemo() +
    '<section class="card soft stack"><h2 class="h2">Sem conta, você pode</h2><ul class="stack">' + ['Ver os animais para adoção', 'Ler os guias e ver o atendimento veterinário', 'Fazer uma denúncia', 'Doar via Pix'].map(function (t) { return it('check', t); }).join('') + '</ul></section>' +
    '<section class="card stack"><h2 class="h2">Com conta, você também pode</h2><ul class="stack">' + ['Pedir uma adoção e acompanhar', 'Anunciar um animal para adoção', 'Apadrinhar um animal e receber notícias', 'Inscrever seu animal em campanhas', 'Ver seu histórico em um só lugar'].map(function (t) { return it('plus', t); }).join('') + '</ul></section>' +
    '<div class="stack"><a class="btn" href="#/cadastro">Criar conta</a><a class="btn outline sm" href="#/entrar">Já tenho conta</a></div>' +
    lista((Instalar.instalado() ? [] : [linha('Instalar o app no celular', '#/instalar')]).concat([linha('Termos e privacidade', '#/termos'), '<a class="row" href="' + SITE + '/institucional/"><span class="main"><span>Sobre a APAC</span></span><span class="side">' + I('out', 18, 2.2) + '</span></a>'])) +
    '<p class="xs muted" style="text-align:center">versão ' + VERSAO + '</p>', 'perfil');
}
T.apoio = async function (id) {
  var a = await D.um('apoios_mensais', id);
  if (!a) { return tela('<p class="empty">Apoio não encontrado.</p>', null, { topo: topbar('Apoio', '/perfil') }); }
  var animal = a.animal ? await D.um('animais', a.animal) : null, h = D.hoje();
  var posts = a.animal && a.status === 'ativo' ? await D.listar('atualizacoes', { eq: { animal: a.animal }, order: ['criada_em', false] }, true) : [];
  var emDia = a.status === 'ativo' && a.pago_ate >= h, pend = await D.listar('pagamentos', { eq: { ref: a.id, status: 'pendente' } }, true);
  var titulo = animal ? 'Padrinho de ' + animal.nome : 'Apoio mensal à APAC';
  return tela('<div class="card stack"><div class="between"><span class="h3">' + reais(a.valor) + ' por mês</span>' + selo(a.status === 'ativo' && !emDia ? 'vencido' : a.status) + '</div>' +
    (a.status === 'ativo' ? '<p class="small">' + (emDia ? 'Mensalidade paga até ' + dataBR(a.pago_ate) + '.' : 'A mensalidade venceu em ' + dataBR(a.pago_ate) + '.') + '</p>' : '') +
    (a.status === 'aguardando_pagamento' ? '<p class="small">Esperando a confirmação do primeiro pagamento pela equipe.</p>' : '') +
    (pend.length ? '<p class="note">Há um Pix de ' + reais(pend[0].valor) + ' aguardando confirmação da equipe.</p>' : '') +
    (a.status !== 'encerrado' && (!emDia || a.pago_ate <= D.somaDias(h, 5)) ? '<button type="button" class="btn gold sm" data-act="pagar-apoio" data-id="' + a.id + '">' + (pend.length ? 'Ver Pix gerado' : 'Pagar mensalidade de ' + reais(a.valor)) + '</button>' : '') + '</div>' +
    (animal ? '<section class="stack"><h2 class="h2">Notícias de ' + esc(animal.nome) + '</h2>' + (a.status !== 'ativo' ? '<p class="card empty" style="padding:14px">As notícias aparecem aqui quando o apadrinhamento estiver ativo.</p>' :
      posts.length ? '<div class="feed">' + posts.map(function (p) { return '<article class="post">' + img(p.foto, 'Foto de ' + animal.nome) + '<div class="txt"><span class="xs muted" style="font-weight:800">' + quando(p.criada_em) + '</span><p class="fala">' + esc(p.texto) + '</p></div></article>'; }).join('') + '</div>' : '<p class="card empty" style="padding:14px">A equipe ainda não publicou notícias. Elas aparecem aqui.</p>') + '</section>' : '') +
    (a.status !== 'encerrado' ? '<button type="button" class="linkbtn u" style="align-self:center;font-size:14px" data-act="encerrar-apoio" data-id="' + a.id + '" data-dupla="Toque de novo para encerrar">Encerrar este apoio</button>' : ''), null, { cls: 'tight', topo: topbar(titulo, '/perfil') });
};
T.atividades = async function (tipo) {
  var u = D.usuario(), t = { pedidos: 'Pedidos de adoção', denuncias: 'Denúncias', inscricoes: 'Inscrições em campanhas', pagamentos: 'Pagamentos e doações' }[tipo] || 'Atividades', itens = [];
  if (tipo === 'pedidos') {
    var ped = await D.listar('pedidos_adocao', { eq: { usuario: u.id }, order: ['criado_em', false] }, true);
    var an = ped.length ? await D.listar('animais', { in: { id: ped.map(function (p) { return p.animal; }) } }) : [];
    itens = ped.map(function (p) { var a = an.filter(function (x) { return x.id === p.animal; })[0]; return [a ? a.nome : 'Animal', 'Enviado em ' + quando(p.criado_em), p.status]; });
  }
  if (tipo === 'denuncias') { itens = (await D.listar('denuncias', { eq: { autor: u.id }, order: ['criada_em', false] }, true)).map(function (d) { return [d.tipo + ' · ' + d.protocolo, quando(d.criada_em) + ' · ' + d.local, d.status]; }); }
  if (tipo === 'inscricoes') {
    var ins = await D.listar('inscricoes', { eq: { usuario: u.id } }, true), cs = ins.length ? await D.listar('campanhas', { in: { id: ins.map(function (i) { return i.campanha; }) } }) : [];
    itens = ins.map(function (i) { var c = cs.filter(function (x) { return x.id === i.campanha; })[0]; return [c ? c.titulo : 'Campanha', c && c.data ? dataBR(c.data) : 'Data a definir', '']; });
  }
  if (tipo === 'pagamentos') { itens = (await D.listar('pagamentos', { eq: { usuario: u.id }, order: ['criado_em', false] }, true)).map(function (p) { return [TIPO_PAG[p.tipo] + ' · ' + reais(p.valor), quando(p.criado_em) + ' · código ' + p.codigo, p.status, p.status === 'pendente' ? '#/pagar/' + p.id : '']; }); }
  return tela(itens.length ? '<div class="list">' + itens.map(function (i) {
    var dentro = '<span class="main"><span>' + esc(i[0]) + '</span><span class="sub">' + esc(i[1]) + '</span></span>' + (i[2] ? '<span class="side">' + selo(i[2]) + '</span>' : '');
    return i[3] ? '<a class="row" href="' + i[3] + '">' + dentro + '</a>' : '<div class="row">' + dentro + '</div>';
  }).join('') + '</div>' : '<p class="empty">Nada por aqui ainda.</p>', null, { cls: 'tight', topo: topbar(t, '/perfil') });
};
T.editar = function () {
  var u = D.usuario();
  return '<div class="screen">' + topbar('Meus dados', '/perfil') + '<form class="scroll tight" data-form="editar" novalidate style="margin:0">' +
    campo('e-nome', 'Nome completo', '', u.nome, 'name="nome" type="text" autocomplete="name"') +
    campo('e-cel', 'Celular com WhatsApp (opcional)', '', u.celular, 'name="celular" type="tel" autocomplete="tel"') +
    '<div class="field"><label for="e-mail">E-mail</label><input class="input" id="e-mail" value="' + esc(u.email) + '" disabled style="background:var(--line-2)"></div>' +
    '<p class="error" id="erro" role="alert"></p><button class="btn" type="submit">Salvar</button></form></div>';
};
T['novo-pet'] = function () {
  return '<div class="screen">' + topbar('Adicionar animal', '/perfil') + '<form class="scroll tight" data-form="novo-pet" novalidate style="margin:0">' +
    campo('n-nome', 'Nome do animal', '', '', 'name="nome" type="text"') + campo('n-vac', 'Próxima vacina (opcional)', '', '', 'name="vacina" type="date"') +
    '<p class="error" id="erro" role="alert"></p><button class="btn" type="submit">Salvar</button></form></div>';
};
T.notificacoes = async function () {
  var l = await D.listar('avisos', { order: ['criado_em', false], limit: 30 }, true);
  try { if (l[0]) { localStorage.setItem('apac.avisos.visto', l[0].criado_em); } } catch (e) { /* sem armazenamento */ }
  return tela(l.length ? l.map(function (a) { return '<article class="card stack none"><span class="xs muted" style="font-weight:800">' + quando(a.criado_em) + '</span><h2 class="h3">' + esc(a.titulo) + '</h2>' + (a.texto ? '<p class="small" style="white-space:pre-line">' + esc(a.texto) + '</p>' : '') + '</article>'; }).join('') : '<p class="empty">Nenhum aviso por enquanto.</p>', null, { cls: 'tight', topo: topbar('Avisos da APAC', '/inicio') });
};
/* ---------- Instalar o app na tela inicial ---------- */
var Instalar = (function () {
  var ua = navigator.userAgent || '';
  var noApk = /APACCotiaApp/.test(ua) || /; wv\)/.test(ua);
  var ios = /iPhone|iPad|iPod/.test(ua) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  var aviso = null;
  window.addEventListener('beforeinstallprompt', function (e) {
    e.preventDefault(); aviso = e;
    if (document.getElementById('convite')) { abrirConvite(true); }
    var n = rotaAtual().nome; if (n === 'instalar' || n === 'inicio' || n === 'perfil') { desenhar(); }
  });
  window.addEventListener('appinstalled', function () { aviso = null; dispensar(); toast('App instalado! Procure o ícone da APAC na tela inicial do celular.'); });
  function dispensar() { try { localStorage.setItem('apac.instalar.dispensado', String(Date.now())); } catch (e) { /* sem armazenamento */ } }
  function dispensado() { try { var t = Number(localStorage.getItem('apac.instalar.dispensado') || 0); return Date.now() - t < 21 * 864e5; } catch (e) { return false; } }
  return {
    ios: ios,
    instalado: function () { return noApk || !!(window.matchMedia && matchMedia('(display-mode: standalone)').matches) || navigator.standalone === true; },
    podeUmToque: function () { return !!aviso; },
    dentroDeOutroApp: function () { return /FBAN|FBAV|FB_IAB|Instagram|WhatsApp|Line\/|TikTok|musical_ly|Twitter|Snapchat/i.test(ua); },
    iosForaDoSafari: function () { return ios && /CriOS|FxiOS|EdgiOS|OPiOS/.test(ua); },
    samsung: function () { return /SamsungBrowser/.test(ua); },
    mostrarBanner: function () { return !this.instalado(); },
    dispensar: dispensar,
    endereco: function () { return location.origin + location.pathname.replace(/index\.html$/, ''); },
    pedir: function () {
      if (!aviso) { return Promise.resolve(false); }
      var e = aviso; aviso = null;
      e.prompt();
      return e.userChoice.then(function (r) { return r && r.outcome === 'accepted'; });
    },
    registrar: function () {
      if (noApk || !('serviceWorker' in navigator) || !/^https:|^http:\/\/localhost/.test(location.href)) { return; }
      navigator.serviceWorker.register('sw.js').catch(function () { /* segue sem cache */ });
    }
  };
})();
/* Convite que abre sozinho: ao entrar no site e logo depois do login */
function podeConvidar(forcar, toque) {
  if (Instalar.instalado()) { return false; }
  if (toque) { return true; }
  if (navigator.webdriver) { return false; }
  if (forcar) { return true; }
  try { var t = Number(localStorage.getItem('apac.convite.visto') || 0); return Date.now() - t > 3 * 864e5; } catch (e) { return true; }
}
function fecharConvite() {
  var c = document.getElementById('convite');
  if (c) { c.classList.remove('show'); setTimeout(function () { if (c.parentNode) { c.parentNode.removeChild(c); } }, 250); }
  try { localStorage.setItem('apac.convite.visto', String(Date.now())); } catch (e) { /* sem armazenamento */ }
}
function abrirConvite(forcar, toque) {
  if (!podeConvidar(forcar, toque)) { return; }
  var ios = Instalar.ios, umToque = Instalar.podeUmToque(), outroApp = Instalar.dentroDeOutroApp(), corpo;
  if (outroApp) {
    corpo = '<p class="lead">Para instalar, abra este link no navegador: toque em <strong>⋮</strong> ou <strong>•••</strong> no canto da tela e escolha <strong>"Abrir no navegador"</strong>.</p>' +
      '<button type="button" class="btn sm outline" data-act="copiar" data-texto="' + esc(Instalar.endereco()) + '" data-ok="Endereço copiado. Cole no navegador.">Copiar o endereço do app</button>';
  } else if (umToque) {
    corpo = '<p class="lead">Instale com um toque e abra a APAC pelo ícone, como qualquer app.</p>' +
      '<button type="button" class="btn gold" data-act="instalar-agora" data-fecha="1">' + I('plus', 20, 2.4) + 'Instalar agora</button>';
  } else if (ios) {
    corpo = '<ol class="stack" style="gap:10px">' +
      '<li class="rowc" style="align-items:flex-start;gap:10px"><span class="num" style="width:28px;height:28px;font-size:15px">1</span><span style="font-size:15px;line-height:21px;padding-top:3px">Toque em <strong>Compartilhar</strong> <svg style="display:inline;vertical-align:-3px" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-label="ícone de compartilhar"><path d="M12 3v12"/><path d="M8 7l4-4 4 4"/><path d="M6 11H5v10h14V11h-1"/></svg> na barra do Safari (às vezes dentro do <strong>•••</strong>).</span></li>' +
      '<li class="rowc" style="align-items:flex-start;gap:10px"><span class="num" style="width:28px;height:28px;font-size:15px">2</span><span style="font-size:15px;line-height:21px;padding-top:3px">Escolha <strong>"Adicionar à Tela de Início"</strong>.</span></li>' +
      '<li class="rowc" style="align-items:flex-start;gap:10px"><span class="num" style="width:28px;height:28px;font-size:15px">3</span><span style="font-size:15px;line-height:21px;padding-top:3px">Toque em <strong>Adicionar</strong>. Pronto!</span></li></ol>' +
      '<a class="btn sm" href="#/instalar" data-act="fechar-convite">Ver o passo a passo com imagens</a>';
  } else {
    corpo = '<ol class="stack" style="gap:10px">' +
      '<li class="rowc" style="align-items:flex-start;gap:10px"><span class="num" style="width:28px;height:28px;font-size:15px">1</span><span style="font-size:15px;line-height:21px;padding-top:3px">Toque nos <strong>três pontinhos ⋮</strong> no canto de cima do Chrome.</span></li>' +
      '<li class="rowc" style="align-items:flex-start;gap:10px"><span class="num" style="width:28px;height:28px;font-size:15px">2</span><span style="font-size:15px;line-height:21px;padding-top:3px">Escolha <strong>"Adicionar à tela inicial"</strong> ou <strong>"Instalar app"</strong>.</span></li>' +
      '<li class="rowc" style="align-items:flex-start;gap:10px"><span class="num" style="width:28px;height:28px;font-size:15px">3</span><span style="font-size:15px;line-height:21px;padding-top:3px">Confirme em <strong>Instalar</strong>. Pronto!</span></li></ol>' +
      '<a class="btn sm" href="#/instalar" data-act="fechar-convite">Ver o passo a passo com imagens</a>';
  }
  var c = document.getElementById('convite');
  if (!c) { c = document.createElement('div'); c.id = 'convite'; document.body.appendChild(c); }
  c.innerHTML = '<div class="convite-fundo" data-act="fechar-convite"></div><section class="convite-folha" role="dialog" aria-modal="true" aria-labelledby="convite-titulo">' +
    '<div class="rowc" style="gap:14px"><img src="img/icone-192.png" alt="" style="width:60px;height:60px;border-radius:14px;flex:none;box-shadow:0 1px 4px rgba(0,0,0,.2)"><div class="stack none"><h2 class="h2" id="convite-titulo" style="font-size:22px;line-height:28px">Coloque a APAC na tela inicial</h2><span class="small muted">Grátis, sem loja de aplicativos, em menos de 1 minuto.</span></div></div>' +
    corpo + '<button type="button" class="btn outline sm" data-act="fechar-convite">Agora não</button></section>';
  requestAnimationFrame(function () { c.classList.add('show'); });
}

function bannerInstalar() {
  if (!Instalar.mostrarBanner()) { return ''; }
  return '<section class="card gold stack" style="gap:12px"><div class="rowc" style="align-items:flex-start;gap:12px"><img src="img/icone-192.png" alt="" style="width:52px;height:52px;border-radius:12px;flex:none;box-shadow:0 1px 3px rgba(0,0,0,.2)">' +
    '<div class="stack" style="flex:1;min-width:0;gap:4px"><span class="h3">Coloque o app na tela inicial</span><span class="small" style="color:var(--gold-ink)">É grátis, leva menos de 1 minuto e abre como um app normal.</span></div></div>' +
    '<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px"><button type="button" class="btn xs" data-act="instalar">' + I('plus', 16, 2.4) + 'Instalar</button>' +
    '<a class="btn xs outline" style="padding:0 8px;white-space:nowrap" href="#/instalar">Ver como instalar</a></div></section>';
}
function mock(conteudo) { return '<div class="mock" aria-hidden="true">' + conteudo + '</div>'; }
var MOCKS = {
  chromeMenu: mock('<div class="mock-bar"><span class="mock-url">' + 'apaccotia.ong.br/app' + '</span><span class="alvo"><svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="5" r="2"/><circle cx="12" cy="12" r="2"/><circle cx="12" cy="19" r="2"/></svg></span></div>'),
  chromeItem: mock('<ul class="mock-menu"><li>Nova guia</li><li>Histórico</li><li class="on"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="6" y="2.5" width="12" height="19" rx="2"/><path d="M12 9v6M9 12h6"/></svg>Adicionar à tela inicial</li><li>Compartilhar…</li></ul>'),
  instalar: mock('<div class="mock-dialog"><img src="img/icone-192.png" alt=""><span><strong>APAC Cotia</strong><br>apaccotia.ong.br</span><span class="mock-btns"><span>Cancelar</span><span class="alvo txt">Instalar</span></span></div>'),
  samsung: mock('<ul class="mock-menu"><li class="on"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 5v14M5 12h14"/></svg>Adicionar página a</li><li>Tela inicial</li></ul>'),
  iosBarra: mock('<div class="mock-bar baixo"><span>‹</span><span>›</span><span class="alvo"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v12"/><path d="M8 7l4-4 4 4"/><path d="M6 11H5v10h14V11h-1"/></svg></span><span>▢</span><span>•••</span></div>'),
  iosItem: mock('<ul class="mock-menu"><li>Copiar</li><li>Adicionar aos Favoritos</li><li class="on"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3.5" y="3.5" width="17" height="17" rx="4"/><path d="M12 8v8M8 12h8"/></svg>Adicionar à Tela de Início</li><li>Imprimir</li></ul>'),
  iosAdicionar: mock('<div class="mock-bar topo"><span>Cancelar</span><strong>Adicionar à Tela de Início</strong><span class="alvo txt">Adicionar</span></div>'),
  pronto: mock('<div class="mock-home"><span class="ap"></span><span class="ap"></span><span class="ap eu"><img src="img/icone-192.png" alt=""><small>APAC Cotia</small></span><span class="ap"></span></div>')
};
function passo(n, titulo, texto, ilustracao) {
  return '<li class="card step"><span class="num">' + n + '</span><div class="stack" style="flex:1;min-width:0"><h3 class="h3">' + titulo + '</h3>' + (texto ? '<p style="font-size:15px;line-height:21px">' + texto + '</p>' : '') + (ilustracao || '') + '</div></li>';
}
T.instalar = function () {
  if (Instalar.instalado()) {
    return concluido('O app já está instalado', 'Você está usando o app da APAC. Para abrir depois, procure o ícone da APAC na tela inicial do celular.', '<a class="btn" href="#/inicio">Ir para o início</a>');
  }
  var aba = S.instalarAba || (Instalar.ios ? 'iphone' : 'android'), end = Instalar.endereco(), endVis = end.replace(/^https?:\/\//, '').replace(/\/$/, '');
  var android = '<ol class="stack">' +
    passo(1, 'Abra o app no Chrome', 'Use o navegador <strong>Chrome</strong>, no endereço <strong>' + esc(endVis) + '</strong>.') +
    passo(2, 'Toque nos três pontinhos', 'Eles ficam no canto de cima, à direita da barra de endereço.', MOCKS.chromeMenu) +
    passo(3, 'Toque em "Adicionar à tela inicial"', 'Em alguns celulares a opção se chama <strong>"Instalar app"</strong>.', MOCKS.chromeItem) +
    passo(4, 'Confirme em "Instalar"', 'Se aparecer a pergunta, toque em <strong>Instalar</strong> ou <strong>Adicionar</strong>.', MOCKS.instalar) +
    passo(5, 'Pronto!', 'O ícone da APAC aparece na tela inicial. Abra por ele, como qualquer app.', MOCKS.pronto) + '</ol>' +
    '<div class="card soft stack"><h3 class="h3">Usa o navegador da Samsung?</h3><p class="small">Toque no menu <strong>☰</strong>, na barra de baixo. Depois toque em <strong>"Adicionar página a"</strong> e escolha <strong>"Tela inicial"</strong>.</p>' + MOCKS.samsung + '</div>';
  var iphone = '<ol class="stack">' +
    passo(1, 'Abra o app no Safari', 'Use o navegador <strong>Safari</strong>, no endereço <strong>' + esc(endVis) + '</strong>.' + (Instalar.iosForaDoSafari() ? ' Você está em outro navegador: copie o endereço e cole no Safari.' : '')) +
    passo(2, 'Toque no botão Compartilhar', 'É o quadrado com uma seta para cima, na barra de baixo. Se não aparecer, toque primeiro em <strong>•••</strong>.', MOCKS.iosBarra) +
    passo(3, 'Toque em "Adicionar à Tela de Início"', 'Se não estiver visível, role a lista para baixo.', MOCKS.iosItem) +
    passo(4, 'Toque em "Adicionar"', 'O botão fica no canto de cima, à direita.', MOCKS.iosAdicionar) +
    passo(5, 'Pronto!', 'O ícone da APAC aparece na tela de início. Na primeira vez que abrir por ele, entre na sua conta de novo.', MOCKS.pronto) + '</ol>';
  return tela('<div class="center stack" style="text-align:center;gap:10px"><img src="img/icone-192.png" alt="Ícone do app APAC Cotia" style="width:88px;height:88px;border-radius:22px;box-shadow:0 2px 8px rgba(0,0,0,.18)">' +
    '<h1 class="h1">Instale o app da APAC</h1><p class="lead">É grátis, não precisa da loja de aplicativos e leva menos de 1 minuto. Depois é só abrir pelo ícone, como qualquer app.</p></div>' +
    (Instalar.dentroDeOutroApp() ? '<div class="note alert stack"><strong>Você abriu o link dentro do Instagram, WhatsApp ou outro app.</strong><span>Para instalar, abra no navegador: toque em <strong>⋮</strong> ou <strong>•••</strong> no canto da tela e escolha <strong>"Abrir no navegador"</strong> (ou "Abrir no Chrome" / "Abrir no Safari").</span><button type="button" class="btn xs outline" data-act="copiar" data-texto="' + esc(end) + '" data-ok="Endereço copiado. Cole no navegador.">Copiar o endereço do app</button></div>' : '') +
    (Instalar.podeUmToque() ? '<button type="button" class="btn gold" data-act="instalar-agora">' + I('plus', 20, 2.4) + 'Instalar agora</button><p class="small muted" style="text-align:center">Ou siga o passo a passo abaixo.</p>' : '') +
    '<div class="grid2" role="group" aria-label="Escolha o seu celular" style="gap:8px">' + chip('Android', aba === 'android', 'data-set="instalarAba" data-val="android"', 'opt') + chip('iPhone', aba === 'iphone', 'data-set="instalarAba" data-val="iphone"', 'opt') + '</div>' +
    (aba === 'android' ? android : iphone) +
    '<button type="button" class="btn outline sm" data-act="compartilhar-app">' + I('people', 20) + 'Enviar o app para alguém</button>', null, {
    cls: 'tight', topo: topbar('Instalar o app', '/inicio')
  });
};

T['excluir-conta'] = function () {
  return tela('<h1 class="h1">Excluir minha conta</h1><p class="lead">Seus dados de cadastro, seus animais, anúncios, inscrições e apoios serão apagados. Registros de pagamentos e denúncias ficam guardados sem o seu nome, porque a APAC precisa deles para a prestação de contas.</p><p class="lead"><strong>Não dá para desfazer.</strong></p><p class="error" id="erro" role="alert"></p>', null, {
    cls: 'tight', topo: topbar('', '/perfil'),
    rodape: '<div class="footer"><button type="button" class="btn danger" data-act="excluir-conta" data-dupla="Toque de novo para excluir">Excluir minha conta</button><a class="btn outline sm" href="#/perfil">Cancelar</a></div>'
  });
};

/* ---------- Conta ---------- */
function senhaCampo(auto, id) {
  return '<div class="field"><label for="' + (id || 'senha') + '">Senha</label><div class="pass"><input class="input" id="' + (id || 'senha') + '" name="senha" type="password" autocomplete="' + auto + '"><button type="button" data-act="ver-senha" data-alvo="' + (id || 'senha') + '">Mostrar</button></div>';
}
T.cadastro = function (_, q) {
  var n = q.next ? '?next=' + encodeURIComponent(q.next) : '';
  return '<div class="screen">' + topbar('', '/perfil') + '<form class="scroll tight" data-form="cadastro" novalidate style="margin:0;gap:12px">' +
    '<div class="stack none"><h1 class="h1">Criar conta</h1><p style="font-size:15px;line-height:22px">' + (q.next ? 'Para continuar, crie uma conta. É rápido.' : 'Use para pedir adoções, anunciar, apadrinhar e acompanhar tudo em um só lugar.') + '</p></div>' + avisoDemo() +
    campo('nome', 'Nome completo', '', '', 'name="nome" type="text" autocomplete="name"') +
    campo('email', 'E-mail', '', '', 'name="email" type="email" autocomplete="email" inputmode="email"') +
    campo('celular', 'Celular com WhatsApp', '', '', 'name="celular" type="tel" autocomplete="tel" placeholder="(11) 90000-0000"') +
    senhaCampo('new-password') + '<span class="help">Mínimo de 8 caracteres</span></div>' +
    '<label class="check"><input type="checkbox" name="termos"><span>Li e aceito os <a href="#/termos" style="font-weight:800">Termos de Uso e a Política de Privacidade</a>.</span></label>' +
    '<p class="error" id="erro" role="alert"></p><button class="btn" type="submit">Criar conta</button>' +
    '<div class="center"><a class="linkbtn" href="#/entrar' + n + '">Já tenho conta</a><a class="linkbtn" href="#/inicio">Continuar sem cadastro</a></div></form></div>';
};
T.entrar = function (_, q) {
  var n = q.next ? '?next=' + encodeURIComponent(q.next) : '';
  return '<div class="screen">' + topbar('', '/perfil') + '<form class="scroll tight" data-form="entrar" novalidate style="margin:0">' +
    '<div class="stack none"><h1 class="h1">Entrar</h1><p style="font-size:15px;line-height:22px">Acesse seus pedidos, anúncios, apoios e inscrições.</p></div>' +
    campo('email', 'E-mail', '', '', 'name="email" type="email" autocomplete="email" inputmode="email"') +
    senhaCampo('current-password') + '<a class="linkbtn u" style="font-size:14px;align-self:flex-start" href="#/recuperar">Esqueci minha senha</a></div>' +
    '<p class="error" id="erro" role="alert"></p><button class="btn" type="submit">Entrar</button>' +
    (D.modo === 'demo' ? '<button type="button" class="btn outline sm" data-act="admin-demo">' + I('shield', 20) + 'Entrar como equipe APAC (demonstração)</button>' : '') +
    '<div class="center"><a class="linkbtn" href="#/cadastro' + n + '">Criar conta</a><a class="linkbtn" href="#/inicio">Continuar sem cadastro</a></div></form></div>';
};
T.recuperar = function () {
  var r = S.recuperar || {};
  return '<div class="screen">' + topbar('Recuperar senha', '/entrar') + '<form class="scroll tight" data-form="' + (r.enviado ? 'redefinir' : 'recuperar') + '" novalidate style="margin:0">' +
    (r.enviado ? '<p class="lead">Enviamos um e-mail para <strong>' + esc(r.email) + '</strong>. Se ele trouxer um código, digite abaixo. Se trouxer um botão, toque e segure nele, escolha <strong>Copiar link</strong> e cole aqui. Não toque no botão direto.</p>' + campo('codigo', 'Código ou link recebido por e-mail', '', '', 'name="codigo" type="text" autocomplete="one-time-code"') + senhaCampo('new-password') + '<span class="help">Mínimo de 8 caracteres</span></div>' :
      '<p class="lead">Informe o e-mail da sua conta. Vamos enviar um código para você criar uma nova senha.</p>' + campo('email', 'E-mail', '', r.email || '', 'name="email" type="email" autocomplete="email" inputmode="email"')) +
    '<p class="error" id="erro" role="alert"></p><button class="btn" type="submit">' + (r.enviado ? 'Salvar nova senha' : 'Enviar código') + '</button></form></div>';
};
T.confirmar = function () { return concluido('Confirme seu e-mail', 'Enviamos um link de confirmação para o seu e-mail. Depois de confirmar, volte aqui e entre na sua conta.', '<a class="btn" href="#/entrar">Entrar</a>'); };
T.termos = function () {
  return tela('<p class="note"><strong>Rascunho</strong> para revisão da APAC antes da publicação na loja.</p>' +
    '<section class="stack"><h2 class="h2">Quem somos</h2><p class="small">Este app é da Associação Protetora dos Animais de Cotia (APAC), CNPJ 17.393.867/0001-57.</p></section>' +
    '<section class="stack"><h2 class="h2">Quais dados coletamos</h2><p class="small">Nome, e-mail e celular de quem cria conta; as informações dos pedidos de adoção, anúncios, inscrições e animais cadastrados; as denúncias com local, descrição e fotos; e os registros de pagamentos e doações. O app também conta quantos aparelhos o abrem por dia, sem identificar as pessoas.</p></section>' +
    '<section class="stack"><h2 class="h2">Para que usamos</h2><p class="small">Para analisar adoções, verificar denúncias, organizar campanhas, publicar anúncios, enviar notícias aos padrinhos e prestar contas das doações. Não vendemos nem compartilhamos seus dados com terceiros para publicidade.</p></section>' +
    '<section class="stack"><h2 class="h2">Quem vê</h2><p class="small">Apenas a equipe da APAC. Nos anúncios de particulares, o WhatsApp informado fica visível para os interessados. Os dados ficam guardados em servidor seguro contratado pela APAC.</p></section>' +
    '<section class="stack"><h2 class="h2">Pagamentos</h2><p class="small">Os pagamentos são feitos por Pix diretamente para a conta da APAC. Quem recebe o Pix vê o nome de quem pagou.</p></section>' +
    '<section class="stack"><h2 class="h2">Seus direitos</h2><p class="small">Você pode corrigir seus dados em Perfil e excluir sua conta a qualquer momento em Perfil, Excluir minha conta. Dúvidas: fale com a APAC pelo WhatsApp.</p></section>', null, { cls: 'tight', topo: topbar('Termos e privacidade', '/perfil') });
};

/* ======================================================================
 * Painel da equipe
 * ====================================================================== */
async function painelAdmin() {
  var r = await D.rpc('painel_resumo');
  var t = r.arrecadado_por_tipo || {}, partes = Object.keys(t).sort(function (a, b) { return t[b] - t[a]; });
  var hojeAc = (r.acessos[r.acessos.length - 1] || {}).total || 0, semana = r.acessos.slice(-7).reduce(function (s, x) { return s + Number(x.total); }, 0);
  function kpi(v, l, href, cls, d) { return '<a class="kpi ' + (cls || '') + '" href="' + href + '"><span class="v">' + v + '</span><span class="l">' + l + '</span>' + (d ? '<span class="d">' + d + '</span>' : '') + '</a>'; }
  var gerenciar = [['pagamentos', 'Pagamentos', 'coin'], ['denuncias', 'Denúncias', 'alert'], ['pedidos', 'Pedidos de adoção', 'doc'], ['animais', 'Animais e anúncios', 'paw'],
    ['lista/campanhas', 'Campanhas e feiras', 'cal'], ['lista/metas', 'Metas de arrecadação', 'chart'], ['atualizacoes', 'Notícias para padrinhos', 'img'], ['apoios', 'Padrinhos e apoios', 'heart'],
    ['lista/itens_doacao', 'Itens para doação', 'box'], ['lista/locais_atendimento', 'Atendimento veterinário', 'pin'], ['lista/avisos', 'Avisos', 'bell'], ['clientes', 'Clientes', 'people'], ['config', 'Configurações', 'gear']];
  return '<div class="screen"><main class="scroll">' +
    '<div class="rowc"><img src="img/gato.jpg" alt="" style="width:48px;height:48px;border-radius:24px;object-fit:cover;flex:none"><div class="stack none"><h1 class="h1" style="font-size:26px;line-height:32px">Painel da equipe</h1><span class="small muted">Atualizado em ' + dataBR(r.hoje) + '</span></div></div>' + avisoDemo() + bannerInstalar() +
    (r.pendentes_qtd ? '<a class="promo gold" href="#/admin/pagamentos">' + I('coin', 28) + '<span class="grow"><span class="h3">' + plural(r.pendentes_qtd, 'Pix para conferir', 'Pix para conferir') + '</span><span class="small">' + reais(r.pendentes_valor) + ' aguardando confirmação</span></span>' + I('right', 20, 2.2) + '</a>' : '') +
    '<section class="card stack"><div class="between"><h2 class="h2">Acessos ao app</h2><span class="small muted">aparelhos por dia</span></div>' +
    '<div class="between"><div class="stack none"><span class="h1" style="font-size:32px;line-height:38px">' + hojeAc + '</span><span class="xs muted" style="font-weight:700">hoje</span></div><div class="stack none" style="text-align:right"><span class="h2">' + semana + '</span><span class="xs muted" style="font-weight:700">últimos 7 dias</span></div></div>' +
    grafico(r.acessos) + '</section>' +
    '<section class="stack"><h2 class="h2">Arrecadação de ' + ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'][Number(r.hoje.slice(5, 7)) - 1] + '</h2>' +
    '<div class="card stack"><span class="h1" style="font-size:32px;line-height:38px">' + reais(r.arrecadado_mes) + '</span><span class="xs muted" style="font-weight:700">Pix confirmados no mês</span>' +
    (partes.length ? '<div class="stack" style="gap:6px;margin-top:4px">' + partes.map(function (k) { return '<div class="between small"><span>' + esc(TIPO_PAG[k] || k) + '</span><strong>' + reais(t[k]) + '</strong></div>'; }).join('') + '</div>' : '<span class="small muted">Nenhum pagamento confirmado este mês.</span>') + '</div></section>' +
    '<div class="kpis">' +
    kpi(r.clientes_total, 'Clientes cadastrados', '#/admin/clientes', '', '+' + r.clientes_7d + ' nos últimos 7 dias') +
    kpi(r.apoios_ativos, 'Padrinhos e apoios ativos', '#/admin/apoios', '', reais(r.apoios_mensal_valor) + ' por mês') +
    kpi(r.denuncias_abertas, 'Denúncias abertas', '#/admin/denuncias', r.denuncias_abertas ? 'alert' : '', r.denuncias_sem_pagamento ? r.denuncias_sem_pagamento + ' sem pagamento' : '') +
    kpi(r.pedidos_novos, 'Pedidos de adoção para analisar', '#/admin/pedidos', r.pedidos_novos ? 'gold' : '') +
    kpi(r.anuncios_ativos, 'Anúncios de particulares no ar', '#/admin/animais?origem=particular', '', r.anuncios_aguardando ? r.anuncios_aguardando + ' aguardando pagamento' : '') +
    kpi(r.animais_apac, 'Animais da APAC para adoção', '#/admin/animais', '') +
    kpi(r.inscricoes, 'Inscrições em campanhas ativas', '#/admin/lista/campanhas', '') +
    kpi(r.pendentes_qtd, 'Pix para conferir', '#/admin/pagamentos', r.pendentes_qtd ? 'gold' : '', reais(r.pendentes_valor)) +
    '</div>' +
    '<section class="stack"><h2 class="h2">Gerenciar o app</h2><div class="admin-grid">' + gerenciar.map(function (g) { return '<a href="#/admin/' + g[0] + '">' + I(g[2], 22) + g[1] + '</a>'; }).join('') + '</div></section>' +
    '<button type="button" class="btn outline sm" data-act="como-cliente">' + I('user', 20) + 'Ver o app como cliente</button></main>' + tabbar('inicio') + '</div>';
}
function grafico(dados) {
  var W = 336, H = 130, top = 18, base = H - 22, n = dados.length, gap = 4, bw = (W - gap * (n - 1)) / n;
  var max = Math.max.apply(null, dados.map(function (d) { return Number(d.total); }).concat([1]));
  var passo = max <= 5 ? 1 : Math.pow(10, Math.floor(Math.log10(max))) * (max / Math.pow(10, Math.floor(Math.log10(max))) > 5 ? 2 : 1);
  var teto = Math.ceil(max / passo) * passo, s = '';
  s += '<line x1="0" x2="' + W + '" y1="' + base + '" y2="' + base + '" stroke="#BDBDB8" stroke-width="1"/>';
  s += '<line x1="0" x2="' + W + '" y1="' + top + '" y2="' + top + '" stroke="#E4E4E0" stroke-width="1" stroke-dasharray="3 3"/><text x="0" y="' + (top - 5) + '" font-size="11" fill="#555">' + teto + '</text>';
  dados.forEach(function (d, i) {
    var v = Number(d.total), h = v ? Math.max(3, (base - top) * v / teto) : 0, x = i * (bw + gap), y = base - h, r = Math.min(4, bw / 2, h);
    var ultimo = i === n - 1;
    if (h) { s += '<path d="M' + x + ',' + base + 'V' + (y + r) + 'Q' + x + ',' + y + ' ' + (x + r) + ',' + y + 'H' + (x + bw - r) + 'Q' + (x + bw) + ',' + y + ' ' + (x + bw) + ',' + (y + r) + 'V' + base + 'Z" fill="' + (ultimo ? '#F7C600' : '#141414') + '"' + (ultimo ? ' stroke="#141414" stroke-width="1"' : '') + '/>'; }
    if (i % 3 === (n - 1) % 3) { s += '<text x="' + (x + bw / 2) + '" y="' + (H - 6) + '" font-size="11" fill="#555" text-anchor="middle">' + (ultimo ? 'hoje' : diaMes(d.dia)) + '</text>'; }
    s += '<rect x="' + (x - gap / 2) + '" y="0" width="' + (bw + gap) + '" height="' + base + '" fill="transparent" data-tip="' + diaMes(d.dia) + ': ' + plural(v, 'aparelho', 'aparelhos') + '" data-x="' + ((x + bw / 2) / W * 100).toFixed(1) + '"/>';
  });
  return '<div class="chart" data-chart="1"><span class="tip"></span><svg viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-label="Aparelhos que abriram o app por dia nos últimos 14 dias">' + s + '</svg>' +
    '<table class="visually-hidden"><caption>Acessos por dia</caption><tbody>' + dados.map(function (d) { return '<tr><th>' + dataBR(d.dia) + '</th><td>' + d.total + '</td></tr>'; }).join('') + '</tbody></table></div>';
}

/* Mapa de clientes (para mostrar nomes nas listas da equipe) */
async function mapaPerfis(ids) {
  ids = ids.filter(Boolean).filter(function (v, i, a) { return a.indexOf(v) === i; });
  var r = ids.length ? await D.listar('perfis', { in: { id: ids } }) : [], m = {};
  r.forEach(function (p) { m[p.id] = p; });
  return m;
}
T.admin = async function (sec, q) {
  var a = S.admin;
  if (sec === 'pagamentos') {
    var st = a.pagStatus, pags = await D.listar('pagamentos', { eq: { status: st }, order: ['criado_em', false], limit: 300 }, true);
    var perf = await mapaPerfis(pags.map(function (p) { return p.usuario; }));
    var refs = pags.map(function (p) { return p.ref; }).filter(Boolean), extras = {};
    if (refs.length) {
      var rr = await Promise.all([D.listar('animais', { in: { id: refs } }), D.listar('denuncias', { in: { id: refs } }), D.listar('metas', { in: { id: refs } }), D.listar('apoios_mensais', { in: { id: refs } })]);
      rr[0].forEach(function (x) { extras[x.id] = 'Animal: ' + x.nome; }); rr[1].forEach(function (x) { extras[x.id] = 'Protocolo ' + x.protocolo; }); rr[2].forEach(function (x) { extras[x.id] = 'Meta: ' + x.titulo; });
      var anAp = rr[3].map(function (x) { return x.animal; }).filter(Boolean), nm = {};
      if (anAp.length) { (await D.listar('animais', { in: { id: anAp } })).forEach(function (x) { nm[x.id] = x.nome; }); }
      rr[3].forEach(function (x) { extras[x.id] = x.animal ? 'Afilhado: ' + (nm[x.animal] || 'animal') : 'Apoio geral à APAC'; });
    }
    var total = pags.reduce(function (s, p) { return s + Number(p.valor); }, 0);
    return tela('<div class="seg">' + setBtn('admin.pagStatus', 'pendente', 'Conferir', st) + setBtn('admin.pagStatus', 'confirmado', 'Confirmados', st) + setBtn('admin.pagStatus', 'recusado', 'Recusados', st) + '</div>' +
      (st === 'pendente' ? '<p class="note flat small">Confira no extrato do banco se o Pix chegou, com o valor e, se possível, o código. Depois toque em Confirmar: o app publica o anúncio, abre a denúncia, ativa o apoio ou soma na meta automaticamente.</p>' : '') +
      '<p class="small muted">' + plural(pags.length, 'pagamento', 'pagamentos') + ' · ' + reais(total) + '</p>' +
      (pags.length ? pags.map(function (p) {
        var c = perf[p.usuario];
        return '<article class="card stack"><div class="between"><span class="h3">' + reais(p.valor) + '</span>' + selo(p.status) + '</div>' +
          '<div class="stack none small"><span><strong>' + esc(TIPO_PAG[p.tipo]) + '</strong>' + (extras[p.ref] ? ' · ' + esc(extras[p.ref]) : '') + '</span><span>Código <strong>' + esc(p.codigo) + '</strong> · ' + quando(p.criado_em) + '</span><span class="muted">' + (c ? esc(c.nome + ' · ' + (c.celular || c.email)) : 'Sem conta (visitante)') + '</span></div>' +
          (p.status === 'pendente' ? '<div class="grid2" style="gap:8px"><button type="button" class="btn xs" data-act="confirmar-pag" data-id="' + p.id + '" data-dupla="Toque de novo para confirmar">' + I('check', 18, 2.4) + 'Confirmar</button><button type="button" class="btn xs outline" data-act="recusar-pag" data-id="' + p.id + '" data-dupla="Toque de novo para recusar">Não chegou</button></div>' : '') + '</article>';
      }).join('') : vazio(st === 'pendente' ? 'Nenhum Pix para conferir.' : 'Nada por aqui.')), null, { cls: 'tight', topo: topbar('Pagamentos', '/inicio') });
  }
  if (sec === 'denuncias') {
    var ds = a.denStatus, filtro = ds === 'abertas' ? { in: { status: ['aberta', 'em_apuracao'] } } : { eq: { status: ds } };
    filtro.order = ['criada_em', false]; filtro.limit = 300;
    var dens = await D.listar('denuncias', filtro, true);
    return tela('<div class="seg">' + setBtn('admin.denStatus', 'abertas', 'Abertas', ds) + setBtn('admin.denStatus', 'aguardando_pagamento', 'Sem pagamento', ds) + setBtn('admin.denStatus', 'encerrada', 'Encerradas', ds) + '</div>' +
      (ds === 'aguardando_pagamento' ? '<p class="note flat small">Denúncias registradas cujo Pix ainda não foi confirmado. Avalie se há urgência mesmo assim.</p>' : '') +
      (dens.length ? lista(dens.map(function (d) { return linha(d.tipo + ' · ' + d.protocolo, '#/admin/denuncia/' + d.id, '', quando(d.criada_em) + ' · ' + d.local); })) : vazio('Nenhuma denúncia aqui.')), null, { cls: 'tight', topo: topbar('Denúncias', '/inicio') });
  }
  if (sec === 'denuncia') {
    var d = await D.um('denuncias', q._id);
    if (!d) { return tela('<p class="empty">Denúncia não encontrada.</p>', null, { topo: topbar('Denúncia', '/admin/denuncias') }); }
    var autor = d.autor ? (await mapaPerfis([d.autor]))[d.autor] : null, coords = /(-?\d+\.\d+),\s*(-?\d+\.\d+)/.exec(d.local);
    return tela('<div class="between"><span class="h2">' + esc(d.tipo) + '</span>' + selo(d.status) + '</div><p class="small">Protocolo <strong>' + esc(d.protocolo) + '</strong> · ' + quando(d.criada_em) + '</p>' +
      '<div class="card stack"><p class="small"><strong>Local:</strong> ' + esc(d.local) + '</p>' + (coords ? '<a class="btn xs outline" href="https://www.google.com/maps/search/?api=1&query=' + coords[1] + ',' + coords[2] + '">' + I('pin', 18) + 'Abrir no mapa</a>' : '') +
      '<p class="small" style="white-space:pre-line"><strong>Descrição:</strong> ' + esc(d.descricao) + '</p>' + (autor ? '<p class="small"><strong>Conta:</strong> ' + esc(autor.nome + ' · ' + (autor.celular || autor.email)) + '</p>' : '') + '</div>' +
      (d.fotos.length ? '<div class="feed">' + d.fotos.map(function (f) { return '<div class="post">' + img(f, 'Foto da denúncia') + '</div>'; }).join('') + '</div>' : '') +
      '<fieldset><legend>Situação</legend><div class="chips">' + [['aberta', 'Aberta'], ['em_apuracao', 'Em apuração'], ['encerrada', 'Encerrada']].map(function (o) { return chip(o[1], d.status === o[0], 'data-act="status" data-tab="denuncias" data-id="' + d.id + '" data-val="' + o[0] + '"'); }).join('') + '</div></fieldset>', null, { cls: 'tight', topo: topbar('Denúncia', '/admin/denuncias') });
  }
  if (sec === 'pedidos') {
    var ps = await D.listar('pedidos_adocao', { order: ['criado_em', false], limit: 300 }, true);
    var pf = await mapaPerfis(ps.map(function (p) { return p.usuario; })), ans = ps.length ? await D.listar('animais', { in: { id: ps.map(function (p) { return p.animal; }) } }) : [];
    return tela(ps.length ? lista(ps.map(function (p) { var an = ans.filter(function (x) { return x.id === p.animal; })[0], c = pf[p.usuario]; return '<a class="row" href="#/admin/pedido/' + p.id + '"><span class="main"><span>' + esc((an ? an.nome : 'Animal') + ' · ' + (c ? c.nome : '')) + '</span><span class="sub">' + quando(p.criado_em) + '</span></span><span class="side">' + selo(p.status) + '</span></a>'; })) : vazio('Nenhum pedido de adoção ainda.'), null, { cls: 'tight', topo: topbar('Pedidos de adoção', '/inicio') });
  }
  if (sec === 'pedido') {
    var p = await D.um('pedidos_adocao', q._id);
    if (!p) { return tela('<p class="empty">Pedido não encontrado.</p>', null, { topo: topbar('Pedido', '/admin/pedidos') }); }
    var an2 = await D.um('animais', p.animal), cl = (await mapaPerfis([p.usuario]))[p.usuario] || {}, dd = p.dados || {};
    var cel = dd.celular || cl.celular;
    return tela('<div class="between"><span class="h2">' + esc(an2 ? an2.nome : 'Animal') + '</span>' + selo(p.status) + '</div>' +
      '<div class="card stack small"><p><strong>Interessado:</strong> ' + esc(dd.nome || cl.nome) + '</p><p><strong>Celular:</strong> ' + esc(cel) + '</p><p><strong>E-mail:</strong> ' + esc(cl.email) + '</p><p><strong>Cidade:</strong> ' + esc(dd.cidade) + '</p><p><strong>Moradia:</strong> ' + esc(dd.moradia) + ', telas: ' + esc(dd.telas) + '</p><p><strong>Moradores:</strong> ' + esc(dd.moradores) + '</p><p><strong>Outros animais:</strong> ' + esc(dd.outros || 'Não informou') + '</p><p><strong>Rotina:</strong> ' + esc(dd.rotina) + '</p><p class="muted">Enviado em ' + quando(p.criado_em) + '</p></div>' +
      (cel ? '<a class="btn sm" href="' + whats(cel, 'Olá, ' + (dd.nome || '').split(' ')[0] + '! Aqui é da APAC Cotia, sobre o seu pedido para adotar ' + (an2 ? an2.nome : '') + '.') + '">' + I('chat', 20) + 'Falar no WhatsApp</a>' : '') +
      '<fieldset><legend>Situação</legend><div class="chips">' + [['novo', 'Novo'], ['em_analise', 'Em análise'], ['aprovado', 'Aprovado'], ['recusado', 'Recusado']].map(function (o) { return chip(o[1], p.status === o[0], 'data-act="status" data-tab="pedidos_adocao" data-id="' + p.id + '" data-val="' + o[0] + '"'); }).join('') + '</div></fieldset>' +
      (p.status === 'aprovado' && an2 && an2.status === 'publicado' ? '<button type="button" class="btn outline sm" data-act="status" data-tab="animais" data-id="' + an2.id + '" data-val="adotado">Marcar ' + esc(an2.nome) + ' como adotado</button>' : ''), null, { cls: 'tight', topo: topbar('Pedido de adoção', '/admin/pedidos') });
  }
  if (sec === 'animais') {
    if (q.origem && !a.fixoOrigem) { a.animais = q.origem; a.fixoOrigem = 1; }
    var or = a.animais, ls = await D.listar('animais', { eq: { origem: or }, order: ['criado_em', false], limit: 500 }, true), h = D.hoje();
    return tela('<div class="seg">' + setBtn('admin.animais', 'apac', 'Animais da APAC', or) + setBtn('admin.animais', 'particular', 'Anúncios de particulares', or) + '</div>' +
      (or === 'apac' ? '<a class="btn sm" href="#/admin/editar/animais/novo">' + I('plus', 20, 2.4) + 'Cadastrar animal da APAC</a>' : '') +
      (ls.length ? lista(ls.map(function (x) {
        var st = x.status === 'publicado' && x.origem === 'particular' && x.publicado_ate < h ? 'vencido' : x.status;
        return '<a class="row" href="#/admin/editar/animais/' + x.id + '"><span class="main"><span>' + esc(x.nome) + (x.aceita_padrinho ? ' <span class="tag gold">Padrinho</span>' : '') + '</span><span class="sub">' + esc(infoAnimal(x)) + (x.origem === 'particular' && x.publicado_ate ? ' · até ' + dataBR(x.publicado_ate) : '') + '</span></span><span class="side">' + selo(st) + '</span></a>';
      })) : vazio('Nada cadastrado ainda.')), null, { cls: 'tight', topo: topbar('Animais e anúncios', '/inicio') });
  }
  if (sec === 'lista') {
    var def = ENT[q._id];
    if (!def) { return T.inicio(); }
    var regs = await D.listar(def.tabela, { order: def.ordem, limit: 500 }, true);
    return tela('<a class="btn sm" href="#/admin/editar/' + q._id + '/novo">' + I('plus', 20, 2.4) + 'Adicionar</a>' +
      (regs.length ? lista(regs.map(function (x) { var l = def.linha(x); return linha(l[0], '#/admin/editar/' + q._id + '/' + x.id, '', l[1]); })) : vazio('Nada cadastrado ainda.')), null, { cls: 'tight', topo: topbar(def.plural, '/inicio') });
  }
  if (sec === 'editar') {
    var ent = q._id, id = q._id2, d2 = ENT[ent];
    if (!S.form || S.form.ent !== ent || S.form.id !== id) {
      var reg = id === 'novo' ? null : await D.um(d2.tabela, id);
      iniciarForm(ent, id, reg);
    }
    var volta = ent === 'animais' ? '/admin/animais' : '/admin/lista/' + ent;
    return tela(renderCampos(ent) + '<p class="error" id="erro" role="alert"></p>' +
      (id !== 'novo' ? '<button type="button" class="linkbtn u" style="align-self:center;color:var(--alert);font-size:14px" data-act="apagar-reg" data-ent="' + ent + '" data-id="' + id + '" data-dupla="Toque de novo para apagar">Apagar</button>' : ''), null, {
      cls: 'tight', topo: topbar((id === 'novo' ? 'Novo: ' : 'Editar: ') + d2.titulo.toLowerCase(), volta),
      rodape: '<div class="footer"><button type="button" class="btn" data-act="salvar-reg" data-ent="' + ent + '">Salvar</button></div>'
    });
  }
  if (sec === 'atualizacoes') {
    var animaisPad = await D.listar('animais', { eq: { origem: 'apac' }, order: ['nome', true] }, true);
    animaisPad = animaisPad.filter(function (x) { return x.aceita_padrinho; });
    var apoios = await D.listar('apoios_mensais', { eq: { status: 'ativo' } }, true);
    var sel = a.atualizacao || (animaisPad[0] && animaisPad[0].id), alvo = animaisPad.filter(function (x) { return x.id === sel; })[0];
    if (!S.post || S.post.animal !== sel) { S.post = { animal: sel, texto: '', foto: null }; }
    var posts = sel ? await D.listar('atualizacoes', { eq: { animal: sel }, order: ['criada_em', false] }, true) : [];
    var padr = apoios.filter(function (x) { return x.animal === sel; }).length;
    var modelos = ['Seu apoio ajudou na minha alimentação este mês. Obrigado!', 'Fui ao veterinário e estou com a saúde em dia.', 'Tomei minhas vacinas. Obrigado por cuidar de mim!', 'Ganhei uma caminha nova graças a você.', 'Hoje brinquei muito e estou cada dia mais feliz.'];
    return tela(!animaisPad.length ? vazio('Nenhum animal aceita padrinhos. Marque "Aceita padrinhos" no cadastro dos animais da APAC.') :
      '<fieldset><legend>Animal</legend><div class="chips">' + animaisPad.map(function (x) { return setBtn('admin.atualizacao', x.id, x.nome, sel); }).join('') + '</div></fieldset>' +
      '<p class="small muted">' + esc(alvo.nome) + ' tem ' + plural(padr, 'padrinho ativo', 'padrinhos ativos') + '. A notícia aparece no Perfil de cada um.</p>' +
      '<div class="stack"><span class="flabel">Mensagens prontas</span><div class="chips">' + modelos.map(function (m) { return '<button type="button" class="chip ghost" style="text-align:left;height:auto;padding:8px 14px" data-act="modelo" data-val="' + esc(m) + '">' + esc(m) + '</button>'; }).join('') + '</div></div>' +
      area('post-texto', 'Mensagem na voz do animal', 'post.texto', S.post.texto, 'Ex.: Seu apoio ajudou na minha alimentação este mês!') +
      '<div class="field"><span class="flabel">Foto</span><div class="thumbs">' + (S.post.foto ? '<span class="thumb">' + img(S.post.foto, 'Foto', true) + '<button type="button" data-act="tirar-foto-post" aria-label="Remover foto">' + I('x', 16, 2.4) + '</button></span>' : '<label class="upload thumb" style="min-height:76px" aria-label="Adicionar foto">' + (S.post.enviando ? '<span class="spin" style="width:24px;height:24px;border-width:3px"></span>' : I('camera', 26)) + '<input class="visually-hidden" type="file" accept="image/*" data-act-change="post-foto"></label>') + '</div></div>' +
      '<p class="error" id="erro" role="alert"></p><button type="button" class="btn" data-act="publicar-post">Publicar para os padrinhos</button>' +
      '<section class="stack"><h2 class="h2">Já publicadas</h2>' + (posts.length ? '<div class="feed">' + posts.map(function (p) { return '<article class="post">' + img(p.foto, '') + '<div class="txt"><span class="xs muted" style="font-weight:800">' + quando(p.criada_em) + '</span><p class="fala">' + esc(p.texto) + '</p><button type="button" class="linkbtn" style="font-size:14px;align-self:flex-start" data-act="apagar-post" data-id="' + p.id + '" data-dupla="Toque de novo para apagar">Apagar</button></div></article>'; }).join('') + '</div>' : vazio('Nenhuma notícia publicada para ' + alvo.nome + '.')) + '</section>', null, { cls: 'tight', topo: topbar('Notícias para padrinhos', '/inicio') });
  }
  if (sec === 'apoios') {
    var ap = await D.listar('apoios_mensais', { order: ['criado_em', false], limit: 500 }, true), pp = await mapaPerfis(ap.map(function (x) { return x.usuario; }));
    var idsA = ap.map(function (x) { return x.animal; }).filter(Boolean), nomes = {};
    if (idsA.length) { (await D.listar('animais', { in: { id: idsA } })).forEach(function (x) { nomes[x.id] = x.nome; }); }
    var hh = D.hoje();
    return tela(ap.length ? lista(ap.map(function (x) {
      var c = pp[x.usuario] || {}, st = x.status === 'ativo' && x.pago_ate < hh ? 'vencido' : x.status;
      return '<div class="row"><span class="main"><span>' + esc(c.nome || 'Cliente') + ' · ' + reais(x.valor) + '/mês</span><span class="sub">' + esc(x.animal ? 'Padrinho de ' + (nomes[x.animal] || 'animal') : 'Apoio geral à APAC') + (x.pago_ate ? ' · pago até ' + dataBR(x.pago_ate) : '') + '</span></span><span class="side">' + selo(st) + '</span></div>';
    })) : vazio('Nenhum padrinho ou apoio mensal ainda.'), null, { cls: 'tight', topo: topbar('Padrinhos e apoios', '/inicio') });
  }
  if (sec === 'clientes') {
    var cs = await D.listar('perfis', { order: ['criado_em', false], limit: 1000 }, true), b = a.busca.trim().toLowerCase();
    var vis = cs.filter(function (c) { return !b || (c.nome + ' ' + c.email + ' ' + c.celular).toLowerCase().indexOf(b) >= 0; });
    return tela('<div class="field"><label for="busca-cli" class="xs" style="font-weight:700;color:var(--muted)">Buscar por nome, e-mail ou celular</label><input class="input" id="busca-cli" type="search" value="' + esc(a.busca) + '" data-bind="admin.busca" data-redesenha="1"></div>' +
      '<p class="small muted">' + plural(vis.length, 'cliente', 'clientes') + '</p>' +
      (vis.length ? lista(vis.map(function (c) {
        return '<div class="row"><span class="main"><span>' + esc(c.nome || 'Sem nome') + (c.papel === 'admin' ? ' <span class="tag dark">Equipe</span>' : '') + '</span><span class="sub">' + esc(c.email) + (c.celular ? ' · ' + esc(c.celular) : '') + ' · desde ' + quando(c.criado_em) + '</span></span>' +
          (c.celular ? '<a class="iconbtn" href="' + whats(c.celular) + '" aria-label="WhatsApp de ' + esc(c.nome) + '">' + I('chat', 20) + '</a>' : '') + '</div>';
      })) : vazio('Nenhum cliente encontrado.')), null, { cls: 'tight', topo: topbar('Clientes', '/inicio') });
  }
  if (sec === 'config') {
    var c = await D.carregarConfig(true);
    var campos = [['pix_chave', 'Chave Pix', 'CNPJ, e-mail, telefone ou chave aleatória da conta da APAC'], ['pix_nome', 'Nome do recebedor no Pix', 'Até 25 letras, sem acentos'], ['pix_cidade', 'Cidade do recebedor', ''], ['whatsapp', 'WhatsApp da APAC', 'Com DDD'],
      ['valor_denuncia', 'Taxa da denúncia (R$)', ''], ['valor_anuncio', 'Taxa do anúncio (R$)', ''], ['meses_anuncio', 'Meses de anúncio por pagamento', ''], ['entrega_endereco', 'Endereço para entrega de doações', ''], ['entrega_horario', 'Horário para entrega de doações', '']];
    return '<div class="screen">' + topbar('Configurações', '/inicio') + '<form class="scroll tight" data-form="config" novalidate style="margin:0">' +
      campos.map(function (x) { return campo('cfg-' + x[0], x[1], '', c[x[0]] || '', 'name="' + x[0] + '" type="text"', x[2]); }).join('') +
      '<p class="note flat small">Para dar acesso de equipe a outra pessoa, ela precisa criar a conta no app. Depois, siga o passo "Tornar alguém administrador" do guia de ativação.</p>' +
      '<p class="error" id="erro" role="alert"></p><button class="btn" type="submit">Salvar configurações</button></form></div>';
  }
  return painelAdmin();
};

/* ======================================================================
 * Navegação
 * ====================================================================== */
var PRECISA_CONTA = { pedido: 1, editar: 1, 'novo-pet': 1, atividades: 1, anunciar: 1, 'meus-anuncios': 1, apoio: 1, 'excluir-conta': 1 };
var indice = 0, trocando = false, ultimaRota = '', desenho = 0;
if (history.state && typeof history.state.i === 'number') { indice = history.state.i; } else { history.replaceState({ i: 0 }, ''); }

function rotaAtual() {
  var h = location.hash.replace(/^#/, '') || '/inicio';
  var partes = h.split('?'), q = {};
  (partes[1] || '').split('&').forEach(function (kv) { var p = kv.split('='); if (p[0]) { q[p[0]] = decodeURIComponent(p[1] || ''); } });
  var seg = partes[0].replace(/^\//, '').split('/');
  return { caminho: partes[0], completo: h, nome: seg[0], arg: seg[1], arg2: seg[2], arg3: seg[3], q: q };
}
function trocar(caminho) { if (location.hash === '#' + caminho) { desenhar(); return; } trocando = true; location.replace('#' + caminho); }
function ir(caminho) { location.hash = '#' + caminho; }
async function desenhar() {
  var r = rotaAtual(), app = document.getElementById('app'), meu = ++desenho;
  if (PRECISA_CONTA[r.nome] && !D.usuario()) { trocar('/cadastro?next=' + encodeURIComponent(r.completo)); return; }
  if (r.nome === 'admin' && !D.ehAdmin()) { trocar('/inicio'); return; }
  var mesma = r.completo === ultimaRota, sc = app.querySelector('.scroll'), topo = mesma && sc ? sc.scrollTop : 0;
  var espera = setTimeout(function () { if (meu === desenho && !mesma) { app.innerHTML = '<div class="screen"><div class="carregando"><span class="spin" role="status" aria-label="Carregando"></span></div></div>'; } }, 180);
  var html;
  try {
    if (r.nome === 'admin') { r.q._id = r.arg2; r.q._id2 = r.arg3; html = await T.admin(r.arg, r.q); }
    else { html = await (T[r.nome] || T.inicio)(r.arg, r.q); }
  } catch (e) {
    console.error(e);
    html = tela('<div class="done"><span class="mark" style="background:var(--alert-tint)">' + I('alert', 34) + '</span><h1 class="h1 sm">Não foi possível carregar</h1><p class="lead">' + esc(D.erroAmigavel(e)) + '</p><button type="button" class="btn" data-act="recarregar">Tentar de novo</button></div>', null, { topo: topbar('', '/inicio') });
  }
  clearTimeout(espera);
  if (meu !== desenho) { return; }
  app.innerHTML = html;
  var novo = app.querySelector('.scroll');
  if (novo) { novo.scrollTop = topo; }
  ultimaRota = r.completo;
  hidratar();
}
window.addEventListener('hashchange', function () {
  var st = history.state;
  if (st && typeof st.i === 'number') { indice = st.i; } else { if (trocando) { trocando = false; } else { indice++; } history.replaceState({ i: indice }, ''); }
  if (rotaAtual().completo !== ultimaRota) { D.limparCache(); }
  desenhar();
});

/* ---------- Ligação de campos ---------- */
function definir(caminho, valor) {
  var p = caminho.split('.'), o = S;
  for (var i = 0; i < p.length - 1; i++) { o = o[p[i]]; }
  o[p[p.length - 1]] = valor;
}
var redesenhaTimer;
document.addEventListener('input', function (e) {
  var el = e.target, b = el.getAttribute('data-bind'), fk = el.getAttribute('data-fk');
  if (fk && S.form) { S.form.vals[fk] = el.type === 'checkbox' ? el.checked : el.value; return; }
  if (!b) { return; }
  definir(b, el.type === 'checkbox' ? el.checked : el.value);
  if (el.getAttribute('data-relista')) { document.getElementById('lista-animais').innerHTML = gradeAnimais(S.cacheAdotar || []); hidratar(); }
  if (el.getAttribute('data-redesenha')) { clearTimeout(redesenhaTimer); redesenhaTimer = setTimeout(function () { desenhar().then(function () { var c = document.getElementById(el.id); if (c) { c.focus(); c.setSelectionRange(c.value.length, c.value.length); } }); }, 250); }
});
document.addEventListener('change', async function (e) {
  var el = e.target, act = el.getAttribute('data-act-change'), fk = el.getAttribute('data-fk');
  if (fk && S.form && el.tagName === 'SELECT') { S.form.vals[fk] = el.value; return; }
  if (!act || !el.files || !el.files.length) { return; }
  var arquivos = Array.prototype.slice.call(el.files, 0, 5);
  var alvo = act === 'form-fotos' ? S.form : act === 'den-fotos' ? S.denuncia : S.post;
  alvo.enviando = 1; desenhar();
  try {
    for (var i = 0; i < arquivos.length; i++) {
      if (!/^image\//.test(arquivos[i].type)) { toast('Por enquanto o app aceita só fotos.'); continue; }
      var id = await D.enviarFoto(arquivos[i], act !== 'den-fotos');
      if (act === 'form-fotos') { if (S.form.vals.fotos.length < 5) { S.form.vals.fotos.push(id); } }
      else if (act === 'den-fotos') { if (S.denuncia.fotos.length < 5) { S.denuncia.fotos.push(id); } }
      else { S.post.foto = id; }
    }
  } catch (err) { toast(D.erroAmigavel(err)); }
  alvo.enviando = 0; desenhar();
});

function erro(msg, foco) {
  var e = document.getElementById('erro');
  if (e) { e.textContent = msg; e.scrollIntoView({ block: 'center' }); } else { toast(msg); }
  if (foco) { var f = document.getElementById(foco); if (f) { f.focus(); } }
}
function copiar(texto, ok) {
  function reserva() {
    var t = document.createElement('textarea');
    t.value = texto; t.style.position = 'fixed'; t.style.opacity = '0';
    document.body.appendChild(t); t.select();
    var deu = false;
    try { deu = document.execCommand('copy'); } catch (e) { deu = false; }
    document.body.removeChild(t);
    toast(deu ? ok : 'Não foi possível copiar automaticamente.');
  }
  if (navigator.clipboard && navigator.clipboard.writeText) { navigator.clipboard.writeText(texto).then(function () { toast(ok); }, reserva); } else { reserva(); }
}
function valorEscolhido(min) {
  var d = S.doar, v = d.valor === 'outro' ? Number(String(d.outro).replace(',', '.')) : Number(d.valor);
  if (!(v >= min)) { erro('Informe um valor de pelo menos ' + reais(min) + '.', 'dv-outro'); return null; }
  return Math.round(v * 100) / 100;
}
async function ocupado(el, fn) {
  if (el.disabled) { return; }
  var txt = el.innerHTML; el.disabled = true;
  try { await fn(); } catch (e) { erro(D.erroAmigavel(e)); }
  if (document.body.contains(el)) { el.disabled = false; el.innerHTML = txt; }
}

/* ---------- Ações ---------- */
var A = {
  voltar: function (el) { if (indice > 0) { history.back(); } else { trocar(el.getAttribute('data-para')); } },
  recarregar: function () { D.limparCache(); desenhar(); },
  filtros: function () { S.adotar.filtros = !S.adotar.filtros; desenhar(); },
  galeria: function (el) { S.galeria[el.getAttribute('data-id')] = el.getAttribute('data-foto-id'); desenhar(); },
  'como-cliente': function () { S.comoCliente = !S.comoCliente; trocar('/inicio'); },
  painel: function () { S.comoCliente = false; },
  'pedido-voltar': function (el) { var id = el.getAttribute('data-id'), p = S.pedido[id]; if (p.etapa > 1) { p.etapa--; ultimaRota = ''; desenhar(); } else { ir('/animal/' + id); } },
  'pedido-avancar': function (el) {
    var id = el.getAttribute('data-id'), p = S.pedido[id];
    if (p.etapa === 1) {
      if (!p.nome.trim()) { return erro('Informe seu nome.', 'p-nome'); }
      if (digitos(p.celular).length < 10) { return erro('Informe um celular com DDD.', 'p-cel'); }
      if (!p.cidade.trim()) { return erro('Informe sua cidade e bairro.', 'p-cid'); }
    } else if (p.etapa === 2) {
      if (!p.moradores.trim()) { return erro('Conte quem mora com você.', 'p-mor'); }
      if (!p.rotina.trim()) { return erro('Conte como é a sua rotina.', 'p-rot'); }
    } else {
      if (!p.confirma) { return erro('Marque a confirmação para continuar.'); }
      return ocupado(el, async function () {
        await D.criar('pedidos_adocao', { usuario: D.usuario().id, animal: id, status: 'novo', dados: { nome: p.nome, celular: p.celular, cidade: p.cidade, moradia: p.moradia, telas: p.telas, moradores: p.moradores, outros: p.outros, rotina: p.rotina } });
        delete S.pedido[id]; trocar('/pedido-enviado');
      });
    }
    p.etapa++; ultimaRota = ''; desenhar();
  },
  localizacao: function () {
    if (!navigator.geolocation) { return toast('Localização indisponível neste aparelho.'); }
    toast('Buscando sua localização…');
    navigator.geolocation.getCurrentPosition(function (pos) {
      S.denuncia.local = 'Coordenadas: ' + pos.coords.latitude.toFixed(5) + ', ' + pos.coords.longitude.toFixed(5) + (S.denuncia.local && !/^Coordenadas/.test(S.denuncia.local) ? ' · ' + S.denuncia.local : '');
      desenhar(); toast('Localização preenchida');
    }, function () { toast('Não foi possível obter a localização. Digite o endereço.'); }, { enableHighAccuracy: true, timeout: 15000 });
  },
  'tirar-foto-den': function (el) { S.denuncia.fotos = S.denuncia.fotos.filter(function (f) { return f !== el.getAttribute('data-id'); }); desenhar(); },
  'tirar-foto': function (el) { S.form.vals.fotos = S.form.vals.fotos.filter(function (f) { return f !== el.getAttribute('data-id'); }); desenhar(); },
  'tirar-foto-post': function () { S.post.foto = null; desenhar(); },
  'enviar-denuncia': function (el) {
    var d = S.denuncia;
    if (!d.local.trim()) { return erro('Informe onde está acontecendo.', 'd-local'); }
    if (!d.descricao.trim()) { return erro('Descreva o que você viu.', 'd-desc'); }
    if (d.enviando) { return erro('Espere as fotos terminarem de carregar.'); }
    return ocupado(el, async function () {
      var u = D.usuario(), id = D.uuid(), prot = 'D' + D.hoje().replace(/-/g, '').slice(2) + '-' + id.slice(0, 4).toUpperCase();
      await D.criar('denuncias', { id: id, protocolo: prot, autor: u ? u.id : null, tipo: d.tipo, local: d.local.trim(), descricao: d.descricao.trim(), fotos: d.fotos, status: 'aguardando_pagamento' });
      S.denuncia = null;
      await irParaPagamento('denuncia', id, null, { protocolo: prot, descricao: 'Taxa da denúncia ' + prot });
    });
  },
  inscrever: function (el) {
    var id = el.getAttribute('data-id'), insc = el.getAttribute('data-insc');
    if (!D.usuario()) { ir('/cadastro?next=' + encodeURIComponent('/campanhas')); return; }
    return ocupado(el, async function () {
      if (insc) { await D.apagar('inscricoes', insc); toast('Inscrição cancelada'); }
      else { await D.criar('inscricoes', { campanha: id, usuario: D.usuario().id }); toast('Inscrição feita. A APAC vai entrar em contato.'); }
      desenhar();
    });
  },
  copiar: function (el) { copiar(el.getAttribute('data-texto'), el.getAttribute('data-ok')); },
  'salvar-anuncio': function (el) {
    var r = valoresForm('anuncio');
    if (r.erro) { return erro(r.erro); }
    if (S.form.enviando) { return erro('Espere as fotos terminarem de carregar.'); }
    if (!r.vals.fotos.length) { return erro('Adicione pelo menos uma foto do animal.'); }
    return ocupado(el, async function () {
      var id = D.uuid(), row = { id: id, origem: 'particular', dono: D.usuario().id, status: 'aguardando_pagamento' };
      for (var k in r.vals) { row[k] = r.vals[k]; }
      await D.criar('animais', row);
      S.form = null;
      await irParaPagamento('anuncio', id, null, { descricao: 'Anúncio de ' + row.nome + ' por ' + D.num('meses_anuncio', 2) + ' meses' });
    });
  },
  'pagar-anuncio': function (el) { return ocupado(el, function () { return pendenteOuNovo('anuncio', el.getAttribute('data-id')); }); },
  'anuncio-status': function (el) { return ocupado(el, async function () { await D.atualizar('animais', el.getAttribute('data-id'), { status: el.getAttribute('data-val') }); toast('Anúncio atualizado'); desenhar(); }); },
  doar: function (el) {
    var d = S.doar, meta = el.getAttribute('data-meta');
    if (d.mensal && !D.usuario()) { ir('/cadastro?next=' + encodeURIComponent(rotaAtual().completo)); return; }
    var v = valorEscolhido(d.mensal ? 5 : 1);
    if (v == null) { return; }
    return ocupado(el, async function () {
      if (d.mensal) {
        var id = D.uuid();
        await D.criar('apoios_mensais', { id: id, usuario: D.usuario().id, animal: null, valor: v, status: 'aguardando_pagamento' });
        await irParaPagamento('apoio_mensal', id, v, { descricao: 'Apoio mensal à APAC' });
      } else {
        await irParaPagamento(meta ? 'meta' : 'doacao', meta || null, v);
      }
      S.doar = null;
    });
  },
  apadrinhar: function (el) {
    var id = el.getAttribute('data-id');
    if (!D.usuario()) { ir('/cadastro?next=' + encodeURIComponent('/apadrinhar/' + id)); return; }
    var v = valorEscolhido(5);
    if (v == null) { return; }
    return ocupado(el, async function () {
      var ap = D.uuid();
      await D.criar('apoios_mensais', { id: ap, usuario: D.usuario().id, animal: id, valor: v, status: 'aguardando_pagamento' });
      S.doar = null;
      await irParaPagamento('apadrinhamento', ap, v, { descricao: 'Apadrinhamento: 1º mês' });
    });
  },
  'pagar-apoio': function (el) {
    return ocupado(el, async function () { var a = await D.um('apoios_mensais', el.getAttribute('data-id')); await pendenteOuNovo(a.animal ? 'apadrinhamento' : 'apoio_mensal', a.id, a.valor); });
  },
  'encerrar-apoio': function (el) { return ocupado(el, async function () { await D.atualizar('apoios_mensais', el.getAttribute('data-id'), { status: 'encerrado' }); toast('Apoio encerrado. Obrigado por ter ajudado!'); trocar('/perfil'); }); },
  'remover-pet': function (el) { return ocupado(el, async function () { await D.apagar('pets', el.getAttribute('data-id')); desenhar(); }); },
  sair: async function () { await D.sair(); S.pedido = {}; S.form = null; S.comoCliente = false; ultimaRota = ''; desenhar(); toast('Você saiu da conta'); },
  'excluir-conta': function (el) { return ocupado(el, async function () { await D.excluirConta(); toast('Sua conta foi excluída.'); trocar('/inicio'); }); },
  'instalar-agora': function (el) {
    if (el.getAttribute('data-fecha')) { fecharConvite(); }
    Instalar.pedir().then(function (ok) { if (!ok) { desenhar(); } });
  },
  /* Botão Instalar do Início: abre a instalação do navegador quando ele permite; senão mostra os passos deste celular */
  instalar: function () {
    if (Instalar.podeUmToque()) { Instalar.pedir().then(function (ok) { if (!ok) { desenhar(); } }); } else { abrirConvite(true, true); }
  },
  'fechar-convite': function () { fecharConvite(); },
  'instalar-depois': function () { Instalar.dispensar(); desenhar(); toast('Tudo bem. Você encontra o passo a passo em Perfil.'); },
  'compartilhar-app': function () {
    var url = Instalar.endereco(), txt = 'Conheça o app da APAC Cotia: adote, denuncie maus-tratos e ajude os animais.';
    if (navigator.share) { navigator.share({ title: 'APAC Cotia', text: txt, url: url }).catch(function () {}); }
    else { location.href = 'https://wa.me/?text=' + encodeURIComponent(txt + ' ' + url); }
  },
  'admin-demo': function (el) { return ocupado(el, async function () { await D.entrarAdminDemo(); S.comoCliente = false; trocar('/inicio'); }); },
  'ver-senha': function (el) {
    var c = document.getElementById(el.getAttribute('data-alvo') || 'senha'), ver = c.type === 'password';
    c.type = ver ? 'text' : 'password'; el.textContent = ver ? 'Ocultar' : 'Mostrar';
  },
  /* equipe */
  'confirmar-pag': function (el) { return ocupado(el, async function () { await D.confirmarPagamento(el.getAttribute('data-id')); toast('Pagamento confirmado'); desenhar(); }); },
  'recusar-pag': function (el) { return ocupado(el, async function () { await D.atualizar('pagamentos', el.getAttribute('data-id'), { status: 'recusado' }); toast('Marcado como não recebido'); desenhar(); }); },
  status: function (el) { return ocupado(el, async function () { await D.atualizar(el.getAttribute('data-tab'), el.getAttribute('data-id'), { status: el.getAttribute('data-val') }); toast('Situação atualizada'); desenhar(); }); },
  'salvar-reg': function (el) {
    var ent = el.getAttribute('data-ent'), def = ENT[ent], r = valoresForm(ent);
    if (r.erro) { return erro(r.erro); }
    if (S.form.enviando) { return erro('Espere as fotos terminarem de carregar.'); }
    return ocupado(el, async function () {
      if (S.form.id === 'novo') { if (ent === 'animais') { r.vals.dono = null; } await D.criar(def.tabela, r.vals); }
      else { await D.atualizar(def.tabela, S.form.id, r.vals); }
      S.form = null; toast('Salvo'); trocar(ent === 'animais' ? '/admin/animais' : '/admin/lista/' + ent);
    });
  },
  'apagar-reg': function (el) {
    var ent = el.getAttribute('data-ent');
    return ocupado(el, async function () { await D.apagar(ENT[ent].tabela, el.getAttribute('data-id')); S.form = null; toast('Apagado'); trocar(ent === 'animais' ? '/admin/animais' : '/admin/lista/' + ent); });
  },
  modelo: function (el) { S.post.texto = el.getAttribute('data-val'); desenhar(); },
  'publicar-post': function (el) {
    if (!S.post.texto.trim()) { return erro('Escreva a mensagem ou escolha uma pronta.', 'post-texto'); }
    if (S.post.enviando) { return erro('Espere a foto terminar de carregar.'); }
    return ocupado(el, async function () { await D.criar('atualizacoes', { animal: S.post.animal, texto: S.post.texto.trim(), foto: S.post.foto }); S.post = null; toast('Notícia publicada para os padrinhos'); desenhar(); });
  },
  'apagar-post': function (el) { return ocupado(el, async function () { await D.apagar('atualizacoes', el.getAttribute('data-id')); desenhar(); }); }
};
document.addEventListener('click', function (e) {
  var tip = e.target.closest && e.target.closest('[data-tip]');
  if (tip) {
    var ch = tip.closest('[data-chart]'), t = ch.querySelector('.tip');
    var px = Number(tip.getAttribute('data-x'));
    t.textContent = tip.getAttribute('data-tip'); t.style.left = px + '%';
    t.style.transform = px > 70 ? 'translateX(-100%)' : px < 30 ? 'translateX(0)' : 'translateX(-50%)';
    return;
  }
  var el = e.target.closest ? e.target.closest('[data-act],[data-set],[data-fset]') : null;
  if (!el) { return; }
  var dupla = el.getAttribute('data-dupla');
  if (dupla && !el.getAttribute('data-armado')) {
    var antes = el.innerHTML;
    el.setAttribute('data-armado', '1'); el.textContent = dupla;
    setTimeout(function () { if (document.body.contains(el) && el.getAttribute('data-armado')) { el.removeAttribute('data-armado'); el.innerHTML = antes; } }, 4000);
    return;
  }
  if (dupla) { el.removeAttribute('data-armado'); }
  var fs = el.getAttribute('data-fset');
  if (fs) { S.form.vals[fs] = el.getAttribute('data-val'); desenhar(); return; }
  var s = el.getAttribute('data-set');
  if (s) { definir(s, el.getAttribute('data-val')); if (s === 'doar.mensal') { S.doar.mensal = !!el.getAttribute('data-val'); } desenhar(); return; }
  var f = A[el.getAttribute('data-act')];
  if (f) { f(el); }
});

/* ---------- Formulários de conta ---------- */
function seguir() { var q = rotaAtual().q; trocar(q.next && q.next.charAt(0) === '/' ? q.next : '/perfil'); setTimeout(function () { abrirConvite(true); }, 700); }
var FORMS = {
  cadastro: async function (f) {
    var nome = f.nome.value.trim(), email = f.email.value.trim().toLowerCase(), cel = f.celular.value.trim(), senha = f.senha.value;
    if (!nome) { return erro('Informe seu nome.', 'nome'); }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { return erro('Informe um e-mail válido.', 'email'); }
    if (digitos(cel).length < 10) { return erro('Informe o celular com DDD.', 'celular'); }
    if (senha.length < 8) { return erro('A senha precisa ter pelo menos 8 caracteres.', 'senha'); }
    if (!f.termos.checked) { return erro('Para criar a conta, aceite os termos.'); }
    var r = await D.cadastrar({ nome: nome, email: email, celular: cel, senha: senha });
    if (!r.sessao) { trocar('/confirmar'); return; }
    toast('Conta criada'); seguir();
  },
  entrar: async function (f) {
    var email = f.email.value.trim().toLowerCase(), senha = f.senha.value;
    if (!email || !senha) { return erro('Informe e-mail e senha.', email ? 'senha' : 'email'); }
    await D.entrar(email, senha); S.comoCliente = false; seguir();
  },
  recuperar: async function (f) {
    var email = f.email.value.trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { return erro('Informe um e-mail válido.', 'email'); }
    await D.recuperar(email); S.recuperar = { email: email, enviado: true }; desenhar();
  },
  redefinir: async function (f) {
    var codigo = f.codigo.value.trim(), senha = f.senha.value;
    if (!codigo) { return erro('Cole o link ou digite o código recebido.', 'codigo'); }
    if (senha.length < 8) { return erro('A senha precisa ter pelo menos 8 caracteres.', 'senha'); }
    await D.redefinir(S.recuperar.email, codigo, senha); S.recuperar = null; toast('Senha alterada'); trocar('/perfil');
  },
  editar: async function (f) {
    var nome = f.nome.value.trim(), cel = f.celular.value.trim();
    if (!nome) { return erro('Informe seu nome.', 'e-nome'); }
    if (cel && digitos(cel).length < 10) { return erro('Informe o celular com DDD ou deixe o campo vazio.', 'e-cel'); }
    await D.atualizarPerfil({ nome: nome, celular: cel }); toast('Dados salvos'); trocar('/perfil');
  },
  'novo-pet': async function (f) {
    var nome = f.nome.value.trim();
    if (!nome) { return erro('Informe o nome do animal.', 'n-nome'); }
    await D.criar('pets', { usuario: D.usuario().id, nome: nome, proxima_vacina: f.vacina.value || null }); trocar('/perfil');
  },
  config: async function (f) {
    var v = {};
    Array.prototype.forEach.call(f.querySelectorAll('input[name]'), function (i) { v[i.name] = i.value.trim(); });
    if (!v.pix_chave) { return erro('Informe a chave Pix.', 'cfg-pix_chave'); }
    await D.salvarConfig(v); toast('Configurações salvas'); trocar('/inicio');
  }
};
document.addEventListener('submit', function (e) {
  var nome = e.target.getAttribute('data-form');
  if (!nome || !FORMS[nome]) { return; }
  e.preventDefault();
  var b = e.target.querySelector('button[type=submit]');
  ocupado(b, function () { return FORMS[nome](e.target); });
});

/* ---------- Início ---------- */
(function () {
  var ab = document.getElementById('abertura'), t0 = Date.now();
  Instalar.registrar();
  D.iniciar().then(function () { return desenhar(); }).then(function () {
    setTimeout(function () { ab.classList.add('sai'); setTimeout(function () { ab.remove(); }, 400); setTimeout(function () { if (rotaAtual().nome !== 'instalar') { abrirConvite(false); } }, 1200); }, Math.max(0, 900 - (Date.now() - t0)));
  });
})();
