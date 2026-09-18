import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { getPublicProcedures, getPublicProcedureCategories } from '../api/procedures';
import { getPublicReviews } from '../api/reviews';
import type { PublicProcedure, CategoryCount } from '../types/procedure';
import type { ServiceReview } from '../types/serviceRequest';

// Procedimentos padrão para exibição e navegação imediata caso a API do tenant esteja vazia
const FALLBACK_PROCEDURES: PublicProcedure[] = [
  {
    id: 'proc-im',
    title: 'Administração de Medicamentos por Via Intramuscular',
    slug: 'administracao-de-medicamentos-por-via-intramuscular',
    category: 'aplicacao_medicamentos',
    category_label: 'Aplicação de Medicamentos',
    short_description:
      'Técnica de aplicação intramuscular segura, escolha do sítio e volumes adequados por profissionais capacitados.',
  },
  {
    id: 'proc-sc',
    title: 'Administração de Medicamentos por Via Subcutânea',
    slug: 'administracao-de-medicamentos-por-via-subcutanea',
    category: 'aplicacao_medicamentos',
    category_label: 'Aplicação de Medicamentos',
    short_description:
      'Aplicação no tecido subcutâneo para insulinas, anticoagulantes e heparinas com rodízio correto de sítios.',
  },
  {
    id: 'proc-curativo',
    title: 'Curativo Simples com Técnica Asséptica',
    slug: 'curativo-simples-com-tecnica-asseptica',
    category: 'curativos_feridas',
    category_label: 'Curativos e Feridas',
    short_description:
      'Limpeza, assepsia e cobertura de feridas limpas ou cirúrgicas para acelerar a cicatrização e prevenir infecções.',
  },
  {
    id: 'proc-sonda',
    title: 'Sondagem Vesical de Alívio',
    slug: 'sondagem-vesical-de-alivio',
    category: 'eliminacoes',
    category_label: 'Eliminações',
    short_description:
      'Cateterismo vesical com técnica rigorosa para esvaziamento da bexiga e coleta de exames com conforto.',
  },
];

// Avaliações de apoio para exibição na landpage caso a API ainda não tenha depoimentos publicados
const FALLBACK_REVIEWS: ServiceReview[] = [
  {
    id: 'rev-fb-1',
    stars: 5,
    body: 'Atendimento domiciliar excelente e muito pontual. A enfermeira aplicou a medicação com técnica asséptica impecável.',
    anonymous: true,
    publish_requested: true,
    published_at: '2026-09-01T12:00:00Z',
    procedure: {
      id: 'proc-im',
      title: 'Administração de Medicamentos por Via Intramuscular',
      slug: 'administracao-de-medicamentos-por-via-intramuscular',
    },
  },
  {
    id: 'rev-fb-2',
    stars: 5,
    body: 'Profissional muito cuidadosa e atenciosa no curativo. Esclareceu todas as orientações para os próximos dias.',
    anonymous: false,
    client_name: 'Mariana Silva',
    publish_requested: true,
    published_at: '2026-09-05T15:30:00Z',
    procedure: {
      id: 'proc-curativo',
      title: 'Curativo Simples com Técnica Asséptica',
      slug: 'curativo-simples-com-tecnica-asseptica',
    },
  },
];

