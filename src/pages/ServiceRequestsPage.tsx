import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { getServiceRequests, updateStatus } from '../api/serviceRequests';
import { createServiceReview, publishServiceReview } from '../api/reviews';
import { getUser, isAuthenticated, isMfaRequired, getErrorMessage } from '../api/auth';
import type { User } from '../types/auth';
import type { ServiceRequest, ServiceRequestStatus, SlotWindow, ServiceReview } from '../types/serviceRequest';
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

interface RequestReviewSectionProps {
  req: ServiceRequest;
  currentUser: User | null;
  onReviewUpdated: (requestId: string, review: ServiceReview) => void;
  onMfaRequired: () => void;
  onError: (msg: string) => void;
}

const RequestReviewSection: React.FC<RequestReviewSectionProps> = ({
  req,
  currentUser,
  onReviewUpdated,
  onMfaRequired,
  onError,
}) => {
  const isStaff = currentUser?.user_type === 'professional' || currentUser?.user_type === 'admin';
  const isOwner = Boolean(
    currentUser && req.client_user_id && String(currentUser.id) === String(req.client_user_id)
  );
  const isClient = currentUser?.user_type === 'client' || (!isStaff && Boolean(currentUser));
  const canReview = isClient || isOwner;

  // Form states
  const [stars, setStars] = useState<number>(5);
  const [hoveredStar, setHoveredStar] = useState<number>(0);
  const [body, setBody] = useState<string>('');
  const [anonymous, setAnonymous] = useState<boolean>(true); // default on
  const [publishRequested, setPublishRequested] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isPublishing, setIsPublishing] = useState<boolean>(false);

  // Se já existe review: SOMENTE LEITURA
  if (req.review) {
    const review = req.review;
    const canPublish = isStaff && review.publish_requested && !review.published_at;

    const handlePublish = async () => {
      setIsPublishing(true);
      try {
        const updated = await publishServiceReview(review.id);
        onReviewUpdated(req.id, {
          ...review,
          ...updated,
          published_at: updated.published_at || new Date().toISOString(),
        });
      } catch (err) {
        if (isMfaRequired(err)) {
          onMfaRequired();
          return;
        }
        onError(getErrorMessage(err));
      } finally {
        setIsPublishing(false);
      }
    };

    return (
      <div className={styles.reviewSection}>
        <h4 className={styles.reviewTitle}>Avaliação do Atendimento</h4>
        <div className={styles.reviewReadOnly}>
          <div className={styles.reviewReadOnlyHeader}>
            <div className={styles.starRating} style={{ marginBottom: 0 }}>
              {[1, 2, 3, 4, 5].map((val) => (
                <span
                  key={val}
                  className={val <= review.stars ? styles.starFilled : styles.starEmpty}
                  style={{ fontSize: '1.25rem' }}
                >
                  ★
                </span>
              ))}
              <span className={styles.starCountText}>{review.stars} / 5</span>
            </div>

            <div className={styles.reviewMetaBadges}>
              <span className={styles.badgeReviewAnonymous}>
                {review.anonymous ? 'Avaliação Anônima' : 'Avaliação Identificada'}
              </span>

              {review.published_at ? (
                <span className={styles.badgeReviewPublished}>Publicado no Site</span>
              ) : review.publish_requested ? (
                <span className={styles.badgeReviewPending}>Aguardando Publicação</span>
              ) : null}

              {canPublish && (
                <button
                  type="button"
                  className={styles.btnPublishReview}
                  onClick={handlePublish}
                  disabled={isPublishing}
                >
                  {isPublishing ? 'Publicando...' : 'Publicar'}
                </button>
              )}
            </div>
          </div>

          {review.body && <p className={styles.reviewBodyText}>{review.body}</p>}
        </div>
      </div>
    );
  }

  // Se não existe review e o usuário pode avaliar: FORMULÁRIO DE AVALIAÇÃO
  if (canReview) {
    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setIsSubmitting(true);
      try {
        const created = await createServiceReview(req.id, {
          stars,
          body: body.trim() || undefined,
          anonymous,
          publish_requested: publishRequested,
        });
        onReviewUpdated(req.id, created);
      } catch (err) {
        if (isMfaRequired(err)) {
          onMfaRequired();
          return;
        }
        onError(getErrorMessage(err));
      } finally {
        setIsSubmitting(false);
      }
    };

    return (
      <div className={styles.reviewSection}>
        <h4 className={styles.reviewTitle}>Avalie este Atendimento</h4>
        <form onSubmit={handleSubmit}>
          <div className={styles.starRating} role="group" aria-label="Avaliação em estrelas">
            {[1, 2, 3, 4, 5].map((val) => (
              <button
                key={val}
                type="button"
                className={`${styles.starBtn} ${
                  val <= (hoveredStar || stars) ? styles.starFilled : styles.starEmpty
                }`}
                onClick={() => setStars(val)}
                onMouseEnter={() => setHoveredStar(val)}
                onMouseLeave={() => setHoveredStar(0)}
                aria-label={`${val} estrela${val > 1 ? 's' : ''}`}
              >
                ★
              </button>
            ))}
            <span className={styles.starCountText}>{stars} de 5 estrelas</span>
          </div>

          <textarea
            className={styles.reviewTextarea}
            placeholder="Conte-nos como foi sua experiência com este atendimento de enfermagem..."
            value={body}
            onChange={(e) => setBody(e.target.value)}
            maxLength={1000}
          />

          <div className={styles.reviewCheckboxes}>
            <label className={styles.checkboxLabel}>
              <input
                type="checkbox"
                className={styles.checkboxInput}
                checked={anonymous}
                onChange={(e) => setAnonymous(e.target.checked)}
              />
              Avaliação anônima
            </label>

            <label className={styles.checkboxLabel}>
              <input
                type="checkbox"
                className={styles.checkboxInput}
                checked={publishRequested}
                onChange={(e) => setPublishRequested(e.target.checked)}
              />
              Autorizo publicar meu depoimento no site
            </label>
          </div>

          <button type="submit" className={styles.btnSubmitReview} disabled={isSubmitting}>
            {isSubmitting ? 'Enviando avaliação...' : 'Enviar Avaliação'}
          </button>
        </form>
      </div>
    );
  }

  return null;
};

