# Prompts para o Antigravity

Cole o **prompt de abertura** uma vez, ao começar a sessão. Depois use um dos **prompts de tarefa** por vez — uma tela por vez, nunca todas juntas.

---

## 1. Prompt de abertura

```
Você vai trabalhar no front React 19 da Enfaci (enfaci.com.br), que consome a API
api.postodeenfermagem.com.br. Este projeto tem um design system próprio, já escrito
e fechado. Seu trabalho é APLICAR esse sistema ao conteúdo real, não redesenhá-lo.

Antes de escrever qualquer linha, leia nesta ordem:

1. AGENTS.md — as regras do projeto
2. design-system/README.md — o livro de marca: cor, tipografia, toque, área segura,
   acessibilidade e a assinatura obrigatória da marca
3. design-system/guidelines/10-telas.md — que componentes montam cada rota
4. design-system/NAVEGACAO.md — a árvore de navegação e como funciona o menu de contexto

Depois me diga, em até dez linhas: quais componentes o sistema oferece, qual é a regra
de contraste do dourado, e o que precisa aparecer junto do logotipo em toda tela.
Não escreva código ainda.
```

Se as respostas estiverem certas, ele entendeu o sistema. Se errar o dourado ou a assinatura, mande reler o livro de marca antes de seguir.

---

## 2. Prompts de tarefa

### Converter uma tela

```
Converta src/pages/HomePage.tsx para o design system.

Componentes a usar: Hero, SectionLabel, CategoryTag, ProcedureCard, TileCard, SidebarCard.
Para cada um, leia design-system/components/<Nome>/README.md e use
design-system/components/<Nome>/preview.html como referência de markup.

Regras:
- Use as classes de src/styles/enfaci.css. Não escreva CSS novo sem me perguntar.
- Nenhum valor fixo de cor, espaço, raio ou sombra. Só var(--token).
- Nenhuma @media (max-width). A regra base é a do celular.
- Não altere os tipos em src/types/ nem as chamadas em src/api/.
- O conteúdo vem da API: PublicProcedure e ServiceReview. Mantenha os fallbacks
  que já existem em HomePage.tsx.

Ao terminar, abra a página no navegador em 390px de largura e me mostre a captura.
```

### Montar o casco do app (cabeçalho e menu)

```
Implemente o casco de navegação: AppHeader e MenuPanel.

Leia design-system/components/AppHeader/README.md e
design-system/components/MenuPanel/README.md antes de começar.

O menu é DADO, não código: carregue src/data/nav-principal.json e renderize a partir dele.
O MenuPanel é um menu de CONTEXTO, com três blocos — trilha, ramo em foco e outros ramos
em linha única. Leia design-system/NAVEGACAO.md para entender a regra.

Pontos críticos:
- O estado do menu é o CAMINHO (array de índices na árvore), nunca o href. Dez destinos
  aparecem em mais de um ponto da árvore; o href não identifica um nó.
- Nó com filhos e sem "desc" tem a descrição COMPOSTA com os três primeiros rótulos dos
  filhos. Não invente descrição nenhuma.
- Tocar num "outro ramo" troca o contexto e mantém o painel aberto.
- Painel: trava o scroll do body, fecha com Escape e com toque no fundo, prende o foco
  dentro e devolve ao hambúrguer ao fechar.
- A barra de topo tem o WhatsApp 51 99294-6225 em dourado à esquerda e
  Sobre | Ajuda | Contato em branco à direita. Nada mais.

Teste em 390px: abra o menu, navegue até Curativos, confirme que os outros ramos
viraram linha única, e volte pela trilha.
```

### Migrar CSS antigo para tokens

```
Migre src/pages/<Arquivo>.module.css para os tokens do design system.

Troque cada valor fixo pela variável correspondente de src/styles/tokens.css.
Onde não houver token equivalente, PARE e me pergunte — não invente um valor novo
nem crie um token por conta própria.

Atenção a três armadilhas herdadas do site de origem:
- #909090 como texto: falha contraste. Use var(--text-muted).
- dourado como texto sobre fundo claro: falha. Use var(--gold-deep).
- texto branco sobre botão dourado: falha. O par correto é var(--accent) sobre var(--gold).

Inverta as media queries: hoje o arquivo usa max-width. A regra base passa a ser a do
celular, e as telas maiores só acrescentam, em min-width.
```

### Revisar antes de publicar

```
Revise as telas que alteramos contra o design system, sem escrever código ainda.

Abra cada uma no navegador em 390px e verifique:
- algum controle clicável com menos de 44px de altura
- algum campo de formulário com fonte abaixo de 16px
- algum texto secundário ainda em var(--gray) em vez de var(--text-muted)
- dourado usado como texto sobre fundo claro
- logotipo sem as três linhas da assinatura, ou sem elas em outro ponto da mesma tela
- elemento fixo no rodapé sem env(safe-area-inset-bottom)
- qualquer @media (max-width) que tenha sobrado

Liste o que encontrou, com arquivo e linha. Só corrija depois que eu aprovar a lista.
```

---

## 3. O que dizer quando ele errar

| erro | o que responder |
| --- | --- |
| inventou uma cor ou um espaçamento | "Esse valor não existe no sistema. Use um token de src/styles/tokens.css ou me pergunte." |
| escreveu `@media (max-width: …)` | "Este sistema é mobile-first. Reescreva com a regra base no celular e min-width acrescentando." |
| escreveu descrição clínica de um procedimento | "Não invente conteúdo clínico. Use o que vem da API ou deixe em branco e me avise." |
| pôs o logotipo sozinho | "Leia a seção Logotipo e assinatura do livro de marca. As três linhas são obrigatórias." |
| criou um componente novo | "Verifique em design-system/components/ se já existe um que sirva. Se não existir, pare e me diga antes de criar." |
| mexeu em src/api/ ou src/types/ | "O contrato com a API está fora do escopo. Reverta e siga só na camada visual." |

---

## 4. Limites permanentes

O servidor do enfaci.com.br **não tem Node.js**. O build é sempre local; publica-se o
conteúdo de `dist/` com o script do humano. Nunca peça ao Antigravity para rodar `npm`
no servidor, e nunca deixe que ele tente publicar sozinho.
