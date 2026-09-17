import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUser, logout, isAuthenticated } from '../api/auth';
import { getErrorMessage } from '../api/client';
import type { User } from '../types/auth';
import styles from './AccountPage.module.css';

export const AccountPage: React.FC = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate('/login', { replace: true });
      return;
    }

    let isMounted = true;

    async function loadUserData() {
      try {
        const userData = await getUser();
        if (isMounted) {
          setUser(userData);
        }
      } catch (err) {
        if (isMounted) {
          setErrorMessage(getErrorMessage(err));
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadUserData();

    return () => {
      isMounted = false;
    };
  }, [navigate]);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logout();
    } catch {
      // Falha no logout remoto não impede saída local
    } finally {
      setIsLoggingOut(false);
      navigate('/login', { replace: true });
    }
  };

  if (isLoading) {
    return (
      <div className={styles.card}>
        <div className={styles.loading}>Carregando dados do usuário...</div>
      </div>
    );
  }

  const identities = user?.identities ?? [];

  return (
    <div className={styles.card}>
      <h1 className={styles.title}>Minha Conta</h1>
      <p className={styles.subtitle}>Informações do Perfil</p>

      {errorMessage && <div className={styles.error}>{errorMessage}</div>}

      <div className={styles.infoGroup}>
        <div className={styles.infoItem}>
          <span className={styles.infoLabel}>Nome:</span>
          <span className={styles.infoValue}>{user?.name ?? '-'}</span>
        </div>
        <div className={styles.infoItem}>
          <span className={styles.infoLabel}>E-mail:</span>
          <span className={styles.infoValue}>{user?.email ?? '-'}</span>
        </div>

        <div className={styles.identitiesContainer}>
          <span className={styles.infoLabel}>Identidades ({identities.length}):</span>
          {identities.length > 0 ? (
            <ul className={styles.identityList}>
              {identities.map((identity, index) => (
                <li key={index} className={styles.identityItem}>
                  {typeof identity === 'object' ? JSON.stringify(identity) : String(identity)}
                </li>
              ))}
            </ul>
          ) : (
            <span className={styles.infoValue}>Nenhuma identidade associada.</span>
          )}
        </div>
      </div>

      <button
        type="button"
        className={styles.logoutButton}
        onClick={handleLogout}
        disabled={isLoggingOut}
      >
        {isLoggingOut ? 'Saindo...' : 'Sair da Conta'}
      </button>
    </div>
  );
};
