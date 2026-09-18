# Árvore de navegação

O menu não é escrito no componente: ele é **dado**. Cada menu do produto tem um arquivo JSON próprio nesta pasta, e o `MenuPanel` é só o leitor desse arquivo. Trocar um item de lugar, acrescentar um procedimento ou renomear uma categoria é editar o JSON, não o React.

| arquivo | menu |
| --- | --- |
| `nav-principal.json` | a navegação principal, lida pelo `MenuPanel` e pelos `nav-link` do desktop |

Arquivos futuros seguem o mesmo esquema: `nav-rodape.json`, `nav-conta.json`.

## Esquema

Um array de nós. Cada nó:

```json
{
  "label": "Curativos",
  "href": "curativos.html",
  "submenu": [ ... ],
  "desc": "opcional",
  "icon": "opcional"
}
```

- **`label`** — obrigatório. É o texto que o paciente lê; escreva por extenso, sem abreviar: "Sonda vesical de alívio", não "SVA".
- **`href`** — obrigatório. Ver *Rotas* abaixo.
- **`submenu`** — array; ausente ou `[]` significa folha.
- **`desc`** — opcional. A linha que explica o item. Ver *Descrições*.
- **`icon`** — opcional. Nome do ícone do nó, só usado nos dois primeiros níveis.

Hoje a árvore tem **81 itens, 65 folhas e 5 níveis de profundidade** no ramo mais fundo (Procedimentos › Eliminações › Drenos › Sucção › Portovac).

## Descrições: o que a regra gera e o que precisa de você

O `MenuPanel` mostra uma linha de explicação sob cada item, e é ela que faz o menu funcionar para quem não domina o vocabulário de enfermagem. Duas origens:

1. **Nó com filhos e sem `desc`** — a linha é **composta automaticamente** com os três primeiros `label` dos filhos. "Vias aéreas" vira "Cateter nasal, Nebulização, Oxigenoterapia…". Não há invenção: o texto sai da própria árvore.
2. **Folha** — não há filhos de onde compor. Ou o nó traz `desc`, ou a linha não aparece.

**As 65 folhas estão sem `desc`.** Escrever uma frase clínica para cada uma é decisão do responsável técnico, não de quem programa — nenhuma foi inventada aqui. O menu funciona sem elas; só perde explicação no último nível, onde o nome do procedimento já costuma bastar.

## Rotas

Os `href` são os do site legado, em `.html`. O app React usa `/servicos/:slug`. A regra de conversão:

```
curativos.html  →  /servicos/curativos
```

Tire o `.html` e prefixe. Mantenha as URLs antigas respondendo por redirecionamento permanente: o site legado está indexado e essas páginas são a porta de entrada de busca da Enfaci.

**O `href` não identifica um nó.** Dez destinos aparecem em mais de um ponto da árvore — `curativo-vacuo.html` está sob Curativos e sob Drenos; `sonda-alivio.html` está sob Eliminações e sob Sondas; `procedimentos.html` está em três lugares. Por isso o menu de contexto guarda o **caminho** (o array de índices do nó raiz até o nó atual), nunca só a URL. Duas visitas à mesma página por caminhos diferentes mostram contextos diferentes, e é isso que se quer.

## Regras de conteúdo

- Um nó novo entra com `label` por extenso e `href` no padrão acima.
- Ramo com mais de oito filhos deve ser dividido: acima disso o paciente deixa de ler a lista.
- Nada de item que só existe para agrupar e não leva a lugar nenhum — todo nó tem destino próprio.
- A ordem do array é a ordem da tela. Ordene por frequência de uso, não por alfabeto.
