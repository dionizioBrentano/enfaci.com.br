Bloco destacado dentro do texto de um procedimento, em duas intenções.

`alert-box--warning` (barra `warning`) é para o que o paciente precisa preparar ou vigiar: prescrição, alergias, sinais de alerta após o procedimento. `alert-box--action` (barra `accent`) é para o que a equipe entrega: material, descarte, registro.

**O consumidor fornece:** o ícone, o título e o conteúdo — lista curta ou um parágrafo.

**Acessibilidade.** A intenção vem do título e do ícone, não da barra colorida: ler só "Atenção antes do atendimento" já basta. O ícone é decorativo. Este componente é conteúdo estático da página — não use como alerta dinâmico de sistema; para retorno de formulário use `role="status"` num elemento próprio.

**Não faça:** três ou mais caixas seguidas — perdem o destaque; usar a caixa de atenção para aviso legal genérico, que vive no rodapé; escrever contraindicação clínica que só o profissional pode avaliar.
