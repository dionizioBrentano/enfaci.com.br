Tira de destaques com imagem: um só markup que rola no celular e vira grade no desktop.

É o padrão de "Explore" do 60+, e a razão de ele servir bem ao app é que **não há carrossel**. A mesma `<div class="tile-strip">` com os mesmos filhos é um scroller com encaixe abaixo de 768px e uma grade acima — a troca é CSS, sem JavaScript, sem biblioteca, sem recalcular nada ao redimensionar. Três colunas no tablet, seis no desktop grande.

**Estrutura:** `tile-card` com imagem 4:3 no topo e corpo com `tile-card-cat` (micro-rótulo da natureza do item), `tile-card-title` e `tile-card-cta` com a seta.

**O consumidor fornece:** a lista de destaques com imagem, categoria, título e destino. O verbo da ação acompanha o tipo: "Ver procedimento", "Agendar", "Conhecer" — nunca "Saiba mais" genérico.

**No celular** cada cartão ocupa 72% da largura da tela, com teto de 260px. Isso é proposital: o cartão seguinte aparece cortado na borda, e é esse pedaço que avisa que a tira rola. `scroll-snap-type: x mandatory` encaixa cada cartão no começo, e `scroll-padding-left` alinha com o gutter da página.

**Imagem.** `aspect-ratio: 4/3` reserva o espaço antes de carregar, então a tira não pula quando as fotos chegam. Fundo `surface-alt` enquanto carrega. Toda imagem precisa de `alt` descrevendo o procedimento — ou `alt=""` se for puramente ilustrativa e o título já disser tudo.

**Acessibilidade.** A tira é uma lista de links, não um widget: navegação por teclado é o Tab normal, e o scroller acompanha o foco sozinho. Não acrescente setas de "anterior/próximo" — elas viram dois alvos a mais sem função no toque. O título do cartão é o nome acessível; a seta é decorativa.

**Não faça:** mais de oito cartões na tira (vire uma página de listagem); texto de apoio no cartão — se precisa explicar, o componente é o `ProcedureCard`; autoplay; indicadores de página.
