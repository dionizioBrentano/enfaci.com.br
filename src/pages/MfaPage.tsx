import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { setupMfa, verifyMfa, isAuthenticated, getErrorMessage } from '../api/auth';
import type { MfaSetupResponse } from '../types/auth';
import styles from './MfaPage.module.css';

interface LocationState {
  returnTo?: string;
  mode?: 'setup' | 'verify';
}

export const MfaPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const state = location.state as LocationState | null;
  const returnTo = state?.returnTo || searchParams.get('returnTo') || '/conta';

  const [mode, setMode] = useState<'setup' | 'verify'>(state?.mode || 'setup');
  const [setupData, setSetupData] = useState<MfaSetupResponse | null>(null);
  const [totpCode, setTotpCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSettingUp, setIsSettingUp] = useState(mode === 'setup');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate('/login', { replace: true });
      return;
    }

    if (mode === 'setup') {
      let isMounted = true;
      setIsSettingUp(true);
      setErrorMessage(null);

      setupMfa()
        .then((data) => {
          if (isMounted) {
            setSetupData(data);
          }
        })
        .catch((err) => {
          if (isMounted) {
            // Se o MFA já estiver habilitado no servidor, alternamos para o modo de verificação direta
            setMode('verify');
            const msg = getErrorMessage(err);
            if (!msg.toLowerCase().includes('habilitado')) {
              setErrorMessage(msg);
            }
          }
        })
        .finally(() => {
          if (isMounted) {
            setIsSettingUp(false);
          }
        });

      return () => {
        isMounted = false;
      };
    }
  }, [mode, navigate]);

  const handleVerifySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const cleanCode = totpCode.trim();
    if (!cleanCode) {
      setErrorMessage('Por favor, informe o código TOTP.');
      return;
    }

    setIsLoading(true);

    try {
      await verifyMfa(cleanCode);
      navigate(returnTo, { replace: true });
    } catch (err) {
      setErrorMessage(getErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ width: '100%' }}>
      <Navbar />
      <div className={styles.card}>
      <h1 className={styles.title}>Autenticação em Duas Etapas</h1>
      <p className={styles.subtitle}>
        {mode === 'setup' ? 'Configuração do MFA' : 'Verificação de Segurança'}
      </p>

      {errorMessage && <div className={styles.error}>{errorMessage}</div>}

      {mode === 'setup' ? (
        isSettingUp ? (
          <div className={styles.loading}>Gerando chave de autenticação e QR Code...</div>
        ) : (
          <>
            <p className={styles.instruction}>
              Escaneie o QR Code abaixo com seu aplicativo autenticador (como Google Authenticator ou
              Authy) e digite o código de 6 dígitos gerado:
            </p>

            {setupData?.qr_code_svg && (
              <div className={styles.qrContainer}>
                <img
                  className={styles.qrImage}
                  src={`data:image/svg+xml;base64,${setupData.qr_code_svg}`}
                  alt="QR Code MFA"
                />
              </div>
            )}

            {setupData?.secret && (
              <div className={styles.secretBox}>
                <span className={styles.secretLabel}>Chave manual (se não conseguir escanear):</span>
                <code className={styles.secretCode}>{setupData.secret}</code>
              </div>
            )}

            <form className={styles.form} onSubmit={handleVerifySubmit}>
              <div className={styles.field}>
                <label className={styles.label} htmlFor="totp-code-setup">
                  Código de Autenticação (TOTP)
                </label>
                <input
                  id="totp-code-setup"
                  type="text"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  maxLength={8}
                  placeholder="000000"
                  className={styles.input}
                  value={totpCode}
                  onChange={(e) => setTotpCode(e.target.value)}
                  required
                  autoFocus
                />
              </div>

              <button type="submit" className={styles.button} disabled={isLoading}>
                {isLoading ? 'Verificando...' : 'Ativar e Continuar'}
              </button>
            </form>
          </>
        )
      ) : (
        <>
          <p className={styles.instruction}>
            Digite o código de 6 dígitos exibido no seu aplicativo autenticador para confirmar seu
            acesso:
          </p>

          <form className={styles.form} onSubmit={handleVerifySubmit}>
            <div className={styles.field}>
              <label className={styles.label} htmlFor="totp-code-verify">
                Código de Autenticação (TOTP)
              </label>
              <input
                id="totp-code-verify"
                type="text"
                inputMode="numeric"
                autoComplete="one-time-code"
                maxLength={8}
                placeholder="000000"
                className={styles.input}
                value={totpCode}
                onChange={(e) => setTotpCode(e.target.value)}
                required
                autoFocus
              />
            </div>

            <button type="submit" className={styles.button} disabled={isLoading}>
              {isLoading ? 'Verificando...' : 'Verificar Código'}
            </button>
          </form>
        </>
      )}
      </div>
    </div>
  );
};
