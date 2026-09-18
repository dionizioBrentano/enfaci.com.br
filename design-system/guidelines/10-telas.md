# Telas do app

As seis rotas do enfaci.com.br montadas na lógica de app. A descrição é a do **celular**; onde o desktop muda, está dito.

O casco é o mesmo em toda tela: `top-bar` › `app-header` › conteúdo em `.container.app-scroll` › `MenuPanel` (fora do fluxo) › `Footer`.

## `/` — Início

`Hero` com a busca dentro › `SectionLabel` › `CategoryTag` rolando na horizontal › `card-grid` de `ProcedureCard` › `SectionLabel` › `card-grid` de `ReviewCard` › `SidebarCard` de cobertura por CEP › `wa-card` › `Footer`.

No celular a coluna é uma só e o cartão de CEP entra no fluxo, depois dos procedimentos. A partir de 1200px ele sobe para a coluna lateral e a grade vira três colunas.

## `/servicos/:slug` — Procedimento

`Breadcrumb` (no celular, só o passo anterior, funcionando como "voltar") › `Hero` com `title` e `category_label` › `Lead` › `article-body` › `AlertBox` de atenção › `AlertBox` de orientação › `ReviewCard` do procedimento › `Footer`.

**É a tela de conversão.** A `ActionBar` fica fixa no rodapé durante toda a leitura, mostrando o CEP confirmado e a primeira data disponível; apertar "Agendar" abre a `Sheet` com CEP, data e `slot-group`. Não existe botão de agendar no meio do texto. A partir de 992px a `ActionBar` some e a ação volta para o cartão lateral.

## `/solicitacoes` — Serviços prestados

`SectionLabel` › lista de solicitações. Cada linha traz procedimento, data, turno e estado (`requested`, `accepted`, `done`, `cancelled`) escrito por extenso em `micro-label` — a cor só reforça. Linha concluída e sem avaliação abre uma `Sheet` com as estrelas e o campo de comentário, com a opção de anonimato marcada por padrão.

## `/login` e `/mfa`

Coluna única, `gutter` nas laterais, sem `top-bar` nem `MenuPanel` — é uma tela de tarefa. Marca assinada no topo, `Field` e `btn-primary` de largura total. No MFA o campo é `inputMode="numeric"` com `autocomplete="one-time-code"`, para o código chegar do teclado do sistema. Erro de autenticação é mensagem de campo, nunca só a borda vermelha.

## `/conta`

`SectionLabel` por bloco (dados pessoais, segurança, identidades) › `Field` › `btn-primary` para salvar. CPF e telefone mascarados por padrão; revelar é ação explícita. Sair da conta fica no fim, em `btn-outline`, nunca como primeira coisa da tela.

## Ordem de aplicação

1. Carregar as quatro famílias do Google Fonts no `index.html` e publicar `tokens.css` e `bundle.css` em `src/styles/`.
2. Trocar os valores fixos dos `*.module.css` por `var(--token)`.
3. Montar o casco: `AppHeader` + `MenuPanel`, que é o que mais muda a sensação de app.
4. Converter as telas na ordem Início › Procedimento (com `ActionBar` e `Sheet`) › Solicitações › Autenticação › Conta.
5. Antes de publicar, testar em 360px de largura com o teclado do sistema aberto, e conferir os dois erros herdados do 60+: `gray` e `gold` como texto.
