# AGENTS.md — enfaci.com.br

Front React 19 + Vite da Enfaci. Consome `api.postodeenfermagem.com.br`. Sem Blade.

## Antes de escrever qualquer interface, leia nesta ordem

1. **`design-system/README.md`** — o livro de marca. Contém as regras de cor, tipografia, toque, área segura e acessibilidade, e é a autoridade sobre qualquer decisão visual.
2. **`design-system/components/<Componente>/README.md`** — o contrato do componente que você vai escrever: o que o consumidor fornece, comportamento, acessibilidade e o que não fazer.
3. **`design-system/components/<Componente>/preview.html`** — o markup de referência. Copie a estrutura e as classes; não reinvente.

`design-system/guidelines/10-telas.md` mapeia cada rota do app aos componentes que a montam.
`design-system/NAVEGACAO.md` explica a árvore de navegação e o menu de contexto.
`design-system/tokens.json` é a fonte dos tokens — para ferramenta, não para leitura.

## Regras que não se negociam

- **Nenhum valor fixo de cor, espaço, raio ou sombra no código.** Use `var(--token)`. Se falta um token, ele é criado no design system, não no CSS da tela.
- **Nenhuma `@media (max-width: …)`.** Este sistema é mobile-first: a regra base é a do celular e telas maiores só acrescentam, em `min-width`.
- **Alvo de toque mínimo de 44px** (`--tap-min`) em todo controle clicável.
- **Campo de formulário nunca abaixo de 16px** — o iOS dá zoom ao focar e desloca o layout.
- **Texto secundário em `--text-muted`, nunca em `--gray`.** O `--gray` é herdado do 60+ e falha contraste como texto.
- **Dourado nunca é texto sobre fundo claro.** Sobre claro use `--gold-deep`; sobre `--accent` o `--gold` pode ser texto.
- **Botão dourado nunca leva texto branco.** O par é `--accent` sobre `--gold`.
- **O logotipo nunca aparece sem as três linhas da assinatura**: nome, "Enfermagem Assistencial de Cuidado Integral" e "Resp. Técnico Enf. Dionizio Brentano - COREN/RS 734.282". Onde não couberem, elas têm de estar em outro ponto da mesma tela.
- **Toda cor que comunica estado vem com palavra ou ícone.** Nunca só a cor.
- Nada de emoji nas superfícies do produto.

## Onde estão as coisas

| caminho | o que é |
| --- | --- |
| `src/styles/tokens.css` | variáveis CSS geradas de `design-system/tokens.json` |
| `src/styles/enfaci.css` | classes do sistema (o `bundle.css` do design system) |
| `src/data/nav-principal.json` | árvore de navegação, 81 itens — fonte de verdade do menu |
| `src/pages/*.module.css` | CSS por página; **ainda com valores fixos a migrar para tokens** |
| `design-system/` | a documentação acima; não é código de produção |

Os dois CSS são importados em `src/main.tsx` **antes** de `index.css`.

## Estado atual da migração

Os `*.module.css` de `src/pages` e `src/components` foram escritos antes do design system e ainda usam valores fixos. Ao mexer numa tela, migre-a: troque os hex por tokens e substitua o bloco pelo componente correspondente. Não faça a migração em massa sem pedir.

## Produção

O servidor (`enfaci.com.br` no cPanel) **não tem Node.js**. Nunca rode `npm`/`npx`/`vite` lá. Build somente local; publica-se o conteúdo de `dist/` com o `.sh` do humano. `VITE_API_URL` e `VITE_TENANT_ID` têm de estar no `.env` local **antes** do `npm run build`.

## Terminal — já autorizado neste workspace

`git add|commit|status|diff|push` (sem `--force`), `git pull|checkout|branch|remote`, `npm install`, `npm run build|dev|preview`.

Proibido sem perguntar: `git push --force`, `git reset --hard`, `rm -rf`, gravar segredo em arquivo versionado, qualquer `npm` no servidor.

## Papel

Codificar o que o prompt pedir. O deploy é do humano. Não misturar com o repositório da API.
