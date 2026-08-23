/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Base da API pública, sem barra no final. */
  readonly VITE_API_BASE_URL?: string;
  /**
   * UUID do tenant. As rotas públicas dispensam autenticação, mas continuam
   * atrás do middleware "tenant" da API — sem este header a resposta é 400.
   */
  readonly VITE_TENANT_ID?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
