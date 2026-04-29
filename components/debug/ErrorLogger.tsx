'use client';

import { useEffect } from 'react';

const REACT_ERROR_BASE = 'https://react.dev/errors/';

async function decodeReactError(code: string, args: string[]): Promise<string | null> {
  try {
    const res = await fetch(`${REACT_ERROR_BASE}${code}.json`, { cache: 'force-cache' });
    if (!res.ok) return null;
    const data = (await res.json()) as { message?: string };
    if (!data.message) return null;
    let i = 0;
    return data.message.replace(/%s/g, () => args[i++] ?? '');
  } catch {
    return null;
  }
}

function summarizeDom(): string {
  if (typeof document === 'undefined') return '';
  const html = document.documentElement;
  const body = document.body;
  const attrs = (el: Element | null) =>
    el
      ? Array.from(el.attributes)
          .map((a) => `${a.name}="${a.value}"`)
          .join(' ')
      : '(none)';
  return [
    `html#children=${html?.children.length ?? 0} attrs=[${attrs(html)}]`,
    `body#children=${body?.children.length ?? 0} attrs=[${attrs(body)}]`,
    `head#children=${document.head?.children.length ?? 0}`,
  ].join(' | ');
}

export function ErrorLogger() {
  useEffect(() => {
    const tag = '[ErrorLogger]';
    // eslint-disable-next-line no-console
    console.info(`${tag} installed. UA=${navigator.userAgent}`);
    // eslint-disable-next-line no-console
    console.info(`${tag} initial DOM: ${summarizeDom()}`);

    const origConsoleError = console.error;
    console.error = (...args: unknown[]) => {
      origConsoleError.apply(console, args);
      try {
        const first = args[0];
        if (typeof first === 'string') {
          const match = first.match(/Minified React error #(\d+)/);
          if (match) {
            const code = match[1];
            const passed = args.slice(1).map((a) => String(a));
            void decodeReactError(code, passed).then((msg) => {
              if (msg) {
                origConsoleError.call(
                  console,
                  `${tag} React #${code} decoded:\n${msg}\nDOM at error: ${summarizeDom()}`,
                );
              } else {
                origConsoleError.call(
                  console,
                  `${tag} React #${code} (decode failed). See ${REACT_ERROR_BASE}${code}`,
                );
              }
            });
          }
        }
      } catch (e) {
        origConsoleError.call(console, `${tag} interceptor failed`, e);
      }
    };

    const onError = (e: ErrorEvent) => {
      origConsoleError.call(
        console,
        `${tag} window.onerror: ${e.message} @ ${e.filename}:${e.lineno}:${e.colno}`,
        e.error,
        `\nDOM: ${summarizeDom()}`,
      );
    };
    const onRejection = (e: PromiseRejectionEvent) => {
      origConsoleError.call(console, `${tag} unhandledrejection:`, e.reason);
    };
    window.addEventListener('error', onError);
    window.addEventListener('unhandledrejection', onRejection);

    return () => {
      console.error = origConsoleError;
      window.removeEventListener('error', onError);
      window.removeEventListener('unhandledrejection', onRejection);
    };
  }, []);

  return null;
}
