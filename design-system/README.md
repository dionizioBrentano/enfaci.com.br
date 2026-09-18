**ENFACI** é sigla de **Enfermagem Assistencial de Cuidado Integral**, e esse dizer é parte da marca, não um slogan opcional. A Enfaci leva procedimentos de enfermagem até a casa do paciente.

Este é um sistema **mobile/app first**. Não é um site de desktop que encolhe: é um app que, em telas grandes, se espalha. Quem chega está no celular, com uma prescrição na mão, muitas vezes com dor ou com pressa, às vezes segurando o aparelho com uma mão só. Toda decisão abaixo parte daí. O vocabulário visual vem do SuperEscolha 60+ — verde institucional profundo, dourado de destaque, tipografia editorial sobre fundo osso — com as tintas do próprio logotipo da Enfaci.

## Como este sistema se escreve

A regra base de todo componente é a do **celular**. Telas maiores só acrescentam, em `@media (min-width: …)`. **Nenhuma regra usa `max-width`** — se você escreveu uma, está desfazendo o celular em vez de construir a partir dele.

| virada | o que muda |
| --- | --- |
| base | uma coluna, `gutter` de 16px, ação de largura total, navegação no `MenuPanel` |
| 768px | grade de duas colunas, gutter de 24px, botão volta a ter largura de conteúdo, `Sheet` vira caixa centrada |
| 992px | navegação sobe para o `AppHeader`, `MenuPanel` e `ActionBar` deixam de existir, aparece a coluna lateral |
| 1200px | o conteúdo ganha largura máxima (`container-max`) |

## Toque

- **`tap-min` (44px) é o piso de qualquer controle** — botão, link de lista, tag, campo, ícone clicável. Não é meta, é mínimo, e vale também para o link discreto de "ver todos".
- **`tap-comfort` (48px)** nos controles que o paciente aperta com pressa: ação principal, item de turno, campo de formulário.
- A ação principal ocupa a **largura inteira** no celular. É o alvo mais fácil de acertar com o polegar e resolve a ambiguidade de qual botão apertar.
- O que fica ao alcance do polegar fica **embaixo**: `ActionBar` no rodapé, confirmação no `sheet-footer`, "Entrar" no `menu-footer`. O topo é para saber onde se está, não para agir.
- Nada depende de `hover`. Todo estado que o mouse revelaria tem de existir no toque ou ser dispensável.

## Área segura e barras fixas

Todo elemento colado no rodapé soma `env(safe-area-inset-bottom, 0px)` ao padding — sem isso o botão cai sob a barra de gestos do iPhone. O `menu-header` faz o mesmo com `env(safe-area-inset-top)`. Quando há barra fixa, o contêiner que rola leva `app-scroll`, que reserva o espaço dela; sem isso o último parágrafo fica escondido atrás da barra.

## Fundamentos de conteúdo

Escreva em português do Brasil, na segunda pessoa ("você"), tratando o leitor como adulto responsável pelo próprio cuidado. Use o nome técnico do procedimento como título e a explicação leiga logo abaixo: "Administração de Medicamentos por Via Intramuscular" seguido de "Técnica de aplicação intramuscular segura, escolha do sítio e volumes adequados por profissionais capacitados." — esse par título/`short_description` é o contrato de cada procedimento.

- Nunca prometa resultado clínico. Descreva a técnica, o preparo e o que o paciente deve esperar.
- Chamada para ação sempre em primeira pessoa do paciente: "Quero este atendimento", "Agendar data e turno". Evite "Contratar", "Comprar", "Solicitar serviço".
- Toda opção de menu tem uma linha dizendo o que ela faz. Quem não sabe o vocabulário de enfermagem descobre ali que "Eliminações" quer dizer sondagem vesical.
- Caixa alta só em micro-rótulos (`micro-label`). Títulos e botões vão em caixa de frase.
- Sem emoji em qualquer superfície do produto. Depoimentos usam estrelas (`star`) acompanhadas do número.
- Toda tela que exibe dado de paciente respeita a LGPD: identificação só quando a avaliação não é anônima; do contrário o autor é "Paciente" com o selo "Avaliação anônima".

## Fundamentos visuais

**Cor.** O fundo de toda tela é `surface`; cartões, cabeçalho, painel de menu e folha são `surface-raised`; faixas de descanso são `surface-alt`.

**As três faixas escuras do produto usam a mesma tinta `accent`**: a barra de serviço no topo, a tarja de consentimento e o rodapé. É essa repetição que emoldura a página. Nenhum texto sobre `accent` fica abaixo de 65% de osso (5,8:1) — inclusive avisos legais, que existem para ser lidos.

