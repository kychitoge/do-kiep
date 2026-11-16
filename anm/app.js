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
    outputBox: $('outputBox'),
    cipherTable: $('cipherTable')
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
    const steps = [];

    for (const ch of prepared) {
      const upper = ch.toUpperCase();
      if (upper >= 'A' && upper <= 'Z') {
        const inCode = upper.charCodeAt(0) - 65;
        const keyChar = key[keyIdx % key.length];
        const k = keyChar.charCodeAt(0) - 65;
        const outCode = mode === 'encrypt' ? (inCode + k) % 26 : (inCode - k + 26) % 26;
        const outChar = ALPHABET[outCode];
        output += outChar;

        const isEncrypt = mode === 'encrypt';
        steps.push({
          isLetter: true,
          pChar: isEncrypt ? upper : outChar,
          pNum: isEncrypt ? inCode : outCode,
          kChar: keyChar,
          kNum: k,
          cChar: isEncrypt ? outChar : upper,
          cNum: isEncrypt ? outCode : inCode
        });
        keyIdx++;
      } else {
        output += ch;
        steps.push({
          isLetter: false,
          displayChar: ch === ' ' ? '·' : ch
        });
      }
    }

    return { output, isFallbackKey: cleanKey.length === 0, steps };
  };

  const createCell = (tag, className, text) => {
    const cell = document.createElement(tag);
    if (className) cell.className = className;
    if (text !== undefined) cell.textContent = text;
    return cell;
  };

  const createStepCell = (charText, numText, extraClass) => {
    const td = document.createElement('td');
    if (extraClass) td.className = extraClass;

    const charSpan = document.createElement('span');
    charSpan.className = 'cell-char';
    charSpan.textContent = charText;
    td.appendChild(charSpan);

    if (numText !== null && numText !== undefined) {
      const numSpan = document.createElement('span');
      numSpan.className = 'cell-num';
      numSpan.textContent = String(numText);
      td.appendChild(numSpan);
    }

    return td;
  };

  const renderTable = (steps) => {
    const table = el.cipherTable;
    table.replaceChildren();

    const thead = document.createElement('thead');
    const headRow = document.createElement('tr');
    headRow.appendChild(createCell('th', 'row-head', 'Chỉ số'));

    const tbody = document.createElement('tbody');
    const pRow = document.createElement('tr');
    pRow.appendChild(createCell('th', 'row-head', 'Bản rõ P'));

    const kRow = document.createElement('tr');
    kRow.appendChild(createCell('th', 'row-head', 'Từ khóa K'));

    const cRow = document.createElement('tr');
    cRow.appendChild(createCell('th', 'row-head', 'Bản mã C'));

    steps.forEach((step, idx) => {
      const activeClass = idx === 0 ? 'cell-active' : '';
      headRow.appendChild(createCell('th', activeClass, String(idx)));

      if (step.isLetter) {
        pRow.appendChild(createStepCell(step.pChar, step.pNum, activeClass));
        kRow.appendChild(createStepCell(step.kChar, step.kNum, activeClass));
        cRow.appendChild(createStepCell(step.cChar, step.cNum, activeClass));
      } else {
        const mutedClass = activeClass ? `${activeClass} cell-muted` : 'cell-muted';
        pRow.appendChild(createCell('td', mutedClass, step.displayChar));
        kRow.appendChild(createCell('td', mutedClass, '—'));
        cRow.appendChild(createCell('td', mutedClass, step.displayChar));
      }
    });

    thead.appendChild(headRow);
    tbody.append(pRow, kRow, cRow);
    table.append(thead, tbody);
  };

  const run = (mode) => {
    const { output, isFallbackKey, steps } = transformVigenere(
      el.textInput.value,
      el.keyInput.value,
      mode
    );

    el.keyHint.textContent = isFallbackKey
      ? 'Đang dùng khóa mặc định A cho đến khi bạn nhập từ khóa.'
      : 'Chỉ giữ lại chữ cái A–Z.';

    el.outputBox.value = output;
    renderTable(steps);
  };

  el.keyInput.addEventListener('input', (e) => {
    e.target.value = sanitizeKey(e.target.value);
  });

  el.btnEncrypt.addEventListener('click', () => run('encrypt'));
  el.btnDecrypt.addEventListener('click', () => run('decrypt'));

  run('encrypt');
})();
