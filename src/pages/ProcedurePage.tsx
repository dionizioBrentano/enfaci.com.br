import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation, Link } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { getPublicProcedureBySlug } from '../api/procedures';
import { searchOfferings } from '../api/offerings';
import { createServiceRequest } from '../api/serviceRequests';
import { isAuthenticated, isMfaRequired, getErrorMessage } from '../api/auth';
import type { PublicProcedure } from '../types/procedure';
import type { PublicOffering } from '../types/offering';
import type { SlotWindow } from '../types/serviceRequest';
import styles from './ProcedurePage.module.css';

// Slug canônico da API para administração intramuscular
const CANONICAL_IM_SLUG = 'administracao-de-medicamentos-por-via-intramuscular';

// Conteúdo canônico fallback caso o banco remoto do tenant ainda não tenha sido populado
const CANONICAL_FALLBACK_PROCEDURES: Record<string, Partial<PublicProcedure>> = {
  [CANONICAL_IM_SLUG]: {
    title: 'Administração de Medicamentos por Via Intramuscular',
    slug: CANONICAL_IM_SLUG,
    category: 'aplicacao_medicamentos',
    category_label: 'Aplicação de Medicamentos',
    short_description:
      'Técnica de aplicação intramuscular, escolha do sítio (ventroglúteo, deltoide, vasto lateral) e volumes máximos por região.',
    content: `
      <h2>Definição e objetivo</h2>
      <p>Introduzir o medicamento no tecido muscular profundo, que por ser bem vascularizado permite absorção mais rápida que a via subcutânea e comporta volumes maiores. Indicada para fármacos irritantes ao subcutâneo, soluções oleosas (incluindo penicilina benzatina / benzetacil) e vacinas.</p>
      <h2>Material necessário</h2>
      <ul>
        <li>Bandeja limpa e prescrição médica conferida</li>
        <li>Medicamento prescrito e diluente, quando necessário</li>
        <li>Seringa de 3 a 5 mL e agulhas apropriadas (uma para aspirar, outra para aplicar: 25x7, 25x8 ou 30x8 conforme massa muscular)</li>
        <li>Algodão e álcool a 70%</li>
        <li>Luvas de procedimento e recipiente para descarte de perfurocortantes</li>
      </ul>
      <h2>Técnica passo a passo</h2>
      <ol>
        <li>Conferir os nove certos da administração de medicamentos (paciente, medicamento, dose, via, hora, registro, orientação, forma farmacêutica e resposta).</li>
        <li>Higienizar as mãos, reunir o material e explicar o procedimento detalhadamente ao paciente.</li>
        <li>Preparar o medicamento em ambiente limpo, trocando a agulha após a aspiração para evitar dor e irritação do trajeto cutâneo.</li>
        <li>Escolher o sítio anatômico de eleição (ventroglúteo até 4 mL em adultos, vasto lateral da coxa ou deltoide até 2 mL).</li>
        <li>Posicionar o paciente de modo a relaxar a musculatura e realizar antissepsia com álcool a 70%.</li>
        <li>Introduzir a agulha em ângulo de 90 graus com movimento firme e rápido.</li>
        <li>Aspirar levemente para verificar ausência de refluxo sanguíneo.</li>
        <li>Injetar a medicação de forma contínua e lenta (cerca de 1 mL a cada 10 segundos).</li>
        <li>Retirar a agulha no mesmo ângulo, comprimindo levemente com algodão seco sem massagear.</li>
      </ol>
      <h2>Cuidados de enfermagem e pontos de atenção</h2>
      <ul>
        <li>Manter o paciente em observação por 15 a 30 minutos após antibióticos e fármacos com risco de anafilaxia.</li>
        <li>Fazer rodízio de sítios em terapias repetidas.</li>
        <li>Descarte imediato em caixa rígida para perfurocortantes sem reencapar.</li>
      </ul>
      <h2>Registro</h2>
      <p>Anotação no prontuário do medicamento, dose, via, sítio anatômico utilizado, lote, horário e resposta do paciente com carimbo e número de conselho do profissional de enfermagem.</p>
    `,
  },
  'curativo-simples-com-tecnica-asseptica': {
    title: 'Curativo Simples com Técnica Asséptica',
    slug: 'curativo-simples-com-tecnica-asseptica',
    category: 'curativos_feridas',
    category_label: 'Curativos e Feridas',
    short_description:
      'Limpeza e cobertura de feridas limpas ou com pouco exsudato, seguindo a técnica asséptica e a avaliação sistemática da lesão.',
    content: `
      <h2>Definição e objetivo</h2>
      <p>Tratamento tópico de feridas limpas ou em processo de cicatrização, promovendo a remoção de exsudato, prevenção de contaminação bacteriana e proteção tecidual.</p>
      <h2>Material necessário</h2>
      <ul>
        <li>Pacote de curativo estéril (pinças anatômica, dente de rato e hemostática)</li>
        <li>Solução fisiológica 0,9% estéril morna</li>
        <li>Gazes estéreis e cobertura secundária</li>
        <li>Fita microporosa hipoalergênica</li>
        <li>Luvas de procedimento e máscara cirúrgica</li>
      </ul>
      <h2>Técnica passo a passo</h2>
      <ol>
        <li>Higienizar as mãos e organizar o campo de trabalho estéril.</li>
        <li>Retirar a cobertura anterior com cuidado, inspecionando o exsudato e o leito da lesão.</li>
        <li>Irrigar a lesão com soro fisiológico a 0,9% em jatos suaves.</li>
        <li>Secar a pele perilesional com gaze estéril sem friccionar o leito.</li>
        <li>Aplicar a cobertura indicada e fixar adequadamente com fita hipoalergênica.</li>
      </ol>
    `,
  },
};

