import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { isAuthenticated } from '../api/auth';
import type { HeaderContext } from '../types/navigation';

export interface AppHeaderProps {
  onOpenMenu: () => void;
  isMenuOpen: boolean;
  hamburgerRef?: React.RefObject<HTMLButtonElement | null>;
  context?: HeaderContext | null;
  authed?: boolean;
}

export const AppHeader: React.FC<AppHeaderProps> = ({
  onOpenMenu,
  isMenuOpen,
  hamburgerRef,
  context,
  authed: propAuthed,
}) => {
  const location = useLocation();
  const [isPinned, setIsPinned] = useState(false);
  const [activeMega, setActiveMega] = useState<'procedimentos' | 'servicos' | 'homecare' | null>(null);
  const authed = propAuthed !== undefined ? propAuthed : isAuthenticated();
  const navContainerRef = useRef<HTMLDivElement | null>(null);

  // Ao rolar mais de 40px (altura da top-bar), o cabeçalho fixa no topo
  useEffect(() => {
    const handleScroll = () => {
      const pinned = window.scrollY > 40;
      setIsPinned(pinned);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Fecha qualquer mega menu ao navegar
  useEffect(() => {
    setActiveMega(null);
  }, [location.pathname]);

  // Fecha mega menu com a tecla Escape ou clique externo
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setActiveMega(null);
      }
    };

    const handleClickOutside = (e: MouseEvent) => {
      if (navContainerRef.current && !navContainerRef.current.contains(e.target as Node)) {
        setActiveMega(null);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    document.addEventListener('click', handleClickOutside);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  const toggleMega = (menu: 'procedimentos' | 'servicos' | 'homecare') => {
    setActiveMega((prev) => (prev === menu ? null : menu));
  };

  const isLinkActive = (path: string) => {
    if (path === '/') return location.pathname === '/' && !location.hash;
    return location.pathname === path;
  };

  return (
    <>
      {/* ── TOP BAR DE SERVIÇO ── */}
      <div className="top-bar">
        {/* WhatsApp à esquerda */}
        <a
          href="https://wa.me/5551992946225"
          className="top-bar-wa"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Atendimento via WhatsApp: 51 99294-6225"
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M12 2a10 10 0 0 0-8.7 14.9L2 22l5.3-1.4A10 10 0 1 0 12 2Zm0 18a8 8 0 0 1-4.1-1.1l-.3-.2-3.1.8.8-3-.2-.3A8 8 0 1 1 12 20Z" />
          </svg>
          <span>Chame no WhatsApp</span>
        </a>

        {/* Botão Entrar no mobile à direita (padrão 60+) */}
        <Link
          to={authed ? '/conta' : '/login'}
          className="top-bar-entrar-btn"
        >
          {authed ? 'Minha Conta' : 'Entrar'}
        </Link>

        {/* Links institucionais visíveis no desktop à direita */}
        <nav className="top-bar-links" aria-label="Institucional">
          <a href="/#sobre">Sobre</a>
          <a href="/#ajuda">Ajuda</a>
          <a href="/#contato">Contato</a>
        </nav>
      </div>

      {/* ── OVERLAY ESCURO DO MEGA MENU DESKTOP (padrão 60+: rgba(26,58,53,.85)) ── */}
      <div
        className={`nav-overlay ${activeMega ? 'open' : ''}`}
        onClick={() => setActiveMega(null)}
        aria-hidden="true"
      />

      {/* ── NAVBAR PRINCIPAL STICKY ── */}
      <header className={`app-header ${isPinned ? 'app-header--pinned' : ''}`}>
        {/* Hambúrguer (Mobile) */}
        <button
          ref={hamburgerRef}
          type="button"
          className="hamburger"
          aria-label="Abrir menu"
          aria-expanded={isMenuOpen}
          onClick={onOpenMenu}
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            aria-hidden="true"
          >
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>

        {/* Contexto ao fixar (quando rolado) */}
        {context && (
          <span className="app-header-context">
            <span>
              {context.parent && (
                <span className="app-header-context-parent">{context.parent}</span>
              )}
              <span className="app-header-context-label">{context.label}</span>
            </span>
          </span>
        )}

        {/* Botão Entrar ou Minha Conta no Desktop (1º elemento da esquerda) */}
        <Link
          to={authed ? '/conta' : '/login'}
          className="btn-entrar"
        >
          {authed ? 'Minha Conta' : 'Entrar'}
        </Link>

        {/* Links Desktop e Mega Menus */}
        <div ref={navContainerRef} className="nav-links">
          {/* Home */}
          <div className="nav-item">
            <Link
              to="/"
              className="nav-link"
              aria-current={isLinkActive('/') ? 'page' : undefined}
              onClick={() => setActiveMega(null)}
            >
              Home
            </Link>
          </div>

          {/* Procedimentos (com Mega Menu) */}
          <div className={`nav-item ${activeMega === 'procedimentos' ? 'open' : ''}`}>
            <button
              type="button"
              className="nav-link nav-link--has-submenu"
              aria-expanded={activeMega === 'procedimentos'}
              onClick={(e) => {
                e.stopPropagation();
                toggleMega('procedimentos');
              }}
            >
              <span>Procedimentos</span>
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
                className="nav-chevron"
              >
                <path d="m6 9 6 6 6-6" />
              </svg>
            </button>

            {/* Mega Menu Dropdown */}
            <div className="mega-menu" role="region" aria-label="Menu de Procedimentos">
              <div className="mega-cols">
                {/* Coluna 1: Curativos e Feridas */}
                <div className="mega-col">
                  <span className="mega-col-label">Curativos e Feridas</span>
                  <Link
                    to="/servicos/curativo-simples-com-tecnica-asseptica"
                    className="mega-link"
                    onClick={() => setActiveMega(null)}
                  >
                    <div className="mega-link-icon">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="2.5" y="8.5" width="19" height="7" rx="3.5" transform="rotate(-45 12 12)" />
                        <path d="M9.5 9.5 14.5 14.5" />
                      </svg>
                    </div>
                    <div className="mega-link-text">
                      <span className="mega-link-title">Curativos Simples</span>
                      <span className="mega-link-desc">Limpeza e curativos assépticos</span>
                    </div>
                  </Link>

                  <Link
                    to="/servicos/curativo-de-ferida-operatoria-e-retirada-de-pontos"
                    className="mega-link"
                    onClick={() => setActiveMega(null)}
                  >
                    <div className="mega-link-icon">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M4 14c4-6 12-6 16 0" />
                        <path d="M8 14v4M12 12v6M16 14v4" />
                      </svg>
                    </div>
                    <div className="mega-link-text">
                      <span className="mega-link-title">Ferida Operatória e Pontos</span>
                      <span className="mega-link-desc">Pós-cirúrgico e retirada de suturas</span>
                    </div>
                  </Link>

                  <Link
                    to="/servicos/prevencao-e-tratamento-de-lesao-por-pressao"
                    className="mega-link"
                    onClick={() => setActiveMega(null)}
                  >
                    <div className="mega-link-icon">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M5 18c2-8 12-8 14 0" />
                        <circle cx="12" cy="9" r="2.5" />
                      </svg>
                    </div>
                    <div className="mega-link-text">
                      <span className="mega-link-title">Lesão por Pressão</span>
                      <span className="mega-link-desc">Prevenção e tratamento avançado</span>
                    </div>
                  </Link>
                </div>

                {/* Coluna 2: Medicações e Sondas */}
                <div className="mega-col">
                  <span className="mega-col-label">Medicações e Sondas</span>
                  <Link
                    to="/servicos/administracao-de-medicamentos-por-via-intramuscular"
                    className="mega-link"
                    onClick={() => setActiveMega(null)}
                  >
                    <div className="mega-link-icon">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="m18 2 4 4" />
                        <path d="m17 7 3-3" />
                        <path d="M19 9 8.7 19.3c-.4.4-1 .6-1.6.6H3v-4.1c0-.6.2-1.2.6-1.6L13.9 4" />
                      </svg>
                    </div>
                    <div className="mega-link-text">
                      <span className="mega-link-title">Injetáveis (Intramuscular)</span>
                      <span className="mega-link-desc">Técnica segura e sítios corretos</span>
                    </div>
                  </Link>

                  <Link
                    to="/servicos/administracao-de-medicamentos-por-via-subcutanea"
                    className="mega-link"
                    onClick={() => setActiveMega(null)}
                  >
                    <div className="mega-link-icon">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 2.7 6.4 10.3A7.5 7.5 0 1 0 17.6 10.3L12 2.7Z" />
                      </svg>
                    </div>
                    <div className="mega-link-text">
                      <span className="mega-link-title">Injetáveis (Subcutânea)</span>
                      <span className="mega-link-desc">Insulinas e heparinas com rodízio</span>
                    </div>
                  </Link>

                  <Link
                    to="/servicos/sondagem-vesical-de-alivio"
                    className="mega-link"
                    onClick={() => setActiveMega(null)}
                  >
                    <div className="mega-link-icon">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M6 3v6a6 6 0 0 0 12 0V3" />
                        <path d="M12 9v12" />
                      </svg>
                    </div>
                    <div className="mega-link-text">
                      <span className="mega-link-title">Sondagem Vesical de Alívio</span>
                      <span className="mega-link-desc">Esvaziamento vesical no domicílio</span>
                    </div>
                  </Link>

                  <Link
                    to="/servicos/cuidados-com-gastrostomia"
                    className="mega-link"
                    onClick={() => setActiveMega(null)}
                  >
                    <div className="mega-link-icon">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="2" y="6" width="20" height="12" rx="3" />
                        <path d="M12 10v4" />
                      </svg>
                    </div>
                    <div className="mega-link-text">
                      <span className="mega-link-title">Cuidados com Gastrostomia</span>
                      <span className="mega-link-desc">Higiene do estoma e nutrição enteral</span>
                    </div>
                  </Link>
                </div>

                {/* Coluna 3: Card em Destaque (padrão 60+) */}
                <div className="mega-card">
                  <div className="mega-card-icon">
                    <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2a10 10 0 0 0-8.7 14.9L2 22l5.3-1.4A10 10 0 1 0 12 2Zm0 18a8 8 0 0 1-4.1-1.1l-.3-.2-3.1.8.8-3-.2-.3A8 8 0 1 1 12 20Z" />
                    </svg>
                  </div>
                  <h4 className="mega-card-title">Precisa de atendimento hoje?</h4>
                  <p className="mega-card-desc">
                    Fale com a equipe de enfermagem e confirme a disponibilidade imediata no seu endereço.
                  </p>
                  <a
                    href="https://wa.me/5551992946225"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mega-card-btn"
                  >
                    <span>Chamar no WhatsApp</span>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="m9 18 6-6-6-6" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Serviços Prestados (com Mega Menu) */}
          <div className={`nav-item ${activeMega === 'servicos' ? 'open' : ''}`}>
            <button
              type="button"
              className="nav-link nav-link--has-submenu"
              aria-expanded={activeMega === 'servicos'}
              onClick={(e) => {
                e.stopPropagation();
                toggleMega('servicos');
              }}
            >
              <span>Serviços Prestados</span>
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
                className="nav-chevron"
              >
                <path d="m6 9 6 6 6-6" />
              </svg>
            </button>

            {/* Mega Menu Dropdown */}
            <div className="mega-menu" role="region" aria-label="Menu de Serviços Prestados">
              <div className="mega-cols">
                <div className="mega-col">
                  <span className="mega-col-label">Assistência Especializada</span>
                  <Link
                    to="/solicitacoes"
                    className="mega-link"
                    onClick={() => setActiveMega(null)}
                  >
                    <div className="mega-link-icon">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="4" width="18" height="16" rx="2" />
                        <line x1="16" y1="2" x2="16" y2="6" />
                        <line x1="8" y1="2" x2="8" y2="6" />
                        <line x1="3" y1="10" x2="21" y2="10" />
                      </svg>
                    </div>
                    <div className="mega-link-text">
                      <span className="mega-link-title">Solicitações de Atendimento</span>
                      <span className="mega-link-desc">Agende e acompanhe em tempo real</span>
                    </div>
                  </Link>

                  <a
                    href="/#procedimentos"
                    className="mega-link"
                    onClick={() => setActiveMega(null)}
                  >
                    <div className="mega-link-icon">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M19 14c1.5-1.5 3-3.5 3-6a5 5 0 0 0-9-3 5 5 0 0 0-9 3c0 2.5 1.5 4.5 3 6l6 6Z" />
                      </svg>
                    </div>
                    <div className="mega-link-text">
                      <span className="mega-link-title">Catálogo de Procedimentos</span>
                      <span className="mega-link-desc">Procedimentos técnicos com cobertura por CEP</span>
                    </div>
                  </a>
                </div>

                <div className="mega-col">
                  <span className="mega-col-label">Garantia e Rigor</span>
                  <div className="mega-link" style={{ cursor: 'default' }}>
                    <div className="mega-link-icon">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                      </svg>
                    </div>
                    <div className="mega-link-text">
                      <span className="mega-link-title">Registro Ativo no COREN</span>
                      <span className="mega-link-desc">Profissionais habilitados e verificados</span>
                    </div>
                  </div>

                  <div className="mega-link" style={{ cursor: 'default' }}>
                    <div className="mega-link-icon">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                        <polyline points="22 4 12 14.01 9 11.01" />
                      </svg>
                    </div>
                    <div className="mega-link-text">
                      <span className="mega-link-title">Protocolos Assépticos</span>
                      <span className="mega-link-desc">Técnica estéril e biossegurança</span>
                    </div>
                  </div>
                </div>

                <div className="mega-card">
                  <div className="mega-card-icon">
                    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                      <polyline points="14 2 14 8 20 8" />
                      <line x1="16" y1="13" x2="8" y2="13" />
                      <line x1="16" y1="17" x2="8" y2="17" />
                      <polyline points="10 9 9 9 8 9" />
                    </svg>
                  </div>
                  <h4 className="mega-card-title">Plano de Cuidado Individual</h4>
                  <p className="mega-card-desc">
                    Evolução clínica contínua registrada para acompanhamento do médico assistente e da família.
                  </p>
                  <Link to="/solicitacoes" className="mega-card-btn" onClick={() => setActiveMega(null)}>
                    <span>Ver Solicitações</span>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="m9 18 6-6-6-6" />
                    </svg>
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Home Care (com Mega Menu) */}
          <div className={`nav-item ${activeMega === 'homecare' ? 'open' : ''}`}>
            <button
              type="button"
              className="nav-link nav-link--has-submenu"
              aria-expanded={activeMega === 'homecare'}
              onClick={(e) => {
                e.stopPropagation();
                toggleMega('homecare');
              }}
            >
              <span>Home Care</span>
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
                className="nav-chevron"
              >
                <path d="m6 9 6 6 6-6" />
              </svg>
            </button>

            {/* Mega Menu Dropdown */}
            <div className="mega-menu" role="region" aria-label="Menu de Home Care">
              <div className="mega-cols">
                <div className="mega-col">
                  <span className="mega-col-label">Cuidado Continuado</span>
                  <a
                    href="/#home-care"
                    className="mega-link"
                    onClick={() => setActiveMega(null)}
                  >
                    <div className="mega-link-icon">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                        <polyline points="9 22 9 12 15 12 15 22" />
                      </svg>
                    </div>
                    <div className="mega-link-text">
                      <span className="mega-link-title">Cuidado Domiciliar Contínuo</span>
                      <span className="mega-link-desc">Assistência técnica de enfermagem no lar</span>
                    </div>
                  </a>

                  <Link
                    to="/solicitacoes"
                    className="mega-link"
                    onClick={() => setActiveMega(null)}
                  >
                    <div className="mega-link-icon">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                        <circle cx="9" cy="7" r="4" />
                        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                      </svg>
                    </div>
                    <div className="mega-link-text">
                      <span className="mega-link-title">Solicitar Plantão</span>
                      <span className="mega-link-desc">Agende turnos e visitas de enfermagem</span>
                    </div>
                  </Link>
                </div>

                <div className="mega-col">
                  <span className="mega-col-label">Benefícios da Família</span>
                  <div className="mega-link" style={{ cursor: 'default' }}>
                    <div className="mega-link-icon">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                      </svg>
                    </div>
                    <div className="mega-link-text">
                      <span className="mega-link-title">Paz e Segurança</span>
                      <span className="mega-link-desc">Supervisão técnica 24 horas</span>
                    </div>
                  </div>

                  <div className="mega-link" style={{ cursor: 'default' }}>
                    <div className="mega-link-icon">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10" />
                        <polyline points="12 6 12 12 16 14" />
                      </svg>
                    </div>
                    <div className="mega-link-text">
                      <span className="mega-link-title">Flexibilidade de Horários</span>
                      <span className="mega-link-desc">Turnos de 6h, 12h ou diárias</span>
                    </div>
                  </div>
                </div>

                <div className="mega-card">
                  <div className="mega-card-icon">
                    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                    </svg>
                  </div>
                  <h4 className="mega-card-title">Converse com o Responsável</h4>
                  <p className="mega-card-desc">
                    Tire dúvidas diretamente com o Enf. Dionizio Brentano e planeje o suporte ideal para seu familiar.
                  </p>
                  <a
                    href="https://wa.me/5551992946225"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mega-card-btn"
                  >
                    <span>Falar no WhatsApp</span>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="m9 18 6-6-6-6" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Contatos */}
          <div className="nav-item">
            <a href="/#contato" className="nav-link" onClick={() => setActiveMega(null)}>
              Contatos
            </a>
          </div>
        </div>

        {/* Marca: logotipo à esquerda e dizeres à direita equalizados com o menu (sempre à direita) */}
        <Link
          to="/"
          className="app-brand brand-lockup"
          aria-label="Enfaci — Enfermagem Assistencial de Cuidado Integral"
          onClick={() => setActiveMega(null)}
        >
          <img
            src="/logo-enfaci-enfermagem-assistencial-cuidado-integral-letras.png"
            alt="Enfaci"
          />
          <span className="logo-text-col">
            <span className="brand-sub">Enfermagem Assistencial de Cuidado Integral.</span>
            <span className="logo-responsavel">
              Resp. Técnico: Enf. Dionizio Brentano - COREN/RS 734.282
            </span>
          </span>
        </Link>
      </header>
    </>
  );
};
