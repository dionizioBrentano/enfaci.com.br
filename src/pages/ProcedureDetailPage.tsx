import { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { fetchProcedureBySlug } from '@/services/procedures';
import { useAsync } from '@/hooks/useAsync';
import { ApiError } from '@/services/http';
import { ErrorState, Spinner } from '@/components/States';

function formatDate(value?: string): string | null {
  if (!value) return null;

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;

  return new Intl.DateTimeFormat('pt-BR', { dateStyle: 'long' }).format(date);
}

export function ProcedureDetailPage() {
  const { slug = '' } = useParams<{ slug: string }>();
  const { data, loading, error, reload } = useAsync(
    (signal) => fetchProcedureBySlug(slug, signal),
    [slug],
  );

  useEffect(() => {
    document.title = data ? `${data.meta_title ?? data.title} — ENFACI` : 'ENFACI';

    return () => {
      document.title = 'ENFACI — Procedimentos de Enfermagem';
    };
  }, [data]);

  if (loading) {
    return <Spinner label="Carregando procedimento…" />;
  }

  // 404 é um estado legítimo (slug inexistente ou procedimento despublicado),
  // não uma falha — merece uma tela própria, com caminho de volta.
  if (error instanceof ApiError && error.isNotFound) {
    return (
      <div className="mx-auto max-w-xl px-4 py-20 text-center sm:px-6">
        <p className="text-5xl">🔎</p>
        <h1 className="mt-5 text-xl font-bold text-brand-900">Procedimento não encontrado</h1>
        <p className="mt-3 text-sm text-brand-700">
          Este procedimento não existe ou não está publicado no momento.
        </p>
        <Link
          to="/"
          className="mt-7 inline-block rounded-full bg-brand-700 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-600"
        >
          Ver todos os procedimentos
        </Link>
      </div>
    );
  }

  if (error) {
    return (
      <div className="px-4 py-16 sm:px-6">
        <ErrorState error={error} onRetry={reload} />
      </div>
    );
  }

  if (!data) return null;

  const publishedAt = formatDate(data.published_at);

  return (
    <article>
      <header className="bg-linear-to-b from-brand-700 to-brand-800 text-white">
        <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-14">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-sm text-brand-100 transition hover:text-white"
          >
            <span aria-hidden="true">←</span> Todos os procedimentos
          </Link>

          <span className="mt-6 block w-fit rounded-full bg-white/15 px-3 py-1 text-xs font-medium">
            {data.category_label}
          </span>

          <h1 className="mt-3 text-2xl font-bold leading-tight sm:text-3xl">{data.title}</h1>

          {data.short_description ? (
            <p className="mt-4 text-sm leading-relaxed text-brand-100 sm:text-base">
              {data.short_description}
            </p>
          ) : null}

          {publishedAt ? (
            <p className="mt-5 text-xs text-brand-200">Publicado em {publishedAt}</p>
          ) : null}
        </div>
      </header>

      <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-12">
        {data.featured_image ? (
          <img
            src={data.featured_image}
            alt=""
            className="mb-8 w-full rounded-2xl object-cover"
            loading="lazy"
          />
        ) : null}

        {/*
          O conteúdo é HTML já sanitizado no servidor (allowlist de tags, sem
          handlers de evento nem URIs executáveis), por isso é injetado aqui.
        */}
        <div className="rich-content" dangerouslySetInnerHTML={{ __html: data.content }} />

        {data.gallery?.length ? (
          <section className="mt-12">
            <h2 className="text-lg font-bold text-brand-800">Galeria</h2>
            <ul className="mt-4 grid gap-4 sm:grid-cols-2">
              {data.gallery.map((image) => (
                <li key={image}>
                  <img
                    src={image}
                    alt=""
                    loading="lazy"
                    className="w-full rounded-xl object-cover"
                  />
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        <p className="mt-12 rounded-2xl border border-sage-200 bg-sage-50 p-5 text-sm leading-relaxed text-sage-800">
          Conteúdo de finalidade educativa. Sempre siga o protocolo operacional padrão da sua
          instituição e a avaliação do profissional responsável pelo cuidado.
        </p>
      </div>
    </article>
  );
}
