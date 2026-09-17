import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  getUser,
  updateProfile,
  logout,
  isAuthenticated,
  isMfaRequired,
  getErrorMessage,
} from '../api/auth';
import type { User } from '../types/auth';
import styles from './AccountPage.module.css';

export const AccountPage: React.FC = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Form edit states
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [cpf, setCpf] = useState('');

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
          setName(userData.name || '');
          setPhone(userData.phone || '');
          setCpf(userData.cpf || '');
        }
      } catch (err) {
        if (isMounted) {
          if (isMfaRequired(err)) {
            navigate('/mfa', { state: { returnTo: '/conta' } });
            return;
          }
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

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);
    setIsUpdating(true);

    try {
      const updated = await updateProfile({
        name: name.trim() ? name.trim() : undefined,
        phone: phone.trim() ? phone.trim() : undefined,
        cpf: cpf.trim() ? cpf.trim() : undefined,
      });

      setUser(updated);
      setName(updated.name || '');
      setPhone(updated.phone || '');
      setCpf(updated.cpf || '');
      setSuccessMessage('Dados atualizados com sucesso!');
    } catch (err) {
      if (isMfaRequired(err)) {
        // Redireciona para a tela MFA e volta para /conta
        navigate('/mfa', {
          state: {
            returnTo: '/conta',
            mode: user?.mfa_enabled ? 'verify' : 'setup',
          },
        });
        return;
      }
      setErrorMessage(getErrorMessage(err));
    } finally {
      setIsUpdating(false);
    }
  };

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
      {successMessage && <div className={styles.success}>{successMessage}</div>}

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

      <form className={styles.form} onSubmit={handleUpdateProfile}>
        <h2 className={styles.subtitle} style={{ marginBottom: '0.75rem', textAlign: 'left' }}>
          Alteração de Dados
        </h2>

        <div className={styles.field}>
          <label className={styles.label} htmlFor="profile-name">
            Nome Completo
          </label>
          <input
            id="profile-name"
            type="text"
            className={styles.input}
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            autoComplete="name"
          />
        </div>

        <div className={styles.field}>
          <label className={styles.label} htmlFor="profile-phone">
            Telefone
          </label>
          <input
            id="profile-phone"
            type="tel"
            className={styles.input}
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="DDD + Número"
            autoComplete="tel"
          />
        </div>

        <div className={styles.field}>
          <label className={styles.label} htmlFor="profile-cpf">
            CPF
          </label>
          <input
            id="profile-cpf"
            type="text"
            className={styles.input}
            value={cpf}
            onChange={(e) => setCpf(e.target.value)}
            placeholder="000.000.000-00"
          />
        </div>

        <button type="submit" className={styles.updateButton} disabled={isUpdating}>
          {isUpdating ? 'Salvando...' : 'Alterar dados'}
        </button>
      </form>

      <div className={styles.actionGroup}>
        <button
          type="button"
          className={styles.logoutButton}
          onClick={handleLogout}
          disabled={isLoggingOut}
        >
          {isLoggingOut ? 'Saindo...' : 'Sair da Conta'}
        </button>
      </div>
    </div>
  );
};

