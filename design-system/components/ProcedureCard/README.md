Unidade do catálogo: um procedimento da API, pronto para ser escolhido.

Reproduz exatamente o contrato de `PublicProcedure`: `category_label` no badge, `title` no título (nome técnico, inteiro, sem abreviar), `short_description` no corpo e `slug` na rota `/servicos/:slug`. O cartão descansa em `shadow-sm` e sobe 3px para `shadow-md` no hover — mesmo comportamento do `article-card-lg` do 60+.

**O consumidor fornece:** o objeto do procedimento e a rota de destino. Sem imagem: o catálogo da Enfaci é técnico e a foto de procedimento invasivo afasta mais do que aproxima.

O badge usa `gold-deep`, não `gold` — sobre `surface-raised` o dourado original tem 2,55:1. O corpo usa `text-muted` (4,9:1) e fica com `flex:1` para que a ação alinhe na base em toda a grade, independente do tamanho do texto.

**Grade:** três colunas no desktop, duas no tablet, uma no celular, com `space-6` de intervalo.

**Não faça:** cortar o título em duas linhas com reticências — o nome técnico completo é o que dá confiança; trocar a ação por "Saiba mais"; acrescentar preço no cartão (a cobertura e o valor dependem do CEP e do turno).