export const ProcedurePage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const location = useLocation();

  const [procedure, setProcedure] = useState<PublicProcedure | null>(null);
  const [actualSlug, setActualSlug] = useState<string>(slug || '');
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Form states - Busca de ofertas
  const [cepServico, setCepServico] = useState('');
  const [isSearchingOfferings, setIsSearchingOfferings] = useState(false);
  const [offerings, setOfferings] = useState<PublicOffering[]>([]);
  const [hasSearchedOfferings, setHasSearchedOfferings] = useState(false);
  const [selectedOfferingId, setSelectedOfferingId] = useState<string>('');

  // Form states - Agendamento
  const [slotDate, setSlotDate] = useState(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  });
  const [slotWindow, setSlotWindow] = useState<SlotWindow>('manha');
  const [notesCliente, setNotesCliente] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderError, setOrderError] = useState<string | null>(null);

  // Carrega rascunho anterior de pedido salvo no sessionStorage se houver
  useEffect(() => {
    try {
      const saved = sessionStorage.getItem('pending_service_request');
      if (saved) {
        const data = JSON.parse(saved);
        if (data.procedure_slug === (slug || actualSlug)) {
          if (data.cep_servico) setCepServico(data.cep_servico);
          if (data.slot_date) setSlotDate(data.slot_date);
          if (data.slot_window) setSlotWindow(data.slot_window);
          if (data.offering_id) setSelectedOfferingId(data.offering_id);
          if (data.notes_cliente) setNotesCliente(data.notes_cliente);
        }
      }
    } catch {
      // Ignora erro de JSON
    }
  }, [slug, actualSlug]);

  // Carrega os dados do procedimento
  useEffect(() => {
    if (!slug) return;

    let isMounted = true;
    setIsLoading(true);
    setErrorMessage(null);

    // Mapeamento específico da rota de Ads benzetacil para a rota intramuscular da API se necessário
    const isBenzetacilAd = slug === 'aplicacao-medicacao-benzetacil';
    const targetSlug = isBenzetacilAd ? CANONICAL_IM_SLUG : slug;

    getPublicProcedureBySlug(slug)
      .then((data) => {
        if (!isMounted) return;
        setProcedure(data);
        setActualSlug(data.slug);
        setIsLoading(false);
      })
      .catch(() => {
        // Se falhar (ex: benzetacil não cadastrado na API ou tenant sem seeder), tenta o slug canônico
        getPublicProcedureBySlug(targetSlug)
          .then((data) => {
            if (!isMounted) return;
            setProcedure(data);
            setActualSlug(data.slug);
            setIsLoading(false);
          })
          .catch(() => {
            if (!isMounted) return;
            // Fallback para conteúdo canônico conhecido
            const fallback =
              CANONICAL_FALLBACK_PROCEDURES[targetSlug] ||
              CANONICAL_FALLBACK_PROCEDURES[CANONICAL_IM_SLUG];

            if (fallback) {
              setProcedure({
                id: 'fallback-proc',
                title: isBenzetacilAd
                  ? 'Aplicação de Benzetacil (Injeção Intramuscular)'
                  : (fallback.title as string),
                slug: targetSlug,
                category: fallback.category as any,
                category_label: fallback.category_label as string,
                short_description: fallback.short_description as string,
                content: fallback.content as string,
                order: 1,
              });
              setActualSlug(targetSlug);
            } else {
              setErrorMessage('Procedimento não encontrado ou indisponível.');
            }
            setIsLoading(false);
          });
      });

    return () => {
      isMounted = false;
    };
  }, [slug]);

  // Formatação de CEP
  const handleCepChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, '').slice(0, 8);
    const masked = raw.length > 5 ? `${raw.slice(0, 5)}-${raw.slice(5)}` : raw;
    setCepServico(masked);
  };

  // Busca de ofertas
  const handleSearchOfferings = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setOrderError(null);

    const cleanCep = cepServico.replace(/\D/g, '');
    if (!cleanCep || cleanCep.length < 8) {
      setOrderError('Por favor, digite um CEP válido com 8 dígitos.');
      return;
    }

    setIsSearchingOfferings(true);
    try {
      const results = await searchOfferings({
        procedure_slug: actualSlug,
        cep: cleanCep,
      });

      setOfferings(results);
      setHasSearchedOfferings(true);

      // Auto-seleciona a primeira oferta se houver
      if (results.length > 0 && !selectedOfferingId) {
        setSelectedOfferingId(results[0].offering_id || results[0].id);
      }
    } catch (err) {
      setOrderError(getErrorMessage(err));
    } finally {
      setIsSearchingOfferings(false);
    }
  };

  // Submissão do pedido de atendimento
  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setOrderError(null);

    const cleanCep = cepServico.replace(/\D/g, '');
    if (!cleanCep || cleanCep.length < 8) {
      setOrderError('Informe o CEP do local do serviço.');
      return;
    }

    if (!slotDate) {
      setOrderError('Informe a data desejada para o atendimento.');
      return;
    }

    // Monta o payload do pedido
    const orderData = {
      procedure_slug: actualSlug,
      cep_servico: cleanCep,
      slot_date: slotDate,
      slot_window: slotWindow,
      offering_id: selectedOfferingId || null,
      notes_cliente: notesCliente.trim() ? notesCliente.trim() : null,
    };

    // Salva no sessionStorage para caso o usuário precise logar ou passar por MFA
    sessionStorage.setItem('pending_service_request', JSON.stringify(orderData));

    // Se não estiver autenticado, vai para login com returnTo
    if (!isAuthenticated()) {
      const returnUrl = location.pathname + location.search;
      navigate(`/login?returnTo=${encodeURIComponent(returnUrl)}`, {
        state: { returnTo: returnUrl },
      });
      return;
    }

    setIsSubmitting(true);

    try {
      await createServiceRequest(orderData);
      sessionStorage.removeItem('pending_service_request');
      navigate('/solicitacoes', {
        state: { successMessage: 'Solicitação de atendimento enviada com sucesso!' },
      });
    } catch (err) {
      // Se a API exigir step-up de MFA (403 mfa_required)
      if (isMfaRequired(err)) {
        const returnUrl = location.pathname + location.search;
        navigate('/mfa', {
          state: { mode: 'verify', returnTo: returnUrl },
        });
        return;
      }
      setOrderError(getErrorMessage(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className={styles.container}>
        <Navbar />
        <div className={styles.loading}>Carregando informações do procedimento...</div>
      </div>
    );
  }

  if (errorMessage || !procedure) {
    return (
      <div className={styles.container}>
        <Navbar />
        <div className={styles.errorBox}>
          {errorMessage || 'Procedimento não encontrado.'}
        </div>
        <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
          <Link to="/" className={styles.searchBtn}>
            Voltar para o catálogo
          </Link>
        </div>
      </div>
    );
  }

  const todayStr = new Date().toISOString().split('T')[0];

  return (
    <div className={styles.container}>
      <Navbar />

      <nav className={styles.breadcrumb} aria-label="Navegação">
        <Link to="/" className={styles.breadcrumbLink}>
          Início
        </Link>
        <span>&rsaquo;</span>
        <Link to="/" className={styles.breadcrumbLink}>
          Procedimentos
        </Link>
        <span>&rsaquo;</span>
        <span>{procedure.title}</span>
      </nav>

      <header className={styles.header}>
        <span className={styles.badge}>{procedure.category_label || procedure.category}</span>
        <h1 className={styles.title}>{procedure.title}</h1>
        <p className={styles.shortDescription}>{procedure.short_description}</p>
      </header>

      <div className={styles.layout}>
        {/* Conteúdo HTML Editorial do Procedimento */}
        <article className={styles.contentCard}>
          {procedure.content ? (
            <div
              className={styles.htmlContent}
              dangerouslySetInnerHTML={{ __html: procedure.content }}
            />
          ) : (
            <p className={styles.htmlContent}>
              Detalhes técnicos e instruções deste procedimento estão em conformidade com as
              normas técnicas vigentes e diretrizes de enfermagem.
            </p>
          )}
        </article>

        {/* CTA "Quero este atendimento" com busca de ofertas por CEP e formulário de pedido */}
        <aside className={styles.ctaCard}>
          <h2 className={styles.ctaTitle}>Quero este atendimento</h2>
          <p className={styles.ctaSubtitle}>
            Consulte a disponibilidade de profissionais credenciados no seu CEP e solicite seu
            atendimento.
          </p>

          {orderError && <div className={styles.errorBox}>{orderError}</div>}

          <form className={styles.ctaForm} onSubmit={handleSubmitOrder}>
            {/* 1. CEP do Local do Serviço */}
            <div className={styles.section}>
              <label className={styles.sectionLabel} htmlFor="cep-servico">
                CEP do local do serviço *
              </label>
              <div className={styles.cepRow}>
                <input
                  id="cep-servico"
                  type="text"
                  className={styles.input}
                  placeholder="00000-000"
                  value={cepServico}
                  onChange={handleCepChange}
                  maxLength={9}
                  required
                />
                <button
                  type="button"
                  className={styles.searchBtn}
                  onClick={() => handleSearchOfferings()}
                  disabled={isSearchingOfferings}
                >
                  {isSearchingOfferings ? 'Buscando...' : 'Buscar'}
                </button>
              </div>
            </div>

            {/* Lista de Ofertas Encontradas (Sem PII) */}
            {hasSearchedOfferings && (
              <div className={styles.section}>
                <label className={styles.sectionLabel}>
                  Opções de Atendimento no seu CEP
                </label>
                {offerings.length === 0 ? (
                  <div className={styles.noOfferingsAlert}>
                    Nenhum ponto de atendimento credenciado retornado para este CEP. Você ainda
                    pode confirmar o pedido para atendimento sob consulta da equipe Enfaci.
                  </div>
                ) : (
                  <div className={styles.offeringsList}>
                    {offerings.map((offering) => {
                      const id = offering.offering_id || offering.id;
                      const isSelected = selectedOfferingId === id;
                      return (
                        <div
                          key={id}
                          className={`${styles.offeringItem} ${isSelected ? styles.offeringItemSelected : ''}`}
                          onClick={() => setSelectedOfferingId(id)}
                        >
                          <input
                            type="radio"
                            name="offering_id"
                            id={`offering-${id}`}
                            value={id}
                            checked={isSelected}
                            onChange={() => setSelectedOfferingId(id)}
                            className={styles.offeringRadio}
                          />
                          <div className={styles.offeringDetails}>
                            <div className={styles.offeringName}>
                              {offering.name || 'Ponto de Atendimento Credenciado'}
                            </div>
                            <div className={styles.offeringMeta}>
                              <span className={styles.metaItem}>
                                CEP: {offering.cep}
                              </span>
                              {offering.coverage_km !== null && (
                                <span className={styles.metaItem}>
                                  Raio: {offering.coverage_km} km
                                </span>
                              )}
                              {offering.quality_score !== null && (
                                <span className={`${styles.metaItem} ${styles.scoreBadge}`}>
                                  {offering.quality_score.toFixed(1)} ★
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* 2. Data e Turno do Atendimento */}
            <div className={styles.section}>
              <div className={styles.slotGrid}>
                <div>
                  <label className={styles.sectionLabel} htmlFor="slot-date">
                    Data do Serviço *
                  </label>
                  <input
                    id="slot-date"
                    type="date"
                    min={todayStr}
                    className={styles.input}
                    value={slotDate}
                    onChange={(e) => setSlotDate(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label className={styles.sectionLabel} htmlFor="slot-window">
                    Turno Desejado *
                  </label>
                  <select
                    id="slot-window"
                    className={styles.select}
                    value={slotWindow}
                    onChange={(e) => setSlotWindow(e.target.value as SlotWindow)}
                    required
                  >
                    <option value="manha">Manhã (08h às 12h)</option>
                    <option value="tarde">Tarde (12h às 18h)</option>
                    <option value="noite">Noite (18h às 22h)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* 3. Observações Opcionais */}
            <div className={styles.section}>
              <label className={styles.sectionLabel} htmlFor="notes-cliente">
                Observações (opcional)
              </label>
              <textarea
                id="notes-cliente"
                className={styles.textarea}
                placeholder="Ex: número do apartamento, interfone ou instruções de acesso..."
                value={notesCliente}
                onChange={(e) => setNotesCliente(e.target.value)}
                maxLength={1000}
              />
            </div>

            {/* Botão de Solicitação */}
            <button type="submit" className={styles.submitBtn} disabled={isSubmitting}>
              {isSubmitting ? 'Enviando Solicitação...' : 'Confirmar Solicitação'}
            </button>

            {!isAuthenticated() && (
              <p className={styles.authNotice}>
                Você será direcionado para entrar ou criar sua conta antes da confirmação final.
              </p>
            )}
          </form>
        </aside>
      </div>
    </div>
  );
};
