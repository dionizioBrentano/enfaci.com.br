Abertura de uma seção da home: ícone, título, subtítulo e atalho para a listagem completa.

Substitui o par "micro-rótulo + H2" quando a seção tem uma lista por trás. O ícone fica num quadrado `accent` com tinta `gold` — é o único lugar onde dourado sobre verde aparece em tamanho pequeno, e como é ícone decorativo (`aria-hidden`) não carrega significado sozinho.

**O consumidor fornece:** o SVG do ícone, o título, o subtítulo (uma linha, opcional) e o link com seu destino.

O título é `label-title` em `display` 700; o subtítulo é `text-muted`, não `gray`. A régua inferior é `surface-alt` em 2px, e é ela que separa a seção da anterior — não acrescente margem extra acima.

**Não faça:** usar sem lista abaixo; repetir o mesmo ícone em duas seções da mesma página; escrever o atalho como "Clique aqui".
