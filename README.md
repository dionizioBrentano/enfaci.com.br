# ENFACI — enfaci.com.br

Portal público de **procedimentos de enfermagem**. Consome a API pública do Posto de Enfermagem e exibe o catálogo agrupado por categoria, com página de detalhe por procedimento.

## Stack

| Camada | Escolha |
| --- | --- |
| UI | React 19 |
| Build | Vite |
| Linguagem | TypeScript (modo estrito) |
| Rotas | React Router DOM 7 |
| Estilo | Tailwind CSS 4 (configuração via `@theme` no CSS) |
| HTTP | `fetch` nativo com cliente tipado |

> **Por que não axios:** os endpoints consumidos são poucos e somente de leitura. Um wrapper fino sobre `fetch` (`src/services/http.ts`) cobre o caso com tipagem completa, tratamento de erro por classe e cancelamento via `AbortSignal`, sem dependência extra. Se a aplicação passar a precisar de interceptors ou refresh de token, trocar por axios é uma alteração localizada nesse único arquivo.

## Como rodar

Requer **Node.js 20.19+** (ou 22.12+).

```bash
npm install
```

Depois copie o arquivo de exemplo de variáveis:

```bash
cp .env.example .env
```

Abra o `.env` e preencha o `VITE_TENANT_ID` (veja a seção abaixo). Então:

```bash
npm run dev
```

A aplicação sobe em <http://localhost:5173>.

### Demais comandos

```bash
npm run build
```

```bash
npm run preview
```

```bash
npm run typecheck
```

## Configuração obrigatória: `VITE_TENANT_ID`

**Sem esta variável o site não carrega nada.**

As rotas `/public/*` da API dispensam autenticação, mas continuam atrás do middleware `tenant`: elas exigem o header `X-Tenant-ID`. É esse header que mantém o isolamento multi-tenant — cada instituição tem o seu próprio catálogo de procedimentos. Sem ele a API responde `400 Header X-Tenant-ID ausente.`

Para descobrir o UUID, rode no servidor da API:

```bash
php artisan tinker --execute="echo App\Models\Tenant::pluck('name','id');"
```

| Variável | Obrigatória | Padrão |
| --- | --- | --- |
| `VITE_TENANT_ID` | sim | — |
| `VITE_API_BASE_URL` | não | `https://api.postodeenfermagem.com.br/api/v1` |

A aplicação detecta a ausência do tenant e mostra uma tela de erro explicando o que configurar, em vez de falhar em branco.

## API consumida

Base: `https://api.postodeenfermagem.com.br/api/v1`

| Método | Endpoint | Uso |
| --- | --- | --- |
| `GET` | `/public/procedures` | Listagem (aceita `category`, `search`, `per_page`) |
| `GET` | `/public/procedures/categories` | Categorias com contagem de publicados |
| `GET` | `/public/procedures/{slug}` | Detalhe de um procedimento |

Somente procedimentos com status `published` são retornados. A listagem não traz o corpo do conteúdo — ele vem apenas no detalhe.

O contrato completo está em `docs/openapi.yaml`, no repositório da API.

## Estrutura

```
src/
├── components/     Peças reutilizáveis (cartão, marca, estados de UI)
├── hooks/          useAsync — carregamento com cancelamento e retry
├── layouts/        Header, Footer e o shell do site
├── pages/          Home, detalhe do procedimento e 404
├── services/       Cliente HTTP e chamadas tipadas da API
├── types/          Tipos espelhando os recursos da API
├── App.tsx         Definição das rotas
├── main.tsx        Ponto de entrada
└── index.css       Tokens do tema e estilos do conteúdo rico
```

## Rotas

| Rota | Página |
| --- | --- |
| `/` | Catálogo agrupado por categoria, com busca |
| `/procedimentos/:slug` | Detalhe do procedimento |
| qualquer outra | 404 |

## Notas de implementação

**Conteúdo rico.** O campo `content` chega como HTML e é injetado com `dangerouslySetInnerHTML`. Isso é seguro aqui porque a API sanitiza o conteúdo na escrita (`App\Services\HtmlSanitizer`: allowlist de tags, remoção de handlers `on*`, de URIs `javascript:`/`data:` e de atributos `style`). A estilização fica na classe `.rich-content`, em `src/index.css`.

**Campos ausentes.** A API remove chaves nulas da resposta, então os tipos usam campos opcionais (`?`) em vez de `| null`. Sempre verifique antes de renderizar.

**Cancelamento.** Toda requisição recebe um `AbortSignal` ligado ao ciclo de vida do componente, o que evita atualização de estado após desmontagem e respostas fora de ordem em buscas rápidas.

**Deploy em hospedagem estática.** O roteamento é client-side. Configure o servidor para devolver `index.html` em qualquer rota, senão um acesso direto a `/procedimentos/algum-slug` retorna 404. Em Apache/CPanel, um `.htaccess` na raiz do build:

```apache
RewriteEngine On
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^ index.html [L]
```

## Escopo desta etapa

Somente leitura pública. **Não** inclui área administrativa, autenticação, formulários de edição nem consumo de rotas autenticadas.
