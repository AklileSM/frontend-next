'use client';

import { useEffect } from 'react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // eslint-disable-next-line no-console
    console.error('[GlobalError]', error, 'digest=', error.digest);
  }, [error]);

  return (
    <html lang="en">
      <body
        style={{
          background: '#0d1117',
          color: '#E6EDF3',
          fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
          padding: '24px',
          margin: 0,
          minHeight: '100vh',
        }}
      >
        <h1 style={{ color: '#f59e0b', fontSize: 18, marginBottom: 12 }}>
          Frontend crashed during render/hydration
        </h1>
        <div style={{ marginBottom: 8 }}>
          <strong>name:</strong> {error.name}
        </div>
        <div style={{ marginBottom: 8 }}>
          <strong>message:</strong> {error.message}
        </div>
        {error.digest && (
          <div style={{ marginBottom: 8 }}>
            <strong>digest:</strong> {error.digest}
          </div>
        )}
        <pre
          style={{
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word',
            background: '#161B22',
            border: '1px solid #30363D',
            padding: 12,
            borderRadius: 6,
            fontSize: 12,
            lineHeight: 1.5,
            overflow: 'auto',
          }}
        >
          {error.stack || '(no stack)'}
        </pre>
        <button
          onClick={() => reset()}
          style={{
            marginTop: 16,
            background: '#f59e0b',
            color: '#0d1117',
            border: 0,
            padding: '8px 16px',
            borderRadius: 4,
            cursor: 'pointer',
            fontWeight: 600,
          }}
        >
          retry
        </button>
      </body>
    </html>
  );
}
