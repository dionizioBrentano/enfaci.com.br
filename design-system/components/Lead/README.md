A abertura editorial de um procedimento e o corpo de texto que vem depois.

`lead` é uma frase única em Raleway itálico, fechada por uma régua `gold` de 2px: é a tradução leiga do nome técnico, escrita para quem acabou de receber uma prescrição. Nunca passa de três linhas.

`article-body` é o corpo em DM Sans a 16,5px com entrelinha 1,8 — medida maior que a do resto do site, porque aqui se lê por minutos e não por segundos. H2 em `display`, citação com barra `gold` sobre fundo verde a 4%, link em `accent` sublinhado com afastamento de 3px.

**O consumidor fornece:** o HTML do procedimento vindo de `PublicProcedure.content`, já sanitizado, dentro de `.article-body`.

Mantenha a medida de leitura em torno de 65 a 75 caracteres; no desktop isso significa não deixar o corpo passar de ~720px, mesmo com `container-max` em 1140px.

**Não faça:** repetir o título do procedimento dentro da linha fina; usar itálico em parágrafos inteiros do corpo; sublinhar texto que não seja link.