O `gold` (#d1c053) é o dourado do arco do próprio logotipo, não o dourado tan do 60+: use-o cheio (badge, breadcrumb, botão de agendamento, ícone sobre verde) ou como texto sobre `accent` e `ink`. Sobre fundo claro, todo texto dourado vai em `gold-deep`. `brand-mark` (#47887b) e `brand-tagline` (#333333) existem só dentro do logotipo.

**Tipografia.** Quatro famílias, cada uma com um trabalho: `display` (Plus Jakarta Sans) em títulos, `sans` (DM Sans) em corpo e interface, `editorial` (Raleway) itálico em linha fina e depoimento, `reading` (Nunito) em títulos de cartão de listas densas. Carregue pelo Google Fonts com `display=swap`; nenhum arquivo de fonte é distribuído aqui. **Campo de formulário nunca abaixo de 16px** — o iOS dá zoom ao focar e desloca o layout inteiro.

**Espaço e forma.** Grade de 4px, de `space-1` a `space-12`. O respiro lateral no celular é `gutter`; a partir de 768px, `space-6`. `radius-md` (8px) é o padrão; `radius-pill` em badge e tag; `radius-sheet` (20px) nos cantos de cima da folha; `radius-round` em avatar. O corpo de leitura nunca passa de `reading-max`, em qualquer largura.

**Elevação.** Cartões descansam em `shadow-sm`. `shadow-md` no hover **só a partir de 768px** — no toque, o cartão responde com `:active` e uma escala de 0,5%, não com sombra. As barras fixas usam `shadow-bar`, que projeta para cima; a folha usa `shadow-sheet`.

**Movimento.** Painel e folha entram em 300ms com `cubic-bezier(.4,0,.2,1)`; o resto é 150ms. Tudo respeita `prefers-reduced-motion`, que o sistema já reduz a 0,01ms.

**Estados.** Hover de superfície primária vai de `accent` para `accent-mid`; de dourada, de `gold` para `gold-light`. Foco visível é obrigatório: contorno sólido de 2px em `accent` com 2px de afastamento. Campo com erro ganha borda `warning` e uma frase explicando o que corrigir, nunca só a cor.

**Imagem.** Fotografia de atendimento real, sem banco de imagens genérico de "equipe sorrindo de jaleco". Sobre foto no hero corre sempre o degradê `linear-gradient(135deg, rgba(26,58,53,.85), rgba(26,58,53,.7) 50%, rgba(209,192,83,.18))`, que é o que garante a leitura do título.

## Acessibilidade

O público da Enfaci inclui idosos e acompanhantes lendo no celular, às vezes com pressa. As regras abaixo não são negociáveis:

- Texto de corpo e secundário em `text` ou `text-muted`. O token `gray` (#909090), herdado do 60+, tem 2,96:1 sobre `surface` e **falha** o mínimo de 4,5:1 — está mantido com o valor exato da fonte para fidelidade, mas só para ícone, separador e placeholder.
- `gold` sobre fundo claro tem 1,71:1 e não serve a texto nem a elemento gráfico. Todo micro-rótulo dourado sobre `surface` usa `gold-deep` (5,67:1). Sobre `accent` o `gold` tem 6,69:1 e pode ser texto em qualquer tamanho.
- Botão dourado nunca leva texto branco (1,85:1). O par correto é `accent` sobre `gold`: 6,69:1, aprovado em qualquer tamanho.
- Toda cor que comunica estado vem acompanhada de palavra ou ícone: as estrelas exibem o número, o selo anônimo exibe o texto, o item de menu ativo leva `aria-current`.
- Painel e folha são `role="dialog" aria-modal="true"`: travam a rolagem do corpo, fecham com Escape e com toque no fundo, prendem o foco dentro e o devolvem ao controle que os abriu.

## Iconografia

O 60+ desenha os ícones com Font Awesome. A Enfaci não distribui uma biblioteca de ícones: use SVG inline com `stroke="currentColor"`, traço de 2px e pontas arredondadas, em 19px dentro dos quadrados de 40px do menu. Ícone em quadrado `radius-md` sobre `surface-alt` herda `accent`; no item ativo, o quadrado vira `accent` e o traço vira `gold`. Ícone é sempre decorativo (`aria-hidden`) — o texto ao lado tem de bastar sozinho.

## Logotipo e assinatura

A marca da Enfaci tem **três linhas, e as três são obrigatórias**:

```html
<div class="logo-text-col">
  <div class="brand-title">Enfaci</div>
  <div class="brand-sub">Enfermagem Assistencial de Cuidado Integral</div>
  <div class="logo-responsavel">Resp. Técnico Enf. Dionizio Brentano - COREN/RS 734.282</div>
</div>
```

A segunda diz o que a sigla significa. A terceira identifica o responsável técnico com registro no COREN — em serviço de saúde isso é exigência legal, não crédito. `logo-responsavel` nunca desce abaixo de 10px nem abaixo de 4,5:1.

A assinatura completa aparece no cabeçalho do `MenuPanel` e no `Footer`. Onde não couber — o cabeçalho fixado de 56px, um favicon, um avatar de rede social — vale a marca reduzida, **desde que as três linhas estejam visíveis em outro ponto da mesma tela**. Nunca em nenhum.

Quando o dizer está desenhado dentro do SVG ele não é lido por leitor de tela: o nome acessível do link é sempre "Enfaci — Enfermagem Assistencial de Cuidado Integral".

Não recolora, não aplique sombra e não coloque o wordmark verde sobre `accent` ou `ink`. Não existe ainda versão clara do logotipo para fundo escuro; até haver, o rodapé escreve a marca em tipo `display` com a assinatura logo abaixo.
