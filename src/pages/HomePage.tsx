import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { getPublicProcedures, getPublicProcedureCategories } from '../api/procedures';
import type { PublicProcedure, CategoryCount } from '../types/procedure';
import styles from './HomePage.module.css';

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

export const HomePage: React.FC = () => {
  const [procedures, setProcedures] = useState<PublicProcedure[]>([]);
  const [categories, setCategories] = useState<CategoryCount[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);

    Promise.allSettled([getPublicProcedures(), getPublicProcedureCategories()]).then(
      ([procResult, catResult]) => {
        if (!isMounted) return;

        if (procResult.status === 'fulfilled' && procResult.value.data.length > 0) {
          setProcedures(procResult.value.data);
        } else {
          setProcedures(FALLBACK_PROCEDURES);
        }

        if (catResult.status === 'fulfilled' && catResult.value.length > 0) {
          setCategories(catResult.value);
        }

        setIsLoading(false);
      }
    );

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
    <div className={styles.container}>
      <Navbar />

      <section className={styles.hero}>
        <h1 className={styles.heroTitle}>Cuidados de Enfermagem com Excelência</h1>
        <p className={styles.heroSubtitle}>
          Procedimentos técnicos realizados com técnica asséptica, segurança do paciente e
          atendimento humanizado onde você estiver.
        </p>

        <div className={styles.searchBar}>
          <input
            type="text"
            className={styles.searchInput}
            placeholder="Buscar procedimento (ex: injeção, curativo, sonda)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </section>

      <section>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Procedimentos Disponíveis</h2>
        </div>

        {categories.length > 0 && (
          <div className={styles.categoriesBar}>
            <button
              type="button"
              className={`${styles.categoryTag} ${selectedCategory === 'all' ? styles.categoryTagActive : ''}`}
              onClick={() => setSelectedCategory('all')}
            >
              Todos
            </button>
            {categories.map((cat) => (
              <button
                key={cat.value}
                type="button"
                className={`${styles.categoryTag} ${selectedCategory === cat.value ? styles.categoryTagActive : ''}`}
                onClick={() => setSelectedCategory(cat.value)}
              >
                {cat.label} {cat.total > 0 ? `(${cat.total})` : ''}
              </button>
            ))}
          </div>
        )}

        {isLoading ? (
          <div className={styles.loading}>Carregando catálogo de procedimentos...</div>
        ) : filteredProcedures.length === 0 ? (
          <div className={styles.emptyState}>
            <h3 className={styles.emptyTitle}>Nenhum procedimento encontrado</h3>
            <p>Tente refinar sua busca ou remover os filtros de categoria.</p>
          </div>
        ) : (
          <div className={styles.grid}>
            {filteredProcedures.map((proc) => (
              <div key={proc.id || proc.slug} className={styles.card}>
                <span className={styles.cardBadge}>{proc.category_label || proc.category}</span>
                <h3 className={styles.cardTitle}>{proc.title}</h3>
                <p className={styles.cardDescription}>{proc.short_description}</p>
                <Link to={`/servicos/${proc.slug}`} className={styles.cardButton}>
                  Quero este atendimento
                </Link>
              </div>
            ))}
          </div>
        )}

        <div className={styles.bannerHelp}>
          <h4 className={styles.bannerHelpTitle}>Precisa de atendimento sob medida?</h4>
          <p className={styles.bannerHelpText}>
            Selecione o procedimento desejado para consultar a disponibilidade de atendimento no seu
            CEP e agendar data e turno com nossos profissionais credenciados.
          </p>
        </div>
      </section>
    </div>
  );
};
