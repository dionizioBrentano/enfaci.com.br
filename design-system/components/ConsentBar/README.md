Tarja de consentimento LGPD, no mesmo verde da barra de topo.

Fica fixa no rodapé, acima de tudo — inclusive da `ActionBar` —, e sai deslizando quando o paciente decide. É o único elemento do sistema com `z-index` 500.

## O texto

> O conteúdo da Enfaci tem caráter informativo baseado em evidências científicas. Não substitui a opinião de um profissional de saúde. Utilizamos cookies em conformidade com a LGPD. Ao continuar, você concorda com nossa **Política de Privacidade**, nossos **Termos de Uso** e nossa Declaração Editorial.

Duas partes num parágrafo só, e é proposital: o aviso clínico ("não substitui a opinião de um profissional de saúde") e o aviso de cookies aparecem juntos porque o paciente lê uma vez só.

**Política de Privacidade** e **Termos de Uso** são links, em `gold` e **sublinhados** — cor sozinha não distingue link de texto. Declaração Editorial vem sem link enquanto a página não existir; quando existir, linke também.

## Ações

`Entendi e aceito` é o `btn-gold`, de largura total no celular. `Saiba mais` é um link discreto ao lado, em osso a 85%, também sublinhado e com 44px de alvo mesmo tendo 13px de texto.

Não há botão de recusar porque a tarja não é um seletor de rastreamento — é aviso de cookies essenciais mais aviso clínico. **Se algum dia entrar cookie de publicidade ou analytics não essencial, a LGPD exige recusa tão fácil quanto o aceite**, e aí a tarja ganha um segundo botão `btn-outline` com o mesmo peso visual, não um link escondido.

**O consumidor fornece:** o estado de já ter aceitado (guardado localmente), o manipulador do aceite e as rotas das páginas legais.

**Contraste sobre `accent`:** texto em osso a 85% dá 8,75:1; os links em `gold`, 6,69:1; o botão leva `accent` sobre `gold`, 6,69:1.

**Comportamento.** Aparece na primeira visita, depois do primeiro quadro pintado — nunca bloqueando o conteúdo. Não é modal: o paciente pode ler e navegar sem aceitar. O aceite guarda a data, porque mudança de política reabre a tarja.

**Não faça:** cobrir a tela com overlay; reabrir a cada navegação; usar `Sheet` no lugar dela; escrever o nome de outra marca no texto.
