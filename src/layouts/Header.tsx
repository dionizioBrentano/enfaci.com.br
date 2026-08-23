import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { ButterflyMark } from '@/components/ButterflyMark';

const NAV_ITEMS = [{ to: '/', label: 'Procedimentos', end: true }];

export function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-brand-100 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <Link to="/" className="flex items-center gap-2.5" onClick={() => setOpen(false)}>
          <ButterflyMark className="h-9 w-9 shrink-0" />
          <span className="flex flex-col leading-tight">
            <span className="text-lg font-bold tracking-tight text-brand-800">ENFACI</span>
            <span className="hidden text-[0.7rem] text-brand-600 sm:block">
              Procedimentos de Enfermagem
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 sm:flex" aria-label="Principal">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `rounded-full px-4 py-2 text-sm font-medium transition ${
                  isActive
                    ? 'bg-brand-700 text-white'
                    : 'text-brand-700 hover:bg-brand-50 hover:text-brand-800'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          aria-expanded={open}
          aria-controls="menu-mobile"
          aria-label={open ? 'Fechar menu' : 'Abrir menu'}
          className="rounded-lg p-2 text-brand-700 transition hover:bg-brand-50 sm:hidden"
        >
          <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth={2}>
            {open ? (
              <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
            ) : (
              <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />
            )}
          </svg>
        </button>
      </div>

      {open ? (
        <nav id="menu-mobile" className="border-t border-brand-100 bg-white sm:hidden" aria-label="Principal">
          <ul className="mx-auto max-w-6xl px-4 py-2">
            {NAV_ITEMS.map((item) => (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  end={item.end}
                  onClick={() => setOpen(false)}
                  className={({ isActive }) =>
                    `block rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                      isActive ? 'bg-brand-50 text-brand-800' : 'text-brand-700 hover:bg-brand-50'
                    }`
                  }
                >
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      ) : null}
    </header>
  );
}
