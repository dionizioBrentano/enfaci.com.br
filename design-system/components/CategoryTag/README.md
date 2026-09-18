Filtro do catálogo pelas categorias de procedimento da API.

As categorias são as do tipo `ProcedureCategory`: Aplicação de Medicamentos, Curativos e Feridas, Eliminações, Vias Aéreas, Sondas Alimentares e Outros. "Todos" vem sempre primeiro e é o estado inicial. O total entre parênteses vem de `CategoryCount.total` e é omitido quando é zero.

**O consumidor fornece:** a lista de categorias com rótulo e total, a categoria ativa e o manipulador de clique.

**Acessibilidade.** É um grupo de `<button>`, não de links: envolva em `role="group"` com `aria-label`, e marque a seleção com `aria-pressed`, nunca só pela cor de fundo. A altura mínima de 44px é alvo de toque e não deve ser reduzida no celular; a barra rola horizontalmente em vez de encolher a tag.

**Não faça:** permitir múltiplas seleções sem trocar para caixas de seleção; esconder "Todos" depois que um filtro é escolhido — é o caminho de volta.
