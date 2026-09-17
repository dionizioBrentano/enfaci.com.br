import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  login,
  register,
  getUser,
  isAuthenticated,
  hasOnlyProfileRead,
  isMfaRequired,
  getErrorMessage,
} from '../api/auth';
import styles from './LoginPage.module.css';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Form states - Login
  const [identifier, setIdentifier] = useState('');

  // Form states - Register
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [cpf, setCpf] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');

  useEffect(() => {
    if (isAuthenticated()) {
      getUser()
        .then((user) => {
          if (!user.mfa_enabled) {
            navigate('/mfa', { replace: true, state: { mode: 'setup' } });
          } else {
            navigate('/conta', { replace: true });
          }
        })
        .catch((err) => {
          if (isMfaRequired(err)) {
            navigate('/mfa', { replace: true, state: { mode: 'verify' } });
          }
        });
    }
  }, [navigate]);

  const handleTabChange = (tab: 'login' | 'register') => {
    setActiveTab(tab);
    setErrorMessage(null);
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsLoading(true);

    try {
      const authRes = await login({ identifier, password });

      // Se o usuário já possui MFA habilitado e a API solicitou verificação
      if (authRes.mfa_required) {
        navigate('/mfa', { state: { mode: 'verify' } });
        return;
      }

      // GET /user depois do login
      const user = await getUser();

      // Se abilities só profile:read ou sem MFA habilitado, mostrar setup
      if (hasOnlyProfileRead(authRes.abilities) || !user.mfa_enabled) {
        navigate('/mfa', { state: { mode: 'setup' } });
        return;
      }

      navigate('/conta');
    } catch (err) {
      if (isMfaRequired(err)) {
        navigate('/mfa', { state: { mode: 'verify' } });
        return;
      }
      setErrorMessage(getErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (password !== passwordConfirmation) {
      setErrorMessage('As senhas não coincidem.');
      return;
    }

    setIsLoading(true);

    try {
      await register({
        name,
        email,
        password,
        password_confirmation: passwordConfirmation,
        cpf: cpf.trim() ? cpf.trim() : undefined,
        phone: phone.trim() ? phone.trim() : undefined,
      });

      const user = await getUser();
      if (!user.mfa_enabled) {
        navigate('/mfa', { state: { mode: 'setup' } });
      } else {
        navigate('/conta');
      }
    } catch (err) {
      setErrorMessage(getErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.card}>
      <h1 className={styles.title}>enfaci.com.br</h1>
      <p className={styles.subtitle}>Acesso ao Sistema</p>

      <div className={styles.tabs}>
        <button
          type="button"
          className={`${styles.tab} ${activeTab === 'login' ? styles.activeTab : ''}`}
          onClick={() => handleTabChange('login')}
        >
          Entrar
        </button>
        <button
          type="button"
          className={`${styles.tab} ${activeTab === 'register' ? styles.activeTab : ''}`}
          onClick={() => handleTabChange('register')}
        >
          Cadastrar
        </button>
      </div>

      {errorMessage && <div className={styles.error}>{errorMessage}</div>}

      {activeTab === 'login' ? (
        <form className={styles.form} onSubmit={handleLoginSubmit}>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="login-identifier">
              E-mail, CPF ou Telefone
            </label>
            <input
              id="login-identifier"
              type="text"
              className={styles.input}
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              required
              autoComplete="username"
              placeholder="seu@email.com, CPF ou telefone"
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label} htmlFor="login-password">
              Senha
            </label>
            <input
              id="login-password"
              type="password"
              className={styles.input}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
            />
          </div>

          <button type="submit" className={styles.button} disabled={isLoading}>
            {isLoading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>
      ) : (
        <form className={styles.form} onSubmit={handleRegisterSubmit}>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="register-name">
              Nome Completo
            </label>
            <input
              id="register-name"
              type="text"
              className={styles.input}
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              autoComplete="name"
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label} htmlFor="register-email">
              E-mail
            </label>
            <input
              id="register-email"
              type="email"
              className={styles.input}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label} htmlFor="register-cpf">
              CPF (opcional)
            </label>
            <input
              id="register-cpf"
              type="text"
              className={styles.input}
              value={cpf}
              onChange={(e) => setCpf(e.target.value)}
              autoComplete="off"
              placeholder="000.000.000-00"
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label} htmlFor="register-phone">
              Telefone (opcional)
            </label>
            <input
              id="register-phone"
              type="tel"
              className={styles.input}
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              autoComplete="tel"
              placeholder="DDD + Número"
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label} htmlFor="register-password">
              Senha
            </label>
            <input
              id="register-password"
              type="password"
              className={styles.input}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="new-password"
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label} htmlFor="register-password-confirmation">
              Confirmar Senha
            </label>
            <input
              id="register-password-confirmation"
              type="password"
              className={styles.input}
              value={passwordConfirmation}
              onChange={(e) => setPasswordConfirmation(e.target.value)}
              required
              autoComplete="new-password"
            />
          </div>

          <button type="submit" className={styles.button} disabled={isLoading}>
            {isLoading ? 'Cadastrando...' : 'Criar Conta'}
          </button>
        </form>
      )}
    </div>
  );
};

