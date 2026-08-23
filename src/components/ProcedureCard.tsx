import { Link } from 'react-router-dom';
import type { ProcedureListItem } from '@/types/procedure';

export function ProcedureCard({ procedure }: { procedure: ProcedureListItem }) {
  return (
    <li className="h-full">
      <Link
        to={`/procedimentos/${procedure.slug}`}
        className="group flex h-full flex-col overflow-hidden rounded-2xl border border-brand-100 bg-white transition hover:-translate-y-0.5 hover:border-brand-300 hover:shadow-lg hover:shadow-brand-900/5"
      >
        {procedure.featured_image ? (
          <img
            src={procedure.featured_image}
            alt=""
            loading="lazy"
            className="h-40 w-full object-cover"
          />
        ) : null}

        <div className="flex flex-1 flex-col p-5">
          <span className="w-fit rounded-full bg-brand-50 px-3 py-1 text-xs font-medium text-brand-700">
            {procedure.category_label}
          </span>

          <h3 className="mt-3 text-base font-semibold text-brand-900 group-hover:text-brand-700 sm:text-lg">
            {procedure.title}
          </h3>

          {procedure.short_description ? (
            <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-brand-700/80">
              {procedure.short_description}
            </p>
          ) : null}

          <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-brand-600">
            Ver procedimento
            <span aria-hidden="true" className="transition group-hover:translate-x-0.5">
              →
            </span>
          </span>
        </div>
      </Link>
    </li>
  );
}
