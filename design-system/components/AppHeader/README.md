O topo do app: uma barra de serviço verde e, abaixo dela, o cabeçalho branco que gruda no topo.

## Barra de serviço (`top-bar`)

Fundo `accent`. **À esquerda, o WhatsApp da empresa em dourado**; **à direita, os links institucionais em branco**, separados por uma barra vertical branca. Nada mais entra nela.

| lado | conteúdo | cor |
| --- | --- | --- |
| esquerda | `51 99294-6225` com o ícone do WhatsApp | `gold` — 6,69:1 sobre `accent` |
| direita | Sobre · Ajuda · Contato | `#fff` — 12,35:1; separador em branco a 45% |

O link do WhatsApp aponta para `https://wa.me/5551992946225` (formato internacional, sem sinais). O número aparece formatado para o leitor: `51 99294-6225`. O hover de ambos os lados vai para `gold-light`. É o único lugar do sistema onde o WhatsApp é dourado em vez do verde `success` — ali ele é identidade da marca, não o verde do aplicativo.

A barra é igual no celular e no desktop: os quatro itens cabem em 390px a 12px. O que muda a partir de 992px é só o respiro lateral.

## O que acontece ao rolar

Em repouso, a barra verde fica acima do cabeçalho. Ao rolar para baixo **a barra sai de cena** — ela rola junto com a página — e o cabeçalho, que é `sticky`, assume o topo sozinho e fica fixo ali. Não é animação nem JavaScript de scroll: é o comportamento natural de um elemento `sticky` com um irmão acima.

Ao ficar sozinho no topo, o cabeçalho ganha a classe `app-header--pinned` e passa a **dizer onde o paciente está**: `app-header-context` mostra o ramo pai em micro-rótulo e o nó atual em `display`, ao lado do hambúrguer. A assinatura da marca encolhe para o wordmark, para abrir espaço. É a mesma informação que a trilha do `MenuPanel` dá, só que sempre visível.

Fixar é a única coisa que o scroll controla. **O cabeçalho não se esconde ao rolar** — sumir tiraria do paciente a única porta de navegação.

## Cabeçalho (`app-header`)

No celular tem `app-header-h` (56px): hambúrguer à esquerda, "Entrar" e a marca à direita. Os links horizontais **não existem** — a navegação é o `MenuPanel`. A partir de 992px o cabeçalho cresce para `nav-h` (72px), o hambúrguer some e os `nav-link` aparecem à esquerda da marca.

**O consumidor fornece:** os itens de navegação (rótulo e rota), a rota ativa, o estado de autenticação — "Entrar" vira "Minha Conta" — e o manipulador que abre o menu.

**A marca vem sempre assinada,** com as três linhas de `logo-text-col`: `brand-title`, `brand-sub` e `logo-responsavel`. No estado fixado, onde não cabem, sobra o wordmark — e aí as três linhas precisam estar visíveis em outro ponto da mesma tela, o que o `MenuPanel` e o `Footer` garantem. O link é para a home e seu nome acessível é "Enfaci — Enfermagem Assistencial de Cuidado Integral", porque texto desenhado em SVG não é lido por leitor de tela.

**Acessibilidade.** O `<nav>` de cada grupo precisa de `aria-label` — "Institucional" na barra de cima, "Navegação principal" no cabeçalho. O item atual leva `aria-current="page"`. O hambúrguer tem 44×44px e `aria-expanded`. Os links da barra de serviço também têm 44px de altura de alvo, embora o texto seja de 12px.

**Não faça:** acrescentar itens à barra de serviço; usar o verde `success` no WhatsApp do topo; esconder o cabeçalho ao rolar; deixar o logotipo sem link ou sem assinatura; mostrar links horizontais abaixo de 992px.
