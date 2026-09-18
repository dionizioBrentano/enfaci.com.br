import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import type { NavNode } from '../types/navigation';
import {
  getTrail,
  getFocusAndOtherBranches,
  getComposedDescription,
  hrefToRoute,
} from '../utils/navigation';

export interface MenuPanelProps {
  isOpen: boolean;
  onClose: () => void;
  tree: NavNode[];
  currentPath: number[];
  onNavigateContext: (path: number[]) => void;
  onSelectRoute: (route: string) => void;
  triggerRef?: React.RefObject<HTMLButtonElement | null>;
  authed: boolean;
  onLogout: () => void;
}

/**
 * Ícones clínicos inline em SVG com traço de 2px, pontas arredondadas e 19x19px,
 * conforme o padrão do design system.
 */
function renderClinicalIcon(label: string) {
  const l = label.toLowerCase();

  // Curativo diverso / ferida operatória
  if (l.includes('curativo diverso') || l.includes('curativos')) {
    return (
      <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2.5" y="8.5" width="19" height="7" rx="3.5" transform="rotate(-45 12 12)" />
        <path d="M9.5 9.5 14.5 14.5" />
      </svg>
    );
  }
  // Ferida operatória
  if (l.includes('operat')) {
    return (
      <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 14c4-6 12-6 16 0" />
        <path d="M8 14v4M12 12v6M16 14v4" />
      </svg>
    );
  }
  // Ferida infectada / atenção
  if (l.includes('infect') || l.includes('coloniz')) {
    return (
      <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="8" />
        <path d="M12 8v5M12 16h.01" />
      </svg>
    );
  }
  // Retirada de pontos
  if (l.includes('ponto') || l.includes('sutur')) {
    return (
      <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="m6 6 12 12M6 18 18 6" />
        <circle cx="12" cy="12" r="9" />
      </svg>
    );
  }
  // Lesão por pressão / paciente
  if (l.includes('press') || l.includes('lpp')) {
    return (
      <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M5 18c2-8 12-8 14 0" />
        <circle cx="12" cy="9" r="2.5" />
      </svg>
    );
  }
  // Pé diabético
  if (l.includes('pé') || l.includes('diab')) {
    return (
      <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M7 20c-2-3-2-7 1-9l7-5c2-1 4 1 3 3l-3 6" />
        <path d="M12 15h6" />
      </svg>
    );
  }
  // Curativo a vácuo / aparelho
  if (l.includes('vácuo') || l.includes('vacuo')) {
    return (
      <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="4" y="9" width="12" height="9" rx="2" />
        <path d="M16 12h3a2 2 0 0 1 0 4h-3" />
        <path d="M8 9V6" />
      </svg>
    );
  }
  // Medicamentos / Injetáveis
  if (l.includes('medicamento') || l.includes('injet') || l.includes('aplic')) {
    return (
      <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="m18 2 4 4" />
        <path d="m17 7 3-3" />
        <path d="M19 9 8.7 19.3c-.4.4-1 .6-1.6.6H3v-4.1c0-.6.2-1.2.6-1.6L13.9 4" />
        <path d="m9 11 4 4" />
      </svg>
    );
  }
  // Soroterapia
  if (l.includes('soro')) {
    return (
      <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2.7 6.4 10.3A7.5 7.5 0 1 0 17.6 10.3L12 2.7Z" />
      </svg>
    );
  }
  // Vias aéreas / Nebulização / Oxigenoterapia
  if (l.includes('aére') || l.includes('nebuliz') || l.includes('oxigen') || l.includes('nasal')) {
    return (
      <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M7 13a4 4 0 0 0 4-4V4H9a4 4 0 0 0-4 4v5" />
        <path d="M17 13a4 4 0 0 1-4-4V4h2a4 4 0 0 1 4 4v5" />
        <path d="M12 4v16" />
      </svg>
    );
  }
  // Sondas / Eliminações / Drenos
  if (l.includes('sonda') || l.includes('dreno') || l.includes('elimin') || l.includes('vesical')) {
    return (
      <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 3v6a6 6 0 0 0 12 0V3" />
        <path d="M12 9v12" />
      </svg>
    );
  }
  // Consulta / Avaliação / Evolução
  if (l.includes('consult') || l.includes('evolu') || l.includes('prestado')) {
    return (
      <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
        <rect x="8" y="2" width="8" height="4" rx="1" />
        <path d="M9 12h6M9 16h6" />
      </svg>
    );
  }
  // Home care / Equipe / Contato
  if (l.includes('home') || l.includes('equipe') || l.includes('pessoal') || l.includes('contat')) {
    return (
      <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
        <polyline points="9 22 9 12 15 12 15 22" />
      </svg>
    );
  }

  // Padrão: Cruz clínica da enfermagem
  return (
    <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}

export const MenuPanel: React.FC<MenuPanelProps> = ({
  isOpen,
  onClose,
  tree,
  currentPath,
  onNavigateContext,
  onSelectRoute,
  triggerRef,
  authed,
  onLogout,
}) => {
  const panelRef = useRef<HTMLElement>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);

  // 1. Trava a rolagem do body enquanto aberto
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // 2. Tecla Escape para fechar
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // 3. Foco inicial e devolução do foco ao hambúrguer ao fechar
  useEffect(() => {
    if (isOpen) {
      // Foca no botão de fechar ao abrir
      closeBtnRef.current?.focus();
    } else {
      // Devolve o foco ao botão que disparou a abertura
      triggerRef?.current?.focus();
    }
  }, [isOpen, triggerRef]);

  // 4. Focus Trap dentro do painel
  const handlePanelKeyDown = (e: React.KeyboardEvent<HTMLElement>) => {
    if (e.key !== 'Tab' || !panelRef.current) return;

    const focusables = panelRef.current.querySelectorAll<HTMLElement>(
      'button:not([disabled]), [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    if (focusables.length === 0) return;

    const firstElement = focusables[0];
    const lastElement = focusables[focusables.length - 1];

    if (e.shiftKey) {
      if (document.activeElement === firstElement) {
        e.preventDefault();
        lastElement.focus();
      }
    } else {
      if (document.activeElement === lastElement) {
        e.preventDefault();
        firstElement.focus();
      }
    }
  };

  const trail = getTrail(tree, currentPath);
  const {
    effectiveFocusPath,
    focusLabel,
    focusItems,
    activeChildIndex,
    otherBranches,
  } = getFocusAndOtherBranches(tree, currentPath);

  return (
    <>
      {/* Backdrop com clique para fechar */}
      <div
        className={`menu-backdrop ${isOpen ? 'is-open' : ''}`}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Painel em tela cheia deslizando da esquerda */}
      <aside
        ref={panelRef}
        className={`menu-panel ${isOpen ? 'is-open' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-label="Menu de navegação"
        onKeyDown={handlePanelKeyDown}
      >
        {/* Cabeçalho do menu com as 3 linhas obrigatórias da marca */}
        <div className="menu-header">
          <span className="brand-lockup">
            <img
              src="/logo-enfaci-enfermagem-assistencial-cuidado-integral-letras.png"
              alt="Enfaci"
            />
            <span className="logo-text-col">
              <span className="brand-sub">Enfermagem Assistencial de Cuidado Integral</span>
              <span className="logo-responsavel">
                Resp. Técnico: Enf. Dionizio Brentano - COREN/RS 734.282
              </span>
            </span>
          </span>
          <button
            ref={closeBtnRef}
            type="button"
            className="menu-close"
            aria-label="Fechar menu"
            onClick={onClose}
          >
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              aria-hidden="true"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Corpo do menu com os três blocos */}
        <div className="menu-body">
          {/* 1. Trilha (menu-trail): onde o paciente está, com cada nível tocável */}
          <nav className="menu-trail" aria-label="Você está em">
            {trail.map((item, idx) => {
              if (item.isCurrent) {
                return (
                  <span key={item.label} aria-current="page">
                    {item.label}
                  </span>
                );
              }
              return (
                <button
                  key={item.label}
                  type="button"
                  className={idx === 0 ? 'menu-trail-root' : undefined}
                  onClick={() => onNavigateContext(item.path)}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* 2. Ramo em foco (menu-focus): aberto por inteiro */}
          <div className="menu-focus">
            <span className="menu-section-label">{focusLabel}</span>

            {focusItems.map((item, idx) => {
              const isItemActive = activeChildIndex === idx;
              const hasSubmenu = item.submenu && item.submenu.length > 0;
              const description = getComposedDescription(item);

              const handleItemClick = (e: React.MouseEvent) => {
                if (hasSubmenu) {
                  e.preventDefault();
                  // Avança na árvore mantendo o menu aberto
                  onNavigateContext([...effectiveFocusPath, idx]);
                } else {
                  // Folha: navega para a rota e fecha o menu
                  e.preventDefault();
                  onSelectRoute(hrefToRoute(item.href));
                  onClose();
                }
              };

              return (
                <a
                  key={item.label}
                  href={hrefToRoute(item.href)}
                  onClick={handleItemClick}
                  className="menu-link"
                  aria-current={isItemActive ? 'page' : undefined}
                >
                  <span className="menu-link-icon" aria-hidden="true">
                    {renderClinicalIcon(item.label)}
                  </span>
                  <span className="menu-link-text">
                    <span className="menu-link-title">{item.label}</span>
                    {description && (
                      <span className="menu-link-desc">{description}</span>
                    )}
                  </span>
                </a>
              );
            })}
          </div>

          {/* 3. Outros ramos (menu-other): uma linha de 44px cada. Tocar troca o contexto */}
          {otherBranches.length > 0 && (
            <>
              <span className="menu-section-label">Ir para</span>

              {otherBranches.map((branch) => (
                <button
                  key={branch.label}
                  type="button"
                  className="menu-other"
                  onClick={() => onNavigateContext(branch.path)}
                >
                  {branch.label}
                  {branch.count !== undefined && branch.count > 0 && (
                    <span className="menu-other-count">{branch.count}</span>
                  )}
                </button>
              ))}
            </>
          )}
        </div>

        {/* Rodapé fixo do menu (menu-footer) */}
        <div className="menu-footer">
          <div style={{ display: 'flex', justifyContent: 'center', gap: 'var(--space-4)', paddingBottom: 'var(--space-1)' }}>
            <a href="/#sobre" onClick={onClose} style={{ fontSize: '14px', color: 'var(--text-muted)', fontWeight: 500 }}>Sobre</a>
            <span style={{ color: 'var(--text-muted)', opacity: 0.5 }}>·</span>
            <a href="/#ajuda" onClick={onClose} style={{ fontSize: '14px', color: 'var(--text-muted)', fontWeight: 500 }}>Ajuda</a>
            <span style={{ color: 'var(--text-muted)', opacity: 0.5 }}>·</span>
            <a href="/#contato" onClick={onClose} style={{ fontSize: '14px', color: 'var(--text-muted)', fontWeight: 500 }}>Contato</a>
          </div>

          {authed ? (
            <button
              type="button"
              className="btn-primary"
              onClick={() => {
                onLogout();
                onClose();
              }}
            >
              Sair da conta
            </button>
          ) : (
            <Link
              to="/login"
              className="btn-primary"
              onClick={onClose}
            >
              Entrar ou cadastrar
            </Link>
          )}
        </div>
      </aside>
    </>
  );
};
