A navegação principal do app: um painel que cobre a tela inteira e **se reorganiza conforme onde o paciente está**.

A árvore da Enfaci tem 81 itens e cinco níveis. Mostrá-la inteira seria uma parede; mostrá-la em acordeão faria o paciente perder o mapa. A saída é o menu de contexto: **o ramo onde ele está aparece aberto por inteiro, e todos os outros viram uma linha só**. Quem está em Curativos vê os sete tipos de curativo com espaço e explicação; Eliminações, Vias aéreas e Home Care ficam reduzidos a uma linha cada, prontos para virar o novo contexto com um toque.

Os dados vêm de `data/nav-principal.json`. O componente não conhece a árvore — ele lê o arquivo.

## Os três blocos, nesta ordem

**1. `menu-trail` — a trilha.** Onde o paciente está, do início até o nó atual, com cada nível tocável. É como se sobe um nível sem depender do botão voltar do aparelho. O nó atual não é link e leva `aria-current="page"`.

**2. `menu-focus` — o ramo em foco.** Os filhos do nó atual, em `menu-link` completo: ícone de 40px, título e descrição. Se o nó atual é folha, o foco passa a ser o **pai** dele, com o irmão atual marcado — assim o paciente sempre vê alternativas, nunca uma lista de um item só.

**3. `menu-other` — os outros ramos.** Uma linha de 44px, sem ícone e sem descrição, com a contagem de filhos à direita e uma seta. Entram: os irmãos do nó atual que não estão no foco, e depois as outras raízes. Tocar aqui **troca o contexto do menu** e mantém o painel aberto — não navega para fora.

## Descrições

A linha sob cada item do foco sai de `desc` no JSON. Faltando `desc` num nó com filhos, o componente **compõe** a linha com os três primeiros rótulos dos filhos ("Cateter nasal, Nebulização, Oxigenoterapia…"). Folha sem `desc` não mostra linha nenhuma — e as 65 folhas da árvore estão assim hoje. Ver `data/README.md`.

## Estado é caminho, não URL

Dez destinos aparecem em mais de um ponto da árvore: `curativo-vacuo.html` está sob Curativos **e** sob Drenos. Por isso o componente guarda o **caminho** — o array de índices da raiz até o nó — e não o `href`. Chegar à mesma página por Curativos ou por Drenos produz contextos diferentes, e é esse o comportamento desejado.

**O consumidor fornece:** a árvore carregada do JSON, o caminho atual, o estado de autenticação e os manipuladores de abrir, fechar e trocar de contexto.

## Comportamento

Entra deslizando da esquerda em 300ms. Enquanto aberto: o `body` trava a rolagem, Escape fecha, toque no fundo fecha, o foco fica preso dentro e volta ao hambúrguer ao fechar. Trocar de contexto **não** fecha o painel e **não** reinicia a rolagem do corpo para o topo — o paciente está comparando ramos.

A partir de 992px o painel deixa de existir: a navegação vira os `nav-link` do `AppHeader`, com o ramo atual em `aria-current`.

## Marca

O cabeçalho do painel é o único lugar do casco com espaço para as **três linhas obrigatórias** da assinatura: `brand-title`, `brand-sub` e `logo-responsavel` com o registro no COREN. Ver o livro de marca.

**Não faça:** acordeão de dois níveis; abrir o ramo inteiro da árvore; esconder "Entrar" dentro da rolagem; usar o painel no desktop; deixar o foco com um item só.
