import { Link } from 'react-router-dom';

export function NotFoundPage() {
  return (
    <div className="mx-auto max-w-xl px-4 py-24 text-center sm:px-6">
      <p className="text-5xl font-bold text-brand-300">404</p>
      <h1 className="mt-4 text-xl font-bold text-brand-900">Página não encontrada</h1>
      <p className="mt-3 text-sm text-brand-700">
        O endereço acessado não existe ou foi movido.
      </p>
      <Link
        to="/"
        className="mt-7 inline-block rounded-full bg-brand-700 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-600"
      >
        Voltar ao início
      </Link>
    </div>
  );
}
