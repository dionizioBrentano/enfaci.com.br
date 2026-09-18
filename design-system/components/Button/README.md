Ação de uma tela, em quatro pesos que não competem entre si.

Use `btn-primary` (accent cheio) para a ação que leva o paciente adiante no fluxo — abrir o procedimento, enviar a solicitação. Use `btn-gold` para o passo de conversão final, o agendamento: é o único dourado cheio da página e nunca aparece duas vezes na mesma dobra. `btn-entrar` é o acesso à conta, compacto, que vive na barra. `btn-outline` é ação secundária de navegação ("ver todos"), sem preenchimento.

**O consumidor fornece:** o rótulo (texto curto, primeira pessoa do paciente: "Quero este atendimento"), o `href` ou o `onClick`, e `type="button"` quando for `<button>`.

**Contraste.** O dourado da Enfaci (`gold`, #d1c053) dá 6,7:1 com texto `accent`, então `btn-gold` e `btn-entrar` passam em qualquer tamanho — foi a troca do dourado tan do 60+ (#b8975a, 4,48:1) pelo dourado do próprio logotipo que resolveu isso. O que continua proibido é **texto branco sobre `gold`**: 1,9:1. Sobre dourado escreve-se `accent`.

**Não faça:** botão dourado com texto branco; dois `btn-gold` na mesma seção; `btn-primary` para uma ação destrutiva ou de cancelamento (use `btn-outline` com rótulo explícito).
