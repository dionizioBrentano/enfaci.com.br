Depoimento de um paciente atendido, ligado ao procedimento que ele recebeu.

Segue o contrato de `ServiceReview`: `stars`, `body`, `procedure.title` e a identificação. Quando `anonymous` é verdadeiro o autor é **"Paciente"**, o avatar mostra um visto e o selo diz "Avaliação anônima"; quando é falso, usa `client_name` (ou `user.name`) e o selo diz "Atendimento verificado". Só entram na página avaliações com `published_at` preenchido.

**O consumidor fornece:** a avaliação já filtrada por publicação. Nunca derive o nome de outro campo do cadastro para "completar" um depoimento anônimo — é dado pessoal sob LGPD e o anonimato foi uma escolha do paciente.

**Acessibilidade.** As estrelas são decorativas (`aria-hidden`) e vêm sempre acompanhadas do texto "N de 5" em `text-muted`: a nota nunca é comunicada só pela cor `star`. O corpo do depoimento é Raleway itálico entre aspas curvas quando citado em outra superfície.

**Não faça:** editar o texto do paciente; exibir nota sem o número; mostrar o procedimento como link se ele saiu do catálogo.