export const HomePage: React.FC = () => {
  const [procedures, setProcedures] = useState<PublicProcedure[]>([]);
  const [categories, setCategories] = useState<CategoryCount[]>([]);
  const [reviews, setReviews] = useState<ServiceReview[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);

    Promise.allSettled([
      getPublicProcedures(),
      getPublicProcedureCategories(),
      getPublicReviews(),
    ]).then(([procResult, catResult, revResult]) => {
      if (!isMounted) return;

      if (procResult.status === 'fulfilled' && procResult.value.data.length > 0) {
        setProcedures(procResult.value.data);
      } else {
        setProcedures(FALLBACK_PROCEDURES);
      }

      if (catResult.status === 'fulfilled' && catResult.value.length > 0) {
        setCategories(catResult.value);
      }

      if (revResult.status === 'fulfilled' && revResult.value.length > 0) {
        setReviews(revResult.value);
      } else {
        setReviews(FALLBACK_REVIEWS);
      }

      setIsLoading(false);
    });

    return () => {
      isMounted = false;
    };
  }, []);

  const filteredProcedures = procedures.filter((proc) => {
    const matchesCategory =
      selectedCategory === 'all' || proc.category === selectedCategory;
    const matchesSearch =
      !searchTerm.trim() ||
      proc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      proc.short_description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="en-root">
      <Navbar />

      {/* 1. Hero com busca integrada */}
      <section className="hero">
        <p className="hero-eyebrow">Atendimento em domicílio</p>
        <h1 className="hero-title">
          Cuidados de enfermagem com <em>excelência</em>
        </h1>
        <p className="hero-text">
          Procedimentos técnicos realizados com <strong>técnica asséptica</strong>, segurança do
          paciente e atendimento humanizado onde você estiver.
        </p>

        <div style={{ marginTop: 'var(--space-6)', maxWidth: 'var(--reading-max)' }}>
          <div className="field">
            <label
              className="field-label"
              htmlFor="hero-search-input"
              style={{ color: 'var(--on-accent)' }}
            >
              Buscar procedimento
            </label>
            <input
              id="hero-search-input"
              type="text"
              className="field-input"
              placeholder="Buscar procedimento (ex: injeção, curativo, sonda)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </section>

      {/* Conteúdo principal em container com espaço para área segura */}
      <div className="container app-scroll">
        {/* 2. Catálogo de Procedimentos Disponíveis */}
        <section style={{ marginTop: 'var(--space-8)' }}>
          <div className="section-label" id="procedimentos">
            <span className="label-icon" aria-hidden="true">
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M19 14c1.5-1.5 3-3.5 3-6a5 5 0 0 0-9-3 5 5 0 0 0-9 3c0 2.5 1.5 4.5 3 6l6 6Z" />
              </svg>
            </span>
            <span className="label-text">
              <strong className="label-title">Procedimentos disponíveis</strong>
              <span className="label-sub">Catálogo técnico com cobertura verificada por CEP</span>
            </span>
            <a href="#procedimentos" className="label-link">
              Ver todos ›
            </a>
          </div>

          {/* Filtro por Categoria */}
          {categories.length > 0 && (
            <div className="category-bar" role="group" aria-label="Filtrar por categoria">
              <button
                type="button"
                className="category-tag"
                aria-pressed={selectedCategory === 'all'}
                onClick={() => setSelectedCategory('all')}
              >
                Todos
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.value}
                  type="button"
                  className="category-tag"
                  aria-pressed={selectedCategory === cat.value}
                  onClick={() => setSelectedCategory(cat.value)}
                >
                  {cat.label} {cat.total > 0 ? `(${cat.total})` : ''}
                </button>
              ))}
            </div>
          )}

          {isLoading ? (
            <p style={{ color: 'var(--text-muted)', padding: 'var(--space-6) 0' }}>
              Carregando catálogo de procedimentos...
            </p>
          ) : filteredProcedures.length === 0 ? (
            <div
              className="sidebar-card"
              style={{
                padding: 'var(--space-8) var(--space-6)',
                textAlign: 'center',
                margin: 'var(--space-4) 0',
              }}
            >
              <h3 className="card-title" style={{ marginBottom: 'var(--space-2)' }}>
                Nenhum procedimento encontrado
              </h3>
              <p className="card-text">Tente refinar sua busca ou remover os filtros de categoria.</p>
            </div>
          ) : (
            <div className="card-grid">
              {filteredProcedures.map((proc) => (
                <article key={proc.id || proc.slug} className="procedure-card">
                  <span className="card-badge">{proc.category_label || proc.category}</span>
                  <h3 className="card-title">{proc.title}</h3>
                  <p className="card-text">{proc.short_description}</p>
                  <Link to={`/servicos/${proc.slug}`} className="card-cta">
                    Quero este atendimento
                  </Link>
                </article>
              ))}
            </div>
          )}
        </section>

        {/* 3. Tira de destaques: TileCard */}
        <section style={{ marginTop: 'var(--space-10)' }}>
          <div className="section-label">
            <span className="label-icon" aria-hidden="true">
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="3" y="3" width="7" height="18" rx="1.5" />
                <rect x="14" y="3" width="7" height="8" rx="1.5" />
                <rect x="14" y="15" width="7" height="6" rx="1.5" />
              </svg>
            </span>
            <span className="label-text">
              <strong className="label-title">Explore a Enfaci</strong>
              <span className="label-sub">Procedimentos, home care e consultas de enfermagem</span>
            </span>
          </div>

          <div className="tile-strip">
            <article className="tile-card">
              <div className="tile-card-img" role="img" aria-label="Preparo de medicação injetável" />
              <div className="tile-card-body">
                <span className="tile-card-cat">Procedimento</span>
                <h3 className="tile-card-title">Aplicação de medicamentos injetáveis</h3>
                <Link to="/servicos/administracao-de-medicamentos-por-via-intramuscular" className="tile-card-cta">
                  Ver procedimento
                </Link>
              </div>
            </article>

            <article className="tile-card">
              <div className="tile-card-img" role="img" aria-label="Troca de curativo em ferida operatória" />
              <div className="tile-card-body">
                <span className="tile-card-cat">Procedimento</span>
                <h3 className="tile-card-title">Curativo em ferida operatória</h3>
                <Link to="/servicos/curativo-de-ferida-operatoria-e-retirada-de-pontos" className="tile-card-cta">
                  Ver procedimento
                </Link>
              </div>
            </article>

            <article className="tile-card">
              <div className="tile-card-img" role="img" aria-label="Cuidado com sonda de gastrostomia" />
              <div className="tile-card-body">
                <span className="tile-card-cat">Procedimento</span>
                <h3 className="tile-card-title">Cuidados com gastrostomia</h3>
                <Link to="/servicos/cuidados-com-gastrostomia" className="tile-card-cta">
                  Ver procedimento
                </Link>
              </div>
            </article>

            <article className="tile-card">
              <div className="tile-card-img" role="img" aria-label="Atendimento domiciliar de enfermagem" />
              <div className="tile-card-body">
                <span className="tile-card-cat">Home care</span>
                <h3 className="tile-card-title">Cuidado domiciliar contínuo</h3>
                <a href="/#home-care" className="tile-card-cta">
                  Conhecer
                </a>
              </div>
            </article>

            <article className="tile-card">
              <div className="tile-card-img" role="img" aria-label="Consulta de enfermagem" />
              <div className="tile-card-body">
                <span className="tile-card-cat">Atendimento</span>
                <h3 className="tile-card-title">Solicitações de Atendimento</h3>
                <Link to="/solicitacoes" className="tile-card-cta">
                  Agendar
                </Link>
              </div>
            </article>

            <article className="tile-card">
              <div className="tile-card-img" role="img" aria-label="Equipe técnica de enfermagem" />
              <div className="tile-card-body">
                <span className="tile-card-cat">Equipe</span>
                <h3 className="tile-card-title">Técnicos e enfermeiros</h3>
                <a href="/#home-care" className="tile-card-cta">
                  Conhecer
                </a>
              </div>
            </article>
          </div>
        </section>

        {/* 4. Depoimentos de Pacientes: ReviewCard */}
        {reviews.length > 0 && (
          <section style={{ marginTop: 'var(--space-10)' }}>
            <div className="section-label">
              <span className="label-icon" aria-hidden="true">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                </svg>
              </span>
              <span className="label-text">
                <strong className="label-title">Depoimentos de Nossos Pacientes</strong>
                <span className="label-sub">
                  Avaliações reais de pacientes atendidos pela equipe de enfermagem
                </span>
              </span>
            </div>

            <div className="card-grid">
              {reviews.map((rev) => {
                const authorDisplay = rev.anonymous
                  ? 'Paciente'
                  : rev.client_name || rev.user_name || rev.user?.name || 'Paciente';

                return (
                  <article key={rev.id} className="review-card">
                    <div className="review-stars">
                      <span aria-hidden="true">
                        {'★'.repeat(rev.stars)}
                        <span className="star-empty">{'★'.repeat(Math.max(0, 5 - rev.stars))}</span>
                      </span>
                      <span className="stars-value">{rev.stars} de 5</span>
                    </div>

                    {rev.procedure?.title && (
                      <span className="review-procedure">{rev.procedure.title}</span>
                    )}

                    {rev.body && <p className="review-text">"{rev.body}"</p>}

                    <div className="review-author">
                      <span className="review-avatar" aria-hidden="true">
                        {rev.anonymous ? '✓' : authorDisplay.charAt(0).toUpperCase()}
                      </span>
                      <span>
                        <strong className="review-name">{authorDisplay}</strong>
                        <span className="review-badge">
                          {rev.anonymous ? 'Avaliação anônima' : 'Atendimento verificado'}
                        </span>
                      </span>
                    </div>
                  </article>
                );
              })}
            </div>
          </section>
        )}

        {/* 5. Apoio e Contato Direto: SidebarCard e wa-card */}
        <section
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: 'var(--space-6)',
            marginTop: 'var(--space-10)',
            marginBottom: 'var(--space-10)',
          }}
        >
          <section className="sidebar-card">
            <h3 className="sidebar-card-header">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M21 10c0 7-9 12-9 12s-9-5-9-12a9 9 0 0 1 18 0Z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              Cobertura por CEP
            </h3>
            <div className="sidebar-card-body">
              <div className="field">
                <label className="field-label" htmlFor="cep-home">
                  CEP do atendimento
                </label>
                <input
                  className="field-input"
                  id="cep-home"
                  inputMode="numeric"
                  placeholder="00000-000"
                />
                <span className="field-hint">
                  Usamos o CEP só para verificar quais profissionais atendem na região.
                </span>
              </div>
              <a
                href="#procedimentos"
                className="btn-primary"
                style={{ marginTop: '14px', width: '100%', textAlign: 'center' }}
              >
                Verificar disponibilidade
              </a>
            </div>
          </section>

          <section className="wa-card">
            <span className="wa-icon" aria-hidden="true">
              <svg width="30" height="30" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2a10 10 0 0 0-8.7 14.9L2 22l5.3-1.4A10 10 0 1 0 12 2Zm0 18a8 8 0 0 1-4.1-1.1l-.3-.2-3.1.8.8-3-.2-.3A8 8 0 1 1 12 20Z" />
              </svg>
            </span>
            <h3 className="wa-title">Precisa de atendimento hoje?</h3>
            <p className="wa-text">
              Fale com a equipe de enfermagem e confirme o turno disponível na sua região.
            </p>
            <a
              href="https://wa.me/5551992946225"
              className="wa-btn"
              target="_blank"
              rel="noopener noreferrer"
            >
              Falar no WhatsApp
            </a>
          </section>
        </section>
      </div>

      {/* 6. Rodapé oficial */}
      <Footer />
    </div>
  );
};

export default HomePage;
