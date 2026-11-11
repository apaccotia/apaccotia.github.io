'use strict';
/*
 * Camada de dados do app.
 * - Modo "servidor": usa o Supabase configurado em config.js (dados reais, compartilhados).
 * - Modo "demonstração": sem servidor configurado, tudo fica salvo só neste aparelho.
 * As telas usam sempre as mesmas funções; só a "ponte" muda.
 */
var D = (function () {
  var CFG = window.APAC_CONFIG || {};
  var modo = CFG.supabaseUrl && CFG.supabaseKey && window.supabase ? 'servidor' : 'demo';

  /* ---------- Utilidades ---------- */
  function uuid() {
    if (window.crypto && crypto.randomUUID) { return crypto.randomUUID(); }
    var b = crypto.getRandomValues(new Uint8Array(16));
    b[6] = (b[6] & 15) | 64; b[8] = (b[8] & 63) | 128;
    var h = Array.prototype.map.call(b, function (x) { return ('0' + x.toString(16)).slice(-2); }).join('');
    return h.slice(0, 8) + '-' + h.slice(8, 12) + '-' + h.slice(12, 16) + '-' + h.slice(16, 20) + '-' + h.slice(20);
  }
  function codigoCurto(prefixo) {
    var abc = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789', b = crypto.getRandomValues(new Uint8Array(7)), s = prefixo || 'APAC';
    for (var i = 0; i < b.length; i++) { s += abc[b[i] % abc.length]; }
    return s;
  }
  function hoje() {
    var d = new Date(Date.now() - 3 * 3600 * 1000); // horário de Brasília
    return d.toISOString().slice(0, 10);
  }
  function somaDias(iso, dias) { var d = new Date(iso + 'T12:00:00Z'); d.setUTCDate(d.getUTCDate() + dias); return d.toISOString().slice(0, 10); }
  function somaMeses(iso, meses) { var d = new Date(iso + 'T12:00:00Z'); d.setUTCMonth(d.getUTCMonth() + meses); return d.toISOString().slice(0, 10); }
  function erroAmigavel(e) {
    var m = (e && (e.message || e.msg || e.error_description)) || String(e || '');
    if (/Failed to fetch|NetworkError|Load failed|network/i.test(m)) { return 'Sem conexão com o servidor. Verifique sua internet e tente de novo.'; }
    if (/Invalid login credentials/i.test(m)) { return 'E-mail ou senha incorretos.'; }
    if (/already registered|already exists/i.test(m)) { return 'Este e-mail já tem uma conta. Use "Já tenho conta".'; }
    if (/Email not confirmed/i.test(m)) { return 'Confirme seu e-mail pelo link que enviamos antes de entrar.'; }
    if (/Password should be|weak_password/i.test(m)) { return 'A senha precisa ter pelo menos 8 caracteres.'; }
    if (/rate limit|too many/i.test(m)) { return 'Muitas tentativas seguidas. Espere alguns minutos e tente de novo.'; }
    if (/Token has expired|otp/i.test(m)) { return 'Código inválido ou expirado. Peça um novo código.'; }
    if (/not authorized|Email address .* invalid|sending .*email|Error sending/i.test(m)) { return 'Não foi possível enviar o e-mail de recuperação agora. Fale com a APAC pelo WhatsApp.'; }
    if (/Sem permissão|permission denied|row-level security/i.test(m)) { return 'Você não tem permissão para fazer isso.'; }
    if (/duplicate key/i.test(m)) { return 'Esse registro já existe.'; }
    return m || 'Algo deu errado. Tente de novo.';
  }
  function falha(e) { var x = new Error(erroAmigavel(e)); x.original = e; throw x; }

  /* Filtros: { eq:{}, neq:{}, in:{}, gte:{}, lte:{}, nulo:[], or:[filtro, filtro], order:['col', asc], limit } */
  function casa(row, f) {
    var k;
    if (!f) { return true; }
    for (k in f.eq || {}) { if (row[k] !== f.eq[k]) { return false; } }
    for (k in f.neq || {}) { if (row[k] === f.neq[k]) { return false; } }
    for (k in f.in || {}) { if (f.in[k].indexOf(row[k]) < 0) { return false; } }
    for (k in f.gte || {}) { if (row[k] == null || row[k] < f.gte[k]) { return false; } }
    for (k in f.lte || {}) { if (row[k] == null || row[k] > f.lte[k]) { return false; } }
    if (f.nulo) { for (var i = 0; i < f.nulo.length; i++) { if (row[f.nulo[i]] != null) { return false; } } }
    if (f.or && !f.or.some(function (g) { return casa(row, g); })) { return false; }
    return true;
  }

  /* ======================================================================
   * Ponte: demonstração (localStorage)
   * ====================================================================== */
  function ponteDemo() {
    var KEY = 'apac.demo.v2', db;
    var PADROES = {
      animais: { origem: 'particular', status: 'aguardando_pagamento', temperamento: '', historia: '', cidade: '', contato: '', fotos: [], vacinado: false, castrado: false, vermifugado: false, publicado_ate: null, aceita_padrinho: false },
      campanhas: { ativa: true, horario: '', local: '', requisitos: '', data: null, vagas: null },
      pedidos_adocao: { status: 'novo', dados: {} },
      denuncias: { status: 'aguardando_pagamento', fotos: [] },
      metas: { ativa: true, arrecadado: 0, descricao: '', prazo: null },
      itens_doacao: { ativo: true, urgente: false, detalhe: '', ordem: 0 },
      apoios_mensais: { status: 'aguardando_pagamento', pago_ate: null, animal: null },
      pagamentos: { status: 'pendente', confirmado_em: null, ref: null },
      locais_atendimento: { ativo: true, gratuito: false, ordem: 0 },
      fotos: { publica: true }
    };
    function semente() {
      var t = {
        perfis: [], fotos: [], pets: [], inscricoes: [], pedidos_adocao: [], denuncias: [], apoios_mensais: [],
        atualizacoes: [], pagamentos: [], acessos: [], avisos: [],
        config: [
          { chave: 'pix_chave', valor: '17393867000157' }, { chave: 'pix_nome', valor: 'APAC COTIA' }, { chave: 'pix_cidade', valor: 'COTIA' },
          { chave: 'whatsapp', valor: '5511984240236' }, { chave: 'valor_anuncio', valor: '20' }, { chave: 'meses_anuncio', valor: '2' },
          { chave: 'valor_denuncia', valor: '5' }, { chave: 'entrega_endereco', valor: '' }, { chave: 'entrega_horario', valor: '' }
        ],
        animais: [
          ['Thor', 'cao', 'Macho', 'Adulto', 'Médio', 'Dócil, brincalhão, gosta de crianças', true, true, true, true],
          ['Mel', 'gato', 'Fêmea', 'Filhote', 'Pequeno', 'Curiosa, carinhosa', true, false, true, true],
          ['Nina', 'cao', 'Fêmea', 'Idoso', 'Pequeno', 'Calma, companheira', true, true, true, false],
          ['Fred', 'gato', 'Macho', 'Adulto', 'Médio', 'Independente, tranquilo', true, true, false, false]
        ].map(function (a) {
          return { id: uuid(), origem: 'apac', dono: null, nome: a[0], especie: a[1], sexo: a[2], idade: a[3], porte: a[4], temperamento: a[5],
            vacinado: a[6], castrado: a[7], vermifugado: a[8], aceita_padrinho: a[9], historia: 'Animal de exemplo da versão de demonstração.',
            cidade: 'Cotia', contato: '', fotos: [], status: 'publicado', publicado_ate: null, criado_em: new Date().toISOString() };
        }),
        campanhas: [{ id: uuid(), tipo: 'castracao', titulo: 'Castração gratuita (exemplo)', data: null, horario: '', local: 'Local a definir', vagas: null, requisitos: '', ativa: true, criado_em: new Date().toISOString() }],
        metas: [{ id: uuid(), titulo: 'Ração para o inverno (exemplo)', descricao: 'Meta de demonstração.', valor_meta: 1500, arrecadado: 0, prazo: null, ativa: true, criado_em: new Date().toISOString() }],
        itens_doacao: [
          ['Ração para cães', 'Adultos e filhotes'], ['Ração para gatos', 'Adultos e filhotes'],
          ['Medicamentos', 'Fale com a equipe para saber quais estão em falta'], ['Cobertores e caminhas', 'Usados, desde que limpos'],
          ['Produtos de limpeza', 'Desinfetante, água sanitária, sacos de lixo']
        ].map(function (x, i) { return { id: uuid(), nome: x[0], detalhe: x[1], urgente: false, ativo: true, ordem: i + 1 }; }),
        locais_atendimento: LOCAIS_PADRAO.map(function (l, i) { var o = { id: uuid(), ativo: true, ordem: i + 1 }; for (var k in l) { o[k] = l[k]; } return o; })
      };
      return { tabelas: t, contas: {}, sessao: null };
    }
    try { db = JSON.parse(localStorage.getItem(KEY) || 'null'); } catch (e) { db = null; }
    if (!db || !db.tabelas) { db = semente(); }
    function salvar() {
      try { localStorage.setItem(KEY, JSON.stringify(db)); }
      catch (e) { throw new Error('O armazenamento do aparelho está cheio. Use fotos menores ou apague algumas.'); }
    }
    salvar();
    function T(nome) { if (!db.tabelas[nome]) { db.tabelas[nome] = []; } return db.tabelas[nome]; }
    function copia(o) { return JSON.parse(JSON.stringify(o)); }
    function uid() { return db.sessao; }
    function admin() { var p = T('perfis').filter(function (x) { return x.id === db.sessao; })[0]; return !!(p && p.papel === 'admin'); }
    function cfgNum(k, padrao) { var c = T('config').filter(function (x) { return x.chave === k; })[0]; var n = c ? Number(String(c.valor).replace(',', '.')) : NaN; return isNaN(n) || !c.valor ? padrao : n; }

    var api = {
      sel: function (t, f) {
        return Promise.resolve().then(function () {
          var r = T(t).filter(function (row) { return casa(row, f); });
          if (f && f.order) {
            var c = f.order[0], asc = f.order[1] !== false;
            r.sort(function (a, b) { var x = a[c], y = b[c]; if (x === y) { return 0; } if (x == null) { return 1; } if (y == null) { return -1; } return (x < y ? -1 : 1) * (asc ? 1 : -1); });
          }
          if (f && f.limit) { r = r.slice(0, f.limit); }
          return copia(r);
        });
      },
      ins: function (t, row) {
        return Promise.resolve().then(function () {
          var o = {}, p = PADROES[t] || {}, k;
          for (k in p) { o[k] = copia(p[k]); }
          for (k in row) { o[k] = row[k]; }
          if (t !== 'config' && t !== 'acessos' && !o.id) { o.id = uuid(); }
          if (!o.criado_em) { o.criado_em = new Date().toISOString(); }
          if (t === 'acessos') {
            if (T('acessos').some(function (a) { return a.dia === o.dia && a.dispositivo === o.dispositivo; })) { throw new Error('duplicate key'); }
          }
          if (t === 'pagamentos') {
            o.status = 'pendente'; o.confirmado_em = null;
            if (o.tipo === 'anuncio') { o.valor = cfgNum('valor_anuncio', 20); }
            if (o.tipo === 'denuncia') { o.valor = cfgNum('valor_denuncia', 5); }
          }
          T(t).push(o); salvar();
        });
      },
      upd: function (t, id, patch) {
        return Promise.resolve().then(function () {
          var chave = t === 'config' ? 'chave' : 'id';
          T(t).forEach(function (r) { if (r[chave] === id) { for (var k in patch) { r[k] = patch[k]; } } });
          salvar();
        });
      },
      upsertConfig: function (chave, valor) {
        return Promise.resolve().then(function () {
          var c = T('config').filter(function (x) { return x.chave === chave; })[0];
          if (c) { c.valor = valor; } else { T('config').push({ chave: chave, valor: valor }); }
          salvar();
        });
      },
      del: function (t, id) {
        return Promise.resolve().then(function () { db.tabelas[t] = T(t).filter(function (r) { return r.id !== id; }); salvar(); });
      },
      rpc: function (nome, args) {
        return Promise.resolve().then(function () {
          var h = hoje();
          if (nome === 'confirmar_pagamento') {
            if (!admin()) { throw new Error('Sem permissão'); }
            var p = T('pagamentos').filter(function (x) { return x.id === args.p_id; })[0];
            if (!p || p.status === 'confirmado') { return null; }
            p.status = 'confirmado'; p.confirmado_em = new Date().toISOString();
            var alvo = function (tab) { return T(tab).filter(function (x) { return x.id === p.ref; })[0]; };
            var a;
            if (p.tipo === 'anuncio' && (a = alvo('animais'))) {
              if (a.status === 'aguardando_pagamento' || a.status === 'publicado') { a.status = 'publicado'; }
              a.publicado_ate = somaMeses(a.publicado_ate && a.publicado_ate > h ? a.publicado_ate : h, cfgNum('meses_anuncio', 2));
            } else if (p.tipo === 'denuncia' && (a = alvo('denuncias'))) {
              if (a.status === 'aguardando_pagamento') { a.status = 'aberta'; }
            } else if ((p.tipo === 'apadrinhamento' || p.tipo === 'apoio_mensal') && (a = alvo('apoios_mensais'))) {
              a.status = 'ativo'; a.pago_ate = somaMeses(a.pago_ate && a.pago_ate > h ? a.pago_ate : h, 1);
            } else if (p.tipo === 'meta' && (a = alvo('metas'))) {
              a.arrecadado = Number(a.arrecadado) + Number(p.valor);
            }
            salvar(); return null;
          }
          if (nome === 'painel_resumo') {
            if (!admin()) { throw new Error('Sem permissão'); }
            return resumoLocal(T, h);
          }
          if (nome === 'excluir_minha_conta') {
            var id = uid();
            ['pets', 'inscricoes', 'pedidos_adocao', 'apoios_mensais', 'fotos'].forEach(function (t) {
              db.tabelas[t] = T(t).filter(function (r) { return r.usuario !== id && r.dono !== id; });
            });
            db.tabelas.animais = T('animais').filter(function (r) { return r.dono !== id; });
            T('pagamentos').forEach(function (r) { if (r.usuario === id) { r.usuario = null; } });
            T('denuncias').forEach(function (r) { if (r.autor === id) { r.autor = null; } });
            db.tabelas.perfis = T('perfis').filter(function (r) { return r.id !== id; });
            for (var e in db.contas) { if (db.contas[e].id === id) { delete db.contas[e]; } }
            db.sessao = null; salvar(); return null;
          }
          throw new Error('Função desconhecida: ' + nome);
        });
      },
      auth: {
        atual: function () { return Promise.resolve(db.sessao ? { id: db.sessao } : null); },
        cadastrar: function (d) {
          var email = d.email;
          if (db.contas[email]) { return Promise.reject(new Error('already registered')); }
          var sal = crypto.getRandomValues(new Uint8Array(16));
          return derivar(d.senha, sal).then(function (hash) {
            var id = uuid();
            db.contas[email] = { id: id, sal: hex(sal), hash: hash };
            T('perfis').push({ id: id, nome: d.nome, email: email, celular: d.celular || '', papel: 'cliente', criado_em: new Date().toISOString() });
            db.sessao = id; salvar();
            return { sessao: true };
          });
        },
        entrar: function (email, senha) {
          var c = db.contas[email];
          if (!c) { return Promise.reject(new Error('Invalid login credentials')); }
          return derivar(senha, unhex(c.sal)).then(function (h) {
            if (h !== c.hash) { throw new Error('Invalid login credentials'); }
            db.sessao = c.id; salvar();
          });
        },
        sair: function () { db.sessao = null; salvar(); return Promise.resolve(); },
        recuperar: function () { return Promise.reject(new Error('Na demonstração a senha não pode ser recuperada. Crie uma nova conta.')); },
        redefinir: function () { return Promise.reject(new Error('Indisponível na demonstração.')); },
        entrarAdminDemo: function () {
          var email = 'admin@demonstracao.local';
          if (!db.contas[email]) {
            var id = uuid();
            db.contas[email] = { id: id, sal: '00', hash: 'x' };
            T('perfis').push({ id: id, nome: 'Equipe APAC', email: email, celular: '', papel: 'admin', criado_em: new Date().toISOString() });
          }
          db.sessao = db.contas[email].id; salvar();
          return Promise.resolve();
        }
      }
    };
    return api;
  }

  function resumoLocal(T, h) {
    var dias = [], i, inicioMes = h.slice(0, 7);
    for (i = 13; i >= 0; i--) { dias.push(somaDias(h, -i)); }
    var conf = T('pagamentos').filter(function (p) { return p.status === 'confirmado' && p.confirmado_em && p.confirmado_em.slice(0, 7) === inicioMes; });
    var porTipo = {};
    conf.forEach(function (p) { porTipo[p.tipo] = (porTipo[p.tipo] || 0) + Number(p.valor); });
    var pend = T('pagamentos').filter(function (p) { return p.status === 'pendente'; });
    var sete = new Date(Date.now() - 7 * 864e5).toISOString();
    var apoios = T('apoios_mensais').filter(function (a) { return a.status === 'ativo' && a.pago_ate >= h; });
    var campAtivas = T('campanhas').filter(function (c) { return c.ativa; }).map(function (c) { return c.id; });
    return {
      hoje: h,
      acessos: dias.map(function (d) { return { dia: d, total: T('acessos').filter(function (a) { return a.dia === d; }).length }; }),
      clientes_total: T('perfis').length,
      clientes_7d: T('perfis').filter(function (p) { return p.criado_em >= sete; }).length,
      arrecadado_mes: conf.reduce(function (s, p) { return s + Number(p.valor); }, 0),
      arrecadado_por_tipo: porTipo,
      pendentes_qtd: pend.length,
      pendentes_valor: pend.reduce(function (s, p) { return s + Number(p.valor); }, 0),
      denuncias_abertas: T('denuncias').filter(function (d) { return d.status === 'aberta' || d.status === 'em_apuracao'; }).length,
      denuncias_sem_pagamento: T('denuncias').filter(function (d) { return d.status === 'aguardando_pagamento'; }).length,
      pedidos_novos: T('pedidos_adocao').filter(function (p) { return p.status === 'novo' || p.status === 'em_analise'; }).length,
      anuncios_ativos: T('animais').filter(function (a) { return a.origem === 'particular' && a.status === 'publicado' && a.publicado_ate >= h; }).length,
      anuncios_aguardando: T('animais').filter(function (a) { return a.origem === 'particular' && a.status === 'aguardando_pagamento'; }).length,
      animais_apac: T('animais').filter(function (a) { return a.origem === 'apac' && a.status === 'publicado'; }).length,
      apoios_ativos: apoios.length,
      apoios_mensal_valor: apoios.reduce(function (s, a) { return s + Number(a.valor); }, 0),
      inscricoes: T('inscricoes').filter(function (i) { return campAtivas.indexOf(i.campanha) >= 0; }).length
    };
  }

  /* ======================================================================
   * Ponte: servidor (Supabase)
   * ====================================================================== */
  function ponteServidor() {
    var sb = window.supabase.createClient(CFG.supabaseUrl, CFG.supabaseKey, {
      auth: { persistSession: true, autoRefreshToken: true, storageKey: 'apac-auth', detectSessionInUrl: false }
    });
    function aplica(q, f) {
      var k;
      if (!f) { return q; }
      for (k in f.eq || {}) { q = q.eq(k, f.eq[k]); }
      for (k in f.neq || {}) { q = q.neq(k, f.neq[k]); }
      for (k in f.in || {}) { q = q.in(k, f.in[k]); }
      for (k in f.gte || {}) { q = q.gte(k, f.gte[k]); }
      for (k in f.lte || {}) { q = q.lte(k, f.lte[k]); }
      (f.nulo || []).forEach(function (c) { q = q.is(c, null); });
      if (f.or) {
        q = q.or(f.or.map(function (g) {
          var p = [];
          for (var c in g.eq || {}) { p.push(c + '.eq.' + g.eq[c]); }
          for (c in g.gte || {}) { p.push(c + '.gte.' + g.gte[c]); }
          return p.length > 1 ? 'and(' + p.join(',') + ')' : p[0];
        }).join(','));
      }
      if (f.order) { q = q.order(f.order[0], { ascending: f.order[1] !== false, nullsFirst: false }); }
      if (f.limit) { q = q.limit(f.limit); }
      return q;
    }
    function r(p) { return p.then(function (res) { if (res.error) { falha(res.error); } return res.data; }); }
    return {
      sel: function (t, f) { return r(aplica(sb.from(t).select((f && f.cols) || '*'), f)); },
      ins: function (t, row) { return r(sb.from(t).insert(row)); },
      upd: function (t, id, patch) { return r(sb.from(t).update(patch).eq(t === 'config' ? 'chave' : 'id', id)); },
      upsertConfig: function (chave, valor) { return r(sb.from('config').upsert({ chave: chave, valor: valor })); },
      del: function (t, id) { return r(sb.from(t).delete().eq('id', id)); },
      rpc: function (nome, args) { return r(sb.rpc(nome, args || {})); },
      auth: {
        atual: function () {
          return sb.auth.getSession().then(function (res) { var s = res.data && res.data.session; return s ? { id: s.user.id } : null; });
        },
        cadastrar: function (d) {
          return sb.auth.signUp({ email: d.email, password: d.senha, options: { data: { nome: d.nome, celular: d.celular || '' } } })
            .then(function (res) {
              if (res.error) { falha(res.error); }
              if (res.data && res.data.user && res.data.user.identities && res.data.user.identities.length === 0) { falha(new Error('already registered')); }
              return { sessao: !!(res.data && res.data.session) };
            });
        },
        entrar: function (email, senha) {
          return sb.auth.signInWithPassword({ email: email, password: senha }).then(function (res) { if (res.error) { falha(res.error); } });
        },
        sair: function () { return sb.auth.signOut().then(function () {}, function () {}); },
        recuperar: function (email) { return sb.auth.resetPasswordForEmail(email).then(function (res) { if (res.error) { falha(res.error); } }); },
        redefinir: function (email, codigo, senha) {
          var hash = /[?&#]token(?:_hash)?=([^&#\s]+)/.exec(codigo);
          var dados = hash ? { token_hash: decodeURIComponent(hash[1]), type: 'recovery' } : { email: email, token: codigo.replace(/\s/g, ''), type: 'recovery' };
          return sb.auth.verifyOtp(dados).then(function (res) {
            if (res.error) { falha(res.error); }
            return sb.auth.updateUser({ password: senha });
          }).then(function (res) { if (res.error) { falha(res.error); } });
        }
      }
    };
  }

  /* ---------- Senha no modo demonstração ---------- */
  function hex(b) { return Array.prototype.map.call(new Uint8Array(b), function (x) { return ('0' + x.toString(16)).slice(-2); }).join(''); }
  function unhex(h) { var a = new Uint8Array(h.length / 2); for (var i = 0; i < a.length; i++) { a[i] = parseInt(h.substr(i * 2, 2), 16); } return a; }
  function derivar(senha, sal) {
    var c = window.crypto && window.crypto.subtle;
    if (!c) { return Promise.reject(new Error('Este aparelho não suporta criptografia.')); }
    return c.importKey('raw', new TextEncoder().encode(senha), 'PBKDF2', false, ['deriveBits']).then(function (k) {
      return c.deriveBits({ name: 'PBKDF2', hash: 'SHA-256', salt: sal, iterations: 150000 }, k, 256);
    }).then(hex);
  }

  /* ---------- Locais de atendimento (iguais aos do schema.sql) ---------- */
  var LOCAIS_PADRAO = [
    { nome: 'PS VET Hospital Público Veterinário de Cotia', cidade: 'Cotia', gratuito: true, servicos: 'Castração, vacinação e cirurgias gratuitas.', requisitos: 'Somente para moradores de Cotia, com comprovante de endereço.', endereco: '', whatsapp: '5511911159550', telefone: '', site: '' },
    { nome: 'Hospitais Veterinários de Osasco', cidade: 'Osasco', gratuito: true, servicos: 'Atendimento gratuito, incluindo castração, vacinação e cirurgias.', requisitos: 'Somente para moradores de Osasco, com comprovante de endereço. Segunda a sexta, das 8h às 17h; senhas a partir das 7h30.', endereco: 'Unidade Manchinha: Av. Franz Voegeli, 930, Jardim Wilson. Zona Norte: Av. Lourenço Belloli, 1480, Pq. Industrial Mazzei.', whatsapp: '', telefone: '1136517080', site: 'https://osasco.sp.gov.br/hospitais-veterinarios-de-osasco/' },
    { nome: 'Hospitais Veterinários Públicos Anclivepa-SP', cidade: 'São Paulo e outras cidades', gratuito: true, servicos: 'Atendimento gratuito para cães e gatos.', requisitos: 'Para tutores de baixa renda que moram na cidade do hospital. Veja as regras de cada unidade no site.', endereco: '', whatsapp: '', telefone: '', site: 'https://hospitalveterinariopublico.com.br/' },
    { nome: 'Clínica Veterinária Popular Dra. Vivian', cidade: 'Caucaia do Alto, Cotia', gratuito: false, servicos: 'Preços populares para castração, vacinação e outros serviços.', requisitos: '', endereco: '', whatsapp: '5511911353006', telefone: '', site: '' },
    { nome: 'Lar dos Pets Dra. Amanda', cidade: 'Divisa de Itapevi e Cotia', gratuito: false, servicos: 'Preços populares: castração (cerca de R$ 120), vacinação e cirurgias.', requisitos: '', endereco: '', whatsapp: '5511930478386', telefone: '', site: '' }
  ];

  var P = modo === 'servidor' ? ponteServidor() : ponteDemo();

  /* ---------- Cache simples de leituras ---------- */
  var cache = {};
  function limpa(t) { for (var k in cache) { if (k.indexOf(t + '|') === 0) { delete cache[k]; } } }
  function listar(t, f, fresco) {
    var k = t + '|' + JSON.stringify(f || {});
    if (!fresco && cache[k]) { return cache[k]; }
    cache[k] = P.sel(t, f).catch(function (e) { delete cache[k]; falha(e); });
    return cache[k];
  }
  function um(t, id) {
    if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(String(id || ''))) { return Promise.resolve(null); }
    return listar(t, { eq: { id: id } }).then(function (r) { return r[0] || null; });
  }
  function criar(t, row) { return P.ins(t, row).then(function () { limpa(t); }, falha); }
  function atualizar(t, id, patch) { return P.upd(t, id, patch).then(function () { limpa(t); }, falha); }
  function apagar(t, id) { return P.del(t, id).then(function () { limpa(t); }, falha); }

  /* ---------- Sessão ---------- */
  var perfil = null;
  function carregarPerfil() {
    return P.auth.atual().then(function (u) {
      if (!u) { perfil = null; return null; }
      return P.sel('perfis', { eq: { id: u.id } }).then(function (r) { perfil = r[0] || null; return perfil; });
    }).catch(function () { perfil = null; return null; });
  }
  function aposMudarSessao() { cache = {}; return carregarPerfil(); }

  /* ---------- Fotos: reduz no aparelho antes de enviar ---------- */
  function reduzir(arquivo, lado, qualidade) {
    return new Promise(function (ok, erro) {
      var url = URL.createObjectURL(arquivo), img = new Image();
      img.onload = function () {
        var e = Math.min(1, lado / Math.max(img.width, img.height));
        var c = document.createElement('canvas');
        c.width = Math.round(img.width * e); c.height = Math.round(img.height * e);
        c.getContext('2d').drawImage(img, 0, 0, c.width, c.height);
        URL.revokeObjectURL(url);
        ok(c.toDataURL('image/jpeg', qualidade));
      };
      img.onerror = function () { URL.revokeObjectURL(url); erro(new Error('Não foi possível ler esta imagem.')); };
      img.src = url;
    });
  }
  var fotoCache = {};
  function enviarFoto(arquivo, publica) {
    var id = uuid(), mini, dados;
    return reduzir(arquivo, 360, 0.7).then(function (m) { mini = m; return reduzir(arquivo, 1080, 0.72); }).then(function (d) {
      dados = d;
      var dono = perfil ? perfil.id : null;
      return P.ins('fotos', { id: id, dono: dono, publica: publica !== false && !!dono, miniatura: mini, dados: dados });
    }).then(function () { fotoCache[id + 'm'] = mini; fotoCache[id] = dados; return id; }, falha);
  }
  function fotos(ids, mini) {
    var falta = ids.filter(function (id) { return id && !fotoCache[id + (mini ? 'm' : '')]; });
    var p = falta.length ? P.sel('fotos', { cols: mini ? 'id,miniatura' : 'id,dados', in: { id: falta } }).then(function (rows) {
      rows.forEach(function (r) { if (mini) { fotoCache[r.id + 'm'] = r.miniatura; } else { fotoCache[r.id] = r.dados; fotoCache[r.id + 'm'] = fotoCache[r.id + 'm'] || r.miniatura; } });
    }) : Promise.resolve();
    return p.then(function () { var o = {}; ids.forEach(function (id) { o[id] = fotoCache[id + (mini ? 'm' : '')] || null; }); return o; }, function () { return {}; });
  }

  /* ---------- Configurações ---------- */
  var config = null;
  function carregarConfig(fresco) {
    return listar('config', null, fresco).then(function (rows) {
      config = {};
      rows.forEach(function (r) { config[r.chave] = r.valor; });
      return config;
    });
  }
  function num(chave, padrao) { var n = Number(String((config || {})[chave] || '').replace(',', '.')); return isNaN(n) || !n ? padrao : n; }

  /* ---------- Pagamentos ---------- */
  function criarPagamento(tipo, ref, valor) {
    var id = uuid(), codigo = codigoCurto();
    if (tipo === 'anuncio') { valor = num('valor_anuncio', 20); }
    if (tipo === 'denuncia') { valor = num('valor_denuncia', 5); }
    var row = { id: id, codigo: codigo, usuario: perfil ? perfil.id : null, tipo: tipo, ref: ref || null, valor: Number(valor) };
    return criar('pagamentos', row).then(function () { return row; });
  }

  /* ---------- Acessos ---------- */
  function registrarAcesso() {
    var k = 'apac.dispositivo', id;
    try { id = localStorage.getItem(k); if (!id) { id = uuid(); localStorage.setItem(k, id); } } catch (e) { id = uuid(); }
    var dia = hoje(), marca = 'apac.acesso.' + dia;
    try { if (localStorage.getItem(marca)) { return; } } catch (e) { /* segue */ }
    P.ins('acessos', { dia: dia, dispositivo: id }).then(ok, function (e) { if (/duplicate/i.test(String(e && e.message))) { ok(); } });
    function ok() { try { localStorage.setItem(marca, '1'); } catch (e) { /* sem armazenamento */ } }
  }

  return {
    modo: modo,
    uuid: uuid, hoje: hoje, somaDias: somaDias,
    iniciar: function () { registrarAcesso(); return Promise.all([carregarPerfil(), carregarConfig().catch(function () { config = {}; })]); },
    usuario: function () { return perfil; },
    ehAdmin: function () { return !!(perfil && perfil.papel === 'admin'); },
    cadastrar: function (d) { return P.auth.cadastrar(d).then(function (r) { return aposMudarSessao().then(function () { return r; }); }, falha); },
    entrar: function (email, senha) { return P.auth.entrar(email, senha).then(aposMudarSessao, falha); },
    entrarAdminDemo: function () { return P.auth.entrarAdminDemo().then(aposMudarSessao); },
    sair: function () { return P.auth.sair().then(function () { perfil = null; cache = {}; }); },
    recuperar: function (email) { return P.auth.recuperar(email).catch(falha); },
    redefinir: function (email, codigo, senha) { return P.auth.redefinir(email, codigo, senha).then(aposMudarSessao, falha); },
    atualizarPerfil: function (patch) {
      return P.upd('perfis', perfil.id, patch).then(function () { for (var k in patch) { perfil[k] = patch[k]; } limpa('perfis'); }, falha);
    },
    excluirConta: function () { return P.rpc('excluir_minha_conta').then(function () { return P.auth.sair(); }).then(function () { perfil = null; cache = {}; }, falha); },
    config: function () { return config || {}; },
    num: num,
    carregarConfig: carregarConfig,
    salvarConfig: function (valores) {
      var ps = Object.keys(valores).map(function (k) { return P.upsertConfig(k, valores[k]); });
      return Promise.all(ps).then(function () { limpa('config'); return carregarConfig(true); }, falha);
    },
    listar: listar, um: um, criar: criar, atualizar: atualizar, apagar: apagar,
    rpc: function (n, a) { return P.rpc(n, a).catch(falha); },
    confirmarPagamento: function (id) {
      return P.rpc('confirmar_pagamento', { p_id: id }).then(function () { ['pagamentos', 'animais', 'denuncias', 'apoios_mensais', 'metas'].forEach(limpa); }, falha);
    },
    criarPagamento: criarPagamento,
    enviarFoto: enviarFoto, fotos: fotos,
    erroAmigavel: erroAmigavel,
    limparCache: function () { cache = {}; }
  };
})();
