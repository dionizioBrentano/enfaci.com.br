Folha que sobe do rodapé com uma tarefa curta, sem tirar o paciente da página.

É o recipiente de agendar, de escolher o turno, de confirmar cancelamento. Sobe em 300ms, cobre até 88% da altura e mantém a página visível atrás — o paciente não perde o lugar onde estava lendo. A partir de 768px a mesma folha vira uma caixa centrada de 480px.

**Estrutura:** `sheet-grabber` (só no celular), `sheet-header` com título e subtítulo dizendo a que procedimento aquilo se refere, `sheet-body` rolável e `sheet-footer` com a confirmação, fixo fora da rolagem.

**O consumidor fornece:** o título, o subtítulo, o conteúdo do corpo e a ação de confirmar. Estado aberto/fechado pela classe `is-open` no par folha + backdrop.

**`slot-group`** é a escolha de turno: três botões `slot-option` com `aria-pressed`, cada um com nome e faixa de horário. Substitui o `<select>` — em `SlotWindow` só existem três valores, e três alvos de 48px são mais rápidos e mais claros que um seletor nativo.

**Comportamento.** Escape fecha, toque no backdrop fecha, o `body` trava a rolagem e o foco fica preso na folha. `overscroll-behavior: contain` impede que rolar dentro da folha arraste a página atrás. O rodapé soma `env(safe-area-inset-bottom)`.

**Campos.** `field-input` dentro da folha tem 16px de fonte por regra do sistema — abaixo disso o iOS dá zoom ao focar e desloca o layout inteiro.

**Não faça:** formulário longo dentro da folha (mais de quatro campos pede tela própria); folha que abre outra folha; ação destrutiva sem confirmação explícita no rótulo do botão.
