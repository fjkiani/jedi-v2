import React from 'react';
import clsx from 'clsx';

export function Card({ children, className, ...rest }) {
  return (
    <div
      className={clsx(
        'rounded-2xl border border-n-6 bg-n-7/70 backdrop-blur-sm',
        'shadow-[inset_0_1px_0_0_rgba(255,255,255,0.03)]',
        className
      )}
      {...rest}
    >
      {children}
    </div>
  );
}

export function CardHeader({ title, subtitle, right, className }) {
  return (
    <div className={clsx('flex items-start justify-between gap-3 px-4 pt-4 pb-3 border-b border-n-6/60', className)}>
      <div className="min-w-0">
        <h3 className="text-sm font-semibold text-n-1 tracking-tight">{title}</h3>
        {subtitle && <p className="text-xs text-n-3 mt-0.5">{subtitle}</p>}
      </div>
      {right && <div className="shrink-0 flex items-center gap-2">{right}</div>}
    </div>
  );
}

export function CardBody({ children, className }) {
  return <div className={clsx('p-4', className)}>{children}</div>;
}

export function Stat({ label, value, sublabel, tone = 'neutral' }) {
  const toneClass = {
    neutral: 'text-n-1',
    good: 'text-color-4',
    warn: 'text-color-2',
    bad: 'text-color-3',
    info: 'text-color-5',
  }[tone] || 'text-n-1';
  return (
    <div>
      <div className="text-[10px] uppercase tracking-wider text-n-3">{label}</div>
      <div className={clsx('text-2xl font-semibold mt-0.5', toneClass)}>{value}</div>
      {sublabel && <div className="text-[11px] text-n-3 mt-0.5">{sublabel}</div>}
    </div>
  );
}

export function Pill({ children, tone = 'neutral', className }) {
  const toneClass = {
    neutral: 'bg-n-6 text-n-2',
    good: 'bg-color-4/15 text-color-4 border border-color-4/25',
    warn: 'bg-color-2/15 text-color-2 border border-color-2/25',
    bad: 'bg-color-3/15 text-color-3 border border-color-3/25',
    info: 'bg-color-5/15 text-color-5 border border-color-5/25',
  }[tone] || 'bg-n-6 text-n-2';
  return (
    <span className={clsx('inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium', toneClass, className)}>
      {children}
    </span>
  );
}

export function Button({ children, tone = 'primary', size = 'sm', className, disabled, ...rest }) {
  const sizeClass = { sm: 'text-xs px-3 py-1.5', md: 'text-sm px-4 py-2' }[size];
  const toneClass = {
    primary: 'bg-color-5 hover:bg-color-5/80 text-white',
    secondary: 'bg-n-6 hover:bg-n-5 text-n-1',
    danger: 'bg-color-3 hover:bg-color-3/80 text-white',
    ghost: 'bg-transparent border border-n-6 hover:bg-n-7 text-n-2',
  }[tone];
  return (
    <button
      disabled={disabled}
      className={clsx(
        'inline-flex items-center gap-1 rounded-lg font-medium transition-colors disabled:opacity-40 disabled:cursor-not-allowed',
        sizeClass,
        toneClass,
        className
      )}
      {...rest}
    >
      {children}
    </button>
  );
}

export function Kbd({ children }) {
  return <kbd className="px-1.5 py-0.5 rounded border border-n-5 bg-n-8 text-[10px] font-mono text-n-2">{children}</kbd>;
}
