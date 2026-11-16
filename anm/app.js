'use strict';

(() => {
  const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

  const $ = (id) => document.getElementById(id);

  const el = {
    textInput: $('textInput'),
    keyInput: $('keyInput'),
    keyHint: $('keyHint'),
    btnEncrypt: $('btnEncrypt'),
    btnDecrypt: $('btnDecrypt'),
    outputBox: $('outputBox')
  };

  const stripDiacritics = (text) =>
    text
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/đ/g, 'd')
      .replace(/Đ/g, 'D');

  const sanitizeKey = (raw) =>
    stripDiacritics(raw || '')
      .toUpperCase()
      .replace(/[^A-Z]/g, '');

  const transformVigenere = (text, rawKey, mode) => {
    const cleanKey = sanitizeKey(rawKey);
    const key = cleanKey.length > 0 ? cleanKey : 'A';
    const prepared = stripDiacritics(text || '');
    let keyIdx = 0;
    let output = '';

    for (const ch of prepared) {
      const upper = ch.toUpperCase();
      if (upper >= 'A' && upper <= 'Z') {
        const p = upper.charCodeAt(0) - 65;
        const k = key[keyIdx % key.length].charCodeAt(0) - 65;
        const c = mode === 'encrypt' ? (p + k) % 26 : (p - k + 26) % 26;
        output += ALPHABET[c];
        keyIdx++;
      } else {
        output += ch;
      }
    }

    return { output, isFallbackKey: cleanKey.length === 0 };
  };

  const run = (mode) => {
    const { output, isFallbackKey } = transformVigenere(
      el.textInput.value,
      el.keyInput.value,
      mode
    );

    el.keyHint.textContent = isFallbackKey
      ? 'Đang dùng khóa mặc định A cho đến khi bạn nhập từ khóa.'
      : 'Chỉ giữ lại chữ cái A–Z.';

    el.outputBox.value = output;
  };

  el.keyInput.addEventListener('input', (e) => {
    e.target.value = sanitizeKey(e.target.value);
  });

  el.btnEncrypt.addEventListener('click', () => run('encrypt'));
  el.btnDecrypt.addEventListener('click', () => run('decrypt'));

  run('encrypt');
})();
