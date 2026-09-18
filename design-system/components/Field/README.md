Campo de formulário: rótulo visível, ajuda e erro explicado em palavras.

Usado em login, MFA, conta, solicitação de atendimento e consulta de CEP. O rótulo fica **sempre acima e sempre visível** — o público da Enfaci inclui pessoas idosas, e rótulo dentro do campo desaparece na hora de conferir o que foi digitado.

**O consumidor fornece:** o `id` que liga rótulo e campo, o `inputMode` adequado (`numeric` para CEP, CPF e código MFA), a mensagem de ajuda e, havendo erro, o texto do erro.

**Estados.** Foco: borda `accent` com halo de 3px — não remova o `outline` do navegador sem repor este. Erro: borda `warning`, `aria-invalid="true"` e a mensagem ligada por `aria-describedby`, dizendo o que corrigir, não apenas "campo inválido". A cor sozinha nunca comunica o erro.

O `placeholder` é exemplo de formato (`00000-000`), nunca substituto do rótulo, e usa `gray` por ser texto efêmero de baixo peso informativo.

**Não faça:** validar enquanto a pessoa digita e pintar o campo de vermelho a cada tecla; pedir CPF sem dizer para quê; usar `type="number"` em CEP ou telefone.
