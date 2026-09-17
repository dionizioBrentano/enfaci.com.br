import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { isAuthenticated, logout } from '../api/auth';
import styles from './Navbar.module.css';

export const Navbar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const authed = isAuthenticated();

  const handleLogout = async () => {
    try {
      await logout();
    } catch {
      // Ignora erro no logout para garantir limpeza local
    } finally {
      navigate('/login');
    }
  };

  return (
    <header className={styles.navbar}>
      <Link to="/" className={styles.brandGroup}>
        <span className={styles.logo}>Enfaci</span>
        <span className={styles.badge}>Posto de Enfermagem</span>
      </Link>

      <nav>
        <ul className={styles.navLinks}>
          <li>
            <Link
              to="/"
              className={`${styles.link} ${location.pathname === '/' ? styles.linkActive : ''}`}
            >
              Procedimentos
            </Link>
          </li>
          <li>
            <Link
              to="/solicitacoes"
              className={`${styles.link} ${location.pathname === '/solicitacoes' ? styles.linkActive : ''}`}
            >
              Minhas Solicitações
            </Link>
          </li>
          {authed ? (
            <>
              <li>
                <Link
                  to="/conta"
                  className={`${styles.link} ${location.pathname === '/conta' ? styles.linkActive : ''}`}
                >
                  Minha Conta
                </Link>
              </li>
              <li>
                <button type="button" onClick={handleLogout} className={styles.logoutBtn}>
                  Sair
                </button>
              </li>
            </>
          ) : (
            <li>
              <Link to="/login" className={styles.buttonLink}>
                Entrar / Cadastrar
              </Link>
            </li>
          )}
        </ul>
      </nav>
    </header>
  );
};
