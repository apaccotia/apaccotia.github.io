'use strict';
/* Código Pix "copia e cola" (BR Code estático) com valor e identificador, conforme o manual do Banco Central. */
var Pix = (function () {
  function semAcento(s) {
    return String(s || '').normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^A-Za-z0-9 .\-]/g, '').toUpperCase();
  }
  function campo(id, valor) {
    var v = String(valor);
    return id + (v.length < 10 ? '0' : '') + v.length + v;
  }
  function crc16(s) {
    var crc = 0xFFFF;
    for (var i = 0; i < s.length; i++) {
      crc ^= s.charCodeAt(i) << 8;
      for (var j = 0; j < 8; j++) {
        crc = (crc & 0x8000) ? ((crc << 1) ^ 0x1021) : (crc << 1);
        crc &= 0xFFFF;
      }
    }
    return ('000' + crc.toString(16).toUpperCase()).slice(-4);
  }
  function chaveLimpa(chave) {
    var k = String(chave || '').trim();
    if (/^[\d.\-\/ ]+$/.test(k)) { return k.replace(/\D/g, ''); }
    return k;
  }
  /* opts: { chave, nome, cidade, valor, txid } */
  function codigo(opts) {
    var conta = campo('00', 'br.gov.bcb.pix') + campo('01', chaveLimpa(opts.chave));
    var txid = String(opts.txid || '***').replace(/[^A-Za-z0-9]/g, '').slice(0, 25) || '***';
    var p = campo('00', '01') + campo('26', conta) + campo('52', '0000') + campo('53', '986');
    if (opts.valor) { p += campo('54', Number(opts.valor).toFixed(2)); }
    p += campo('58', 'BR') + campo('59', semAcento(opts.nome).slice(0, 25) || 'APAC') + campo('60', semAcento(opts.cidade).slice(0, 15) || 'COTIA');
    p += campo('62', campo('05', txid)) + '6304';
    return p + crc16(p);
  }
  function qrSvg(texto) {
    if (typeof qrcode !== 'function') { return ''; }
    var q = qrcode(0, 'M');
    q.addData(texto);
    q.make();
    return q.createSvgTag({ cellSize: 4, margin: 0, scalable: true });
  }
  return { codigo: codigo, crc16: crc16, qrSvg: qrSvg };
})();
