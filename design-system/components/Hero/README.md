Faixa de abertura da página, em `accent`, com foto opcional atrás.

São três partes na ordem fixa: `hero-eyebrow` (micro-rótulo dourado dizendo a que a página pertence), `hero-title` (o que a página é) e `hero-text` (uma frase de apoio em Raleway, no máximo duas linhas). O `<em>` dentro do título pinta uma palavra de `gold` — use uma só, e nunca no começo da frase.

**O consumidor fornece:** o eyebrow, o título, a frase de apoio e, opcionalmente, a URL da foto pela variável `--hero-bg: url(...)` no próprio elemento.

**A foto nunca aparece limpa.** O `::after` do hero corre um degradê de `rgba(26,58,53,.85)` a `rgba(209,192,83,.18)` por cima — é isso que mantém o título em 11,4:1 sobre qualquer fotografia. Se a imagem falhar, o fundo continua `accent` e nada quebra.

**Acessibilidade.** A foto é decorativa: entra por CSS, não por `<img>`, e não leva texto alternativo. O `hero-text` usa `on-accent-muted` (70% de opacidade) e por isso não desce abaixo de 16px.

**Não faça:** botão `btn-primary` dentro do hero — verde sobre verde; mais de uma ação; texto de apoio com mais de duas linhas no celular.
