import { ButterflyMark } from '@/components/ButterflyMark';

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-16 bg-brand-900 text-brand-100">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 sm:grid-cols-2 sm:px-6">
        <div>
          <div className="flex items-center gap-2.5">
            <ButterflyMark className="h-8 w-8" tone="light" />
            <span className="text-lg font-bold tracking-tight text-white">ENFACI</span>
          </div>
          <p className="mt-3 max-w-sm text-sm leading-relaxed text-brand-200">
            Consulta rápida de procedimentos de enfermagem: técnica passo a passo, materiais
            necessários e cuidados de enfermagem.
          </p>
        </div>

        <div className="sm:justify-self-end">
          <h2 className="text-sm font-semibold text-white">Aviso importante</h2>
          <p className="mt-3 max-w-sm text-sm leading-relaxed text-brand-200">
            O conteúdo tem finalidade educativa e não substitui os protocolos da sua instituição nem
            a avaliação clínica do profissional responsável.
          </p>
        </div>
      </div>

      <div className="border-t border-brand-800">
        <p className="mx-auto max-w-6xl px-4 py-5 text-xs text-brand-300 sm:px-6">
          © {year} ENFACI — enfaci.com.br
        </p>
      </div>
    </footer>
  );
}
