import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { isAuthenticated, logout } from '../api/auth';
import styles from './Navbar.module.css';

interface NavItem {
  label: string;
  path: string;
}

const NAV_ITEMS: NavItem[] = [
  { label: 'Home', path: '/' },
  { label: 'Procedimentos', path: '/' },
  { label: 'Serviços Prestados', path: '/solicitacoes' },
  { label: 'Home Care', path: '/#home-care' },
  { label: 'Consultas', path: '/#consultas' },
  { label: 'Contatos', path: '/#contatos' },
];

export const Navbar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const authed = isAuthenticated();

  const handleLogout = async () => {
    try {
      await logout();
    } catch {
      // Ignora erro no logout para garantir limpeza local
    } finally {
      setIsDrawerOpen(false);
      navigate('/login');
    }
  };

  const closeDrawer = () => {
    setIsDrawerOpen(false);
  };

  // Trava scroll da página quando drawer mobile estiver aberto e escuta tecla Escape
  useEffect(() => {
    if (isDrawerOpen) {
      document.body.style.overflow = 'hidden';
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          setIsDrawerOpen(false);
        }
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => {
        document.body.style.overflow = '';
        window.removeEventListener('keydown', handleKeyDown);
      };
    } else {
      document.body.style.overflow = '';
    }
  }, [isDrawerOpen]);

  const isLinkActive = (path: string) => {
    if (path === '/') {
      return location.pathname === '/' && !location.hash;
    }
    if (path.startsWith('/#')) {
      return location.pathname === '/' && location.hash === path.replace('/', '');
    }
    return location.pathname === path;
  };

  return (
    <>
      <header className={styles.navbar}>
        {/* Botão Hambúrguer (Mobile) */}
        <button
          type="button"
          className={styles.hamburgerBtn}
          onClick={() => setIsDrawerOpen(true)}
          aria-label="Abrir menu"
          aria-expanded={isDrawerOpen}
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>

        {/* Botão Entrar dourado (#b8975a) - sempre visível na barra, 1º item no desktop */}
        <Link
          to={authed ? '/conta' : '/login'}
          className={styles.btnEntrar}
        >
          {authed ? 'Minha Conta' : 'Entrar'}
        </Link>

        {/* Navegação desktop (≥768px): nav em linha à esquerda do logo */}
        <nav className={styles.desktopNav} aria-label="Navegação principal">
          <ul className={styles.navList}>
            {NAV_ITEMS.map((item) => {
              const active = isLinkActive(item.path);
              return (
                <li key={item.label}>
                  <Link
                    to={item.path}
                    className={`${styles.navLink} ${active ? styles.navLinkActive : ''}`}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
            {authed && (
              <li>
                <button type="button" onClick={handleLogout} className={styles.logoutBtn}>
                  Sair
                </button>
              </li>
            )}
          </ul>
        </nav>

        {/* Logo Enfaci à direita */}
        <Link to="/" className={styles.logoLink} aria-label="Enfaci - Início">
          <img
            src="/logo-enfaci.png"
            alt="Enfaci"
            className={styles.logoImg}
          />
        </Link>
      </header>

      {/* Backdrop do Drawer Mobile */}
      <div
        className={`${styles.drawerBackdrop} ${isDrawerOpen ? styles.drawerBackdropOpen : ''}`}
        onClick={closeDrawer}
        aria-hidden="true"
      />

      {/* Drawer Tela Cheia Mobile */}
      <aside
        className={`${styles.drawer} ${isDrawerOpen ? styles.drawerOpen : ''}`}
        role="dialog"
        aria-modal="true"
        aria-label="Menu de navegação"
      >
        <div className={styles.drawerHeader}>
          <Link to="/" onClick={closeDrawer} className={styles.drawerLogoLink}>
            <img
              src="/logo-enfaci.png"
              alt="Enfaci"
              className={styles.drawerLogoImg}
            />
          </Link>
          <button
            type="button"
            className={styles.drawerCloseBtn}
            onClick={closeDrawer}
            aria-label="Fechar menu"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <div className={styles.drawerBody}>
          <span className={styles.drawerSectionLabel}>Navegação</span>
          <ul className={styles.drawerList}>
            {NAV_ITEMS.map((item) => {
              const active = isLinkActive(item.path);
              return (
                <li key={item.label}>
                  <Link
                    to={item.path}
                    className={`${styles.drawerLink} ${active ? styles.drawerLinkActive : ''}`}
                    onClick={closeDrawer}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
            {authed && (
              <>
                <li>
                  <Link
                    to="/conta"
                    className={`${styles.drawerLink} ${location.pathname === '/conta' ? styles.drawerLinkActive : ''}`}
                    onClick={closeDrawer}
                  >
                    Minha Conta
                  </Link>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className={styles.drawerLogoutBtn}
                  >
                    Sair da Conta
                  </button>
                </li>
              </>
            )}
          </ul>

          <div className={styles.drawerFooter}>
            {!authed && (
              <Link
                to="/login"
                className={styles.drawerBtnEntrar}
                onClick={closeDrawer}
              >
                Entrar / Cadastrar
              </Link>
            )}
          </div>
        </div>
      </aside>
    </>
  );
};
