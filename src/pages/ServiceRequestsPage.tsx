import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { getServiceRequests } from '../api/serviceRequests';
import { isAuthenticated, isMfaRequired, getErrorMessage } from '../api/auth';
import type { ServiceRequest, ServiceRequestStatus, SlotWindow } from '../types/serviceRequest';
import styles from './ServiceRequestsPage.module.css';

const STATUS_LABELS: Record<ServiceRequestStatus, { label: string; className: string }> = {
  requested: { label: 'Solicitado', className: styles.badgeRequested },
  accepted: { label: 'Aceito', className: styles.badgeAccepted },
  done: { label: 'Concluído', className: styles.badgeDone },
  cancelled: { label: 'Cancelado', className: styles.badgeCancelled },
};

const WINDOW_LABELS: Record<SlotWindow, string> = {
  manha: 'Manhã (08h às 12h)',
  tarde: 'Tarde (12h às 18h)',
  noite: 'Noite (18h às 22h)',
};

export const ServiceRequestsPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [requests, setRequests] = useState<ServiceRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const successMessage = (location.state as { successMessage?: string } | null)?.successMessage;

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate('/login?returnTo=/solicitacoes', {
        replace: true,
        state: { returnTo: '/solicitacoes' },
      });
      return;
    }

    let isMounted = true;
    setIsLoading(true);
    setErrorMessage(null);

    getServiceRequests()
      .then((res) => {
        if (!isMounted) return;
        setRequests(res.data);
        setIsLoading(false);
      })
      .catch((err) => {
        if (!isMounted) return;
        if (isMfaRequired(err)) {
          navigate('/mfa', {
            state: { mode: 'verify', returnTo: '/solicitacoes' },
          });
          return;
        }
        setErrorMessage(getErrorMessage(err));
        setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [navigate]);

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return '-';
    try {
      const [y, m, d] = dateStr.split('-');
      if (y && m && d) return `${d}/${m}/${y}`;
      return new Date(dateStr).toLocaleDateString('pt-BR');
    } catch {
      return dateStr;
    }
  };

  const formatDateTime = (dateStr?: string) => {
    if (!dateStr) return '-';
    try {
      return new Date(dateStr).toLocaleString('pt-BR', {
        dateStyle: 'short',
        timeStyle: 'short',
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className={styles.container}>
      <Navbar />

      <div className={styles.headerRow}>
        <h1 className={styles.title}>Minhas Solicitações</h1>
        <Link to="/" className={styles.newBtn}>
          Novo Atendimento
        </Link>
      </div>

      {successMessage && <div className={styles.successAlert}>{successMessage}</div>}
      {errorMessage && <div className={styles.errorBox}>{errorMessage}</div>}

      {isLoading ? (
        <div className={styles.loading}>Carregando solicitações...</div>
      ) : requests.length === 0 ? (
        <div className={styles.emptyState}>
          <h2 className={styles.emptyTitle}>Nenhuma solicitação encontrada</h2>
          <p style={{ marginBottom: '1.25rem' }}>
            Você ainda não possui pedidos de atendimento registrados. Escolha um procedimento no
            nosso catálogo para começar.
          </p>
          <Link to="/" className={styles.newBtn}>
            Ver Catálogo de Procedimentos
          </Link>
        </div>
      ) : (
        <div className={styles.list}>
          {requests.map((req) => {
            const statusConfig = STATUS_LABELS[req.status] || {
              label: req.status,
              className: styles.badgeRequested,
            };
            const windowLabel = WINDOW_LABELS[req.slot_window] || req.slot_window;

            return (
              <article key={req.id} className={styles.card}>
                <div className={styles.cardTop}>
                  <h3 className={styles.procedureTitle}>
                    {req.procedure?.title || 'Procedimento de Enfermagem'}
                  </h3>
                  <span className={statusConfig.className}>{statusConfig.label}</span>
                </div>

                <div className={styles.gridInfo}>
                  <div className={styles.infoItem}>
                    <span className={styles.infoLabel}>Data Agendada</span>
                    <span className={styles.infoValue}>{formatDate(req.slot_date)}</span>
                  </div>

                  <div className={styles.infoItem}>
                    <span className={styles.infoLabel}>Turno</span>
                    <span className={styles.infoValue}>{windowLabel}</span>
                  </div>

                  <div className={styles.infoItem}>
                    <span className={styles.infoLabel}>CEP do Serviço</span>
                    <span className={styles.infoValue}>{req.cep_servico}</span>
                  </div>

                  <div className={styles.infoItem}>
                    <span className={styles.infoLabel}>Ponto Credenciado</span>
                    <span className={styles.infoValue}>
                      {req.service_point?.name || 'Em triagem / Central Enfaci'}
                    </span>
                  </div>

                  <div className={styles.infoItem}>
                    <span className={styles.infoLabel}>Criado em</span>
                    <span className={styles.infoValue}>{formatDateTime(req.created_at)}</span>
                  </div>
                </div>

                {req.notes_cliente && (
                  <div className={styles.notes}>
                    <strong>Observações:</strong> {req.notes_cliente}
                  </div>
                )}
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
};
