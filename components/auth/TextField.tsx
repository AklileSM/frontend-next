'use client';

import { Eye, EyeOff } from 'lucide-react';
import { useState, type ChangeEvent, type InputHTMLAttributes } from 'react';

interface TextFieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  label: string;
  id: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  hint?: string;
  error?: string | null;
  passwordToggle?: boolean;
}

export function TextField({
  label,
  id,
  value,
  onChange,
  hint,
  error,
  passwordToggle,
  type = 'text',
  required,
  ...rest
}: TextFieldProps) {
  const [show, setShow] = useState(false);
  const effectiveType = passwordToggle ? (show ? 'text' : 'password') : type;

  return (
    <div>
      <label
        htmlFor={id}
        className="mb-1.5 flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.2em] text-[#8B949E]"
      >
        <span>
          {label}
          {required && <span className="ml-1 text-amber-500">*</span>}
        </span>
        {hint && <span className="text-[#484F58]">{hint}</span>}
      </label>
      <div className="relative">
        <input
          id={id}
          type={effectiveType}
          value={value}
          onChange={onChange}
          required={required}
          aria-invalid={!!error}
          className={`w-full rounded-md border bg-base-950/60 px-4 py-2.5 text-sm text-[#E6EDF3] outline-none transition-colors placeholder:text-[#484F58] ${
            error ? 'border-red-500/60 focus:border-red-500' : 'border-base-700 focus:border-amber-500'
          } ${passwordToggle ? 'pr-11' : ''}`}
          {...rest}
        />
        {passwordToggle && (
          <button
            type="button"
            onClick={() => setShow((v) => !v)}
            className="absolute inset-y-0 right-0 grid w-11 place-items-center text-[#8B949E] transition-colors hover:text-amber-500"
            aria-label={show ? 'Hide password' : 'Show password'}
            tabIndex={-1}
          >
            {show ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        )}
      </div>
      {error && <p className="mt-1.5 text-xs text-red-400">{error}</p>}
    </div>
  );
}
