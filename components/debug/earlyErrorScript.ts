// Inline script body — runs synchronously at HTML parse time, before any
// React/Next bundle. Captures errors during hydration (when no useEffect can
// fire), decodes minified React error codes, persists every capture to
// localStorage so it survives the React recovery + reload cycle, and pins a
// banner directly to <html> (outside React's reconciliation root in <body>)
// so the message stays visible even if React rips out the body subtree.

const REACT_ERROR_TABLE: Record<string, string> = {
  '418':
    'Hydration failed because the server rendered HTML did not match the client. SSR and CSR produced different output for this subtree. Common causes: typeof window branches, Date.now()/Math.random(), locale-dependent date formatting, browser extensions injecting attributes.',
  '419':
    'Server rendering aborted due to an error during a Suspense boundary fallback.',
  '421':
    'Hydration was attempted but the server rendered HTML was empty for this boundary.',
  '422':
    'Hydration could not recover by switching to client rendering because an error happened in a parent Suspense boundary.',
  '423':
    'There was an error while hydrating but React was able to recover by switching to client rendering. The whole root will be regenerated on the client.',
  '425':
    'Text content does not match server-rendered HTML.',
};

export const EARLY_ERROR_SCRIPT = `
(function () {
  if (typeof window === 'undefined') return;
  if (window.__siteScopeEarlyErrorInstalled) return;
  window.__siteScopeEarlyErrorInstalled = true;

  var STORAGE_KEY = '__sitescope_errors';
  var TAG = '[EarlyError]';
  var TABLE = ${JSON.stringify(REACT_ERROR_TABLE)};

  function loadStored() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch (_) { return []; }
  }
  function persist(list) {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(list.slice(-30))); } catch (_) {}
  }

  var captures = loadStored();
  window.__siteScopeErrorBuffer = captures;

  function summarizeDom() {
    try {
      var html = document.documentElement;
      var body = document.body;
      function attrs(n) {
        if (!n) return '(none)';
        var out = [];
        for (var i = 0; i < n.attributes.length; i++) {
          out.push(n.attributes[i].name + '=' + JSON.stringify(n.attributes[i].value));
        }
        return out.length ? out.join(' ') : '(no attrs)';
      }
      return 'html.children=' + (html ? html.children.length : 0)
        + ' html.attrs=[' + attrs(html) + ']'
        + ' | body.children=' + (body ? body.children.length : 0)
        + ' body.attrs=[' + attrs(body) + ']'
        + ' | head.children=' + (document.head ? document.head.children.length : 0);
    } catch (e) { return '(dom-summary-failed: ' + e + ')'; }
  }

  function ensureBanner() {
    var el = document.getElementById('__sitescope_error_banner');
    if (el && el.isConnected) return el;
    var root = document.documentElement;
    if (!root) return null;
    el = document.createElement('div');
    el.id = '__sitescope_error_banner';
    el.setAttribute('data-sitescope', 'error-banner');
    el.style.cssText = [
      'position:fixed','top:0','left:0','right:0','z-index:2147483647',
      'background:#7f1d1d','color:#fef2f2',
      'font:12px/1.45 ui-monospace,Menlo,monospace',
      'padding:10px 14px','max-height:60vh','overflow:auto',
      'border-bottom:2px solid #f59e0b','white-space:pre-wrap','word-break:break-word',
      'pointer-events:auto'
    ].join(';');
    // Append to documentElement (sibling of head/body) so React's body-tree
    // reconciliation cannot delete it.
    root.appendChild(el);
    return el;
  }

  function render() {
    try {
      var el = ensureBanner();
      if (!el) return;
      var header = TAG + ' ' + captures.length + ' capture(s) — newest first. ';
      header += '(stored in localStorage["' + STORAGE_KEY + '"]; click to copy)\\n\\n';
      var body = captures.slice().reverse().map(function (c, idx) {
        return '#' + (captures.length - idx) + ' [' + c.kind + '] ' + (c.title || '')
          + (c.detail ? '\\n' + c.detail : '')
          + (c.dom ? '\\nDOM: ' + c.dom : '')
          + (c.stack ? '\\n' + c.stack : '');
      }).join('\\n────────\\n');
      el.textContent = header + body;
      el.onclick = function () {
        try { navigator.clipboard.writeText(el.textContent || ''); } catch (_) {}
      };
    } catch (_) {}
  }

  function capture(kind, title, detail, stack) {
    var entry = {
      kind: kind,
      title: title,
      detail: detail || '',
      stack: stack || '',
      dom: summarizeDom(),
      t: new Date().toISOString(),
      url: location.href
    };
    captures.push(entry);
    persist(captures);
    render();
  }

  // Boot marker so we know the script ran even if no errors fire.
  capture('boot', 'Early error logger installed', 'UA=' + navigator.userAgent, '');

  var origError = console.error;
  console.error = function () {
    try {
      var first = arguments[0];
      if (typeof first === 'string') {
        var m = first.match(/Minified React error #(\\d+)/);
        if (m) {
          var code = m[1];
          var args = [];
          for (var i = 1; i < arguments.length; i++) {
            try { args.push(typeof arguments[i] === 'object' ? JSON.stringify(arguments[i]) : String(arguments[i])); }
            catch (_) { args.push('[unstringifiable]'); }
          }
          var decoded = TABLE[code] || '(no local decode for #' + code + '; see https://react.dev/errors/' + code + ')';
          capture('react#' + code, decoded, 'raw: ' + first + (args.length ? ' | args=' + args.join(', ') : ''), '');
        } else if (/hydrat|did not match|server.rendered|Text content/i.test(first)) {
          var dargs = [];
          for (var j = 1; j < arguments.length; j++) {
            try { dargs.push(String(arguments[j])); } catch (_) {}
          }
          capture('hydration', first, dargs.join(' | '), '');
        } else if (first && first.indexOf && first.indexOf('Warning:') === 0) {
          capture('react-warning', first.split('\\n')[0], first, '');
        }
      } else if (first && first.message) {
        capture('console.error', first.message, '', first.stack || '');
      }
    } catch (_) {}
    return origError.apply(console, arguments);
  };

  window.addEventListener('error', function (e) {
    capture(
      'window.error',
      e.message || '(no message)',
      'at ' + (e.filename || '?') + ':' + (e.lineno || '?') + ':' + (e.colno || '?'),
      e.error && e.error.stack ? e.error.stack : ''
    );
  }, true);

  window.addEventListener('unhandledrejection', function (e) {
    var r = e.reason || {};
    capture(
      'unhandledrejection',
      r.message ? r.message : String(r),
      '',
      r.stack || ''
    );
  });

  // Re-render the banner whenever the body is mutated, so React tear-downs
  // don't leave the page looking blank without context.
  try {
    var mo = new MutationObserver(function () { render(); });
    mo.observe(document.documentElement, { childList: true, subtree: false });
  } catch (_) {}
})();
`;
