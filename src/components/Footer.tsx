import React from 'react';
import { Link } from 'react-router-dom';

export const Footer: React.FC = () => {
  return (
    <footer className="footer">
      <div className="footer-brand-block">
        <span className="footer-brand">
          ENF<span>ACI</span>
        </span>
        <span className="footer-brand-sub">Enfermagem Assistencial de Cuidado Integral</span>
        <span className="footer-responsavel">
          Resp. Técnico Enf. Dionizio Brentano — COREN/RS 734.282
        </span>
        <p className="footer-desc">
          Procedimentos de enfermagem com técnica asséptica e profissionais credenciados, na casa do
          paciente.
        </p>
      </div>

      <div className="footer-cols">
        <div>
          <h4 className="footer-col-title">Contato</h4>
          <p className="footer-note">
            Dúvidas, agendamentos ou parcerias?{' '}
            <a href="https://wa.me/5551992946225" target="_blank" rel="noopener noreferrer">
              Fale conosco
            </a>
            .
          </p>
          <div className="footer-social-icons">
            <a
              href="https://wa.me/5551992946225"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="WhatsApp"
            >
              <svg width="19" height="19" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M12 2a10 10 0 0 0-8.7 14.9L2 22l5.3-1.4A10 10 0 1 0 12 2Zm0 18a8 8 0 0 1-4.1-1.1l-.3-.2-3.1.8.8-3-.2-.3A8 8 0 1 1 12 20Z" />
              </svg>
            </a>
          </div>
        </div>

        <div>
          <h4 className="footer-col-title">Procedimentos</h4>
          <ul className="footer-links">
            <li>
              <Link to="/servicos/aplicacao-medicamentos">Aplicação de medicamentos</Link>
            </li>
            <li>
              <Link to="/servicos/curativos">Curativos</Link>
            </li>
            <li>
              <Link to="/servicos/eliminacoes">Eliminações</Link>
            </li>
            <li>
              <Link to="/servicos/vias-aereas">Vias aéreas</Link>
            </li>
            <li>
              <Link to="/servicos/sondas">Sondas</Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="footer-col-title">Institucional</h4>
          <ul className="footer-links">
            <li>
              <a href="/#home-care">Home care</a>
            </li>
            <li>
              <Link to="/servicos/nossa-equipe">Nossa equipe</Link>
            </li>
            <li>
              <Link to="/servicos/missao">Missão e valores</Link>
            </li>
            <li>
              <Link to="/servicos/contatos">Contatos</Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="footer-col-title">Começar</h4>
          <ul className="footer-links">
            <li>
              <Link to="/login">Entrar / Cadastrar</Link>
            </li>
            <li>
              <Link to="/servicos/consultas">Consultas</Link>
            </li>
            <li>
              <Link to="/solicitacoes">Serviços prestados</Link>
            </li>
            <li>
              <a href="/#ajuda">Ajuda</a>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="footer-col-title">Legal</h4>
          <ul className="footer-links">
            <li>
              <a href="/#privacidade">Política de Privacidade</a>
            </li>
            <li>
              <a href="/#termos">Termos de Uso</a>
            </li>
            <li>
              <a href="/#editorial">Declaração Editorial</a>
            </li>
          </ul>
        </div>
      </div>

      <div className="footer-social">
        <span className="footer-social-label">Siga-nos</span>
        <div className="footer-social-icons">
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram"
          >
            <svg
              width="19"
              height="19"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              aria-hidden="true"
            >
              <rect x="3" y="3" width="18" height="18" rx="5" />
              <circle cx="12" cy="12" r="4" />
              <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
            </svg>
          </a>
          <a
            href="https://youtube.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="YouTube"
          >
            <svg
              width="19"
              height="19"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              aria-hidden="true"
            >
              <rect x="2" y="5" width="20" height="14" rx="4" />
              <path d="m10 9 5 3-5 3V9Z" fill="currentColor" stroke="none" />
            </svg>
          </a>
          <a
            href="https://facebook.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Facebook"
          >
            <svg
              width="19"
              height="19"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              aria-hidden="true"
            >
              <path d="M14 8h3V4h-3a4 4 0 0 0-4 4v2H7v4h3v6h4v-6h3l1-4h-4V8a1 1 0 0 1 1-1Z" />
            </svg>
          </a>
          <a
            href="https://wa.me/5551992946225"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="WhatsApp"
          >
            <svg width="19" height="19" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M12 2a10 10 0 0 0-8.7 14.9L2 22l5.3-1.4A10 10 0 1 0 12 2Zm0 18a8 8 0 0 1-4.1-1.1l-.3-.2-3.1.8.8-3-.2-.3A8 8 0 1 1 12 20Z" />
            </svg>
          </a>
        </div>
      </div>

      <div className="footer-bottom">
        <span>© 2026 Enfaci · Todos os direitos reservados</span>
        <span>
          <a href="/#privacidade">Privacidade</a> · <a href="/#termos">Termos</a>
        </span>
      </div>

      <p className="footer-disclaimer">
        O conteúdo deste site tem caráter informativo e é baseado em evidências científicas. Não
        substitui a avaliação, o diagnóstico ou a conduta de um profissional de saúde. Todo
        procedimento é executado mediante prescrição e por profissionais com registro ativo no
        Conselho Regional de Enfermagem.
      </p>
    </footer>
  );
};

export default Footer;
