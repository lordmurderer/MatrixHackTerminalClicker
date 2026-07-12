  function t(key, replacements) {
    const lang = state && state.lang ? state.lang : 'es';
    const parts = key.split('.');
    let val = STRINGS[lang];
    for (const p of parts) {
      if (val == null) return '?' + key;
      val = val[p];
    }
    if (val == null) return '?' + key;
    if (replacements) {
      for (const [k, v] of Object.entries(replacements)) {
        val = val.replace('{' + k + '}', v);
      }
    }
    return val;
  }
  function formatNum(n) {
    if (n < 1000) return Math.floor(n) + '';
    var s = Math.floor(n);
    var units = ['', 'K', 'M', 'B', 'T', 'Qa', 'Qi'];
    var u = 0;
    while (s >= 1000 && u < units.length - 1) { s /= 1000; u++; }
    return (s < 10 ? s.toFixed(2) : s < 100 ? s.toFixed(1) : s.toFixed(0)) + units[u];
  }

  function formatData(n) {
    if (n < 1000) return Math.floor(n) + ' MB';
    var units = [' GB', ' TB', ' PB', ' EB', ' ZB', ' YB'];
    var u = -1;
    while (n >= 1000 && u < units.length - 1) { n /= 1000; u++; }
    var val = n < 10 ? n.toFixed(2) : n < 100 ? n.toFixed(1) : n.toFixed(0);
    return val + units[u];
  }