export const ServiceRequestsPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [requests, setRequests] = useState<ServiceRequest[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

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

    Promise.all([getUser(), getServiceRequests()])
      .then(([userData, res]) => {
        if (!isMounted) return;
        setCurrentUser(userData);
        setRequests(res.data);
        setIsLoading(false);
      })
      .catch((err) => {
        if (!isMounted) return;
        if (isMfaRequired(err)) {
          navigate('/mfa?returnTo=/solicitacoes', {
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

  const handleUpdateStatus = async (id: string, newStatus: ServiceRequestStatus) => {
    setUpdatingId(id);
    setActionError(null);

    try {
      const updated = await updateStatus(id, newStatus);
      setRequests((prev) =>
        prev.map((req) =>
          req.id === id ? { ...req, ...updated, status: updated.status || newStatus } : req
        )
      );
    } catch (err) {
      if (isMfaRequired(err)) {
        navigate('/mfa?returnTo=/solicitacoes', {
          state: { mode: 'verify', returnTo: '/solicitacoes' },
        });
        return;
      }
      setActionError(getErrorMessage(err));
    } finally {
      setUpdatingId(null);
    }
  };

  const handleReviewUpdated = (requestId: string, updatedReview: ServiceReview) => {
    setRequests((prev) =>
      prev.map((req) => (req.id === requestId ? { ...req, review: updatedReview } : req))
    );
  };

  const handleMfaRequired = () => {
    navigate('/mfa?returnTo=/solicitacoes', {
      state: { mode: 'verify', returnTo: '/solicitacoes' },
    });
  };

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
      {actionError && <div className={styles.errorBox}>{actionError}</div>}

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

            const isStaff =
              currentUser?.user_type === 'professional' || currentUser?.user_type === 'admin';
            const isUpdating = updatingId === req.id;

            const canAccept = isStaff && req.status === 'requested';
            const canComplete = isStaff && req.status === 'accepted';
            const canCancel =
              (isStaff && (req.status === 'requested' || req.status === 'accepted')) ||
              (!isStaff && req.status === 'requested');

            const hasActions = canAccept || canComplete || canCancel;

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

                {/* Seção de Avaliação para pedidos concluídos (done) */}
                {req.status === 'done' && (
                  <RequestReviewSection
                    req={req}
                    currentUser={currentUser}
                    onReviewUpdated={handleReviewUpdated}
                    onMfaRequired={handleMfaRequired}
                    onError={(msg) => setActionError(msg)}
                  />
                )}

                {hasActions && (
                  <div className={styles.cardActions}>
                    {canAccept && (
                      <button
                        type="button"
                        className={`${styles.actionBtn} ${styles.btnAccept}`}
                        disabled={isUpdating}
                        onClick={() => handleUpdateStatus(req.id, 'accepted')}
                      >
                        {isUpdating ? 'Salvando...' : 'Aceitar'}
                      </button>
                    )}

                    {canComplete && (
                      <button
                        type="button"
                        className={`${styles.actionBtn} ${styles.btnComplete}`}
                        disabled={isUpdating}
                        onClick={() => handleUpdateStatus(req.id, 'done')}
                      >
                        {isUpdating ? 'Salvando...' : 'Concluir'}
                      </button>
                    )}

                    {canCancel && (
                      <button
                        type="button"
                        className={`${styles.actionBtn} ${styles.btnCancel}`}
                        disabled={isUpdating}
                        onClick={() => handleUpdateStatus(req.id, 'cancelled')}
                      >
                        {isUpdating ? 'Salvando...' : 'Cancelar'}
                      </button>
                    )}
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
