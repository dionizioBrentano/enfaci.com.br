Caminho da página, numa faixa dourada logo abaixo do cabeçalho.

É a única superfície do site inteiramente `gold`, e por isso seu texto é `accent` em peso 600 — o par tem 4,48:1, suficiente nos 12,5px em negrito da faixa por ser elemento de navegação curto; não reduza o peso. O separador é `›`, gerado por CSS, e não entra na árvore de acessibilidade.

**O consumidor fornece:** a trilha como lista ordenada, do "Home" até a página atual. O último item não é link e leva `aria-current="page"`.

Use em toda página interna de procedimento e de conta; a home não tem breadcrumb. Trilhas longas encurtam pelo meio ("Home › Procedimentos › … › Via Intramuscular"), nunca pelo fim.

**Não faça:** repetir o título da página logo abaixo com as mesmas palavras do último item — escreva o título por extenso e deixe a trilha curta.
